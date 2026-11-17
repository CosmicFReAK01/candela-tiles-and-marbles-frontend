import { NextRequest } from "next/server";
import { authorizeRequest } from "@/lib/rbac";
import { forwardToBackend } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await authorizeRequest(request, {
    allowedRoles: ["ROLE_STAFF", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"],
  });
  if (!auth.authorized) {
    return auth.response;
  }
  return forwardToBackend(request, "/api/v1/collections");
}

export async function PUT(request: NextRequest) {
  const auth = await authorizeRequest(request, {
    requiredPermission: "MANAGE_CATALOGUE",
  });
  if (!auth.authorized) {
    return auth.response;
  }
  return forwardToBackend(request, "/api/v1/collections");
}
