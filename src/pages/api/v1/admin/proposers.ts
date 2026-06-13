import type { APIRoute } from "astro";
import { createApiSupabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    const token = authHeader.replace(/^Bearer\s+/i, "");

    const scopedSupabase = createApiSupabase(token);
    if (!scopedSupabase) return new Response(JSON.stringify({ error: "Server config error" }), { status: 500 });

    const { data: { user }, error: authError } = await scopedSupabase.auth.getUser(token);
    if (authError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { data: adminProfile } = await scopedSupabase.from("profiles").select("role").eq("id", user.id).single();
    if (!adminProfile || adminProfile.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const { full_name, epic_number, ward, vidhan_sabha, contact_number, address } = await request.json();
    if (!full_name || !epic_number) {
      return new Response(JSON.stringify({ error: "Name and EPIC number are required" }), { status: 400 });
    }

    const { error: insertError } = await scopedSupabase.from("proposers").insert({
      full_name,
      epic_number,
      ward: ward || null,
      vidhan_sabha: vidhan_sabha || null,
      contact_number: contact_number || null,
      address: address || null,
      added_by: user.id
    });

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    console.error("create proposer error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to create proposer" }), { status: 500 });
  }
};
