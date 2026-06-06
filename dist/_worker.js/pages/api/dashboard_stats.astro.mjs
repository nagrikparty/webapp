globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../../chunks/_@astro-renderers_DNSRmELw.mjs';

const GET = async (context) => {
  try {
    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify(null), { status: 200 });
    const [reports, volunteers, donations] = await Promise.all([
      env.DB.prepare("SELECT COUNT(*) as count FROM nagrik_reports").first(),
      env.DB.prepare("SELECT COUNT(*) as count FROM nagrik_members").first(),
      env.DB.prepare("SELECT COUNT(*) as count FROM nagrik_donations").first()
    ]);
    return new Response(JSON.stringify({
      reportCount: reports?.count ?? 0,
      volunteerCount: volunteers?.count ?? 0,
      donationCount: donations?.count ?? 0
    }), { status: 200 });
  } catch {
    return new Response(JSON.stringify(null), { status: 200 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
