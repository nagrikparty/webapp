import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabase!
      .from("issues")
      .select("id, title, category, lok_sabha, vidhan_sabha, ward, status, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to fetch issues" }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();
    const id = "iss-" + Date.now() + Math.floor(Math.random() * 1000);
    
    const { error } = await supabase!.from("issues").insert({
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
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to create issue" }), { status: 500 });
  }
};
