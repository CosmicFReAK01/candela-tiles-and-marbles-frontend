import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const SAFE_RASTER_MIMES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const fileSegments = params.path || [];
    const uploadsRoot = path.resolve(process.cwd(), "public", "uploads");
    const resolvedTarget = path.resolve(uploadsRoot, ...fileSegments);

    // Strictly enforce canonical containment inside public/uploads
    if (!resolvedTarget.startsWith(uploadsRoot + path.sep)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const ext = path.extname(resolvedTarget).toLowerCase();
    const contentType = SAFE_RASTER_MIMES[ext];
    if (!contentType || !fs.existsSync(resolvedTarget)) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(resolvedTarget);
    const baseName = path.basename(resolvedTarget).replace(/["\r\n]/g, "");

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${baseName}"`,
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox;",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving uploaded file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
