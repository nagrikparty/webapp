import { logger } from "./logger";

// TODO: For production, setup Cloudflare KV binding 'RATE_LIMITER_KV' or use Upstash Redis.
// The in-memory map fallback is ONLY for development and is not reliable on Cloudflare Workers
// because each isolate has its own memory and isolates are spun up/down dynamically.

interface RateLimitTracker {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitTracker>();

export async function checkRateLimit(key: string, maxRequests: number = 5, windowMs: number = 60000): Promise<boolean> {
  const now = Date.now();
  
  // Cloudflare KV approach (requires binding RATE_LIMITER_KV in wrangler)
  const kv = (globalThis as any).process?.env?.RATE_LIMITER_KV || (globalThis as any).RATE_LIMITER_KV;
  
  if (kv) {
    try {
      const dataStr = await kv.get(`rl:${key}`);
      let tracker: RateLimitTracker | null = dataStr ? JSON.parse(dataStr) : null;
      
      if (!tracker || now > tracker.resetTime) {
        tracker = { count: 1, resetTime: now + windowMs };
        // expirationTtl needs to be at least 60 seconds for Cloudflare KV.
        const ttl = Math.max(60, Math.ceil(windowMs / 1000));
        await kv.put(`rl:${key}`, JSON.stringify(tracker), { expirationTtl: ttl });
        return true;
      }
      
      if (tracker.count >= maxRequests) {
        logger.warn({ key }, "Rate limit exceeded (KV)");
        return false;
      }
      
      tracker.count += 1;
      const ttl = Math.max(60, Math.ceil((tracker.resetTime - now) / 1000));
      await kv.put(`rl:${key}`, JSON.stringify(tracker), { expirationTtl: ttl });
      return true;
    } catch (e) {
      logger.error({ err: e }, "KV Rate limit check failed, falling back to in-memory");
    }
  }

  const tracker = rateLimitMap.get(key);

  if (!tracker || now > tracker.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (tracker.count >= maxRequests) {
    logger.warn({ key }, "Rate limit exceeded (Memory)");
    return false;
  }

  tracker.count += 1;
  return true;
}
