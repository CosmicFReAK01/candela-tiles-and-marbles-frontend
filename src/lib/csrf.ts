/**
 * CSRF and Origin Defense Utility
 * Enforces strict Origin & Referer validation on cookie-authenticated mutating requests.
 * Follows OWASP Cross-Site Request Forgery Prevention Guidelines.
 */

import { NextRequest, NextResponse } from "next/server";

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];

export function getAllowedOrigins(): string[] {
  const list = [...DEFAULT_ALLOWED_ORIGINS];
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      const u = new URL(configured);
      list.push(u.origin);
    } catch {}
  }
  return Array.from(new Set(list));
}

/**
 * Validates request origin for state-changing operations.
 * Cookie-authenticated mutations require verified same-origin.
 * Bearer-token API calls bypass browser cookie-CSRF checks.
 */
export function validateCsrfOrigin(request: NextRequest): { valid: boolean; reason?: string } {
  const method = request.method.toUpperCase();
  const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  if (!isMutation) {
    return { valid: true };
  }

  // If the request uses Authorization: Bearer, it is not vulnerable to ambient browser cookie CSRF
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return { valid: true };
  }

  // If request has cookie authentication, strictly validate Origin/Referer
  const hasAuthCookie = Boolean(request.cookies.get("candela_access_token")?.value);
  if (!hasAuthCookie) {
    // Unauthenticated mutation (e.g. public enquiry submission or login attempt)
    // Validate Sec-Fetch-Site if provided by modern browser
    const secFetchSite = request.headers.get("sec-fetch-site");
    if (secFetchSite && secFetchSite === "cross-site") {
      return { valid: false, reason: "Cross-site request blocked by Sec-Fetch-Site policy" };
    }
    return { valid: true };
  }

  // Cookie-authenticated state mutation: enforce origin match
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const allowed = getAllowedOrigins();

  if (origin) {
    if (!allowed.includes(origin)) {
      return { valid: false, reason: `Untrusted Origin: ${origin}` };
    }
  } else if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (!allowed.includes(refOrigin)) {
        return { valid: false, reason: `Untrusted Referer: ${refOrigin}` };
      }
    } catch {
      return { valid: false, reason: "Malformed Referer header" };
    }
  } else {
    // In strict environments, cookie-authenticated mutations without Origin or Referer are rejected
    return { valid: false, reason: "Missing Origin and Referer on cookie-authenticated mutation" };
  }

  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite && secFetchSite === "cross-site") {
    return { valid: false, reason: "Cross-site request blocked by Sec-Fetch-Site" };
  }

  return { valid: true };
}
