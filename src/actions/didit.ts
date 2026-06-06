"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function createVerificationSession() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.id) {
      return { success: false, error: "Unauthorized" };
    }
    const memberId = user.id;

    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return { success: false, error: "Database unavailable" };

    // 1. Check Monthly Limit (500 per month)
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const countResult = await env.DB.prepare(
      `SELECT COUNT(*) as count FROM nagrik_verifications WHERE strftime('%Y-%m', created_at) = ?`
    ).bind(currentMonth).first();

    if (countResult && (countResult.count as number) >= 500) {
      return { success: false, error: "Monthly verification limit reached (500/500). Please try again next month." };
    }

    // 2. Check if user is already verified
    const member = await env.DB.prepare(
      `SELECT is_verified FROM nagrik_members WHERE id = ?`
    ).bind(memberId).first();

    if (member && member.is_verified) {
      return { success: false, error: "You are already verified!" };
    }

    // 3. Create Didit Session
    const apiKey = typeof process !== 'undefined' ? process.env.DIDIT_API_KEY : env.DIDIT_API_KEY;
    const workflowId = typeof process !== 'undefined' ? process.env.DIDIT_WORKFLOW_ID : env.DIDIT_WORKFLOW_ID;
    
    if (!apiKey) {
      logger.error("DIDIT_API_KEY is not configured in the environment.");
      return { success: false, error: "Verification service configuration missing." };
    }

    const diditResponse = await fetch("https://verification.didit.me/v3/session/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify({
        workflow_id: workflowId || "placeholder_workflow_id", // Replace with actual workflow ID if empty
        vendor_data: memberId, // To identify the user later
        callback: "https://nagrik.party/en/dashboard", // Where they go after verification
      })
    });

    if (!diditResponse.ok) {
      const errorText = await diditResponse.text();
      logger.error({ errorText }, "Didit API Error");
      return { success: false, error: "Failed to initialize verification session with Didit." };
    }

    const data = await diditResponse.json();
    const sessionId = data.session_id;
    const verificationUrl = data.url;

    // 4. Record session in database
    const vId = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO nagrik_verifications (id, member_id, session_id) VALUES (?, ?, ?)`
    ).bind(vId, memberId, sessionId).run();

    await env.DB.prepare(
      `UPDATE nagrik_members SET didit_session_id = ? WHERE id = ?`
    ).bind(sessionId, memberId).run();

    return { success: true, url: verificationUrl };

  } catch (error) {
    logger.error({ err: error }, "Error creating Didit session");
    return { success: false, error: "Internal Server Error" };
  }
}

export async function checkVerificationStatus() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.id) {
      return { success: false, error: "Unauthorized" };
    }
    const memberId = user.id;

    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return { success: false, error: "Database unavailable" };

    const member = await env.DB.prepare(
      `SELECT didit_session_id, is_verified FROM nagrik_members WHERE id = ?`
    ).bind(memberId).first();

    if (!member || !member.didit_session_id) {
      return { success: true, isVerified: !!member?.is_verified };
    }

    if (member.is_verified) {
      return { success: true, isVerified: true };
    }

    // Poll Didit API for status
    const apiKey = typeof process !== 'undefined' ? process.env.DIDIT_API_KEY : env.DIDIT_API_KEY;
    if (!apiKey) return { success: false, error: "Missing API Key" };

    const diditResponse = await fetch(`https://verification.didit.me/v3/session/${member.didit_session_id}/decision/`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey
      }
    });

    if (diditResponse.ok) {
      const data = await diditResponse.json();
      // Assuming 'Approved' or 'Declined' is returned in data.decision or data.status
      if (data.status === "Approved" || data.decision === "Approved") {
        await env.DB.prepare(
          `UPDATE nagrik_members SET is_verified = 1 WHERE id = ?`
        ).bind(memberId).run();
        return { success: true, isVerified: true };
      }
      if (data.status === "Declined" || data.decision === "Declined") {
         // Reset session if declined so they can try again
         await env.DB.prepare(
          `UPDATE nagrik_members SET didit_session_id = NULL WHERE id = ?`
        ).bind(memberId).run();
        return { success: true, isVerified: false, declined: true };
      }
    }

    return { success: true, isVerified: false };
  } catch (error) {
    logger.error({ err: error }, "Error checking verification status");
    return { success: false, error: "Internal Server Error" };
  }
}
