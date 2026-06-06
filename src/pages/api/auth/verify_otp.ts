import type { APIRoute } from 'astro';
import { logger } from "@/lib/logger";

export const POST: APIRoute = async (context) => {
  try {
    const formData = await context.request.formData();
    const phone = formData.get("phone") as string;
    const token = formData.get("token") as string;

    if (!phone || !token) {
      return new Response(JSON.stringify({ success: false, error: "Phone and OTP are required" }), { status: 400 });
    }

    const supabase = (context.locals as any).supabase;
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: "sms"
    });

    if (verifyError) {
      logger.error({ err: verifyError }, "Supabase Verify OTP Error");
      return new Response(JSON.stringify({ success: false, error: "Invalid or expired OTP" }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error in verifyLoginOtp");
    return new Response(JSON.stringify({ success: false, error: "Verification failed" }), { status: 500 });
  }
}
