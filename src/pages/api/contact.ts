import type { APIRoute } from 'astro';
import { submitContactSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/ratelimit";
import { verifyTurnstile } from "./_utils";

export const POST: APIRoute = async (context) => {
  try {
    const data = await context.request.json();
    const ip = context.request.headers.get("x-forwarded-for") || "unknown";
    const env = context.locals.runtime.env;

    if (!await checkRateLimit(`contact_${ip}`, 5, 60000)) {
      return new Response(JSON.stringify({ success: false, error: "Too many requests, please try again later" }), { status: 429 });
    }

    if (!data.turnstileToken || !(await verifyTurnstile(data.turnstileToken, env))) {
      return new Response(JSON.stringify({ success: false, error: "CAPTCHA verification failed" }), { status: 400 });
    }

    const parsed = submitContactSchema.safeParse(data);
    if (!parsed.success) {
      return new Response(JSON.stringify({ success: false, error: parsed.error.issues[0].message }), { status: 400 });
    }
    const d = parsed.data;

    if (!env.DB) return new Response(JSON.stringify({ success: false, error: "Database not configured" }), { status: 500 });

    const id = crypto.randomUUID();
    const result = await env.DB.prepare(
      "INSERT INTO nagrik_contact_messages (id, name, email, message) VALUES (?, ?, ?, ?)"
    ).bind(id, d.name, d.email, d.message).run();

    return new Response(JSON.stringify({ success: result.success }), { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error in submitContact");
    return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
  }
}
