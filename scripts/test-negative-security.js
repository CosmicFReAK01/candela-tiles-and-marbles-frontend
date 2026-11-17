#!/usr/bin/env node
/**
 * Negative Security Test Suite for Candela Tiles & Marbles
 * Executes explicit negative authorization and attack simulations.
 * Prints raw request, headers, response status, and response bodies.
 */

const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const urlObj = new URL(BASE_URL);
const HOST = urlObj.hostname;
const PORT = parseInt(urlObj.port || "3000", 10);

// Load JWT_SECRET from .env.local if available
let JWT_SECRET = process.env.JWT_SECRET;
const envPath = path.join(__dirname, "..", ".env.local");
if (!JWT_SECRET && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const match = envContent.match(/^JWT_SECRET=(.+)$/m);
  if (match) {
    JWT_SECRET = match[1].trim().replace(/^['"]|['"]$/g, "");
  }
}
if (!JWT_SECRET) {
  // Generate ephemeral random secret at test runtime (zero static hardcoded fallback)
  JWT_SECRET = crypto.randomBytes(32).toString("hex");
}

// Base64Url helper
function base64UrlEncode(obj) {
  return Buffer.from(JSON.stringify(obj))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getKeyBuffer(secret) {
  if (secret.length % 4 === 0 && /^[A-Za-z0-9+/=]+$/.test(secret)) {
    try {
      return Buffer.from(secret, "base64");
    } catch {}
  }
  return Buffer.from(secret, "utf8");
}

function generateToken(payload, secret = JWT_SECRET, sign = true) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const data = `${encodedHeader}.${encodedPayload}`;
  if (!sign) {
    return `${data}.invalidsignature1234567890`;
  }
  const keyBuf = getKeyBuffer(secret);
  const signature = crypto
    .createHmac("sha256", keyBuf)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${data}.${signature}`;
}

function makeRequest({ method = "GET", path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const reqHeaders = {
      Host: `${HOST}:${PORT}`,
      ...headers,
    };
    if (body) {
      if (typeof body === "string") {
        reqHeaders["Content-Length"] = Buffer.byteLength(body);
      } else if (Buffer.isBuffer(body)) {
        reqHeaders["Content-Length"] = body.length;
      }
    }

    const req = http.request(
      {
        hostname: HOST,
        port: PORT,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: rawData,
          });
        });
      }
    );

    req.on("error", reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function runNegativeSecuritySuite() {
  console.log("================================================================================");
  console.log(`CANDELA TILES & MARBLES — NEGATIVE SECURITY TEST SUITE`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log("================================================================================\n");

  const now = Math.floor(Date.now() / 1000);

  // Tokens
  const expiredToken = generateToken({
    sub: "user-expired",
    username: "expired_user",
    roles: ["SUPER_ADMIN"],
    exp: now - 3600,
  });

  const tamperedToken = generateToken(
    {
      sub: "user-tampered",
      username: "attacker",
      roles: ["SUPER_ADMIN"],
      exp: now + 3600,
    },
    JWT_SECRET,
    false // invalid signature
  );

  const userToken = generateToken({
    sub: "cust-1",
    username: "customer_john",
    roles: ["USER"],
    exp: now + 3600,
  });

  const advisorToken = generateToken({
    sub: "staff-advisor-1",
    username: "advisor_sarah",
    roles: ["SHOWROOM_ADVISOR"],
    exp: now + 3600,
  });

  const inventoryToken = generateToken({
    sub: "staff-inv-1",
    username: "manager_vikram",
    roles: ["INVENTORY_MANAGER"],
    exp: now + 3600,
  });

  const adminToken = generateToken({
    sub: "admin-1",
    username: "admin_arjun",
    roles: ["ADMIN"],
    exp: now + 3600,
  });

  const tests = [
    // 1. No token on admin console
    {
      id: "NEG-01",
      name: "No Token accessing /admin UI",
      method: "GET",
      path: "/admin",
      headers: {},
      expectedStatus: [307, 302, 401],
    },
    // 2. Expired token on admin API
    {
      id: "NEG-02",
      name: "Expired JWT accessing /api/v1/admin/cms/homepage",
      method: "GET",
      path: "/api/v1/admin/cms/homepage",
      headers: { Authorization: `Bearer ${expiredToken}` },
      expectedStatus: [401],
    },
    // 3. Tampered JWT signature
    {
      id: "NEG-03",
      name: "Tampered JWT Signature on /api/v1/admin/cms/homepage",
      method: "GET",
      path: "/api/v1/admin/cms/homepage",
      headers: { Authorization: `Bearer ${tamperedToken}` },
      expectedStatus: [401],
    },
    // 4. ROLE_USER accessing /admin UI
    {
      id: "NEG-04",
      name: "USER role accessing /admin UI via cookie",
      method: "GET",
      path: "/admin",
      headers: { Cookie: `candela_access_token=${userToken}` },
      expectedStatus: [403],
    },
    // 5. ROLE_USER mutating catalogue
    {
      id: "NEG-05",
      name: "USER role attempting POST /api/v1/products",
      method: "POST",
      path: "/api/v1/products",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "Attacker Tile", category: "tiles", price: 10 }),
      expectedStatus: [403],
    },
    // 6. SHOWROOM_ADVISOR attempting catalogue modification (outside role)
    {
      id: "NEG-06",
      name: "SHOWROOM_ADVISOR attempting POST /api/v1/products (lacks MANAGE_CATALOGUE)",
      method: "POST",
      path: "/api/v1/products",
      headers: {
        Authorization: `Bearer ${advisorToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "Advisor Tile", category: "tiles", price: 50 }),
      expectedStatus: [403],
    },
    // 7. INVENTORY_MANAGER attempting CMS update (outside role)
    {
      id: "NEG-07",
      name: "INVENTORY_MANAGER attempting PUT /api/v1/admin/cms/homepage (lacks MANAGE_CMS)",
      method: "PUT",
      path: "/api/v1/admin/cms/homepage",
      headers: {
        Authorization: `Bearer ${inventoryToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ headline: "Hacked CMS" }),
      expectedStatus: [403],
    },
    // 8. Forged X-User-Roles header sent directly (spoofing attempt without JWT)
    {
      id: "NEG-08",
      name: "Direct header spoofing via forged X-User-Roles: SUPER_ADMIN",
      method: "GET",
      path: "/api/v1/admin/cms/homepage",
      headers: {
        "X-User-Roles": "SUPER_ADMIN",
        "X-User-Id": "forged-admin-uuid",
      },
      expectedStatus: [401],
    },
    // 9. CSRF attack: cookie mutation from foreign origin
    {
      id: "NEG-09",
      name: "CSRF attack: Cookie-authenticated mutation from foreign origin",
      method: "POST",
      path: "/api/v1/products",
      headers: {
        Cookie: `candela_access_token=${adminToken}`,
        Origin: "https://malicious-cross-origin.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "CSRF Product" }),
      expectedStatus: [403],
      validateBody: (body) => {
        // Verify specifically that CsrfOriginFilter rejected the request rather than CorsFilter
        return typeof body === "string" && body.includes("CSRF validation failed: Untrusted Origin: https://malicious-cross-origin.com");
      },
    },
    // 10. Public enquiry tracking without token / second factor
    {
      id: "NEG-10",
      name: "Enquiry tracking lookup without secret token or 2nd factor",
      method: "GET",
      path: "/api/v1/enquiries/track/ENQ-UNAUTHORIZED-TEST",
      headers: {},
      expectedStatus: [403, 404],
    },
    // 11. Malicious SVG upload rejection
    {
      id: "NEG-11",
      name: "SVG upload rejection on /api/v1/media/upload",
      method: "POST",
      path: "/api/v1/media/upload",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryX",
      },
      body: `------WebKitFormBoundaryX\r\nContent-Disposition: form-data; name="file"; filename="xss.svg"\r\nContent-Type: image/svg+xml\r\n\r\n<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>\r\n------WebKitFormBoundaryX--\r\n`,
      expectedStatus: [400, 415],
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`[TEST ${t.id}] ${t.name}`);
    console.log(`>> Request: ${t.method} ${t.path}`);
    if (t.headers) {
      console.log(`>> Headers: ${JSON.stringify(t.headers)}`);
    }
    if (t.body) {
      console.log(`>> Body Preview: ${String(t.body).substring(0, 100)}...`);
    }

    try {
      const res = await makeRequest(t);
      const isStatusExpected = t.expectedStatus.includes(res.statusCode);
      const isBodyExpected = !t.validateBody || t.validateBody(res.body);

      console.log(`<< Response Status: ${res.statusCode}`);
      console.log(`<< Response Body: ${res.body.substring(0, 250)}`);

      if (isStatusExpected && isBodyExpected) {
        console.log(`[RESULT: PASS] Status ${res.statusCode} and response body verified against security assertions.`);
        passed++;
      } else if (!isStatusExpected) {
        console.error(`[RESULT: FAIL] Expected status ${t.expectedStatus.join("|")}, got ${res.statusCode}`);
        failed++;
      } else {
        console.error(`[RESULT: FAIL] Status matched but response body failed security validator: ${res.body}`);
        failed++;
      }
    } catch (err) {
      console.error(`[RESULT: ERROR] Request failed:`, err.message);
      failed++;
    }
  }

  console.log("\n================================================================================");
  console.log(`NEGATIVE SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runNegativeSecuritySuite();
