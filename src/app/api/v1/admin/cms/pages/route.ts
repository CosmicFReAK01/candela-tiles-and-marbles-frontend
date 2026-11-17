import { NextRequest, NextResponse } from "next/server";
import { getSitePagesFromPostgres, updateSitePageInPostgres } from "@/lib/db";
import { authorizeRequest } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, {
      requiredPermission: "MANAGE_CMS",
    });
    if (!auth.authorized) {
      return auth.response;
    }

    const pages = await getSitePagesFromPostgres();
    return NextResponse.json({
      success: true,
      data: pages,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch site pages" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, {
      requiredPermission: "MANAGE_CMS",
    });
    if (!auth.authorized) {
      return auth.response;
    }

    const body = await req.json();
    const { slug, ...data } = body;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "slug is required" },
        { status: 400 }
      );
    }

    const updated = await updateSitePageInPostgres(slug, data);
    return NextResponse.json({
      success: updated,
      message: updated ? `Page '${slug}' updated successfully` : "Failed to update page",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update site page" },
      { status: 500 }
    );
  }
}
