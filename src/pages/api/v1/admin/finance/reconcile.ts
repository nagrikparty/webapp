import type { APIRoute } from "astro";
import { requireRole } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";
import {
  fromPaise,
  reconcileStatement,
  toPaise,
  verifyStatementContinuity,
} from "@/lib/finance-engine";

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

    // 2. Fetch all transactions for this period
    const { data: txs, error: txErr } = await scopedSupabase
      .from("financial_transactions")
      .select("*")
      .eq("reporting_period_id", periodId)
      .order("transaction_date", { ascending: true });

    if (txErr) throw txErr;

    let totalCreditsPaise = 0n;
    let totalDebitsPaise = 0n;
    let unclassifiedCount = 0;
    let duplicateCount = 0;
    let verifiedCount = 0;

    for (const t of txs || []) {
      const cr = toPaise(t.credit);
      const dr = toPaise(t.debit);
      totalCreditsPaise += cr;
      totalDebitsPaise += dr;
      if (t.classification === "UNKNOWN") unclassifiedCount++;
      if (t.is_duplicate_flag) duplicateCount++;
      if (t.verification_status === "VERIFIED") verifiedCount++;
    }

    const openingPaise = toPaise(period.opening_balance);
    const expectedClosingPaise = toPaise(period.closing_balance);

    const recon = reconcileStatement({
      opening_balance_paise: openingPaise,
      total_credits_paise: totalCreditsPaise,
      total_debits_paise: totalDebitsPaise,
      expected_closing_paise: expectedClosingPaise,
    });

    // 3. Continuity check with previous period
    const { data: prevPeriod } = await scopedSupabase
      .from("reporting_periods")
      .select("id, title, closing_balance, end_date")
      .lt("start_date", period.start_date)
      .order("start_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    let continuity = verifyStatementContinuity({
      previous_closing_paise: prevPeriod ? toPaise(prevPeriod.closing_balance) : null,
      current_opening_paise: openingPaise,
      previous_period_id: prevPeriod?.id,
    });

    // 4. Update reporting_periods table
    const updateRecord = {
      total_credits: fromPaise(totalCreditsPaise),
      total_debits: fromPaise(totalDebitsPaise),
      calculated_closing_balance: fromPaise(recon.calculated_closing_paise),
      reconciliation_difference: fromPaise(recon.difference_paise),
      reconciliation_status: recon.status,
      continuity_status: continuity.status,
      status: recon.is_matched
        ? verifiedCount === (txs?.length || 0) && (txs?.length || 0) > 0
          ? "VERIFIED"
          : "NEEDS_REVIEW"
        : "RECONCILIATION_FAILED",
      updated_at: new Date().toISOString(),
    };

    await scopedSupabase
      .from("reporting_periods")
      .update(updateRecord)
      .eq("id", periodId);

    return new Response(
      JSON.stringify({
        success: true,
        reconciliation: {
          opening_balance: fromPaise(openingPaise),
          total_credits: fromPaise(totalCreditsPaise),
          total_debits: fromPaise(totalDebitsPaise),
          expected_closing_balance: fromPaise(expectedClosingPaise),
          calculated_closing_balance: fromPaise(recon.calculated_closing_paise),
          difference: recon.difference_formatted,
          is_matched: recon.is_matched,
          status: recon.status,
        },
        continuity: {
          previous_period: prevPeriod ? { title: prevPeriod.title, closing: prevPeriod.closing_balance } : null,
          status: continuity.status,
          difference: fromPaise(continuity.difference_paise),
          is_continuous: continuity.is_continuous,
        },
        diagnostics: {
          transaction_count: txs?.length || 0,
          verified_count: verifiedCount,
          unclassified_count: unclassifiedCount,
          duplicate_count: duplicateCount,
          can_publish:
            recon.is_matched &&
            continuity.is_continuous &&
            unclassifiedCount === 0 &&
            (txs?.length || 0) > 0,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to reconcile reporting period";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
