import type { APIRoute } from "astro";
import { requireAuth } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";
import { getFormationProgress } from "@/lib/progress-service";

export const GET: APIRoute = async ({ request }) => {
  const authResult = await requireAuth(request);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database client unavailable" }), { status: 500 });
    }

    // 1. Fetch latest application
    const { data: application } = await scopedSupabase
      .from("membership_applications")
      .select("id, user_id, application_number, status, membership_category, submitted_at, reviewed_at, correction_notes, rejection_reason, created_at")
      .eq("user_id", ctx.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 2. Fetch approved member record
    const { data: member } = await scopedSupabase
      .from("members")
      .select("id, user_id, application_id, membership_id, full_name, category, status, approved_at, created_at")
      .eq("user_id", ctx.user.id)
      .maybeSingle();

    // 3. Fetch active membership card
    let card = null;
    if (member) {
      const { data: cardData } = await scopedSupabase
        .from("membership_cards")
        .select("id, member_id, card_number, card_version, issue_date, status, qr_token, verification_slug")
        .eq("member_id", member.id)
        .order("card_version", { ascending: false })
        .limit(1)
        .maybeSingle();
      card = cardData;
    }

    // 4. Fetch participation & skills record
    const { data: participation } = await scopedSupabase
      .from("member_participation")
      .select("id, interest_areas, skills, availability, notes, created_at")
      .eq("user_id", ctx.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 5. Fetch assigned volunteer tasks
    const { data: assignedTasks } = await scopedSupabase
      .from("volunteer_tasks")
      .select("id, title, description, ward, status, created_at")
      .eq("assigned_to", ctx.user.id)
      .order("created_at", { ascending: false });

    // 6. Fetch recent organizational announcements
    const { data: announcements } = await scopedSupabase
      .from("announcements")
      .select("id, title, content, target_audience, created_at")
      .in("target_audience", ["all", "members"])
      .order("created_at", { ascending: false })
      .limit(5);

    // 7. Calculate authoritative formation progress
    let formationProgress = null;
    try {
      formationProgress = await getFormationProgress();
    } catch {
      // Graceful fallback
    }

    return new Response(
      JSON.stringify({
        profile: ctx.profile,
        application,
        member,
        card,
        participation,
        assignedTasks: assignedTasks || [],
        announcements: announcements || [],
        formationProgress,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
