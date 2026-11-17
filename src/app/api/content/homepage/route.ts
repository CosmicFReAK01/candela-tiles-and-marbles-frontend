import { NextRequest } from "next/server";
import { forwardToBackend } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return forwardToBackend(request, "/api/content/homepage");
}
