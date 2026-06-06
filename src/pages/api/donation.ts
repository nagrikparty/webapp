import type { APIRoute } from 'astro';
import { submitDonationSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/ratelimit";
import { verifyTurnstile } from "./_utils";

export const POST: APIRoute = async (context) => {
  try {
    const data = await context.request.json();
    const env = context.locals.runtime.env;

    if (!data.turnstileToken || !(await verifyTurnstile(data.turnstileToken, env))) {
      return new Response(JSON.stringify({ success: false, error: "CAPTCHA verification failed" }), { status: 400 });
    }

    const ip = context.request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`donation_${ip}`, 5, 60000)) {
      return new Response(JSON.stringify({ success: false, error: "Too many requests, please try again later" }), { status: 429 });
    }

    if (!env.DB) return new Response(JSON.stringify({ success: false, error: "Database not configured" }), { status: 500 });

    const parsed = submitDonationSchema.safeParse(data);
    if (!parsed.success) {
      return new Response(JSON.stringify({ success: false, error: parsed.error.issues[0].message }), { status: 400 });
    }
    const d = parsed.data;

    const id = crypto.randomUUID();
    const result = await env.DB.prepare(
      "INSERT INTO nagrik_donations (id, donor_name, amount, purpose, transaction_ref) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, d.donor_name, d.amount, d.purpose, d.transaction_ref).run();

    return new Response(JSON.stringify({ success: result.success, id }), { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error in submitDonation");
    return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
  }
}

export const GET: APIRoute = async (context) => {
  try {
    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify([]), { status: 200 });

    const { results } = await env.DB.prepare(
      "SELECT * FROM nagrik_donations ORDER BY created_at DESC LIMIT 20"
    ).all<any>();

    return new Response(JSON.stringify(results), { status: 200 });
  } catch {
    return new Response(JSON.stringify([]), { status: 200 });
  }
}
