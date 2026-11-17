/**
 * Centralized Role-Based Access Control (RBAC) Engine
 * Follows Principle of Least Privilege and Fail-Closed Security (OWASP ASVS v4.0.3)
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyJwt, JwtPayload } from "./auth";

/**
 * Standard Role Taxonomy:
 * - SUPER_ADMIN: Full system & security authority
 * - ADMIN: Backoffice management (catalogue, CMS, media, enquiries, inventory)
 * - INVENTORY_MANAGER: Warehouse stock, supplier restock, logistics, order viewing
 * - SHOWROOM_ADVISOR: Customer enquiry consultation, status progression, viewing orders
 * - USER: Customer storefront access, submitting enquiries, tracking own enquiry
 */
export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "INVENTORY_MANAGER"
  | "SHOWROOM_ADVISOR"
  | "USER"
  | "ROLE_SUPER_ADMIN"
  | "ROLE_ADMIN"
  | "ROLE_INVENTORY_MANAGER"
  | "ROLE_SHOWROOM_ADVISOR"
  | "ROLE_USER";

export type Permission =
  | "READ_PUBLIC"
  | "SUBMIT_ENQUIRY"
  | "TRACK_ENQUIRY"
  | "MANAGE_CATALOGUE"
  | "MANAGE_INVENTORY"
  | "MANAGE_CMS"
  | "MANAGE_MEDIA"
  | "VIEW_ORDERS"
  | "MANAGE_ORDERS"
  | "MANAGE_USERS"
  | "MANAGE_SYSTEM";

/**
 * Normalizes role names (removes 'ROLE_' prefix if present, converts to uppercase)
 */
export function normalizeRole(role: string): string {
  const upper = role.trim().toUpperCase();
  if (upper.startsWith("ROLE_")) {
    return upper.substring(5);
  }
  return upper;
}

/**
 * Canonical Role to Permissions Mapping
 */
export const ROLE_PERMISSIONS: Record<string, readonly Permission[]> = {
  USER: ["READ_PUBLIC", "SUBMIT_ENQUIRY", "TRACK_ENQUIRY"],
  SHOWROOM_ADVISOR: [
    "READ_PUBLIC",
    "SUBMIT_ENQUIRY",
    "TRACK_ENQUIRY",
    "VIEW_ORDERS",
    "MANAGE_ORDERS",
  ],
  INVENTORY_MANAGER: [
    "READ_PUBLIC",
    "SUBMIT_ENQUIRY",
    "TRACK_ENQUIRY",
    "VIEW_ORDERS",
    "MANAGE_INVENTORY",
  ],
  ADMIN: [
    "READ_PUBLIC",
    "SUBMIT_ENQUIRY",
    "TRACK_ENQUIRY",
    "VIEW_ORDERS",
    "MANAGE_ORDERS",
    "MANAGE_INVENTORY",
    "MANAGE_CATALOGUE",
    "MANAGE_CMS",
    "MANAGE_MEDIA",
  ],
  SUPER_ADMIN: [
    "READ_PUBLIC",
    "SUBMIT_ENQUIRY",
    "TRACK_ENQUIRY",
    "VIEW_ORDERS",
    "MANAGE_ORDERS",
    "MANAGE_INVENTORY",
    "MANAGE_CATALOGUE",
    "MANAGE_CMS",
    "MANAGE_MEDIA",
    "MANAGE_USERS",
    "MANAGE_SYSTEM",
  ],
};

/**
 * Central Route-to-Required-Roles / Permissions Map
 * Single evaluation table used across middleware and route handlers
 */
export interface RouteRule {
  pathPrefix: string;
  exactPath?: boolean;
  excludePrefix?: string;
  methods?: string[];
  requiredPermission?: Permission;
  allowedRoles?: string[];
}

export const CENTRAL_ROUTE_RULES: readonly RouteRule[] = [
  // Admin Backoffice Pages
  {
    pathPrefix: "/admin",
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "INVENTORY_MANAGER", "SHOWROOM_ADVISOR"],
  },
  // Catalogue Management
  {
    pathPrefix: "/api/v1/products",
    methods: ["POST", "PUT", "PATCH", "DELETE"],
    requiredPermission: "MANAGE_CATALOGUE",
    allowedRoles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    pathPrefix: "/api/v1/admin/categories",
    requiredPermission: "MANAGE_CATALOGUE",
    allowedRoles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    pathPrefix: "/api/v1/admin/collections",
    requiredPermission: "MANAGE_CATALOGUE",
    allowedRoles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    pathPrefix: "/api/v1/admin/products",
    requiredPermission: "MANAGE_CATALOGUE",
    allowedRoles: ["SUPER_ADMIN", "ADMIN"],
  },
  // CMS Content Management
  {
    pathPrefix: "/api/v1/admin/cms",
    requiredPermission: "MANAGE_CMS",
    allowedRoles: ["SUPER_ADMIN", "ADMIN"],
  },
  // Media Asset Management
  {
    pathPrefix: "/api/v1/media/upload",
    methods: ["POST"],
    requiredPermission: "MANAGE_MEDIA",
    allowedRoles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    pathPrefix: "/api/v1/media/ingest-url",
    methods: ["POST"],
    requiredPermission: "MANAGE_MEDIA",
    allowedRoles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    pathPrefix: "/api/v1/admin/media",
    requiredPermission: "MANAGE_MEDIA",
    allowedRoles: ["SUPER_ADMIN", "ADMIN"],
  },
  // Sales & Orders & Inventory
  {
    pathPrefix: "/api/v1/admin/sales",
    requiredPermission: "VIEW_ORDERS",
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "SHOWROOM_ADVISOR", "INVENTORY_MANAGER"],
  },
  // Enquiries list (Staff view) - excludes public /api/v1/enquiries/track/[code]
  {
    pathPrefix: "/api/v1/enquiries",
    exactPath: true,
    methods: ["GET"],
    requiredPermission: "VIEW_ORDERS",
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "SHOWROOM_ADVISOR"],
  },
];

/**
 * Resolves the matching route rule for a request
 */
export function matchRouteRule(pathname: string, method: string): RouteRule | null {
  for (const rule of CENTRAL_ROUTE_RULES) {
    if (rule.excludePrefix && pathname.startsWith(rule.excludePrefix)) {
      continue;
    }
    const pathMatches = rule.exactPath
      ? pathname === rule.pathPrefix
      : pathname === rule.pathPrefix ||
        pathname.startsWith(rule.pathPrefix + "/") ||
        (rule.pathPrefix === "/admin" && pathname === "/admin");

    if (pathMatches) {
      if (!rule.methods || rule.methods.includes(method.toUpperCase())) {
        return rule;
      }
    }
  }
  return null;
}

/**
 * Check whether user roles grant a permission
 */
export function hasPermission(userRoles: string[] | undefined, permission: Permission): boolean {
  if (!userRoles || !Array.isArray(userRoles) || userRoles.length === 0) {
    return false;
  }
  for (const rawRole of userRoles) {
    const canonical = normalizeRole(rawRole);
    const perms = ROLE_PERMISSIONS[canonical];
    if (perms && perms.includes(permission)) {
      return true;
    }
  }
  return false;
}

/**
 * Check whether user has at least one of the accepted roles
 */
export function hasAnyRole(userRoles: string[] | undefined, acceptedRoles: string[]): boolean {
  if (!userRoles || !Array.isArray(userRoles) || userRoles.length === 0) {
    return false;
  }
  const acceptedNormalized = acceptedRoles.map(normalizeRole);
  return userRoles.some((r) => acceptedNormalized.includes(normalizeRole(r)));
}

/**
 * Retrieves authenticated user claims and roles from request if valid
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<{
  claims: JwtPayload;
  roles: string[];
} | null> {
  let token: string | undefined;
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  }
  if (!token) {
    token = request.cookies.get("candela_access_token")?.value;
  }
  if (!token) return null;

  const claims = await verifyJwt(token);
  if (!claims) return null;

  const rawRoles = Array.isArray(claims.roles) ? claims.roles : [];
  return {
    claims,
    roles: rawRoles.map(normalizeRole),
  };
}

/**
 * Server-Side Defense-in-Depth Request Authorizer
 * Verifies JWT token directly (never blindly trusts incoming X-User-* headers)
 */
export async function authorizeRequest(
  request: NextRequest,
  options: {
    requiredPermission?: Permission;
    allowedRoles?: string[];
  }
): Promise<
  | { authorized: true; claims: JwtPayload; roles: string[] }
  | { authorized: false; response: NextResponse }
> {
  let token: string | undefined;

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  }

  if (!token) {
    token = request.cookies.get("candela_access_token")?.value;
  }

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Missing authentication credentials.",
          code: "AUTH_REQUIRED",
        },
        { status: 401 }
      ),
    };
  }

  const claims = await verifyJwt(token);
  if (!claims) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid or expired token.",
          code: "INVALID_TOKEN",
        },
        { status: 401 }
      ),
    };
  }

  const rawRoles = Array.isArray(claims.roles) ? claims.roles : [];
  const roles = rawRoles.map(normalizeRole);

  if (options.requiredPermission && !hasPermission(rawRoles, options.requiredPermission)) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: `Forbidden: User lacks '${options.requiredPermission}' capability.`,
          code: "INSUFFICIENT_PERMISSIONS",
        },
        { status: 403 }
      ),
    };
  }

  if (options.allowedRoles && !hasAnyRole(rawRoles, options.allowedRoles)) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: `Forbidden: Endpoint restricted to roles [${options.allowedRoles.join(", ")}].`,
          code: "ROLE_NOT_PERMITTED",
        },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    claims,
    roles,
  };
}
