import { logger } from "./logger";

// Simple in-memory rate limiter for server actions
// Note: In a true serverless edge environment (like Cloudflare Workers),
// this memory state might reset on every request or differ per edge node.
// For production, replace this with Cloudflare KV or Upstash Redis.

interface RateLimitTracker {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitTracker>();

export function checkRateLimit(ip: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const tracker = rateLimitMap.get(ip);

  if (!tracker) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (now > tracker.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (tracker.count >= maxRequests) {
    logger.warn({ ip }, "Rate limit exceeded");
    return false;
  }

  tracker.count += 1;
  return true;
}
