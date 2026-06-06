import type { APIRoute } from 'astro';
import { logger } from "@/lib/logger";

export const POST: APIRoute = async (context) => {
  try {
    const formData = await context.request.formData();
    const phone = formData.get("phone") as string;
    
    if (!phone || phone.length < 10) {
      return new Response(JSON.stringify({ success: false, error: "Invalid phone number" }), { status: 400 });
    }

    const env = context.locals.runtime.env;
    if (!env.DB) return new Response(JSON.stringify({ success: false, error: "Database not configured" }), { status: 500 });

    const user = await env.DB.prepare(
      `SELECT phone FROM nagrik_members WHERE phone = ?`
    ).bind(phone).first();

    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "Phone number not registered" }), { status: 400 });
    }

    const supabase = (context.locals as any).supabase;
    
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: formattedPhone
    });

    if (otpError) {
      logger.error({ err: otpError }, "Supabase OTP Error");
      return new Response(JSON.stringify({ success: false, error: "Failed to send OTP" }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error in sendLoginOtp");
    return new Response(JSON.stringify({ success: false, error: "Authentication failed" }), { status: 500 });
  }
}
