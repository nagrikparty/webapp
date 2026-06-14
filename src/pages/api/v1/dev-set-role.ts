import type { APIRoute } from "astro";
import { createApiSupabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.DEV) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return new Response("Unauthorized", { status: 401 });
    const token = authHeader.replace(/^Bearer\s+/i, "");

    const scopedSupabase = createApiSupabase(token);
    if (!scopedSupabase) return new Response("Supabase not configured", { status: 500 });

    const { data: { user } } = await scopedSupabase.auth.getUser(token);
    if (!user) return new Response("Unauthorized", { status: 401 });

    const body = await request.json();
    const { role } = body;

    await scopedSupabase.from("profiles").update({ role }).eq("id", user.id);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    console.error("dev-set-role error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};
