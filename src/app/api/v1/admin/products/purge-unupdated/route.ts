import { NextRequest, NextResponse } from "next/server";
import { purgeUnupdatedProductsInPostgres } from "@/lib/db";
import { ApiResponse } from "@/types";
import { authorizeRequest } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRequest(req, {
      allowedRoles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"],
    });
    if (!auth.authorized) {
      return auth.response;
    }

    const result = await purgeUnupdatedProductsInPostgres();

    const response: ApiResponse<{ purgedCount: number; remainingCount: number }> = {
      success: true,
      data: result,
      message: `Successfully purged ${result.purgedCount} items without updated images from PostgreSQL. ${result.remainingCount} active lots remain.`,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in purge-unupdated route:", error);
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Failed to purge un-updated products",
      timestamp: new Date().toISOString(),
      error: {
        code: "PURGE_ERROR",
        message: error instanceof Error ? error.message : "Internal server error",
      },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
