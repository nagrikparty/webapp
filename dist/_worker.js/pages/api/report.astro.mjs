globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as submitReportSchema } from '../../chunks/validations_DFcAlvCZ.mjs';
import { l as logger } from '../../chunks/logger_CkpZmJYy.mjs';
import { v as verifyTurnstile, c as checkRateLimit, a as validateFileUpload } from '../../chunks/_utils_DruJU8pL.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DNSRmELw.mjs';

const POST = async (context) => {
  try {
    const formData = await context.request.formData();
    const turnstileToken = formData.get("cf-turnstile-response");
    const env = context.locals.runtime.env;
    if (!turnstileToken || !await verifyTurnstile(turnstileToken, env)) {
      return new Response(JSON.stringify({ success: false, error: "CAPTCHA verification failed" }), { status: 400 });
    }
    const ip = context.request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`report_${ip}`, 5, 6e4)) {
      return new Response(JSON.stringify({ success: false, error: "Too many requests, please try again later" }), { status: 429 });
    }
    if (!env.DB) return new Response(JSON.stringify({ success: false, error: "Database not configured" }), { status: 500 });
    const id = crypto.randomUUID();
    const validationData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      ward: formData.get("ward"),
      category: formData.get("category"),
      severity: formData.get("severity"),
      description: formData.get("description")
    };
    const parsed = submitReportSchema.safeParse(validationData);
    if (!parsed.success) {
      return new Response(JSON.stringify({ success: false, error: parsed.error.issues[0].message }), { status: 400 });
    }
    const d = parsed.data;
    const file = formData.get("file");
    if (file && file.size > 0) {
      const v = await validateFileUpload(file);
      if (!v.valid) return new Response(JSON.stringify({ success: false, error: v.error }), { status: 400 });
    }
    let photo_url = null;
    if (file && file.size > 0 && env.REPORTS_BUCKET) {
      const fileExt = file.name.split(".").pop();
      const fileName = `reports/${id}.${fileExt}`;
      const arrayBuffer = await file.arrayBuffer();
      await env.REPORTS_BUCKET.put(fileName, arrayBuffer, {
        httpMetadata: { contentType: file.type }
      });
      photo_url = fileName;
    }
    const result = await env.DB.prepare(
      "INSERT INTO nagrik_reports (id, name, phone, ward, category, severity, description, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, d.name, d.phone, d.ward, d.category, d.severity, d.description, photo_url).run();
    return new Response(JSON.stringify({ success: result.success, id }), { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error in submitReport");
    return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
