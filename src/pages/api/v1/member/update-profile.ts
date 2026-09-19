import type { APIRoute } from "astro";
import { requireAuth, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

const ALLOWED_INTERESTS = [
  "Community work",
  "Research",
  "Policy",
  "Technology",
  "Design",
  "Video",
  "Writing",
  "Legal",
  "Data",
  "Media",
  "Outreach",
  "Events",
  "Administration",
  "Translation",
];

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireAuth(request);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database client unavailable" }), { status: 500 });
    }

    const body = await request.json();
    const { full_name, phone, ward, vidhan_sabha, skills, interest_areas, availability } = body;

    // Check if user is already an approved member
    const { data: approvedMember } = await scopedSupabase
      .from("members")
      .select("id, status, full_name")
      .eq("user_id", ctx.user.id)
      .eq("status", "APPROVED")
      .maybeSingle();

    const profileUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (phone !== undefined) {
      profileUpdates.phone = typeof phone === "string" ? phone.trim().slice(0, 20) : null;
    }
    if (ward !== undefined) {
      profileUpdates.ward = typeof ward === "string" ? ward.trim().slice(0, 100) : null;
    }
    if (vidhan_sabha !== undefined) {
      profileUpdates.vidhan_sabha = typeof vidhan_sabha === "string" ? vidhan_sabha.trim().slice(0, 100) : null;
    }

    // Name change policy:
    // If already an approved member, primary legal name cannot be silently overwritten without verification desk.
    let nameChangeNotice: string | null = null;
    if (full_name !== undefined && typeof full_name === "string" && full_name.trim().length > 0) {
      const trimmedName = full_name.trim().slice(0, 150);
      if (approvedMember && approvedMember.full_name && approvedMember.full_name !== trimmedName) {
        nameChangeNotice = "Name update recorded for review. Official membership record changes require scrutiny desk confirmation.";
      } else {
        profileUpdates.full_name = trimmedName;
      }
    }

    // 1. Update Profile
    const { data: updatedProfile, error: profileErr } = await scopedSupabase
      .from("profiles")
      .update(profileUpdates)
      .eq("id", ctx.user.id)
      .select()
      .single();

    if (profileErr) throw profileErr;

    // 2. Validate and Update Participation & Skills
    let sanitizedInterests: string[] = [];
    if (Array.isArray(interest_areas)) {
      sanitizedInterests = interest_areas.filter((item) =>
        typeof item === "string" && ALLOWED_INTERESTS.includes(item.trim())
      );
    }

    // Find latest participation record
    const { data: existingPart } = await scopedSupabase
      .from("member_participation")
      .select("id, application_id")
      .eq("user_id", ctx.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let savedParticipation = null;
    if (existingPart) {
      const { data: partData, error: partErr } = await scopedSupabase
        .from("member_participation")
        .update({
          interest_areas: sanitizedInterests,
          skills: typeof skills === "string" ? skills.trim().slice(0, 500) : null,
          availability: typeof availability === "string" ? availability.trim().slice(0, 100) : null,
        })
        .eq("id", existingPart.id)
        .select()
        .single();

      if (partErr) throw partErr;
      savedParticipation = partData;
    } else {
      // Find latest application if any
      const { data: latestApp } = await scopedSupabase
        .from("membership_applications")
        .select("id")
        .eq("user_id", ctx.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: partData, error: partErr } = await scopedSupabase
        .from("member_participation")
        .insert({
          user_id: ctx.user.id,
          application_id: latestApp?.id || null,
          interest_areas: sanitizedInterests,
          skills: typeof skills === "string" ? skills.trim().slice(0, 500) : null,
          availability: typeof availability === "string" ? availability.trim().slice(0, 100) : null,
        })
        .select()
        .single();

      if (partErr) throw partErr;
      savedParticipation = partData;
    }

    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      "MEMBER_PROFILE_UPDATED",
      "profiles",
      ctx.user.id,
      { ward: profileUpdates.ward, vidhan_sabha: profileUpdates.vidhan_sabha },
      request,
      scopedSupabase
    );

    return new Response(
      JSON.stringify({
        success: true,
        profile: updatedProfile,
        participation: savedParticipation,
        notice: nameChangeNotice,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    console.error("update-profile error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Failed to update profile" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
