import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const GET: APIRoute = async () => {
  try {
    const [issueRes, volRes, memRes] = await Promise.all([
      supabase!.from("issues").select("id", { count: "exact", head: true }),
      supabase!.from("volunteer_applications").select("id", { count: "exact", head: true }),
      supabase!.from("membership_applications").select("id", { count: "exact", head: true }),
    ]);

    return new Response(JSON.stringify({
      issues: issueRes.count ?? 0,
      volunteers: volRes.count ?? 0,
      members: memRes.count ?? 0,
      areas: 70
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to fetch stats" }), { status: 500 });
  }
};
