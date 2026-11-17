import { NextRequest, NextResponse } from "next/server";
import { cascadeImageUpdateInPostgres } from "@/lib/db";
import { authorizeRequest } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, {
      requiredPermission: "MANAGE_MEDIA",
    });
    if (!auth.authorized) {
      return auth.response;
    }

    const body = await req.json();
    const { oldUrl, newUrl } = body;

    if (!oldUrl || !newUrl) {
      return NextResponse.json(
        { success: false, error: "Both oldUrl and newUrl are required" },
        { status: 400 }
      );
    }

    const result = await cascadeImageUpdateInPostgres(oldUrl, newUrl);
    return NextResponse.json({
      success: true,
      message: `Image updated successfully across all projected locations.`,
      cascaded: result,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to cascade image update" },
      { status: 500 }
    );
  }
}
