import { NextRequest } from "next/server";
import { forwardToBackend } from "@/lib/backend-client";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = encodeURIComponent(params.code || "");
  return forwardToBackend(request, `/api/v1/enquiries/track/${code}`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = encodeURIComponent(params.code || "");
  return forwardToBackend(request, `/api/v1/enquiries/track/${code}`);
}
