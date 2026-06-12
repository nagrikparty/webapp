import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const GET: APIRoute = async () => {
  try {
    const { data, error } = await supabase!
      .from("manifesto_items")
      .select("id, title, title_hi, lok_sabha, vidhan_sabha, ward, category, vote_count, created_at")
      .order("vote_count", { ascending: false })
      .limit(10);

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to fetch manifesto items" }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { itemId } = await request.json();
    
    const { error: insertError } = await supabase!.from("manifesto_votes").insert({
      manifesto_item_id: itemId
    });
    if (insertError) throw insertError;

    // Use the RPC we created to increment safely
    const { error: rpcError } = await supabase!.rpc("increment_manifesto_vote", { item_id: itemId });
    if (rpcError) throw rpcError;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to vote" }), { status: 500 });
  }
};
