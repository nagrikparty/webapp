import type { APIRoute } from "astro";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";

export const GET: APIRoute = async () => {
  try {
    if (!hasSupabaseConfig || !supabase) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
    const { data, error } = await supabase
      .from("manifesto_items")
      .select("id, title, title_hi, lok_sabha, vidhan_sabha, ward, category, vote_count, created_at")
      .order("vote_count", { ascending: false })
      .limit(10);

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: unknown) {
    console.error("GET manifesto error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to fetch manifesto items" }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!hasSupabaseConfig || !supabase) {
      return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
    }
    const { itemId } = await request.json();
    
    const { error: insertError } = await supabase.from("manifesto_votes").insert({
      manifesto_item_id: itemId
    });
    if (insertError) throw insertError;

    const { error: rpcError } = await supabase.rpc("increment_manifesto_vote", { item_id: itemId });
    if (rpcError) throw rpcError;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    console.error("POST manifesto error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to vote" }), { status: 500 });
  }
};
