import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";
import { fromPaise, toPaise, formatPaiseInr } from "@/lib/finance-engine";

export const GET: APIRoute = async ({ request }) => {
  try {
    if (!supabase) {
      return new Response(JSON.stringify({
        has_data: false,
        periods: [],
        totals: {
          total_donations: "0.00",
          total_expenses: "0.00",
          other_income: "0.00",
          closing_balance: "0.00",
          verified_transactions_count: 0,
        },
        transactions: [],
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(request.url);
    const selectedPeriodId = url.searchParams.get("period_id");

    // 1. Fetch all published reporting periods
    const { data: publishedPeriods, error: pErr } = await supabase
      .from("reporting_periods")
      .select(`
        id, title, fiscal_year, period_type, start_date, end_date,
        opening_balance, closing_balance, total_credits, total_debits,
        published_at, notes,
        statements:bank_statements(
          id, original_filename, file_sha256, file_size_bytes, bank_name
        )
      `)
      .eq("status", "PUBLISHED")
      .order("start_date", { ascending: false });

    if (pErr) throw pErr;

    if (!publishedPeriods || publishedPeriods.length === 0) {
      return new Response(JSON.stringify({
        has_data: false,
        periods: [],
        totals: {
          total_donations: "0.00",
          total_expenses: "0.00",
          other_income: "0.00",
          closing_balance: "0.00",
          verified_transactions_count: 0,
        },
        transactions: [],
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Determine target period IDs for calculation
    const targetPeriodIds = selectedPeriodId && selectedPeriodId !== "ALL"
      ? [selectedPeriodId]
      : publishedPeriods.map((p) => p.id);

    // 2. Fetch verified public transactions for target published periods
    const { data: txs, error: txErr } = await supabase
      .from("financial_transactions")
      .select(`
        id, reporting_period_id, transaction_date, transaction_type,
        category, classification, amount, debit, credit, description,
        reference_utr, balance_after_transaction
      `)
      .in("reporting_period_id", targetPeriodIds)
      .eq("verification_status", "VERIFIED")
      .eq("public_visibility", true)
      .order("transaction_date", { ascending: false });

    if (txErr) throw txErr;

    // 3. Server-side authoritative calculation in integer paise
    let totalDonationsPaise = 0n;
    let totalExpensesPaise = 0n;
    let otherIncomePaise = 0n;

    for (const t of txs || []) {
      const cr = toPaise(t.credit);
      const dr = toPaise(t.debit);

      if (t.classification === "DONATION") {
        totalDonationsPaise += cr;
      } else if (t.classification === "EXPENSE") {
        totalExpensesPaise += dr;
      } else if (t.classification === "BANK_INTEREST" || t.classification === "OTHER_INCOME" || t.classification === "REFUND") {
        otherIncomePaise += cr;
      }
    }

    // Closing balance determination
    let currentClosingPaise = 0n;
    if (selectedPeriodId && selectedPeriodId !== "ALL") {
      const matchPeriod = publishedPeriods.find((p) => p.id === selectedPeriodId);
      currentClosingPaise = matchPeriod ? toPaise(matchPeriod.closing_balance) : 0n;
    } else {
      // Latest published period's closing balance
      currentClosingPaise = publishedPeriods.length > 0 ? toPaise(publishedPeriods[0].closing_balance) : 0n;
    }

    // 4. Privacy Sanitization: Sanitize description & mask reference
    const sanitizedTxs = (txs || []).map((t) => {
      let safeDesc = t.description;
      // Mask full account numbers or sensitive phone numbers if any
      safeDesc = safeDesc.replace(/\b\d{10,18}\b/g, (m: string) => `XXXX${m.slice(-4)}`);

      let maskedRef: string | null = null;
      if (t.reference_utr) {
        maskedRef = t.reference_utr.length > 6
          ? `***${t.reference_utr.slice(-4)}`
          : t.reference_utr;
      }

      return {
        id: t.id,
        period_id: t.reporting_period_id,
        date: t.transaction_date,
        type: t.transaction_type,
        classification: t.classification,
        description: safeDesc,
        reference_masked: maskedRef,
        amount: t.amount,
        debit: t.debit,
        credit: t.credit,
        balance_after: t.balance_after_transaction,
      };
    });

    return new Response(JSON.stringify({
      has_data: true,
      periods: publishedPeriods,
      selected_period_id: selectedPeriodId || "ALL",
      totals: {
        total_donations: fromPaise(totalDonationsPaise),
        total_donations_formatted: formatPaiseInr(totalDonationsPaise),
        total_expenses: fromPaise(totalExpensesPaise),
        total_expenses_formatted: formatPaiseInr(totalExpensesPaise),
        other_income: fromPaise(otherIncomePaise),
        other_income_formatted: formatPaiseInr(otherIncomePaise),
        closing_balance: fromPaise(currentClosingPaise),
        closing_balance_formatted: formatPaiseInr(currentClosingPaise),
        verified_transactions_count: txs?.length || 0,
      },
      transactions: sanitizedTxs,
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (err: unknown) {
    console.error("Public transparency API error:", err);
    const msg = err instanceof Error ? err.message : "Failed to load transparency data";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
