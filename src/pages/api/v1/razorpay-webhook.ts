import type { APIRoute } from "astro";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";


export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const webhookSecret = import.meta.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("RAZORPAY_WEBHOOK_SECRET not configured");
    return new Response(JSON.stringify({ error: "Webhook not configured" }), { status: 500 });
  }

  const signature = request.headers.get("X-Razorpay-Signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing signature" }), { status: 401 });
  }

  const body = await request.text();

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", 
    encoder.encode(webhookSecret), 
    { name: "HMAC", hash: "SHA-256" }, 
    false, 
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  if (signature !== expectedSignature) {
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 401 });
  }

  let event: { event: string; payload: { payment?: { entity?: { id?: string } } } };
  try {
    event = JSON.parse(body);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  if (event.event === "payment.captured") {
    const paymentId = event.payload?.payment?.entity?.id;
    if (!paymentId || !hasSupabaseConfig || !supabase) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    const { error } = await supabase
      .from("transactions")
      .update({ payment_status: "captured" })
      .eq("transaction_id", paymentId);

    if (error) {
      console.error("Webhook update error:", error);
    }
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
