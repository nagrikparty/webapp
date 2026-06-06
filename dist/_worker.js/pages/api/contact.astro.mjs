globalThis.process ??= {}; globalThis.process.env ??= {};
import { s as submitContactSchema } from '../../chunks/validations_DFcAlvCZ.mjs';
import { l as logger } from '../../chunks/logger_CkpZmJYy.mjs';
import { c as checkRateLimit, v as verifyTurnstile } from '../../chunks/_utils_DruJU8pL.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DNSRmELw.mjs';

const POST = async (context) => {
  try {
    const data = await context.request.json();
    const ip = context.request.headers.get("x-forwarded-for") || "unknown";
    const env = context.locals.runtime.env;
    if (!await checkRateLimit(`contact_${ip}`, 5, 6e4)) {
      return new Response(JSON.stringify({ success: false, error: "Too many requests, please try again later" }), { status: 429 });
    }
    if (!data.turnstileToken || !await verifyTurnstile(data.turnstileToken, env)) {
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
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
