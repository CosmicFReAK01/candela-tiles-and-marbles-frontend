/**
 * Edge Middleware for Candela Tiles & Marbles
 * Enforces Zero-Trust Route Authorization, JWT Validation, CSRF Origin Checks,
 * and Centralized Role-Based Access Control (RBAC).
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import { matchRouteRule, hasAnyRole, hasPermission, normalizeRole } from "@/lib/rbac";
import { validateCsrfOrigin } from "@/lib/csrf";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // 1. CSRF and Origin Validation on state-changing requests
  const csrfCheck = validateCsrfOrigin(request);
  if (!csrfCheck.valid) {
    return NextResponse.json(
      {
        success: false,
        error: `CSRF validation failed: ${csrfCheck.reason || "Forbidden"}`,
        code: "CSRF_FORBIDDEN",
      },
      { status: 403 }
    );
  }

  // 2. Allow login route and public static assets unconditionally
  if (pathname === "/admin/login") {
    const token = request.cookies.get("candela_access_token")?.value;
    if (token) {
      const claims = await verifyJwt(token);
      if (claims && hasAnyRole(claims.roles, ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER", "SHOWROOM_ADVISOR"])) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // 3. Match against Centralized Route Rules
  const matchedRule = matchRouteRule(pathname, method);

  // If no rule matches and it's not under /admin or protected API, check public endpoints
  if (!matchedRule) {
    if (pathname.startsWith("/admin")) {
      // Catch-all safety for any nested admin route
      return handleAdminAuth(request, ["SUPER_ADMIN", "ADMIN"]);
    }
    return NextResponse.next();
  }

  // Handle Admin Pages
  if (pathname.startsWith("/admin")) {
    return handleAdminAuth(request, matchedRule.allowedRoles || ["SUPER_ADMIN", "ADMIN"]);
  }

  // Handle Protected API Endpoints
  let token: string | undefined;
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  }
  if (!token) {
    token = request.cookies.get("candela_access_token")?.value;
  }

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized: Missing Authorization header or session cookie",
        code: "AUTH_REQUIRED",
      },
      { status: 401 }
    );
  }

  const claims = await verifyJwt(token);
  if (!claims) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized: Invalid or expired Bearer token",
        code: "INVALID_TOKEN",
      },
      { status: 401 }
    );
  }

  const userRoles = Array.isArray(claims.roles) ? claims.roles : [];

  // Check required permission
  if (matchedRule.requiredPermission && !hasPermission(userRoles, matchedRule.requiredPermission)) {
    return NextResponse.json(
      {
        success: false,
        error: `Forbidden: Lacks required capability '${matchedRule.requiredPermission}'`,
        code: "FORBIDDEN",
      },
      { status: 403 }
    );
  }

  // Check allowed roles
  if (matchedRule.allowedRoles && !hasAnyRole(userRoles, matchedRule.allowedRoles)) {
    return NextResponse.json(
      {
        success: false,
        error: `Forbidden: Endpoint restricted to [${matchedRule.allowedRoles.join(", ")}]`,
        code: "FORBIDDEN",
      },
      { status: 403 }
    );
  }

  // Forward authenticated user identity headers downstream
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("X-User-Id", claims.sub);
  requestHeaders.set("X-User-Name", claims.username);
  requestHeaders.set("X-User-Roles", userRoles.map(normalizeRole).join(","));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Handles authentication and role verification for Admin UI pages
 */
async function handleAdminAuth(request: NextRequest, allowedRoles: string[]) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("candela_access_token")?.value;

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const claims = await verifyJwt(token);
  if (!claims) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!hasAnyRole(claims.roles, allowedRoles)) {
    return new NextResponse(
      "<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body style=\"font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#1D1B18;color:#F5F3EF\"><div style=\"text-align:center\"><h1>403 Forbidden</h1><p>Your account does not possess authorized privileges to access this console.</p><a href=\"/\" style=\"color:#C5A880;text-decoration:none\">&larr; Return to Storefront</a></div></body></html>",
      {
        status: 403,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/v1/:path*",
  ],
};
