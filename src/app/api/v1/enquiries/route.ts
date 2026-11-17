import { NextRequest } from "next/server";
import { authorizeRequest } from "@/lib/rbac";
import { forwardToBackend } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await authorizeRequest(request, { requiredPermission: "VIEW_ORDERS" });
  if (!auth.authorized) {
    return auth.response;
  }
  return forwardToBackend(request, "/api/v1/enquiries");
}

export async function POST(request: NextRequest) {
  return forwardToBackend(request, "/api/v1/enquiries");
}
