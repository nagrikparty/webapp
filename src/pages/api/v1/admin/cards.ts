import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["VERIFIER", "ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database client unavailable" }), { status: 500 });
    }

    const { data: cards, error } = await scopedSupabase
      .from("membership_cards")
      .select("*, members:member_id(membership_id, full_name, category, user_id)")
      .order("issue_date", { ascending: false })
      .order("card_version", { ascending: false });

    if (error) {
      console.error("Fetch cards error:", error);
      return new Response(JSON.stringify({ error: "Failed to load cards" }), { status: 500 });
    }

    return new Response(JSON.stringify({ cards }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500 }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["VERIFIER", "ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const body = await request.json();
    const action = body.action;
    const cardId = body.cardId || body.card_id;
    const memberId = body.memberId || body.member_id;
    const reason = body.reason;

    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database client unavailable" }), { status: 500 });
    }

    if (action === "REVOKE") {
      if (!["ADMIN", "SUPER_ADMIN"].includes(ctx.profile.role)) {
        return new Response(
          JSON.stringify({ error: "Forbidden: Card revocation requires ADMIN or SUPER_ADMIN role", code: "FORBIDDEN" }),
          { status: 403 }
        );
      }

      if (!cardId) {
        return new Response(JSON.stringify({ error: "Missing cardId" }), { status: 400 });
      }

      if (!reason || !reason.trim()) {
        return new Response(JSON.stringify({ error: "Revocation reason is required for statutory audit" }), { status: 400 });
      }

      const { data: card, error: fetchErr } = await scopedSupabase
        .from("membership_cards")
        .select("*, members:member_id(membership_id, full_name)")
        .eq("id", cardId)
        .single();

      if (fetchErr || !card) {
        return new Response(JSON.stringify({ error: "Card not found" }), { status: 404 });
      }

      if (card.status === "REVOKED") {
        return new Response(JSON.stringify({ error: "Card is already revoked" }), { status: 400 });
      }

      const revocationReason = reason || "Revoked by administrative authority";
      const { error: updateErr } = await scopedSupabase
        .from("membership_cards")
        .update({
          status: "REVOKED",
          revoked_at: new Date().toISOString(),
          revocation_reason: revocationReason,
        })
        .eq("id", cardId);

      if (updateErr) {
        console.error("Revoke card error:", updateErr);
        return new Response(JSON.stringify({ error: "Failed to revoke card" }), { status: 500 });
      }

      await logAuditEvent(
        ctx.user.id,
        ctx.profile.role,
        "CARD_REVOKED",
        "membership_cards",
        cardId,
        {
          card_number: card.card_number,
          member_id: card.member_id,
          reason: revocationReason,
        },
        request,
        scopedSupabase
      );

      return new Response(JSON.stringify({ success: true, message: "Card successfully revoked" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (action === "REISSUE") {
      let targetCard = null;
      let targetMemberId = memberId;

      if (cardId) {
        const { data: card, error: cardErr } = await scopedSupabase
          .from("membership_cards")
          .select("*, members:member_id(*)")
          .eq("id", cardId)
          .single();

        if (cardErr || !card) {
          return new Response(JSON.stringify({ error: "Card not found" }), { status: 404 });
        }
        targetCard = card;
        targetMemberId = card.member_id;
      }

      if (!targetMemberId) {
        return new Response(JSON.stringify({ error: "Missing cardId or memberId" }), { status: 400 });
      }

      // Fetch member
      const { data: member, error: memErr } = await scopedSupabase
        .from("members")
        .select("*")
        .eq("id", targetMemberId)
        .single();

      if (memErr || !member) {
        return new Response(JSON.stringify({ error: "Member not found" }), { status: 404 });
      }

      if (member.status !== "APPROVED") {
        return new Response(JSON.stringify({ error: "Cannot issue card for non-approved member" }), { status: 400 });
      }

      // Fetch all existing cards for this member to determine next version
      const { data: existingCards, error: listErr } = await scopedSupabase
        .from("membership_cards")
        .select("id, card_version, status")
        .eq("member_id", targetMemberId)
        .order("card_version", { ascending: false });

      if (listErr) {
        return new Response(JSON.stringify({ error: "Failed to query member cards" }), { status: 500 });
      }

      const maxVersion = existingCards && existingCards.length > 0
        ? Math.max(...existingCards.map((c) => c.card_version || 1))
        : 0;
      const nextVersion = maxVersion + 1;

      // Mark any currently ACTIVE cards for this member as SUPERSEDED
      const activeCards = (existingCards || []).filter((c) => c.status === "ACTIVE");
      for (const ac of activeCards) {
        const { error: superErr } = await scopedSupabase
          .from("membership_cards")
          .update({ status: "SUPERSEDED" })
          .eq("id", ac.id);

        if (superErr) {
          console.error("Failed to supersede card:", superErr);
          return new Response(JSON.stringify({ error: "Failed to supersede existing active card" }), { status: 500 });
        }
      }

      // Issue new active card
      const qrToken = crypto.randomUUID();
      const verificationSlug = `${member.membership_id.toLowerCase()}-v${nextVersion}`;
      const reissueReason = reason || `Reissued card version ${nextVersion}`;

      const { data: newCard, error: insertErr } = await scopedSupabase
        .from("membership_cards")
        .insert({
          member_id: targetMemberId,
          card_number: member.membership_id,
          card_version: nextVersion,
          status: "ACTIVE",
          qr_token: qrToken,
          verification_slug: verificationSlug,
          issue_date: new Date().toISOString().split("T")[0],
        })
        .select()
        .single();

      if (insertErr || !newCard) {
        console.error("Insert reissued card error:", insertErr);
        return new Response(JSON.stringify({ error: "Failed to issue new card record" }), { status: 500 });
      }

      await logAuditEvent(
        ctx.user.id,
        ctx.profile.role,
        "CARD_REISSUED",
        "membership_cards",
        newCard.id,
        {
          previous_card_id: targetCard?.id || null,
          member_id: targetMemberId,
          new_version: nextVersion,
          reason: reissueReason,
        },
        request,
        scopedSupabase
      );

      return new Response(JSON.stringify({ success: true, card: newCard }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
  } catch (err: unknown) {
    console.error("Cards endpoint error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500 }
    );
  }
};
