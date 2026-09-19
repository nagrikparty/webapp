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
      .from("manifesto_items")
      .select("*")
      .order("vote_count", { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load manifesto items";
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
    const { title, title_hi, category, lok_sabha, vidhan_sabha, ward } = body;

    if (!title || !title.trim()) {
      return new Response(JSON.stringify({ error: "Title is required" }), { status: 400 });
    }

    const { data, error } = await scopedSupabase
      .from("manifesto_items")
      .insert({
        title: title.trim(),
        title_hi: title_hi?.trim() || null,
        category: category || "Civic Governance",
        lok_sabha: lok_sabha || null,
        vidhan_sabha: vidhan_sabha || null,
        ward: ward || null,
        vote_count: 0,
      })
      .select()
      .single();

    if (error) throw error;

    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      "MANIFESTO_ITEM_CREATED",
      "manifesto_items",
      data.id,
      { title: data.title, category: data.category },
      request,
      scopedSupabase
    );

    return new Response(JSON.stringify({ success: true, item: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create manifesto item";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: "Missing item id" }), { status: 400 });

    const { error } = await scopedSupabase
      .from("manifesto_items")
      .delete()
      .eq("id", id);

    if (error) throw error;

    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      "MANIFESTO_ITEM_DELETED",
      "manifesto_items",
      id,
      { id },
      request,
      scopedSupabase
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete manifesto item";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
