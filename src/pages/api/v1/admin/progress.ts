import type { APIRoute } from "astro";
import { requireRole } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["VERIFIER", "ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });
    }

    const [
      { count: totalApplications },
      { count: pendingApplications },
      { count: underReviewApplications },
      { count: approvedMembers },
      { count: rejectedApplications },
      { count: needsCorrection },
      { count: draftApplications },
      { data: allApplications },
      { data: membersWithAddress },
      { data: membersWithElectoral },
      { data: membersWithDeclaration },
      { data: membersWithConsent },
      { data: membersWithSignature },
      { data: membersWithDocuments },
      { data: proposerRecords },
      { data: vidhanSabhaCoverage },
    ] = await Promise.all([
      scopedSupabase.from("membership_applications").select("*", { count: "exact", head: true }),
      scopedSupabase.from("membership_applications").select("*", { count: "exact", head: true }).eq("status", "SUBMITTED"),
      scopedSupabase.from("membership_applications").select("*", { count: "exact", head: true }).eq("status", "UNDER_REVIEW"),
      scopedSupabase.from("members").select("*", { count: "exact", head: true }).eq("status", "APPROVED"),
      scopedSupabase.from("membership_applications").select("*", { count: "exact", head: true }).eq("status", "REJECTED"),
      scopedSupabase.from("membership_applications").select("*", { count: "exact", head: true }).eq("status", "NEEDS_CORRECTION"),
      scopedSupabase.from("membership_applications").select("*", { count: "exact", head: true }).eq("status", "DRAFT"),
      scopedSupabase.from("membership_applications").select("id, status, membership_category, created_at"),
      scopedSupabase.from("member_addresses").select("application_id, vidhan_sabha, district"),
      scopedSupabase.from("electoral_details").select("application_id, epic_number"),
      scopedSupabase.from("membership_declarations").select("application_id, accepts_constitution"),
      scopedSupabase.from("membership_consents").select("application_id, agreed_at"),
      scopedSupabase.from("signatures").select("application_id, typed_name"),
      scopedSupabase.from("documents").select("application_id, verification_status"),
      scopedSupabase.from("proposer_records").select("*"),
      scopedSupabase.from("member_addresses").select("vidhan_sabha").not("vidhan_sabha", "is", null),
    ]);

    const memberIds = new Set((allApplications || []).map((a: { id: string }) => a.id));
    const addressSet = new Set((membersWithAddress || []).map((m: { application_id: string }) => m.application_id));
    const electoralSet = new Set((membersWithElectoral || []).map((m: { application_id: string }) => m.application_id));
    const declarationSet = new Set((membersWithDeclaration || []).map((m: { application_id: string }) => m.application_id));
    const consentSet = new Set((membersWithConsent || []).map((m: { application_id: string }) => m.application_id));
    const signatureSet = new Set((membersWithSignature || []).map((m: { application_id: string }) => m.application_id));
    const documentSet = new Set((membersWithDocuments || []).map((m: { application_id: string }) => m.application_id));

    const completeMembers = Array.from(memberIds).filter((id) =>
      addressSet.has(id) && electoralSet.has(id) && declarationSet.has(id) &&
      consentSet.has(id) && signatureSet.has(id) && documentSet.has(id)
    );

    const vidhanSabhaSet = new Set(
      (vidhanSabhaCoverage || []).map((m: { vidhan_sabha: string }) => m.vidhan_sabha).filter(Boolean)
    );

    const proposerStats = {
      total: proposerRecords?.length || 0,
      verified: (proposerRecords || []).filter((p: { status: string }) => p.status === "VERIFIED").length,
      notarized: (proposerRecords || []).filter((p: { status: string }) => p.status === "NOTARIZED").length,
      submitted: (proposerRecords || []).filter((p: { status: string }) => p.status === "SUBMITTED").length,
      draft: (proposerRecords || []).filter((p: { status: string }) => p.status === "DRAFT").length,
      rejected: (proposerRecords || []).filter((p: { status: string }) => p.status === "REJECTED").length,
    };

    const eciReadiness = {
      foundingMembersRequired: 100,
      foundingMembersApproved: approvedMembers || 0,
      foundingMembersVerified: proposerStats.verified,
      vidhanSabhaCoverage: vidhanSabhaSet.size,
      vidhanSabhaTotal: 70,
      documentCompleteness: memberIds.size > 0 ? Math.round((completeMembers.length / memberIds.size) * 100) : 0,
      proposerReadiness: proposerStats.verified >= 100,
      overallReadiness: 0,
    };

    const readinessScore = 
      (Math.min(eciReadiness.foundingMembersApproved / 100, 1) * 0.4) +
      (Math.min(eciReadiness.vidhanSabhaCoverage / 70, 1) * 0.2) +
      (Math.min(eciReadiness.documentCompleteness / 100, 1) * 0.2) +
      (Math.min(proposerStats.verified / 100, 1) * 0.2);
    
    eciReadiness.overallReadiness = Math.round(readinessScore * 100);

    const documentBreakdown = {
      address: addressSet.size,
      electoral: electoralSet.size,
      declaration: declarationSet.size,
      consent: consentSet.size,
      signature: signatureSet.size,
      documents: documentSet.size,
    };

    const vidhanSabhaCounts: Record<string, number> = {};
    (membersWithAddress || []).forEach((m: { vidhan_sabha: string }) => {
      if (m.vidhan_sabha) vidhanSabhaCounts[m.vidhan_sabha] = (vidhanSabhaCounts[m.vidhan_sabha] || 0) + 1;
    });

    const { data: recentApplications } = await scopedSupabase
      .from("membership_applications")
      .select("id, application_number, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    return new Response(
      JSON.stringify({
        generatedAt: new Date().toISOString(),
        metrics: {
          totalApplications: totalApplications || 0,
          pendingApplications: pendingApplications || 0,
          underReviewApplications: underReviewApplications || 0,
          approvedMembers: approvedMembers || 0,
          rejectedApplications: rejectedApplications || 0,
          needsCorrection: needsCorrection || 0,
          draftApplications: draftApplications || 0,
        },
        documentBreakdown,
        completeMembersCount: completeMembers.length,
        vidhanSabhaCoverage: { covered: vidhanSabhaSet.size, total: 70, counts: vidhanSabhaCounts },
        proposerStats,
        eciReadiness,
        recentApplications: recentApplications || [],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Progress API error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
};
