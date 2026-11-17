#!/usr/bin/env node
/**
 * Candela Comprehensive Automated Security Regression Suite
 * Tests all OWASP ASVS v4.0.3 requirements:
 * 1. RBAC authorization (401 / 403)
 * 2. IDOR enquiry tracking & PII scrubbing
 * 3. Login brute-force rate limiting (429 & Retry-After)
 * 4. CSRF origin validation
 * 5. Optimistic locking concurrency control (409)
 * 6. Storefront regression checks
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
    failures.push(message);
  }
}

// Read JWT secret from .env.local
const envContent = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
let jwtSecret = "";
for (const line of envContent.split("\n")) {
  if (line.startsWith("JWT_SECRET=")) {
    jwtSecret = line.split("JWT_SECRET=")[1].trim().replace(/^[\x22\x27]|[\x22\x27]$/g, "");
  }
}

function base64UrlEncode(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlEncodeJson(obj) {
  return base64UrlEncode(new TextEncoder().encode(JSON.stringify(obj)));
}

async function signJwt(payload, expiresInSeconds = 3600) {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  let rawKey;
  if (jwtSecret.length % 4 === 0 && /^[A-Za-z0-9+/=]+$/.test(jwtSecret)) {
    let b64 = jwtSecret.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const bin = atob(b64);
    rawKey = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) rawKey[i] = bin.charCodeAt(i);
  } else {
    rawKey = new TextEncoder().encode(jwtSecret);
  }

  const key = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const headerB64 = base64UrlEncodeJson({ alg: "HS256", typ: "JWT" });
  const payloadB64 = base64UrlEncodeJson(fullPayload);
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const sig = await crypto.subtle.sign("HMAC", key, data);
  const sigB64 = base64UrlEncode(new Uint8Array(sig));
  return `${headerB64}.${payloadB64}.${sigB64}`;
}

async function runTests() {
  console.log("================================================================================");
  console.log("RUNNING CANDELA AUTOMATED SECURITY REGRESSION TEST SUITE");
  console.log(`Target: ${BASE_URL}`);
  console.log("================================================================================");

  const adminToken = await signJwt({
    sub: "admin-test-1",
    username: "admin_tester",
    roles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"],
  });

  const userToken = await signJwt({
    sub: "user-test-1",
    username: "customer_user",
    roles: ["ROLE_USER"],
  });

  const expiredToken = await signJwt(
    {
      sub: "expired-user",
      username: "expired",
      roles: ["ROLE_ADMIN"],
    },
    -7200
  );

  const tamperedToken = adminToken.slice(0, -6) + "XXXXXX";

  // ─── 1. RBAC TESTS ─────────────────────────────────────────────────────────
  console.log("\n[TEST GROUP 1: ROLE-BASED ACCESS CONTROL]");

  // 1a. No token on /admin page
  const resNoTokenPage = await fetch(`${BASE_URL}/admin`, { redirect: "manual" });
  assert(
    resNoTokenPage.status === 307 && resNoTokenPage.headers.get("location")?.includes("/admin/login"),
    "No token accessing /admin redirects to login (307)"
  );

  // 1b. ROLE_USER accessing /admin page
  const resUserPage = await fetch(`${BASE_URL}/admin`, {
    headers: { Cookie: `candela_access_token=${userToken}` },
    redirect: "manual",
  });
  assert(resUserPage.status === 403, "ROLE_USER accessing /admin returns 403 Forbidden");

  // 1c. ROLE_ADMIN accessing /admin page
  const resAdminPage = await fetch(`${BASE_URL}/admin`, {
    headers: { Cookie: `candela_access_token=${adminToken}` },
    redirect: "manual",
  });
  assert(resAdminPage.status === 200, "ROLE_ADMIN accessing /admin returns 200 OK");

  // 1d. No token on protected CMS API
  const resNoTokenApi = await fetch(`${BASE_URL}/api/v1/admin/cms/homepage`);
  assert(resNoTokenApi.status === 401, "No token on /api/v1/admin/cms/homepage returns 401 Unauthorized");

  // 1e. Expired token on protected CMS API
  const resExpiredApi = await fetch(`${BASE_URL}/api/v1/admin/cms/homepage`, {
    headers: { Authorization: `Bearer ${expiredToken}` },
  });
  assert(resExpiredApi.status === 401, "Expired token on /api/v1/admin/cms/homepage returns 401 Unauthorized");

  // 1f. Tampered token signature
  const resTamperedApi = await fetch(`${BASE_URL}/api/v1/admin/cms/homepage`, {
    headers: { Authorization: `Bearer ${tamperedToken}` },
  });
  assert(resTamperedApi.status === 401, "Tampered signature on /api/v1/admin/cms/homepage returns 401 Unauthorized");

  // 1g. ROLE_USER accessing admin CMS API
  const resUserCmsApi = await fetch(`${BASE_URL}/api/v1/admin/cms/homepage`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert(resUserCmsApi.status === 403, "ROLE_USER on /api/v1/admin/cms/homepage returns 403 Forbidden");

  // 1h. ROLE_ADMIN accessing admin CMS API
  const resAdminCmsApi = await fetch(`${BASE_URL}/api/v1/admin/cms/homepage`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(resAdminCmsApi.status === 200, "ROLE_ADMIN on /api/v1/admin/cms/homepage returns 200 OK");

  // 1i. ROLE_USER creating a product
  const resUserPostProd = await fetch(`${BASE_URL}/api/v1/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "Malicious Slab", sku: "HACK-01" }),
  });
  assert(resUserPostProd.status === 403, "ROLE_USER creating a product returns 403 Forbidden");

  // 1j. ROLE_ADMIN creating a product (authorized to execute business logic)
  const resAdminPostProd = await fetch(`${BASE_URL}/api/v1/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: `test-slab-${Date.now()}`,
      name: "Security Test Statuario",
      sku: `SKU-SEC-${Date.now()}`,
      slug: `security-test-statuario-${Date.now()}`,
      pricePerSqftInr: 1500,
    }),
  });
  assert(
    resAdminPostProd.status === 201 || resAdminPostProd.status === 200,
    "ROLE_ADMIN creating a product is Authorized (201 Created)"
  );

  // ─── 2. ENQUIRY TRACKING IDOR & PII SCRUBBING ──────────────────────────────
  console.log("\n[TEST GROUP 2: ENQUIRY TRACKING & IDOR PREVENTION]");

  // 2a. Submit an enquiry to obtain reference and tracking token
  const submitRes = await fetch(`${BASE_URL}/api/v1/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientName: "IDOR Defense Architect",
      phoneWhatsApp: "+91 9988776655",
      email: "secret.architect@luxuryfirm.com",
      city: "Mumbai",
      notes: "CONFIDENTIAL INTERNAL NOTE: High Net Worth Client requesting private viewing.",
    }),
  });
  const submitData = await submitRes.json();
  const refCode = submitData.referenceCode;
  const trackingToken = submitData.trackingToken;

  assert(Boolean(refCode && trackingToken), "Enquiry submission returns referenceCode and secret trackingToken");

  // 2b. Attempt to track with referenceCode alone without token (Predictable IDOR attempt)
  const idorRes = await fetch(`${BASE_URL}/api/v1/enquiries/track/${refCode}`);
  assert(idorRes.status === 404 || idorRes.status === 403, "Tracking without token is rejected (404/403 anti-enumeration)");

  // 2c. Attempt to track with wrong/invalid token
  const wrongTokenRes = await fetch(`${BASE_URL}/api/v1/enquiries/track/${refCode}?token=invalid_fake_token_1234`);
  assert(wrongTokenRes.status === 404 || wrongTokenRes.status === 403, "Tracking with invalid token is rejected (404/403 anti-enumeration)");

  // 2d. Track with valid token -> Must return sanitized payload
  const validTrackRes = await fetch(`${BASE_URL}/api/v1/enquiries/track/${refCode}?token=${trackingToken}`);
  const validTrackData = await validTrackRes.json();
  assert(validTrackRes.status === 200, "Tracking with valid secret token returns 200 OK");
  assert(!validTrackData.data?.phoneWhatsApp, "Customer phone number is NOT exposed in public tracking response");
  assert(!validTrackData.data?.email, "Customer email is NOT exposed in public tracking response");
  assert(!validTrackData.data?.notes, "Internal notes are NOT exposed in public tracking response");

  // 2e. Track via X-Tracking-Token header (out of query string)
  const validHeaderTrackRes = await fetch(`${BASE_URL}/api/v1/enquiries/track/${refCode}`, {
    headers: { "X-Tracking-Token": trackingToken },
  });
  assert(validHeaderTrackRes.status === 200, "Tracking via X-Tracking-Token header returns 200 OK without query params");

  // 2f. Track via POST body (out of query string)
  const validPostTrackRes = await fetch(`${BASE_URL}/api/v1/enquiries/track/${refCode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trackingToken }),
  });
  assert(validPostTrackRes.status === 200, "Tracking via POST body returns 200 OK");

  // 2g. Enquiry Idempotency Key prevents duplicate creation
  const idempKey = `idemp-test-${Date.now()}`;
  const idempReqBody = JSON.stringify({
    clientName: "Duplicate Submitter",
    phoneWhatsApp: "+91 9123456789",
    email: "duplicate@example.com",
    notes: "Should not duplicate",
  });
  const idempRes1 = await fetch(`${BASE_URL}/api/v1/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": idempKey },
    body: idempReqBody,
  });
  const idempData1 = await idempRes1.json();
  const idempRes2 = await fetch(`${BASE_URL}/api/v1/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": idempKey },
    body: idempReqBody,
  });
  const idempData2 = await idempRes2.json();
  assert(
    idempData1.referenceCode === idempData2.referenceCode,
    "Duplicate enquiry submission with same Idempotency-Key returns cached reference code"
  );
  assert(validTrackData.data?.reference === refCode, "Public tracking returns minimal status payload");

  // ─── 3. LOGIN BRUTE-FORCE RATE LIMITING ────────────────────────────────────
  console.log("\n[TEST GROUP 3: LOGIN RATE LIMITING]");

  // 3a. Generate 6 consecutive bad login attempts for a unique IP-simulated test
  const testAccount = `attacker_${Date.now()}`;
  let lastStatus = 0;
  let retryAfterHeader = null;

  for (let i = 0; i < 6; i++) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": "198.51.100.42", // Isolated IP
      },
      body: JSON.stringify({ username: testAccount, password: "wrong_password_123" }),
    });
    lastStatus = res.status;
    retryAfterHeader = res.headers.get("retry-after");
  }

  assert(lastStatus === 429, "6th failed login attempt receives HTTP 429 Too Many Requests");
  assert(Boolean(retryAfterHeader), "Retry-After header is present on rate-limited login response");

  // ─── 4. CSRF ORIGIN DEFENSE ───────────────────────────────────────────────
  console.log("\n[TEST GROUP 4: CSRF & ORIGIN DEFENSE]");

  // 4a. Cookie-authenticated mutation from untrusted Origin
  const csrfEvilRes = await fetch(`${BASE_URL}/api/v1/admin/categories`, {
    method: "PUT",
    headers: {
      Cookie: `candela_access_token=${adminToken}`,
      Origin: "http://attacker-evil-site.com",
      Referer: "http://attacker-evil-site.com/exploit.html",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: "2e364c96-fe4a-416a-87be-9b5229062954",
      name: "Hacked Category",
    }),
  });
  assert(csrfEvilRes.status === 403, "Cookie-authenticated mutation from untrusted Origin is blocked (403)");

  // 4b. Cookie-authenticated mutation from legitimate Origin
  const csrfGoodRes = await fetch(`${BASE_URL}/api/v1/admin/categories`, {
    method: "PUT",
    headers: {
      Cookie: `candela_access_token=${adminToken}`,
      Origin: "http://localhost:3000",
      Referer: "http://localhost:3000/admin",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: "2e364c96-fe4a-416a-87be-9b5229062954",
      name: "Tiles",
      display_order: 1,
    }),
  });
  assert(csrfGoodRes.status === 200, "Cookie-authenticated mutation from trusted Origin is accepted (200)");

  // 4c. Programmatic Bearer token mutation with external origin
  const bearerMutationRes = await fetch(`${BASE_URL}/api/v1/admin/categories`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: "2e364c96-fe4a-416a-87be-9b5229062954",
      name: "Tiles",
      display_order: 1,
    }),
  });
  assert(bearerMutationRes.status === 200, "Bearer token API mutation executes without browser cookie CSRF blockage");

  // ─── 5. OPTIMISTIC CONCURRENCY CONTROL ─────────────────────────────────────
  console.log("\n[TEST GROUP 5: OPTIMISTIC CONCURRENCY CONTROL]");

  // 5a. Fetch current category version
  const catListRes = await fetch(`${BASE_URL}/api/v1/admin/categories`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const catListData = await catListRes.json();
  const targetCat = catListData.data[0];
  const currentVersion = targetCat.version || 1;

  // 5b. Attempt update with stale version
  const staleVersion = currentVersion - 1;
  const staleUpdateRes = await fetch(`${BASE_URL}/api/v1/admin/categories`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: targetCat.id,
      name: targetCat.name,
      version: staleVersion,
    }),
  });
  assert(staleUpdateRes.status === 409, "Update with stale version returns HTTP 409 Conflict");

  // 5c. Update with current valid version
  const validUpdateRes = await fetch(`${BASE_URL}/api/v1/admin/categories`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: targetCat.id,
      name: targetCat.name,
      version: currentVersion,
    }),
  });
  assert(validUpdateRes.status === 200, "Update with current version returns HTTP 200 OK");

  // ─── 6. STOREFRONT REGRESSION CHECKS ──────────────────────────────────────
  console.log("\n[TEST GROUP 6: STOREFRONT REGRESSION]");

  // 6a. Public catalogue
  const pubCatRes = await fetch(`${BASE_URL}/api/v1/products?limit=5`);
  assert(pubCatRes.status === 200, "Public catalogue GET /api/v1/products returns 200 OK");

  // 6b. Public search
  const pubSearchRes = await fetch(`${BASE_URL}/api/v1/search?q=marble`);
  const pubSearchData = await pubSearchRes.json();
  assert(pubSearchRes.status === 200 && pubSearchData.count > 0, "Public search GET /api/v1/search?q=marble returns 200 OK with results");

  // 6c. Storefront Home page
  const homeRes = await fetch(`${BASE_URL}/`);
  assert(homeRes.status === 200, "Storefront Home / returns 200 OK");

  console.log("\n================================================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================");

  if (failed > 0) {
    console.error("FAILURES DETECTED:");
    failures.forEach((f) => console.error(` - ${f}`));
    process.exit(1);
  } else {
    console.log("ALL SECURITY REGRESSION TESTS PASSED SUCCESSFULLY.");
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed with error:", err);
  process.exit(1);
});
