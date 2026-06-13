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

    const { userId, newRole } = await request.json();
    if (!userId || !newRole) {
      return new Response(JSON.stringify({ error: "Missing userId or newRole" }), { status: 400 });
    }

    const validRoles = ["volunteer", "member", "admin"];
    if (!validRoles.includes(newRole)) {
      return new Response(JSON.stringify({ error: "Invalid role" }), { status: 400 });
    }

    const { error: updateError } = await scopedSupabase.from("profiles").update({ role: newRole }).eq("id", userId);
    if (updateError) throw updateError;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    console.error("change-role error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to change role" }), { status: 500 });
  }
};
