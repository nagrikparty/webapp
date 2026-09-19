import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";
import { toPaise } from "@/lib/finance-engine";

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

    // Pre-publish validation check 1: Status must be VERIFIED
    if (period.status !== "VERIFIED") {
      return new Response(
        JSON.stringify({
          error: `Cannot publish period: Current status is "${period.status}". Period must be explicitly VERIFIED before publishing.`,
        }),
        { status: 400 }
      );
    }

    // Pre-publish validation check 2: Reconciliation must be MATCHED
    if (period.reconciliation_status !== "MATCHED") {
      return new Response(
        JSON.stringify({
          error: `Cannot publish period: Reconciliation status is "${period.reconciliation_status}". Difference must be exact ₹0.00.`,
        }),
        { status: 400 }
      );
    }

    // Pre-publish validation check 3: No unclassified transactions
    const { count: unclassifiedCount, error: countErr } = await scopedSupabase
      .from("financial_transactions")
      .select("id", { count: "exact", head: true })
      .eq("reporting_period_id", periodId)
      .eq("classification", "UNKNOWN");

    if (countErr) throw countErr;

    if (unclassifiedCount && unclassifiedCount > 0) {
      return new Response(
        JSON.stringify({
          error: `Cannot publish period: ${unclassifiedCount} transactions remain unclassified. All transactions must have an assigned classification.`,
        }),
        { status: 400 }
      );
    }

    // Pre-publish validation check 4: Must have at least 1 verified transaction
    const { count: totalTxCount } = await scopedSupabase
      .from("financial_transactions")
      .select("id", { count: "exact", head: true })
      .eq("reporting_period_id", periodId)
      .eq("verification_status", "VERIFIED");

    if (!totalTxCount || totalTxCount === 0) {
      return new Response(
        JSON.stringify({
          error: "Cannot publish period: No verified transactions exist for this reporting period.",
        }),
        { status: 400 }
      );
    }

    // 2. Perform atomic publication
    const now = new Date().toISOString();
    const { error: publishErr } = await scopedSupabase
      .from("reporting_periods")
      .update({
        status: "PUBLISHED",
        published_by: ctx.user.id,
        published_at: now,
        updated_at: now,
      })
      .eq("id", periodId);

    if (publishErr) throw publishErr;

    // 3. Mirror to legacy financial_statements table so any legacy consumers stay in sync
    // Fetch verified donations total
    const { data: donations } = await scopedSupabase
      .from("financial_transactions")
      .select("amount")
      .eq("reporting_period_id", periodId)
      .eq("verification_status", "VERIFIED")
      .eq("classification", "DONATION");

    let totalDonationsPaise = 0n;
    for (const d of donations || []) {
      totalDonationsPaise += toPaise(d.amount);
    }

    const { data: expenses } = await scopedSupabase
      .from("financial_transactions")
      .select("amount")
      .eq("reporting_period_id", periodId)
      .eq("verification_status", "VERIFIED")
      .eq("classification", "EXPENSE");

    let totalExpensesPaise = 0n;
    for (const e of expenses || []) {
      totalExpensesPaise += toPaise(e.amount);
    }

    const { data: existingStmt } = await scopedSupabase
      .from("financial_statements")
      .select("id")
      .eq("period_start", period.start_date)
      .eq("period_end", period.end_date)
      .maybeSingle();

    if (existingStmt) {
      await scopedSupabase
        .from("financial_statements")
        .update({
          reporting_period: period.title,
          opening_balance: period.opening_balance,
          total_contributions: period.total_credits,
          total_expenses: period.total_debits,
          closing_balance: period.closing_balance,
          is_published: true,
          published_at: now,
          notes: period.notes || `Audited 6-month statutory statement for ${period.title}.`,
        })
        .eq("id", existingStmt.id);
    } else {
      await scopedSupabase.from("financial_statements").insert({
        reporting_period: period.title,
        period_start: period.start_date,
        period_end: period.end_date,
        opening_balance: period.opening_balance,
        total_contributions: period.total_credits,
        total_expenses: period.total_debits,
        closing_balance: period.closing_balance,
        is_published: true,
        published_at: now,
        notes: period.notes || `Audited 6-month statutory statement for ${period.title}.`,
      });
    }

    // 4. Log audit event
    await logAuditEvent({
      actorUserId: ctx.user.id,
      actorRole: ctx.profile.role,
      action: "REPORTING_PERIOD_PUBLISHED",
      entityType: "REPORTING_PERIOD",
      entityId: periodId,
      metadata: {
        title: period.title,
        opening_balance: period.opening_balance,
        total_credits: period.total_credits,
        total_debits: period.total_debits,
        closing_balance: period.closing_balance,
        verified_transactions_count: totalTxCount,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Reporting period "${period.title}" has been successfully published to the public financial transparency portal.`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to publish reporting period";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
