import type { APIRoute } from "astro";
import { requireRole } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) return new Response(JSON.stringify({ error: "Server config error" }), { status: 500 });

    const { full_name, epic_number, ward, vidhan_sabha, contact_number, address } = await request.json();
    if (!full_name || !epic_number) {
      return new Response(JSON.stringify({ error: "Name and EPIC number are required" }), { status: 400 });
    }

    const { error: insertError } = await scopedSupabase.from("proposers").insert({
      full_name,
      epic_number,
      ward: ward || null,
      vidhan_sabha: vidhan_sabha || null,
      contact_number: contact_number || null,
      address: address || null,
      added_by: ctx.user.id
    });

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    console.error("create proposer error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to create proposer" }), { status: 500 });
  }
};
