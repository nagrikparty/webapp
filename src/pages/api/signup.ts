import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { type, lok_sabha, vidhan_sabha, ward, email, full_name } = await request.json();
    
    if (type === "volunteer") {
      await supabase!.from("volunteer_applications").insert({
        id: "vol-" + Date.now(),
        lok_sabha,
        vidhan_sabha,
        ward,
        email,
        full_name
      });
    } else if (type === "member") {
      await supabase!.from("membership_applications").insert({
        id: "mem-" + Date.now(),
        lok_sabha,
        vidhan_sabha,
        ward,
        email,
        full_name
      });
    }
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to signup" }), { status: 500 });
  }
};
