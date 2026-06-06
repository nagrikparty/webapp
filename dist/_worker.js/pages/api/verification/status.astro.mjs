globalThis.process ??= {}; globalThis.process.env ??= {};
import { l as logger } from '../../../chunks/logger_CkpZmJYy.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DNSRmELw.mjs';

const GET = async (context) => {
  try {
    const supabase = context.locals.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.id) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
    }
    const memberId = user.id;
    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify({ success: false, error: "Database unavailable" }), { status: 500 });
    const member = await env.DB.prepare(
      `SELECT didit_session_id, is_verified FROM nagrik_members WHERE id = ?`
    ).bind(memberId).first();
    if (!member || !member.didit_session_id) {
      return new Response(JSON.stringify({ success: true, isVerified: !!member?.is_verified }), { status: 200 });
    }
    if (member.is_verified) {
      return new Response(JSON.stringify({ success: true, isVerified: true }), { status: 200 });
    }
    const apiKey = env.DIDIT_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ success: false, error: "Missing API Key" }), { status: 500 });
    const diditResponse = await fetch(`https://verification.didit.me/v3/session/${member.didit_session_id}/decision/`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey
      }
    });
    if (diditResponse.ok) {
      const data = await diditResponse.json();
      if (data.status === "Approved" || data.decision === "Approved") {
        await env.DB.prepare(
          `UPDATE nagrik_members SET is_verified = 1 WHERE id = ?`
        ).bind(memberId).run();
        return new Response(JSON.stringify({ success: true, isVerified: true }), { status: 200 });
      }
      if (data.status === "Declined" || data.decision === "Declined") {
        await env.DB.prepare(
          `UPDATE nagrik_members SET didit_session_id = NULL WHERE id = ?`
        ).bind(memberId).run();
        return new Response(JSON.stringify({ success: true, isVerified: false, declined: true }), { status: 200 });
      }
    }
    return new Response(JSON.stringify({ success: true, isVerified: false }), { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error checking verification status");
    return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
