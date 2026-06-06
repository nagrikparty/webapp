globalThis.process ??= {}; globalThis.process.env ??= {};
import { l as logger } from '../../../chunks/logger_CkpZmJYy.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DNSRmELw.mjs';

const GET = async (context) => {
  try {
    const env = context.locals.runtime.env;
    const url = new URL(context.request.url);
    const vidhanSabhaId = url.searchParams.get("vidhanSabhaId");
    if (!env.DB || !vidhanSabhaId) return new Response(JSON.stringify([]), { status: 200 });
    const result = await env.DB.prepare(
      "SELECT id, name, serial_no FROM wards WHERE vidhan_sabha_id = ? ORDER BY serial_no ASC"
    ).bind(vidhanSabhaId).all();
    return new Response(JSON.stringify(result.results || []), { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error fetching wards");
    return new Response(JSON.stringify([]), { status: 200 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
