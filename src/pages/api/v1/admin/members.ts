import type { APIRoute } from "astro";
import { createApiSupabase } from "@/lib/supabase";

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

    const { applicationId, action } = await request.json();
    if (!applicationId || !action) {
      return new Response(JSON.stringify({ error: "Missing applicationId or action" }), { status: 400 });
    }

    if (action === "induct") {
      const { data: app, error: fetchError } = await scopedSupabase
        .from("membership_applications")
        .select("*")
        .eq("id", applicationId)
        .single();

      if (fetchError || !app) {
        return new Response(JSON.stringify({ error: "Application not found" }), { status: 404 });
      }

      const { error: updateAppError } = await scopedSupabase
        .from("membership_applications")
        .update({ status: "approved" })
        .eq("id", applicationId);

      if (updateAppError) throw updateAppError;

      const { error: updateProfileError } = await scopedSupabase
        .from("profiles")
        .update({ role: "member", full_name: app.full_name, ward: app.ward })
        .eq("email", app.email);

      if (updateProfileError) throw updateProfileError;
    } else if (action === "reject") {
      const { error: updateAppError } = await scopedSupabase
        .from("membership_applications")
        .update({ status: "rejected" })
        .eq("id", applicationId);

      if (updateAppError) throw updateAppError;
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    console.error("members action error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to process member action" }), { status: 500 });
  }
};
