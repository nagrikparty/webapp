import { defineMiddleware } from "astro:middleware";

const ipRequests = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // 100 requests per minute per IP for APIs

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // 1. Basic Rate Limiting for API routes
  if (url.pathname.startsWith("/api/")) {
    // Cloudflare specific headers for client IP, fallback to 127.0.0.1
    const clientIp = context.request.headers.get("cf-connecting-ip") || 
                     context.request.headers.get("x-forwarded-for") || 
                     "127.0.0.1";

    const now = Date.now();
    const requestData = ipRequests.get(clientIp);

    if (requestData) {
      if (now - requestData.timestamp < RATE_LIMIT_WINDOW) {
        requestData.count += 1;
        if (requestData.count > MAX_REQUESTS_PER_WINDOW) {
          return new Response(JSON.stringify({ error: "Too Many Requests" }), {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": "60"
            }
          });
        }
      } else {
        // Reset window
        ipRequests.set(clientIp, { count: 1, timestamp: now });
      }
    } else {
      ipRequests.set(clientIp, { count: 1, timestamp: now });
    }
  }

  // 2. Process request
  const response = await next();

  // 3. Inject Security Headers
  // Strict Transport Security (HSTS)
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Strict Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Prevent use of camera, mic, geolocation unless needed
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );

  // Content Security Policy (Basic but strict, adjust if adding third-party scripts)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://checkout.razorpay.com",
    "frame-src 'self' https://checkout.razorpay.com",
    "worker-src 'self' blob:"
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  return response;
});
