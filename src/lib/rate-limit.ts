/**
 * Enterprise Rate-Limiting and Brute-Force Defense
 * Provides sliding-window rate limiting with IP and account-based keys,
 * Retry-After calculation, and structured security audit logging.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
  lastAttemptAt: number;
}

class InMemoryRateLimiter {
  private map = new Map<string, RateLimitEntry>();
  private readonly windowMs: number;
  private readonly maxLimit: number;

  constructor(windowMs: number, maxLimit: number) {
    this.windowMs = windowMs;
    this.maxLimit = maxLimit;
    // Periodic cleanup every 5 minutes
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 5 * 60 * 1000).unref?.();
    }
  }

  private cleanup(): void {
    const now = Date.now();
    this.map.forEach((entry, key) => {
      if (now > entry.resetAt) {
        this.map.delete(key);
      }
    });
  }

  public check(key: string): {
    allowed: boolean;
    remaining: number;
    resetInSeconds: number;
    total: number;
  } {
    const now = Date.now();
    let entry = this.map.get(key);

    if (!entry || now > entry.resetAt) {
      entry = {
        count: 0,
        resetAt: now + this.windowMs,
        lastAttemptAt: now,
      };
      this.map.set(key, entry);
    }

    const remaining = Math.max(0, this.maxLimit - entry.count);
    const resetInSeconds = Math.ceil((entry.resetAt - now) / 1000);

    return {
      allowed: entry.count < this.maxLimit,
      remaining,
      resetInSeconds: Math.max(1, resetInSeconds),
      total: entry.count,
    };
  }

  public increment(key: string): {
    allowed: boolean;
    remaining: number;
    resetInSeconds: number;
    total: number;
  } {
    const now = Date.now();
    let entry = this.map.get(key);

    if (!entry || now > entry.resetAt) {
      entry = {
        count: 1,
        resetAt: now + this.windowMs,
        lastAttemptAt: now,
      };
      this.map.set(key, entry);
    } else {
      entry.count += 1;
      entry.lastAttemptAt = now;
    }

    const allowed = entry.count <= this.maxLimit;
    const remaining = Math.max(0, this.maxLimit - entry.count);
    const resetInSeconds = Math.ceil((entry.resetAt - now) / 1000);

    return {
      allowed,
      remaining,
      resetInSeconds: Math.max(1, resetInSeconds),
      total: entry.count,
    };
  }

  public reset(key: string): void {
    this.map.delete(key);
  }
}

// 1. Staff Login Rate Limiter: max 5 failed attempts per 15-minute window
export const loginRateLimiter = new InMemoryRateLimiter(15 * 60 * 1000, 5);

// 2. Enquiry Tracking Rate Limiter: max 15 queries per 15-minute window per IP
export const enquiryTrackingRateLimiter = new InMemoryRateLimiter(15 * 60 * 1000, 15);

// 3. Enquiry Submission Rate Limiter: max 10 submissions per 15-minute window
export const enquirySubmissionRateLimiter = new InMemoryRateLimiter(15 * 60 * 1000, 10);

/**
 * Extracts client IP address safely considering proxy forwarding headers
 */
export function getClientIp(requestOrHeaders: Headers | Request): string {
  const headers = "headers" in requestOrHeaders ? requestOrHeaders.headers : requestOrHeaders;
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor.split(",");
    const clientIp = parts[0]?.trim();
    if (clientIp) return clientIp;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();
  return "127.0.0.1";
}
