import type { APIRoute } from "astro";
import { createApiSupabase } from "@/lib/supabase";

export const GET: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    const token = authHeader.replace(/^Bearer\s+/i, "");

    const scopedSupabase = createApiSupabase(token);
    if (!scopedSupabase) return new Response(JSON.stringify({ error: "Server config error" }), { status: 500 });

    const { data: { user }, error: authError } = await scopedSupabase.auth.getUser(token);
    if (authError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { data: adminProfile } = await scopedSupabase.from("profiles").select("role").eq("id", user.id).single();
    if (!adminProfile || adminProfile.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const url = new URL(request.url);
    const statusFilter = url.searchParams.get("status");

    let query = scopedSupabase.from("volunteer_applications").select("*").order("created_at", { ascending: false });
    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error) throw error;

    return new Response(JSON.stringify(data || []), { status: 200 });
  } catch (err: unknown) {
    console.error("list volunteer applications error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to fetch volunteer applications" }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    const token = authHeader.replace(/^Bearer\s+/i, "");

    const scopedSupabase = createApiSupabase(token);
    if (!scopedSupabase) return new Response(JSON.stringify({ error: "Server config error" }), { status: 500 });

    const { data: { user }, error: authError } = await scopedSupabase.auth.getUser(token);
    if (authError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const { data: adminProfile } = await scopedSupabase.from("profiles").select("role").eq("id", user.id).single();
    if (!adminProfile || adminProfile.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const { applicationId, status } = await request.json();
    if (!applicationId || !status) {
      return new Response(JSON.stringify({ error: "Missing applicationId or status" }), { status: 400 });
    }

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid status" }), { status: 400 });
    }

    const { error: updateError } = await scopedSupabase
      .from("volunteer_applications")
      .update({ status })
      .eq("id", applicationId);

    if (updateError) throw updateError;

    if (status === "approved") {
      const { data: app } = await scopedSupabase
        .from("volunteer_applications")
        .select("email, full_name, ward, vidhan_sabha, lok_sabha")
        .eq("id", applicationId)
        .single();

      if (app) {
        const { data: existingProfile } = await scopedSupabase
          .from("profiles")
          .select("id")
          .eq("email", app.email)
          .maybeSingle();

        if (existingProfile) {
          await scopedSupabase
            .from("profiles")
            .update({ role: "volunteer", full_name: app.full_name, ward: app.ward })
            .eq("id", existingProfile.id);
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    console.error("update volunteer application error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to update volunteer application" }), { status: 500 });
  }
};
