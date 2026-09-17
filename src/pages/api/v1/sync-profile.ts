import type { APIRoute } from "astro";
import { createApiSupabase } from "@/lib/supabase";
import { logAuditEvent } from "@/lib/auth";

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), { status: 401 });
    }

    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return new Response(JSON.stringify({ error: "Invalid token format" }), { status: 401 });
    }

    const scopedSupabase = createApiSupabase(token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Supabase not configured" }), { status: 500 });
    }

    const { data: { user }, error: authError } = await scopedSupabase.auth.getUser(token);
    if (authError || !user || !user.email) {
      return new Response(JSON.stringify({ error: "Invalid token or user" }), { status: 401 });
    }

    const userEmail = user.email.toLowerCase();
    const adminEmail = (import.meta.env.PUBLIC_ADMIN_EMAIL || "").toLowerCase();

    // Fetch existing profile from database
    const { data: existingProfile } = await scopedSupabase
      .from("profiles")
      .select("id, role, full_name, referred_by")
      .eq("id", user.id)
      .maybeSingle();

    let resolvedRole = existingProfile?.role || "PUBLIC";

    // Bootstrap configured admin
    if (userEmail === adminEmail && adminEmail !== "") {
      resolvedRole = "ADMIN";
    } else if (!existingProfile) {
      // New user strictly defaults to PUBLIC role
      resolvedRole = "PUBLIC";
    } else {
      // Check if user has an approved membership record
      const { data: approvedMember } = await scopedSupabase
        .from("members")
        .select("id, status")
        .eq("user_id", user.id)
        .eq("status", "APPROVED")
        .maybeSingle();

      if (approvedMember && resolvedRole === "PUBLIC") {
        resolvedRole = "MEMBER";
      }
    }

    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      // Body optional
    }
    const bodyReferredBy = typeof body?.referred_by === "string" ? body.referred_by : undefined;

    const upsertData: Record<string, unknown> = {
      id: user.id,
      email: userEmail,
      role: resolvedRole,
      updated_at: new Date().toISOString()
    };

    if (!existingProfile) {
      upsertData.created_at = new Date().toISOString();
      if (bodyReferredBy && bodyReferredBy !== user.id) {
        upsertData.referred_by = bodyReferredBy;
      }
    }

    const { error: upsertError } = await scopedSupabase
      .from("profiles")
      .upsert(upsertData);

    if (upsertError) {
      console.error("Profile sync upsert error:", upsertError);
      return new Response(JSON.stringify({ error: "Failed to sync profile" }), { status: 500 });
    }

    if (!existingProfile) {
      await logAuditEvent(
        user.id,
        resolvedRole,
        "ACCOUNT_CREATED",
        "profiles",
        user.id,
        { email: userEmail },
        request
      );
    }

    return new Response(
      JSON.stringify({
        role: resolvedRole,
        user_id: user.id,
        email: userEmail
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    console.error("Sync profile error:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};
