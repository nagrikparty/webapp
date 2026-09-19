import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });
    }

    const { data, error } = await scopedSupabase
      .from("donation_configuration")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error) throw error;

    return new Response(JSON.stringify(data || { id: "default", is_enabled: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load donation configuration";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });
    }

    const body = await request.json();
    const payload = {
      id: "default",
      is_enabled: Boolean(body.is_enabled),
      legal_status_label: body.legal_status_label || "Contributions currently accepted under the Formation Phase",
      upi_id: body.upi_id || null,
      account_name: body.account_name || null,
      bank_name: body.bank_name || null,
      account_number: body.account_number || null,
      ifsc_code: body.ifsc_code || null,
      qr_image_url: body.qr_image_url || null,
      payment_instructions: body.payment_instructions || "Scan the UPI QR code or transfer directly to the formation account. Retain reference UTR for audit receipting.",
      disclosure_text: body.disclosure_text || "Nagrik Party is in its Formation Phase. All contributions are recorded in our public transparency ledger with complete donor provenance.",
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await scopedSupabase
      .from("donation_configuration")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) throw error;

    // Log the configuration change in statutory audit logs
    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      "DONATION_CONFIG_UPDATED",
      "donation_configuration",
      "default",
      { is_enabled: payload.is_enabled, upi_id: payload.upi_id },
      request,
      scopedSupabase
    );

    return new Response(JSON.stringify({ success: true, config: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update donation configuration";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
