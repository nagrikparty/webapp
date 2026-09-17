import type { APIRoute } from "astro";
import { requireAuth } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";
import { generateCR80CardPdf } from "@/lib/card-generator";

export const GET: APIRoute = async ({ request, url }) => {
  const authResult = await requireAuth(request);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database client unavailable" }), { status: 500 });
    }

    // Verify member is APPROVED
    const { data: member, error: memError } = await scopedSupabase
      .from("members")
      .select("*, member_addresses:application_id(vidhan_sabha, district, state)")
      .eq("user_id", ctx.user.id)
      .eq("status", "APPROVED")
      .single();

    if (memError || !member) {
      return new Response(
        JSON.stringify({ error: "Only approved members receive a membership card." }),
        { status: 403 }
      );
    }

    // Get active card record or generate one
    let { data: card } = await scopedSupabase
      .from("membership_cards")
      .select("*")
      .eq("member_id", member.id)
      .eq("status", "ACTIVE")
      .maybeSingle();

    if (!card) {
      const qrToken = crypto.randomUUID();
      const verificationSlug = member.membership_id;
      const { data: newCard, error: cardError } = await scopedSupabase
        .from("membership_cards")
        .insert({
          member_id: member.id,
          card_number: member.membership_id,
          card_version: 1,
          status: "ACTIVE",
          qr_token: qrToken,
          verification_slug: verificationSlug,
        })
        .select()
        .single();

      if (cardError || !newCard) {
        return new Response(JSON.stringify({ error: "Failed to issue card record" }), { status: 500 });
      }
      card = newCard;
    }

    const origin = url.origin || "https://nagrik.party";
    const verificationUrl = `${origin}/verify/member/${card.card_number}`;

    const address = Array.isArray(member.member_addresses)
      ? member.member_addresses[0]
      : member.member_addresses;

    const pdfBytes = await generateCR80CardPdf({
      membershipId: member.membership_id,
      fullName: member.full_name,
      category: member.category,
      vidhanSabha: address?.vidhan_sabha || "Delhi",
      district: address?.district || "Delhi",
      state: address?.state || "Delhi",
      issueDate: card.issue_date || new Date().toISOString().split("T")[0],
      verificationUrl,
    });

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${member.membership_id}-membership-card.pdf"`,
      },
    });
  } catch (err: unknown) {
    console.error("Card PDF generation error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500 }
    );
  }
};
