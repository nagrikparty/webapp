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

    const { title, description, ward } = await request.json();
    if (!title) return new Response(JSON.stringify({ error: "Title is required" }), { status: 400 });

    const { error: insertError } = await scopedSupabase.from("volunteer_tasks").insert({
      title,
      description: description || "",
      ward: ward || null,
      status: "open"
    });

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    console.error("create task error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to create task" }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
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

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });

    const { error: deleteError } = await scopedSupabase.from("volunteer_tasks").delete().eq("id", id);
    if (deleteError) throw deleteError;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    console.error("delete task error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to delete task" }), { status: 500 });
  }
};
