import type { APIRoute } from "astro";
import { requireAuth, logAuditEvent } from "@/lib/auth";
import { executeTopicPipeline } from "@/lib/topic-service";

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireAuth(request);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  if (ctx.profile.role !== "ADMIN" && ctx.profile.role !== "SUPER_ADMIN") {
    return new Response(JSON.stringify({ error: "Forbidden: Admin privileges required" }), { status: 403 });
  }

  try {
    const result = await executeTopicPipeline(`ADMIN:${ctx.user.id}`);

    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      "TOPIC_PIPELINE_RUN",
      "data_runs",
      result.runId,
      { success: result.success, itemsProcessed: result.itemsProcessed },
      request
    );

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Pipeline failure";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};
