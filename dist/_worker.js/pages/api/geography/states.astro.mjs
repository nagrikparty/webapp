globalThis.process ??= {}; globalThis.process.env ??= {};
import { l as logger } from '../../../chunks/logger_CkpZmJYy.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DNSRmELw.mjs';

const GET = async (context) => {
  try {
    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify([]), { status: 200 });
    const result = await env.DB.prepare("SELECT id, name, name_hi, serial_no FROM states ORDER BY serial_no ASC").all();
    return new Response(JSON.stringify(result.results || []), { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error fetching states");
    return new Response(JSON.stringify([]), { status: 200 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
