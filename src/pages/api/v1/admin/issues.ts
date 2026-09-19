import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });

    const url = new URL(request.url);
    const statusFilter = url.searchParams.get("status");

    let query = scopedSupabase.from("issues").select("*").order("created_at", { ascending: false });
    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error) throw error;

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load issues";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });

    const { id, status } = await request.json();
    if (!id) return new Response(JSON.stringify({ error: "Missing issue id" }), { status: 400 });

    const newStatus = status || "resolved";
    const { data, error: updateError } = await scopedSupabase
      .from("issues")
      .update({ status: newStatus })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      "ISSUE_STATUS_UPDATED",
      "issues",
      id,
      { status: newStatus },
      request,
      scopedSupabase
    );

    return new Response(JSON.stringify({ success: true, issue: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update issue";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });

    const { error: deleteError } = await scopedSupabase.from("issues").delete().eq("id", id);
    if (deleteError) throw deleteError;

    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      "ISSUE_DELETED",
      "issues",
      id,
      { id },
      request,
      scopedSupabase
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete issue";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
