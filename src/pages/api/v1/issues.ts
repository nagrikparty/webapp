import type { APIRoute } from "astro";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";


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

    // Payload Validation
    if (!payload.title || typeof payload.title !== "string" || payload.title.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid title" }), { status: 400 });
    }
    if (!payload.category || typeof payload.category !== "string" || payload.category.length > 50) {
      return new Response(JSON.stringify({ error: "Invalid category" }), { status: 400 });
    }
    if (!payload.description || typeof payload.description !== "string" || payload.description.length > 5000) {
      return new Response(JSON.stringify({ error: "Invalid description" }), { status: 400 });
    }
    // Basic sanitization by allowing only alphanumeric and basic punctuation could be added here
    
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
