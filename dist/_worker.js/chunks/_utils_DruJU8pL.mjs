globalThis.process ??= {}; globalThis.process.env ??= {};
import { l as logger } from './logger_CkpZmJYy.mjs';

const rateLimitMap = /* @__PURE__ */ new Map();
async function checkRateLimit(key, maxRequests = 5, windowMs = 6e4) {
  const now = Date.now();
  const kv = globalThis.process?.env?.RATE_LIMITER_KV || globalThis.RATE_LIMITER_KV;
  if (kv) {
    try {
      const dataStr = await kv.get(`rl:${key}`);
      let tracker2 = dataStr ? JSON.parse(dataStr) : null;
      if (!tracker2 || now > tracker2.resetTime) {
        tracker2 = { count: 1, resetTime: now + windowMs };
        const ttl2 = Math.max(60, Math.ceil(windowMs / 1e3));
        await kv.put(`rl:${key}`, JSON.stringify(tracker2), { expirationTtl: ttl2 });
        return true;
      }
      if (tracker2.count >= maxRequests) {
        logger.warn({ key }, "Rate limit exceeded (KV)");
        return false;
      }
      tracker2.count += 1;
      const ttl = Math.max(60, Math.ceil((tracker2.resetTime - now) / 1e3));
      await kv.put(`rl:${key}`, JSON.stringify(tracker2), { expirationTtl: ttl });
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

async function verifyTurnstile(token, env) {
  try {
    const secretKey = env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) return false;
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      body: formData,
      method: "POST"
    });
    const outcome = await result.json();
    return !!outcome.success;
  } catch (error) {
    logger.error({ err: error }, "Turnstile verification error");
    return false;
  }
}
async function validateFileUpload(file, maxSizeMB = 5) {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit.` };
  }
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed." };
  }
  return { valid: true };
}

export { validateFileUpload as a, checkRateLimit as c, verifyTurnstile as v };
