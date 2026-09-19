import type { APIRoute } from "astro";
import { requireRole, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });

    const { data, error } = await scopedSupabase
      .from("volunteer_tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load tasks";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });

    const { title, description, ward, status, assigned_to } = await request.json();
    if (!title) return new Response(JSON.stringify({ error: "Title is required" }), { status: 400 });

    const { data, error: insertError } = await scopedSupabase
      .from("volunteer_tasks")
      .insert({
        title,
        description: description || "",
        ward: ward || null,
        status: status || "open",
        assigned_to: assigned_to || null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      "VOLUNTEER_TASK_CREATED",
      "volunteer_tasks",
      data.id,
      { title, ward },
      request,
      scopedSupabase
    );

    return new Response(JSON.stringify({ success: true, task: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create task";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  const authResult = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) return new Response(JSON.stringify({ error: "Database unavailable" }), { status: 500 });

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });

    const { error: deleteError } = await scopedSupabase.from("volunteer_tasks").delete().eq("id", id);
    if (deleteError) throw deleteError;

    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      "VOLUNTEER_TASK_DELETED",
      "volunteer_tasks",
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
    const msg = err instanceof Error ? err.message : "Failed to delete task";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
