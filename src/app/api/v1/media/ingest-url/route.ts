import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import net from "net";
import { ApiResponse, MediaAsset } from "@/types";
import { recordMediaInPostgres } from "@/lib/db";
import { authorizeRequest } from "@/lib/rbac";

export const dynamic = "force-dynamic";

// Trusted media host domains allowlist (supplemented by project's Supabase host & TRUSTED_MEDIA_HOSTS)
const DEFAULT_TRUSTED_HOSTS = [
  "images.unsplash.com",
  "res.cloudinary.com",
  "cdn.candelatiles.com",
];

function isPrivateOrLoopbackIp(hostname: string): boolean {
  const cleanHost = hostname.replace(/^\[|\]$/g, "").toLowerCase();

  // Common local/metadata hostnames
  if (
    cleanHost === "localhost" ||
    cleanHost.endsWith(".localhost") ||
    cleanHost.endsWith(".local") ||
    cleanHost.endsWith(".internal") ||
    cleanHost === "metadata.google.internal"
  ) {
    return true;
  }

  // IPv4 private/loopback/link-local ranges
  if (net.isIPv4(cleanHost)) {
    const parts = cleanHost.split(".").map(Number);
    const [a, b] = parts;
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 127) return true; // 127.0.0.0/8 loopback
    if (a === 0) return true; // 0.0.0.0/8
    if (a === 169 && b === 254) return true; // 169.254.0.0/16 cloud metadata/link-local
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 CGNAT
  }

  // IPv6 loopback / link-local / unique-local
  if (net.isIPv6(cleanHost)) {
    if (
      cleanHost === "::1" ||
      cleanHost === "::" ||
      cleanHost.startsWith("fe80:") ||
      cleanHost.startsWith("fc") ||
      cleanHost.startsWith("fd") ||
      cleanHost.startsWith("::ffff:127.") ||
      cleanHost.startsWith("::ffff:10.") ||
      cleanHost.startsWith("::ffff:169.254.") ||
      cleanHost.startsWith("::ffff:192.168.")
    ) {
      return true;
    }
  }

  return false;
}

function isTrustedMediaHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  const extraHosts = (process.env.TRUSTED_MEDIA_HOSTS || "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  // Include project's own Supabase Storage hostname if configured
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (supaUrl) {
    try {
      extraHosts.push(new URL(supaUrl).hostname.toLowerCase());
    } catch {}
  }

  const allowed = new Set([...DEFAULT_TRUSTED_HOSTS, ...extraHosts]);
  return allowed.has(host) || host.endsWith(".supabase.co");
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authorizeRequest(request, {
      requiredPermission: "MANAGE_MEDIA",
    });
    if (!auth.authorized) {
      return auth.response;
    }

    const body = await request.json();
    const { url, altText, categoryScope = "ALL" } = body || {};

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Image URL is required.",
          timestamp: new Date().toISOString(),
          error: {
            code: "MISSING_URL",
            message: "Please provide a valid HTTPS image URL string.",
          },
        } satisfies ApiResponse<null>,
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();
    if (trimmedUrl.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "URL exceeds maximum length (1000 characters).",
          timestamp: new Date().toISOString(),
          error: { code: "URL_TOO_LONG", message: "URL too long." },
        } satisfies ApiResponse<null>,
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmedUrl);
    } catch {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Invalid URL format provided.",
          timestamp: new Date().toISOString(),
          error: {
            code: "INVALID_URL",
            message: "The provided URL is not a well-formed web address.",
          },
        } satisfies ApiResponse<null>,
        { status: 400 }
      );
    }

    // Enforce HTTPS-only (blocks javascript:, data:, file:, http:) & strip credentialed URLs
    if (parsedUrl.protocol !== "https:" || parsedUrl.username || parsedUrl.password) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Only HTTPS URLs without embedded credentials are permitted.",
          timestamp: new Date().toISOString(),
          error: {
            code: "UNSAFE_URL_SCHEME",
            message: `Protocol '${parsedUrl.protocol}' is rejected. Only clean https:// image URLs are allowed.`,
          },
        } satisfies ApiResponse<null>,
        { status: 400 }
      );
    }

    // Block loopback, private, and link-local IP ranges (SSRF guard)
    if (isPrivateOrLoopbackIp(parsedUrl.hostname)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Private, loopback, or link-local network addresses are forbidden.",
          timestamp: new Date().toISOString(),
          error: {
            code: "FORBIDDEN_HOST",
            message: "Internal network hosts are blocked by SSRF policy.",
          },
        } satisfies ApiResponse<null>,
        { status: 403 }
      );
    }

    // Enforce trusted media domain allowlist
    if (!isTrustedMediaHost(parsedUrl.hostname)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: `Untrusted media host '${parsedUrl.hostname}'. Upload the file directly or use an approved CDN.`,
          timestamp: new Date().toISOString(),
          error: {
            code: "UNTRUSTED_MEDIA_HOST",
            message: "Domain is not in the approved external media allowlist.",
          },
        } satisfies ApiResponse<null>,
        { status: 400 }
      );
    }

    const pathname = parsedUrl.pathname;
    const lastSlash = pathname.lastIndexOf("/");
    let derivedName = lastSlash >= 0 ? pathname.slice(lastSlash + 1) : "external-asset";
    if (!derivedName || derivedName.length > 80) {
      derivedName = "external-asset.jpg";
    }

    const uniqueId = crypto.randomBytes(4).toString("hex");
    const assetId = `media-url-${Date.now()}-${uniqueId}`;

    const mediaAsset: MediaAsset = {
      id: assetId,
      fileName: derivedName,
      originalName: derivedName,
      url: parsedUrl.toString(),
      sourceType: "EXTERNAL_URL",
      mimeType: "image/jpeg",
      categoryScope,
      altText: String(altText || derivedName.replace(/[-_.]/g, " ")).slice(0, 200),
      uploadedBy: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await recordMediaInPostgres(mediaAsset);

    return NextResponse.json(
      {
        success: true,
        data: mediaAsset,
        message: "Verified HTTPS media link registered in Supabase PostgreSQL",
        timestamp: new Date().toISOString(),
      } satisfies ApiResponse<MediaAsset>,
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in /api/v1/media/ingest-url:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "An internal server error occurred while ingesting image URL.",
        timestamp: new Date().toISOString(),
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      } satisfies ApiResponse<null>,
      { status: 500 }
    );
  }
}
