import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { access_token } = await request.json();
    if (!access_token) {
      return new Response(JSON.stringify({ error: "Missing access token" }), { status: 400 });
    }

    // Initialize admin client to securely verify token
    // We use service role key if available, else fallback to publishable key
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // 1. Verify user token
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(access_token);
    if (error || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }

    // 2. Determine role
    const adminEmail = import.meta.env.ADMIN_EMAIL || "";
    let role = "volunteer";

    // Case-insensitive admin check
    if (adminEmail && user.email?.toLowerCase() === adminEmail.toLowerCase()) {
      role = "admin";
    } else {
      // Check if email exists in membership applications (case-insensitive)
      const { data: memberApp } = await supabaseAdmin
        .from("membership_applications")
        .select("id")
        .ilike("email", user.email || "")
        .maybeSingle();

      if (memberApp) {
        role = "member";
      } else {
        // We could also check volunteer_applications similarly if needed,
        // but default is volunteer.
        role = "volunteer";
      }
    }

    // 3. Upsert profile securely
    const { error: upsertError } = await supabaseAdmin.from("profiles").upsert({
      id: user.id,
      email: user.email,
      role: role
    });

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({ role }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
