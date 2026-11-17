import { NextRequest, NextResponse } from "next/server";
import { validateAdminCredentials, signJwt } from "@/lib/auth";
import { loginRateLimiter, getClientIp } from "@/lib/rate-limit";

const ACCESS_COOKIE = "candela_access_token";
const REFRESH_COOKIE = "candela_refresh_token";

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request.headers);

  try {
    const credentials = await request.json();
    const { username, password } = credentials || {};
    const normalizedUsername = (username || "").trim().toLowerCase();
    const ipKey = `ip:${clientIp}`;
    const accountKey = `user:${normalizedUsername || "anonymous"}`;

    // 1. Check rate limits (both IP-based and Account-based)
    const ipCheck = loginRateLimiter.check(ipKey);
    const accountCheck = loginRateLimiter.check(accountKey);

    if (!ipCheck.allowed || !accountCheck.allowed) {
      const retryAfter = Math.max(ipCheck.resetInSeconds, accountCheck.resetInSeconds);

      console.warn(
        JSON.stringify({
          event: "AUTH_LOGIN_RATE_LIMIT_EXCEEDED",
          timestamp: new Date().toISOString(),
          ip: clientIp,
          account: normalizedUsername,
          retryAfter,
        })
      );

      return NextResponse.json(
        {
          success: false,
          message: "Too many failed login attempts. Please try again later.",
          code: "TOO_MANY_REQUESTS",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
          },
        }
      );
    }

    // 2. Validate against environment-configured staff credentials
    const valid = await validateAdminCredentials(username, password);

    if (!valid) {
      loginRateLimiter.increment(ipKey);
      if (normalizedUsername) {
        loginRateLimiter.increment(accountKey);
      }

      console.warn(
        JSON.stringify({
          event: "AUTH_LOGIN_FAILED",
          timestamp: new Date().toISOString(),
          ip: clientIp,
          account: normalizedUsername,
        })
      );

      return NextResponse.json(
        {
          success: false,
          message: "Invalid staff username or password",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 }
      );
    }

    // 3. Successful authentication: reset failed attempts
    loginRateLimiter.reset(ipKey);
    if (normalizedUsername) {
      loginRateLimiter.reset(accountKey);
    }

    console.info(
      JSON.stringify({
        event: "AUTH_LOGIN_SUCCESS",
        timestamp: new Date().toISOString(),
        ip: clientIp,
        account: username,
      })
    );

    const adminEmail = process.env.ADMIN_EMAIL || "admin@candela.in";
    const roles = ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"];

    // Generate compliant HS256 JWT
    const accessToken = await signJwt(
      {
        sub: "admin-1",
        username,
        email: adminEmail,
        roles,
      },
      86400 // 24 hours session for staff convenience
    );

    const refreshToken = await signJwt(
      {
        sub: "admin-1",
        username,
        email: adminEmail,
        roles,
      },
      60 * 60 * 24 * 7 // 7 days
    );

    const secure = process.env.NODE_ENV === "production";
    const response = NextResponse.json({
      success: true,
      userId: "admin-1",
      username,
      email: adminEmail,
      roles,
      accessToken,
      message: "Staff authentication successful",
    });

    response.cookies.set(ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    });

    response.cookies.set(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    console.error(
      JSON.stringify({
        event: "AUTH_LOGIN_ERROR",
        timestamp: new Date().toISOString(),
        ip: clientIp,
        error: err.message,
      })
    );
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred during authentication",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
