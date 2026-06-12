import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

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

    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: "Supabase not configured" }), { status: 500 });
    }

    const scopedSupabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    const { data: { user }, error: authError } = await scopedSupabase.auth.getUser(token);
    
    if (authError || !user || !user.email) {
      return new Response(JSON.stringify({ error: "Invalid token or user" }), { status: 401 });
    }

    const userEmail = user.email.toLowerCase();
    const adminEmail = (import.meta.env.PUBLIC_ADMIN_EMAIL || "").toLowerCase();

    // Fetch existing profile
    const { data: existingProfile } = await scopedSupabase
      .from("profiles")
      .select("role, referred_by")
      .eq("id", user.id)
      .maybeSingle();

    let role = existingProfile?.role || "volunteer";

    // Admin email bypass overwrites
    if (userEmail === adminEmail && adminEmail !== "") {
      role = "admin";
    } else if (!existingProfile) {
      if (user.user_metadata?.role) {
        role = user.user_metadata.role;
      } else {
        // Determine initial role if it doesn't exist
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

    // Read body parameters
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      // Body not provided or invalid JSON
    }
    const bodyReferredBy = body?.referred_by;

    const upsertData: any = {
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
  } catch (e: any) {
    console.error("Sync profile error:", e);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};
