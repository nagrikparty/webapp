import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });
    }

    const { data, error } = await scopedSupabase
      .from("bank_account_status")
      .select("*")
      .eq("id", "primary")
      .maybeSingle();

    if (error) throw error;

    return new Response(JSON.stringify({ status: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch bank status";
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
    const liveBalance = Number(body.live_bank_balance ?? -22202.53);
    const asOfDate = body.as_of_date || new Date().toISOString().split("T")[0];
    const disclosureTitle = body.disclosure_title || "Live Bank Account Status & Unrecovered Bank Charges";
    const disclosureExplanation = body.disclosure_explanation || "";
    const isPublicVisible = body.is_public_visible !== undefined ? Boolean(body.is_public_visible) : true;

    const { data, error } = await scopedSupabase
      .from("bank_account_status")
      .upsert({
        id: "primary",
        bank_name: body.bank_name || "Axis Bank",
        account_number_masked: body.account_number_masked || "XXXXXX7387",
        branch_name: body.branch_name || "Sarojini Nagar Branch, New Delhi",
        statement_closing_balance: body.statement_closing_balance !== undefined ? Number(body.statement_closing_balance) : 0.00,
        live_bank_balance: liveBalance,
        balance_type: body.balance_type || "ACCUMULATED_BANK_MAB_CHARGES",
        as_of_date: asOfDate,
        disclosure_title: disclosureTitle,
        disclosure_explanation: disclosureExplanation,
        is_public_visible: isPublicVisible,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    await logAuditEvent({
      actorUserId: ctx.user.id,
      actorRole: ctx.profile.role,
      action: "BANK_STATUS_UPDATED",
      entityType: "FINANCIAL_DISCLOSURE",
      entityId: "primary",
      metadata: { liveBalance, asOfDate },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bank account status and disclosure updated successfully.",
        status: data,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update bank status";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
