import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const GET: APIRoute = async () => {
  try {
    if (!supabase) {
      return new Response(
        JSON.stringify({
          is_enabled: false,
          legal_status_label: "Contributions currently accepted under the Formation Phase",
          payment_instructions: "100% digital receipts. Cashless only.",
          disclosure_text: "Nagrik Party operates on a strictly digital, zero-cash basis.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { data, error } = await supabase
      .from("donation_configuration")
      .select("is_enabled, legal_status_label, upi_id, account_name, bank_name, qr_image_url, payment_instructions, disclosure_text")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) {
      return new Response(
        JSON.stringify({
          is_enabled: false,
          legal_status_label: "Contributions currently accepted under the Formation Phase",
          payment_instructions: "100% digital receipts. Cashless only.",
          disclosure_text: "Nagrik Party operates on a strictly digital, zero-cash basis.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("Error fetching donation configuration:", err);
    return new Response(JSON.stringify({ is_enabled: false }), { status: 200 });
  }
};
