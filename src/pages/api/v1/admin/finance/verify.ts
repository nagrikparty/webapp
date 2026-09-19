import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });
    }

    const body = await request.json();
    const periodId = body.reporting_period_id;

    if (!periodId) {
      return new Response(JSON.stringify({ error: "reporting_period_id is required" }), { status: 400 });
    }

    // 1. Fetch period
    const { data: period, error: pErr } = await scopedSupabase
      .from("reporting_periods")
      .select("*")
      .eq("id", periodId)
      .single();

    if (pErr || !period) {
      return new Response(JSON.stringify({ error: "Reporting period not found" }), { status: 404 });
    }

    if (period.reconciliation_status !== "MATCHED") {
      return new Response(
        JSON.stringify({
          error: `Cannot verify reporting period: Reconciliation is ${period.reconciliation_status}. Expected closing and calculated closing must match with ₹0.00 difference.`,
        }),
        { status: 400 }
      );
    }

    // 2. Check for any unclassified transactions
    const { count: unclassifiedCount, error: countErr } = await scopedSupabase
      .from("financial_transactions")
      .select("id", { count: "exact", head: true })
      .eq("reporting_period_id", periodId)
      .eq("classification", "UNKNOWN");

    if (countErr) throw countErr;

    if (unclassifiedCount && unclassifiedCount > 0) {
      return new Response(
        JSON.stringify({
          error: `Cannot verify period: ${unclassifiedCount} transactions remain unclassified. Please classify all transactions before verification.`,
        }),
        { status: 400 }
      );
    }

    // 3. Mark all transactions as VERIFIED
    const now = new Date().toISOString();
    const { error: txUpdateErr } = await scopedSupabase
      .from("financial_transactions")
      .update({
        verification_status: "VERIFIED",
        verified_by: ctx.user.id,
        verified_at: now,
      })
      .eq("reporting_period_id", periodId);

    if (txUpdateErr) throw txUpdateErr;

    // 4. Mark period as VERIFIED
    const { error: pUpdateErr } = await scopedSupabase
      .from("reporting_periods")
      .update({
        status: "VERIFIED",
        verified_by: ctx.user.id,
        verified_at: now,
        updated_at: now,
      })
      .eq("id", periodId);

    if (pUpdateErr) throw pUpdateErr;

    // 5. Log audit event
    await logAuditEvent({
      actorUserId: ctx.user.id,
      actorRole: ctx.profile.role,
      action: "REPORTING_PERIOD_VERIFIED",
      entityType: "REPORTING_PERIOD",
      entityId: periodId,
      metadata: { periodTitle: period.title },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Reporting period "${period.title}" and all its transactions are now officially verified.`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to verify reporting period";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
