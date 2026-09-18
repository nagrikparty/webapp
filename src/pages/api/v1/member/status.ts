import type { APIRoute } from "astro";
import { requireAuth } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  const authResult = await requireAuth(request);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database client unavailable" }), { status: 500 });
    }

    // 1. Fetch latest application
    const { data: application } = await scopedSupabase
      .from("membership_applications")
      .select("*, member_addresses(*), electoral_details(*), member_participation(*), membership_declarations(*), membership_consents(*), signatures(*), documents(*, document_extractions(*))")
      .eq("user_id", ctx.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 2. Fetch approved member record
    const { data: member } = await scopedSupabase
      .from("members")
      .select("*")
      .eq("user_id", ctx.user.id)
      .maybeSingle();

    // 3. Fetch active membership card
    let card = null;
    if (member) {
      const { data: cardData } = await scopedSupabase
        .from("membership_cards")
        .select("*")
        .eq("member_id", member.id)
        .order("card_version", { ascending: false })
        .limit(1)
        .maybeSingle();
      card = cardData;
    }

    return new Response(
      JSON.stringify({
        profile: ctx.profile,
        application,
        member,
        card,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500 }
    );
  }
};
