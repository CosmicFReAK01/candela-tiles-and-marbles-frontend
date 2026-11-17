/**
 * Edge-compatible JWT & Authentication Utility (Fail-Closed)
 * Uses Web Crypto API (Edge runtime, Node.js, Browser).
 * Zero hardcoded credential or secret fallbacks.
 */

export interface JwtPayload {
  sub: string;
  username: string;
  roles: string[];
  email?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error(
      "SECURITY CONFIGURATION ERROR: JWT_SECRET environment variable must be set (min 32 characters)."
    );
  }
  return secret;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function decodeSecretKey(secret: string): Uint8Array {
  try {
    if (secret.length % 4 === 0 && /^[A-Za-z0-9+/=]+$/.test(secret)) {
      return base64UrlDecode(secret);
    }
  } catch {}
  return new TextEncoder().encode(secret);
}

async function getCryptoKey(): Promise<CryptoKey> {
  const rawKey = decodeSecretKey(getJwtSecret());
  return crypto.subtle.importKey(
    "raw",
    rawKey as unknown as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Constant-time SHA-256 digest comparison (prevents timing leaks)
 */
async function constantTimeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const bytesA = new Uint8Array(hashA);
  const bytesB = new Uint8Array(hashB);
  let diff = bytesA.length ^ bytesB.length;
  for (let i = 0; i < bytesA.length; i++) {
    diff |= bytesA[i] ^ bytesB[i];
  }
  return diff === 0;
}

/**
 * Sign an edge-compatible JWT token (HS256)
 */
export async function signJwt(
  payload: {
    sub: string;
    username: string;
    roles: string[];
    email?: string;
    [key: string]: unknown;
  },
  expiresInSeconds = 900
): Promise<string> {
  const enc = new TextEncoder();
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const headerB64 = base64UrlEncode(
    enc.encode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  );
  const payloadB64 = base64UrlEncode(
    enc.encode(JSON.stringify(fullPayload))
  );

  const signInput = `${headerB64}.${payloadB64}`;
  const key = await getCryptoKey();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(signInput));
  const sigB64 = base64UrlEncode(new Uint8Array(signature));

  return `${signInput}.${sigB64}`;
}

/**
 * Verify and decode an incoming JWT token (fail-closed if JWT_SECRET unset)
 */
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;

  try {
    const enc = new TextEncoder();
    const signInput = `${parts[0]}.${parts[1]}`;
    const sigBytes = base64UrlDecode(parts[2]);
    const key = await getCryptoKey();

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      enc.encode(signInput)
    );

    if (!isValid) return null;

    const payloadBytes = base64UrlDecode(parts[1]);
    const payloadJson = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadJson) as JwtPayload;

    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Validates staff admin credentials strictly against environment variables.
 * Fails closed if ADMIN_USERNAME or ADMIN_PASSWORD are not configured.
 */
export async function validateAdminCredentials(
  username?: string,
  password?: string
): Promise<boolean> {
  const configuredUser = process.env.ADMIN_USERNAME?.trim();
  const configuredPass = process.env.ADMIN_PASSWORD?.trim();

  if (!configuredUser || !configuredPass) {
    throw new Error(
      "SECURITY CONFIGURATION ERROR: ADMIN_USERNAME and ADMIN_PASSWORD environment variables must be configured."
    );
  }

  if (!username || !password) return false;

  const userOk = await constantTimeEqual(
    username.trim().toLowerCase(),
    configuredUser.toLowerCase()
  );
  const passOk = await constantTimeEqual(password, configuredPass);

  return userOk && passOk;
}
