import { NextRequest, NextResponse } from "next/server";

export function getBackendUrl(): string {
  const url = process.env.BACKEND_URL?.trim();
  if (process.env.NODE_ENV === "production" && !url) {
    throw new Error("SECURITY CONFIGURATION ERROR: BACKEND_URL environment variable must be set in production.");
  }
  return url || "http://localhost:8080";
}

export interface BackendResponse<T = unknown> {
  status: number;
  data: T | null;
  headers: Headers;
  rawBody: string;
}

export async function backendFetch<T = unknown>(
  path: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string | FormData | Buffer | Uint8Array;
    token?: string;
    clientIp?: string;
    timeoutMs?: number;
  } = {}
): Promise<BackendResponse<T>> {
  const backendBase = getBackendUrl().replace(/\/+$/, "");
  const targetUrl = `${backendBase}${path.startsWith("/") ? path : `/${path}`}`;

  const reqHeaders = new Headers(options.headers || {});

  if (options.token && !reqHeaders.has("Authorization")) {
    reqHeaders.set("Authorization", `Bearer ${options.token}`);
  }

  if (options.clientIp) {
    if (!reqHeaders.has("X-Forwarded-For")) {
      reqHeaders.set("X-Forwarded-For", options.clientIp);
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || 10000);

  try {
    const res = await fetch(targetUrl, {
      method: options.method || "GET",
      headers: reqHeaders,
      body: options.body as BodyInit,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    const text = await res.text();
    let parsed: any = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Raw string or non-JSON response
    }

    // Unpack Spring Boot ApiResponse wrapper ({ success: true, data: ... }) if present
    let finalData: T | null = parsed;
    if (parsed && typeof parsed === "object" && "data" in parsed && "success" in parsed) {
      finalData = parsed.data as T;
    }

    return {
      status: res.status,
      data: finalData,
      headers: res.headers,
      rawBody: text,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Forwards an incoming NextRequest directly to the Spring Boot modular monolith,
 * preserving method, query parameters, authorization, client IP, and payload.
 * Injects X-Handled-By: Spring-Boot-Modular-Monolith for full provenance and auditability.
 */
export async function forwardToBackend(
  request: NextRequest,
  backendPath?: string
): Promise<NextResponse> {
  const backendBase = getBackendUrl().replace(/\/+$/, "");
  const url = new URL(request.url);
  const targetPath = backendPath || url.pathname;
  const targetUrl = `${backendBase}${targetPath}${url.search}`;

  const reqHeaders = new Headers();

  // Forward incoming headers safely
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower !== "host" && lower !== "connection" && lower !== "content-length") {
      reqHeaders.set(key, value);
    }
  });

  // Extract token from cookie if Authorization header is missing
  if (!reqHeaders.has("Authorization")) {
    const cookieToken = request.cookies.get("candela_access_token")?.value;
    if (cookieToken) {
      reqHeaders.set("Authorization", `Bearer ${cookieToken}`);
    }
  }

  // Forward client IP
  const xForwardedFor = request.headers.get("x-forwarded-for") || request.ip || "127.0.0.1";
  reqHeaders.set("X-Forwarded-For", xForwardedFor);

  let body: BodyInit | undefined;
  if (!["GET", "HEAD"].includes(request.method.toUpperCase())) {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const arrayBuf = await request.arrayBuffer();
      body = Buffer.from(arrayBuf);
    } else {
      body = await request.text();
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const backendRes = await fetch(targetUrl, {
      method: request.method,
      headers: reqHeaders,
      body,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    const responseBody = await backendRes.text();
    const responseHeaders = new Headers();

    backendRes.headers.forEach((val, key) => {
      const lower = key.toLowerCase();
      if (lower !== "content-encoding" && lower !== "transfer-encoding" && lower !== "content-length") {
        responseHeaders.set(key, val);
      }
    });

    // Explicit architectural provenance header
    responseHeaders.set("X-Handled-By", "Spring-Boot-Modular-Monolith");
    responseHeaders.set("X-Backend-Service", "CandelaMonolithApplication");

    return new NextResponse(responseBody, {
      status: backendRes.status,
      headers: responseHeaders,
    });
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`[backend-client] Error proxying ${request.method} ${targetUrl}:`, error);

    return NextResponse.json(
      {
        success: false,
        message: "Backend service layer unreachable or timed out.",
        code: "GATEWAY_TIMEOUT",
        timestamp: new Date().toISOString(),
      },
      {
        status: 504,
        headers: {
          "X-Handled-By": "Next.js-Gateway-Fallback",
        },
      }
    );
  }
}
