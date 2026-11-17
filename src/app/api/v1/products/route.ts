import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/rbac";
import { forwardToBackend } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return forwardToBackend(request, "/api/v1/products");
}

export async function POST(request: NextRequest) {
  const auth = await authorizeRequest(request, { requiredPermission: "MANAGE_CATALOGUE" });
  if (!auth.authorized) {
    return auth.response;
  }
  return forwardToBackend(request, "/api/v1/products");
}

export async function PUT(request: NextRequest) {
  const auth = await authorizeRequest(request, { requiredPermission: "MANAGE_CATALOGUE" });
  if (!auth.authorized) {
    return auth.response;
  }
  return forwardToBackend(request, "/api/v1/products");
}

export async function DELETE(request: NextRequest) {
  const auth = await authorizeRequest(request, { requiredPermission: "MANAGE_CATALOGUE" });
  if (!auth.authorized) {
    return auth.response;
  }
  return forwardToBackend(request, "/api/v1/products");
}
