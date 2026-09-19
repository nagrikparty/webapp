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
    const periodId = url.searchParams.get("period_id");

    let query = scopedSupabase
      .from("financial_corrections")
      .select("*, profiles:created_by(full_name, email)")
      .order("created_at", { ascending: false });

    if (periodId) {
      query = query.eq("reporting_period_id", periodId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load corrections";
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

    const body = await request.json();
    const { reporting_period_id, transaction_id, correction_type, reason, amount, original_values, new_values } = body;

    if (!reporting_period_id || !reason) {
      return new Response(JSON.stringify({ error: "reporting_period_id and reason are required" }), { status: 400 });
    }

    const { data: correction, error: insErr } = await scopedSupabase
      .from("financial_corrections")
      .insert({
        reporting_period_id,
        transaction_id: transaction_id || null,
        correction_type: correction_type || "ADJUSTMENT",
        reason,
        amount: amount || null,
        original_values: original_values || null,
        new_values: new_values || null,
        created_by: ctx.user.id,
      })
      .select()
      .single();

    if (insErr) throw insErr;

    await logAuditEvent({
      actorUserId: ctx.user.id,
      actorRole: ctx.profile.role,
      action: "FINANCIAL_CORRECTION_CREATED",
      entityType: "FINANCIAL_CORRECTION",
      entityId: correction.id,
      metadata: { reporting_period_id, reason, amount },
    });

    return new Response(JSON.stringify({ success: true, correction }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to record correction";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
