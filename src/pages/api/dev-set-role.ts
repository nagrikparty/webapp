import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.DEV) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return new Response("Unauthorized", { status: 401 });
    const token = authHeader.replace(/^Bearer\s+/i, "");

    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const scopedSupabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: { user } } = await scopedSupabase.auth.getUser(token);
    if (!user) return new Response("Unauthorized", { status: 401 });

    const body = await request.json();
    const { role } = body;

    // Use service role to bypass RLS for dev mode
    const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceKey) {
        const adminSupabase = createClient(supabaseUrl, serviceKey);
        await adminSupabase.from("profiles").update({ role }).eq("id", user.id);
    } else {
        // If no service key, try with scoped client (might fail if RLS prevents it)
        await scopedSupabase.from("profiles").update({ role }).eq("id", user.id);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};
