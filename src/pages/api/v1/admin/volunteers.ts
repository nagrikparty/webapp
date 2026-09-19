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

    const url = new URL(request.url);
    const statusFilter = url.searchParams.get("status");

    let query = scopedSupabase
      .from("volunteer_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error) throw error;

    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch volunteer applications";
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

    const { applicationId, status } = await request.json();
    if (!applicationId || !status) {
      return new Response(JSON.stringify({ error: "Missing applicationId or status" }), { status: 400 });
    }

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid status" }), { status: 400 });
    }

    const { data: updatedApp, error: updateError } = await scopedSupabase
      .from("volunteer_applications")
      .update({ status })
      .eq("id", applicationId)
      .select()
      .single();

    if (updateError) throw updateError;

    if (status === "approved" && updatedApp) {
      const { data: existingProfile } = await scopedSupabase
        .from("profiles")
        .select("id, role")
        .eq("email", updatedApp.email)
        .maybeSingle();

      if (existingProfile && existingProfile.role === "PUBLIC") {
        await scopedSupabase
          .from("profiles")
          .update({
            full_name: updatedApp.full_name,
            ward: updatedApp.ward,
          })
          .eq("id", existingProfile.id);
      }
    }

    await logAuditEvent(
      ctx.user.id,
      ctx.profile.role,
      "VOLUNTEER_STATUS_UPDATED",
      "volunteer_applications",
      applicationId,
      { status },
      request,
      scopedSupabase
    );

    return new Response(JSON.stringify({ success: true, application: updatedApp }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update volunteer application";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
};
