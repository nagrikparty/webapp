import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  const authResult = await requireRole(request, ["VERIFIER", "ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });
    }

    const status = url.searchParams.get("status");
    const filingId = url.searchParams.get("filingId");

    let query = scopedSupabase
      .from("proposer_records")
      .select("*")
      .order("proposer_serial_number", { ascending: true });

    if (status && status !== "ALL") query = query.eq("status", status);
    if (filingId) query = query.eq("eci_filing_id", filingId);

    const { data: proposers, error } = await query;
    if (error) {
      return new Response(JSON.stringify({ error: "Failed to load proposer records" }), { status: 500 });
    }

    const counts = {
      total: (proposers || []).length,
      verified: (proposers || []).filter((p) => p.status === "VERIFIED").length,
      notarized: (proposers || []).filter((p) => p.status === "NOTARIZED").length,
      submitted: (proposers || []).filter((p) => p.status === "SUBMITTED").length,
      draft: (proposers || []).filter((p) => p.status === "DRAFT").length,
      rejected: (proposers || []).filter((p) => p.status === "REJECTED").length,
    };

    return new Response(JSON.stringify({ proposers: proposers || [], counts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("proposers GET error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["VERIFIER", "ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const body = await request.json();
    const { proposerId, status, affidavitSha256, rejectionReason, partNumber, serialNumber, pollingStation } = body;

    if (!proposerId || !status) {
      return new Response(JSON.stringify({ error: "proposerId and status are required" }), { status: 400 });
    }

    const ALLOWED = ["DRAFT", "NOTARIZED", "SUBMITTED", "VERIFIED", "REJECTED"];
    if (!ALLOWED.includes(status)) {
      return new Response(JSON.stringify({ error: `Invalid status. Allowed: ${ALLOWED.join(", ")}` }), { status: 400 });
    }

    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });
    }

    const payload: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "VERIFIED") {
      payload.verified_by = ctx.user.id;
      payload.verified_at = new Date().toISOString();
    }
    if (status === "REJECTED") {
      payload.rejection_reason = rejectionReason || "Did not meet ECI proposer criteria";
    }
    if (affidavitSha256) {
      payload.affidavit_sha256 = affidavitSha256;
      payload.affidavit_uploaded_at = new Date().toISOString();
    }
    if (partNumber !== undefined) payload.part_number = partNumber;
    if (serialNumber !== undefined) payload.serial_number = serialNumber;
    if (pollingStation !== undefined) payload.polling_station = pollingStation;

    const { data: updated, error } = await scopedSupabase
      .from("proposer_records")
      .update(payload)
      .eq("id", proposerId)
      .select("*")
      .single();

    if (error || !updated) {
      return new Response(JSON.stringify({ error: error?.message || "Failed to update proposer record" }), { status: 500 });
    }

    await logAuditEvent(
      ctx.user.id, ctx.profile.role, "PROPOSER_STATUS_UPDATED",
      "proposer_records", proposerId,
      { status, serial: updated.proposer_serial_number }, request, scopedSupabase
    );

    return new Response(JSON.stringify({ success: true, proposer: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("proposers PATCH error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500 }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) return new Response(JSON.stringify({ error: "Server config error" }), { status: 500 });

    const { full_name, epic_number, ward, vidhan_sabha, contact_number, address } = await request.json();
    if (!full_name || !epic_number) {
      return new Response(JSON.stringify({ error: "Name and EPIC number are required" }), { status: 400 });
    }

    const { error: insertError } = await scopedSupabase.from("proposers").insert({
      full_name,
      epic_number,
      ward: ward || null,
      vidhan_sabha: vidhan_sabha || null,
      contact_number: contact_number || null,
      address: address || null,
      added_by: ctx.user.id
    });

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    console.error("create proposer error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to create proposer" }), { status: 500 });
  }
};
