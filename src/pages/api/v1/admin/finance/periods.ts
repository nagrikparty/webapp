import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";
import { fromPaise, toPaise, verifyStatementContinuity } from "@/lib/finance-engine";

export const GET: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });
    }

    const { data: periods, error } = await scopedSupabase
      .from("reporting_periods")
      .select(`
        *,
        statements:bank_statements(
          id, original_filename, file_type, file_size_bytes, file_sha256, 
          extracted_row_count, parser_status, uploaded_at
        )
      `)
      .order("start_date", { ascending: true });

    if (error) throw error;

    // Check cross-period continuity across ordered periods
    const enrichedPeriods = (periods || []).map((period, index) => {
      if (index === 0) {
        return { ...period, continuity_status: "NOT_APPLICABLE" };
      }
      const prev = periods[index - 1];
      const prevClosing = toPaise(prev.closing_balance);
      const currOpening = toPaise(period.opening_balance);
      const cont = verifyStatementContinuity({
        previous_closing_paise: prevClosing,
        current_opening_paise: currOpening,
        previous_period_id: prev.id,
      });
      return {
        ...period,
        continuity_status: cont.status,
        continuity_difference: fromPaise(cont.difference_paise),
        previous_period_title: prev.title,
      };
    });

    return new Response(JSON.stringify(enrichedPeriods), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch reporting periods";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};

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
    const id = body.id;
    const title = (body.title || body.cycle_label || body.name || "").trim();
    const startDate = body.start_date;
    const endDate = body.end_date;

    if (!title || !startDate || !endDate) {
      return new Response(JSON.stringify({ error: "Title/Name, start date, and end date are required" }), { status: 400 });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return new Response(JSON.stringify({ error: "End date must be greater than or equal to start date" }), { status: 400 });
    }

    // Auto-derive Fiscal Year if not supplied
    let fiscalYear = (body.fiscal_year || "").trim();
    if (!fiscalYear) {
      const sDate = new Date(startDate);
      const sYear = sDate.getFullYear();
      const sMonth = sDate.getMonth() + 1;
      fiscalYear = sMonth >= 4 ? `${sYear}-${sYear + 1}` : `${sYear - 1}-${sYear}`;
    }

    // Auto-derive Period Type if not supplied
    let periodType = (body.period_type || "").trim();
    if (!periodType) {
      const sMonth = new Date(startDate).getMonth() + 1;
      periodType = sMonth <= 6 ? "H1" : "H2";
    }

    const openingPaise = toPaise(body.opening_balance || 0);
    const closingPaise = toPaise(body.closing_balance || 0);

    const record = {
      title,
      fiscal_year: fiscalYear,
      period_type: periodType,
      start_date: startDate,
      end_date: endDate,
      opening_balance: fromPaise(openingPaise),
      notes: body.notes || null,
      updated_at: new Date().toISOString(),
    };

    let resultData;
    if (id) {
      // Update existing
      const { data, error } = await scopedSupabase
        .from("reporting_periods")
        .update(record)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      resultData = data;

      await logAuditEvent({
        actorUserId: ctx.user.id,
        actorRole: ctx.profile.role,
        action: "REPORTING_PERIOD_UPDATED",
        entityType: "REPORTING_PERIOD",
        entityId: id,
        metadata: { title, fiscalYear, startDate, endDate },
      });
    } else {
      // Create new
      const { data, error } = await scopedSupabase
        .from("reporting_periods")
        .insert({
          ...record,
          status: "DRAFT",
          closing_balance: fromPaise(closingPaise),
          total_credits: "0.00",
          total_debits: "0.00",
          calculated_closing_balance: "0.00",
          reconciliation_difference: "0.00",
          reconciliation_status: "PENDING",
        })
        .select()
        .single();
      if (error) throw error;
      resultData = data;

      await logAuditEvent({
        actorUserId: ctx.user.id,
        actorRole: ctx.profile.role,
        action: "REPORTING_PERIOD_CREATED",
        entityType: "REPORTING_PERIOD",
        entityId: data.id,
        metadata: { title, fiscalYear, startDate, endDate },
      });
    }

    return new Response(JSON.stringify({ success: true, period: resultData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save reporting period";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
