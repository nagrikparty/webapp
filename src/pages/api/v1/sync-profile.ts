import type { APIRoute } from "astro";
import { createApiSupabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), { status: 401 });
    }

    const token = authHeader.replace(/^Bearer\s+/i, "");
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

    const { data: existingProfile } = await scopedSupabase
      .from("profiles")
      .select("role, referred_by")
      .eq("id", user.id)
      .maybeSingle();

    let role = existingProfile?.role || "volunteer";

    if (userEmail === adminEmail && adminEmail !== "") {
      role = "admin";
    } else if (!existingProfile) {
      if (user.user_metadata?.role) {
        role = user.user_metadata.role;
      } else {
        const { data: memberApp } = await scopedSupabase
          .from("membership_applications")
          .select("id")
          .eq("email", userEmail)
          .maybeSingle();
        
        if (memberApp) {
          role = "member";
        } else {
          role = "volunteer";
        }
      }
    }

    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      // Body not provided or invalid JSON
    }
    const bodyReferredBy = typeof body?.referred_by === "string" ? body.referred_by : undefined;

    const upsertData: Record<string, unknown> = {
      id: user.id,
      email: userEmail,
      role: role
    };

    if (!existingProfile) {
      if (bodyReferredBy) {
        upsertData.referred_by = bodyReferredBy;
      }
    } else if (!existingProfile.referred_by) {
      if (bodyReferredBy) {
        upsertData.referred_by = bodyReferredBy;
      }
    }

    const { error: upsertError } = await scopedSupabase
      .from("profiles")
      .upsert(upsertData);

    if (upsertError) {
      console.error("Upsert error:", upsertError);
      return new Response(JSON.stringify({ error: "Failed to sync profile" }), { status: 500 });
    }

    return new Response(JSON.stringify({ role }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: unknown) {
    console.error("Sync profile error:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};
