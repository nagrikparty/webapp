globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as submitDonationSchema } from '../../chunks/validations_DFcAlvCZ.mjs';
import { l as logger } from '../../chunks/logger_CkpZmJYy.mjs';
import { v as verifyTurnstile, c as checkRateLimit } from '../../chunks/_utils_DruJU8pL.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DNSRmELw.mjs';

const POST = async (context) => {
  try {
    const data = await context.request.json();
    const env = context.locals.runtime.env;
    if (!data.turnstileToken || !await verifyTurnstile(data.turnstileToken, env)) {
      return new Response(JSON.stringify({ success: false, error: "CAPTCHA verification failed" }), { status: 400 });
    }
    const ip = context.request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`donation_${ip}`, 5, 6e4)) {
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
};
const GET = async (context) => {
  try {
    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify([]), { status: 200 });
    const { results } = await env.DB.prepare(
      "SELECT * FROM nagrik_donations ORDER BY created_at DESC LIMIT 20"
    ).all();
    return new Response(JSON.stringify(results), { status: 200 });
  } catch {
    return new Response(JSON.stringify([]), { status: 200 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
