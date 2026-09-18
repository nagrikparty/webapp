import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";
import type { UserRole } from "@/lib/types";

const VALID_ROLES: UserRole[] = ["PUBLIC", "MEMBER", "VERIFIER", "ADMIN", "SUPER_ADMIN"];

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const body = await request.json();
    const userId = body.userId || body.user_id;
    const newRole = body.newRole || body.role;

    if (!userId || !newRole) {
      return new Response(JSON.stringify({ error: "Missing userId or newRole" }), { status: 400 });
    }

    const normalizedRole = String(newRole).toUpperCase() as UserRole;
    if (!VALID_ROLES.includes(normalizedRole)) {
      return new Response(JSON.stringify({ error: `Invalid role: ${newRole}` }), { status: 400 });
    }

    // Only SUPER_ADMIN can grant or revoke SUPER_ADMIN role
    if (normalizedRole === "SUPER_ADMIN" && ctx.profile.role !== "SUPER_ADMIN") {
      return new Response(
        JSON.stringify({ error: "Forbidden: Only SUPER_ADMIN can assign the SUPER_ADMIN role", code: "FORBIDDEN" }),
        { status: 403 }
      );
    }

    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database client unavailable" }), { status: 500 });
    }

    // Check target profile
    const { data: targetProfile, error: fetchError } = await scopedSupabase
      .from("profiles")
      .select("id, role, full_name, email")
      .eq("id", userId)
      .single();

    if (fetchError || !targetProfile) {
      return new Response(JSON.stringify({ error: "Target profile not found" }), { status: 404 });
    }

    if (targetProfile.role === "SUPER_ADMIN" && ctx.profile.role !== "SUPER_ADMIN") {
      return new Response(
        JSON.stringify({ error: "Forbidden: Only SUPER_ADMIN can modify another SUPER_ADMIN's role", code: "FORBIDDEN" }),
        { status: 403 }
      );
    }

    const oldRole = targetProfile.role;
    const { error: updateError } = await scopedSupabase
      .from("profiles")
      .update({ role: normalizedRole })
      .eq("id", userId);

    if (updateError) {
      console.error("Profile role update error:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update profile role" }), { status: 500 });
    }

    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      "ROLE_CHANGED",
      "profiles",
      userId,
      { old_role: oldRole, new_role: normalizedRole },
      request,
      scopedSupabase
    );

    return new Response(JSON.stringify({ success: true, oldRole, newRole: normalizedRole }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error("change-role error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
