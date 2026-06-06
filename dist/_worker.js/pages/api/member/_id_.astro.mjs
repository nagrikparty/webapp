globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../../chunks/_@astro-renderers_DNSRmELw.mjs';

const GET = async (context) => {
  try {
    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify(null), { status: 200 });
    const id = context.params.id;
    const data = await env.DB.prepare(
      `SELECT id, name, phone, email, epic_number, is_indian_citizen, has_criminal_record, created_at, profile_photo_key, is_verified, didit_session_id 
       FROM nagrik_members WHERE id = ?`
    ).bind(id).first();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(null), { status: 200 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
