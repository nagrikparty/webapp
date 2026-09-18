import type { APIRoute } from "astro";
import { requireAuth, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireAuth(request);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  if (ctx.profile.role !== "ADMIN" && ctx.profile.role !== "SUPER_ADMIN") {
    return new Response(JSON.stringify({ error: "Forbidden: Admin privileges required" }), { status: 403 });
  }

  const scopedSupabase = createApiSupabase(ctx.token);
  if (!scopedSupabase) {
    return new Response(JSON.stringify({ error: "Database client unavailable" }), { status: 500 });
  }

  try {
    const { milestoneId, status, publicNote, weight, completedAt } = await request.json();

    if (!milestoneId || !status) {
      return new Response(JSON.stringify({ error: "Missing milestoneId or status" }), { status: 400 });
    }

    const updatePayload: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (publicNote !== undefined) updatePayload.public_note = publicNote;
    if (weight !== undefined) updatePayload.weight = weight;
    if (status === "COMPLETED") {
      updatePayload.completed_at = completedAt || new Date().toISOString();
    } else if (status === "IN_PROGRESS") {
      updatePayload.started_at = new Date().toISOString();
      updatePayload.completed_at = null;
    } else {
      updatePayload.completed_at = null;
    }

    const { data, error } = await scopedSupabase
      .from("founding_milestones")
      .update(updatePayload)
      .eq("id", milestoneId)
      .select()
      .single();

    if (error) throw error;

    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      "MILESTONE_UPDATED",
      "founding_milestones",
      milestoneId,
      { status, weight },
      request
    );

    return new Response(JSON.stringify({ success: true, milestone: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};
