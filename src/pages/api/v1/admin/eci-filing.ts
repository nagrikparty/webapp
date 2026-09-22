import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

export const prerender = false;

const ECI_CHECKLIST_ITEMS = [
  { code: "FOUNDING_MEMBERS", title: "100+ Founding Members", description: "At least 100 verified party members with valid EPIC voter IDs.", mandatory: true },
  { code: "PARTY_CONSTITUTION", title: "Party Constitution", description: "Written constitution declaring allegiance to the Constitution of India and democratic principles.", mandatory: true },
  { code: "OFFICE_BEARERS", title: "Office Bearers List", description: "Names, addresses and designations of the party office bearers.", mandatory: true },
  { code: "NON_MEMBERSHIP_DECLARATION", title: "Non-Membership Declaration", description: "Declaration that no founder member belongs to any other registered political party.", mandatory: true },
  { code: "AFFIDAVIT", title: "Sworn Affidavit", description: "Sworn affidavit confirming no member is a member of any other political party.", mandatory: true },
  { code: "BANK_ACCOUNT", title: "Party Bank Account", description: "Bank account in the name of the party for financial transparency.", mandatory: true },
  { code: "PUBLIC_NOTICE", title: "Public Notice Publication", description: "Public notice published in two leading newspapers inviting objections.", mandatory: true },
  { code: "SYMBOL_PREFERENCE", title: "Symbol Preference", description: "Three proposed symbols in order of preference submitted to ECI.", mandatory: true },
  { code: "PARTY_NAME_CHECK", title: "Party Name Approval", description: "Verification that the proposed party name is not identical to an existing registered party.", mandatory: true },
  { code: "REGISTERED_OFFICE", title: "Registered Office Address", description: "Documented address of the party's registered headquarters in Delhi.", mandatory: true },
];

export const GET: APIRoute = async ({ request, url }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });
    }

    const filingId = url.searchParams.get("id");

    if (filingId) {
      const { data: dossier, error: dErr } = await scopedSupabase
        .from("eci_filing_dossiers")
        .select("*")
        .eq("id", filingId)
        .single();

      if (dErr || !dossier) {
        return new Response(JSON.stringify({ error: "Filing dossier not found" }), { status: 404 });
      }

      const { data: proposers } = await scopedSupabase
        .from("proposer_records")
        .select("*")
        .eq("eci_filing_id", filingId)
        .order("proposer_serial_number", { ascending: true });

      const { data: checklist } = await scopedSupabase
        .from("eci_compliance_checklist")
        .select("*")
        .eq("eci_filing_id", filingId)
        .order("item_code", { ascending: true });

      const { data: symbols } = await scopedSupabase
        .from("party_symbols")
        .select("*")
        .eq("eci_filing_id", filingId)
        .order("preference_order", { ascending: true });

      const { data: gazette } = await scopedSupabase
        .from("gazette_notifications")
        .select("*")
        .eq("eci_filing_id", filingId)
        .order("created_at", { ascending: false });

      return new Response(
        JSON.stringify({ dossier, proposers: proposers || [], checklist: checklist || [], symbols: symbols || [], gazette: gazette || [] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: dossiers } = await scopedSupabase
      .from("eci_filing_dossiers")
      .select("*")
      .order("created_at", { ascending: false });

    const { count: verifiedProposers } = await scopedSupabase
      .from("proposer_records")
      .select("*", { count: "exact", head: true })
      .eq("status", "VERIFIED");

    return new Response(
      JSON.stringify({
        dossiers: dossiers || [],
        verifiedProposers: verifiedProposers || 0,
        checklistTemplate: ECI_CHECKLIST_ITEMS,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("ECI filing GET error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const body = await request.json();
    const action = body.action || "CREATE_DOSSIER";

    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });
    }

    if (action === "CREATE_DOSSIER") {
      // Generate filing number server-side
      const { data: seqData, error: seqErr } = await scopedSupabase.rpc("generate_filing_number");
      if (seqErr || !seqData) {
        return new Response(JSON.stringify({ error: "Failed to generate filing number" }), { status: 500 });
      }

      const { data: dossier, error: insErr } = await scopedSupabase
        .from("eci_filing_dossiers")
        .insert({
          filing_number: seqData,
          status: "DRAFT",
          total_proposers: 0,
          verified_proposers: 0,
          created_by: ctx.user.id,
        })
        .select("*")
        .single();

      if (insErr || !dossier) {
        return new Response(JSON.stringify({ error: "Failed to create filing dossier" }), { status: 500 });
      }

      // Seed mandatory compliance checklist
      const checklistRows = ECI_CHECKLIST_ITEMS.map((item) => ({
        eci_filing_id: dossier.id,
        item_code: item.code,
        item_title: item.title,
        item_description: item.description,
        is_mandatory: item.mandatory,
        is_satisfied: false,
      }));

      const { error: chkErr } = await scopedSupabase.from("eci_compliance_checklist").insert(checklistRows);
      if (chkErr) {
        // Roll back the dossier so we never leave a partial filing
        await scopedSupabase.from("eci_filing_dossiers").delete().eq("id", dossier.id);
        return new Response(JSON.stringify({ error: "Failed to seed compliance checklist" }), { status: 500 });
      }

      await logAuditEvent(
        ctx.user.id, ctx.profile.role, "ECI_DOSSIER_CREATED",
        "eci_filing_dossiers", dossier.id,
        { filing_number: dossier.filing_number }, request, scopedSupabase
      );

      return new Response(JSON.stringify({ success: true, dossier }), {
        status: 200, headers: { "Content-Type": "application/json" },
      });
    }

    if (action === "ASSIGN_PROPOSERS") {
      const filingId = body.filingId;
      if (!filingId) {
        return new Response(JSON.stringify({ error: "filingId is required" }), { status: 400 });
      }

      // Only approved members with complete child records become proposers
      const { data: members, error: memErr } = await scopedSupabase
        .from("members")
        .select("id, application_id, user_id, membership_id")
        .eq("status", "APPROVED");

      if (memErr) {
        return new Response(JSON.stringify({ error: "Failed to load approved members" }), { status: 500 });
      }

      let created = 0;
      const failures: string[] = [];

      for (const member of members || []) {
        const { error: rpcErr } = await scopedSupabase.rpc("create_proposer_from_member", {
          p_member_id: member.id,
          p_verifier_id: ctx.user.id,
        });
        if (rpcErr) {
          failures.push(`${member.membership_id}: ${rpcErr.message}`);
        } else {
          created += 1;
        }
      }

      // Attach all unassigned proposer records to this filing dossier
      await scopedSupabase
        .from("proposer_records")
        .update({ eci_filing_id: filingId, updated_at: new Date().toISOString() })
        .is("eci_filing_id", null);

      const { count: totalProposers } = await scopedSupabase
        .from("proposer_records")
        .select("*", { count: "exact", head: true })
        .eq("eci_filing_id", filingId);

      const { count: verifiedProposers } = await scopedSupabase
        .from("proposer_records")
        .select("*", { count: "exact", head: true })
        .eq("eci_filing_id", filingId)
        .eq("status", "VERIFIED");

      await scopedSupabase
        .from("eci_filing_dossiers")
        .update({
          total_proposers: totalProposers || 0,
          verified_proposers: verifiedProposers || 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", filingId);

      await logAuditEvent(
        ctx.user.id, ctx.profile.role, "ECI_PROPOSERS_ASSIGNED",
        "eci_filing_dossiers", filingId,
        { created_records: created, total_proposers: totalProposers || 0 }, request, scopedSupabase
      );

      return new Response(
        JSON.stringify({
          success: true,
          created_records: created,
          total_proposers: totalProposers || 0,
          verified_proposers: verifiedProposers || 0,
          failures,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (action === "CHECK_READINESS") {
      const filingId = body.filingId;
      if (!filingId) {
        return new Response(JSON.stringify({ error: "filingId is required" }), { status: 400 });
      }
      const { data: readiness, error: rErr } = await scopedSupabase.rpc("check_eci_readiness", {
        p_filing_id: filingId,
      });
      if (rErr) {
        return new Response(JSON.stringify({ error: rErr.message }), { status: 500 });
      }
      return new Response(JSON.stringify({ success: true, readiness }), {
        status: 200, headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });
  } catch (err) {
    console.error("ECI filing POST error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500 }
    );
  }
};

