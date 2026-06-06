globalThis.process ??= {}; globalThis.process.env ??= {};
import { l as logger } from '../../../chunks/logger_CkpZmJYy.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_DNSRmELw.mjs';

const POST = async (context) => {
  try {
    const supabase = context.locals.supabase;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.id) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
    }
    const memberId = user.id;
    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify({ success: false, error: "Database unavailable" }), { status: 500 });
    const currentMonth = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
    const countResult = await env.DB.prepare(
      `SELECT COUNT(*) as count FROM nagrik_verifications WHERE strftime('%Y-%m', created_at) = ?`
    ).bind(currentMonth).first();
    if (countResult && countResult.count >= 500) {
      return new Response(JSON.stringify({ success: false, error: "Monthly verification limit reached (500/500). Please try again next month." }), { status: 403 });
    }
    const member = await env.DB.prepare(
      `SELECT is_verified FROM nagrik_members WHERE id = ?`
    ).bind(memberId).first();
    if (member && member.is_verified) {
      return new Response(JSON.stringify({ success: false, error: "You are already verified!" }), { status: 400 });
    }
    const apiKey = env.DIDIT_API_KEY;
    const workflowId = env.DIDIT_WORKFLOW_ID;
    if (!apiKey) {
      logger.error("DIDIT_API_KEY is not configured in the environment.");
      return new Response(JSON.stringify({ success: false, error: "Verification service configuration missing." }), { status: 500 });
    }
    const diditResponse = await fetch("https://verification.didit.me/v3/session/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify({
        workflow_id: workflowId || "placeholder_workflow_id",
        vendor_data: memberId,
        callback: "https://nagrik.party/en/dashboard"
      })
    });
    if (!diditResponse.ok) {
      const errorText = await diditResponse.text();
      logger.error({ errorText }, "Didit API Error");
      return new Response(JSON.stringify({ success: false, error: "Failed to initialize verification session with Didit." }), { status: 500 });
    }
    const data = await diditResponse.json();
    const sessionId = data.session_id;
    const verificationUrl = data.url;
    const vId = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO nagrik_verifications (id, member_id, session_id) VALUES (?, ?, ?)`
    ).bind(vId, memberId, sessionId).run();
    await env.DB.prepare(
      `UPDATE nagrik_members SET didit_session_id = ? WHERE id = ?`
    ).bind(sessionId, memberId).run();
    return new Response(JSON.stringify({ success: true, url: verificationUrl }), { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error creating Didit session");
    return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
