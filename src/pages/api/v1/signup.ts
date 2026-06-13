import type { APIRoute } from "astro";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!hasSupabaseConfig || !supabase) {
      return new Response(JSON.stringify({ error: "Database not configured" }), { status: 500 });
    }

    const { type, lok_sabha, vidhan_sabha, ward, email, full_name, skills, availability, referred_by } = await request.json();
    
    if (type === "volunteer") {
      const record: Record<string, unknown> = {
        id: crypto.randomUUID(),
        lok_sabha,
        vidhan_sabha,
        ward,
        email,
        full_name,
        skills: skills || null,
        availability: availability || null,
        status: "pending"
      };
      if (referred_by) record.referred_by = referred_by;
      await supabase.from("volunteer_applications").insert(record);
    } else if (type === "member") {
      await supabase.from("membership_applications").insert({
        id: crypto.randomUUID(),
        lok_sabha,
        vidhan_sabha,
        ward,
        email,
        full_name
      });
    }
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: unknown) {
    console.error("Signup error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to signup" }), { status: 500 });
  }
};
