import { NextRequest, NextResponse } from "next/server";
import {
  getSiteNavigationFromPostgres,
  upsertSiteNavigationInPostgres,
  deleteSiteNavigationInPostgres,
} from "@/lib/db";
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

    const nav = await getSiteNavigationFromPostgres();
    return NextResponse.json({
      success: true,
      data: nav,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch navigation items" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, {
      requiredPermission: "MANAGE_CMS",
    });
    if (!auth.authorized) {
      return auth.response;
    }

    const body = await req.json();
    const updated = await upsertSiteNavigationInPostgres(body);
    return NextResponse.json({
      success: updated,
      message: "Navigation item saved",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save navigation item" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, {
      requiredPermission: "MANAGE_CMS",
    });
    if (!auth.authorized) {
      return auth.response;
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }
    const deleted = await deleteSiteNavigationInPostgres(id);
    return NextResponse.json({
      success: deleted,
      message: "Navigation item deleted",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete navigation item" },
      { status: 500 }
    );
  }
}
