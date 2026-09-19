import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

const VALID_CLASSIFICATIONS = [
  "DONATION",
  "MEMBERSHIP_FEE",
  "EXPENSE",
  "REFUND",
  "TRANSFER",
  "BANK_INTEREST",
  "OTHER_INCOME",
  "UNKNOWN",
];

const VALID_VERIFICATION_STATUSES = [
  "EXTRACTED",
  "VERIFIED",
  "FLAGGED",
  "REJECTED",
];

export const GET: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });
    }

    const url = new URL(request.url);
    const periodId = url.searchParams.get("period_id");
    const classification = url.searchParams.get("classification");
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const isDuplicate = url.searchParams.get("is_duplicate");

    let query = scopedSupabase
      .from("financial_transactions")
      .select("*, statements:bank_statement_id(original_filename, file_sha256)")
      .order("transaction_date", { ascending: true })
      .order("created_at", { ascending: true });

    if (periodId) {
      query = query.eq("reporting_period_id", periodId);
    }
    if (classification && classification !== "ALL") {
      query = query.eq("classification", classification);
    }
    if (status && status !== "ALL") {
      query = query.eq("verification_status", status);
    }
    if (isDuplicate === "true") {
      query = query.eq("is_duplicate_flag", true);
    }
    if (search) {
      query = query.or(`description.ilike.%${search}%,reference_utr.ilike.%${search}%`);
    }

    const { data: txs, error } = await query;
    if (error) throw error;

    return new Response(JSON.stringify(txs || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load transactions";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });
    }

    const body = await request.json();
    const { id, classification, public_visibility, verification_status } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Transaction ID is required" }), { status: 400 });
    }

    // 1. Fetch current transaction to check period immutability
    const { data: currentTx, error: fetchErr } = await scopedSupabase
      .from("financial_transactions")
      .select("*, reporting_period:reporting_period_id(status)")
      .eq("id", id)
      .single();

    if (fetchErr || !currentTx) {
      return new Response(JSON.stringify({ error: "Transaction not found" }), { status: 404 });
    }

    const periodStatus = Array.isArray(currentTx.reporting_period)
      ? currentTx.reporting_period[0]?.status
      : currentTx.reporting_period?.status;

    if (periodStatus === "PUBLISHED") {
      return new Response(
        JSON.stringify({
          error: "Reporting period is already published. Use the audit corrections console to register post-publication adjustments.",
        }),
        { status: 403 }
      );
    }

    const updates: Record<string, unknown> = {};

    if (classification) {
      if (!VALID_CLASSIFICATIONS.includes(classification)) {
        return new Response(JSON.stringify({ error: "Invalid classification" }), { status: 400 });
      }
      updates.classification = classification;
      updates.category = classification;
    }

    if (public_visibility !== undefined) {
      updates.public_visibility = Boolean(public_visibility);
      updates.is_public = Boolean(public_visibility);
    }

    if (verification_status) {
      if (!VALID_VERIFICATION_STATUSES.includes(verification_status)) {
        return new Response(JSON.stringify({ error: "Invalid verification status" }), { status: 400 });
      }
      updates.verification_status = verification_status;
      if (verification_status === "VERIFIED") {
        updates.verified_by = ctx.user.id;
        updates.verified_at = new Date().toISOString();
      }
    }

    const { data: updatedTx, error: updateErr } = await scopedSupabase
      .from("financial_transactions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    await logAuditEvent({
      actorUserId: ctx.user.id,
      actorRole: ctx.profile.role,
      action: "FINANCIAL_TRANSACTION_UPDATED",
      entityType: "FINANCIAL_TRANSACTION",
      entityId: id,
      metadata: { previous: currentTx, updates },
    });

    return new Response(JSON.stringify({ success: true, transaction: updatedTx }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update transaction";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
