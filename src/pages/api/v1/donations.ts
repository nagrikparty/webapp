import type { APIRoute } from "astro";
import { createApiSupabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), { status: 401 });
    }

    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Invalid token format" }), { status: 401 });
    }

    const scopedSupabase = createApiSupabase(token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Supabase not configured" }), { status: 500 });
    }

    const { data: { user }, error: authError } = await scopedSupabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token or user" }), { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
    }

    const { amount, transactionId } = body;

    if (amount === undefined || typeof amount !== 'number' || amount <= 0 || !transactionId || typeof transactionId !== 'string' || transactionId.trim() === '') {
      return new Response(JSON.stringify({ error: "Invalid body parameters" }), { status: 400 });
    }

    const { error: insertError } = await scopedSupabase
      .from("transactions")
      .insert({
        user_id: user.id,
        amount: amount,
        transaction_id: transactionId,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error("Insert transaction error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to save transaction" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, transactionId }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (err: unknown) {
    console.error("Donation API error:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};
