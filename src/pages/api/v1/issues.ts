import type { APIRoute } from "astro";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import crypto from "crypto";

export const GET: APIRoute = async () => {
  try {
    if (!hasSupabaseConfig || !supabase) {
      return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
    }
    const { data, error } = await supabase
      .from("issues")
      .select("id, title, category, lok_sabha, vidhan_sabha, ward, status, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: unknown) {
    console.error("GET issues error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to fetch issues" }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!hasSupabaseConfig || !supabase) {
      return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
    }
    const payload = await request.json();
    const id = crypto.randomUUID();
    
    const { error } = await supabase.from("issues").insert({
      id,
      title: payload.title,
      category: payload.category,
      description: payload.description,
      lok_sabha: payload.lok_sabha,
      vidhan_sabha: payload.vidhan_sabha,
      ward: payload.ward,
      status: "submitted"
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, id }), { status: 200 });
  } catch (err: unknown) {
    console.error("POST issue error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to create issue" }), { status: 500 });
  }
};
