"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createClient } from "@/lib/supabase/server";
import { submitDonationSchema, submitReportSchema, submitMemberSchema, loginMemberSchema, updateProfileSchema, submitContactSchema } from "@/lib/validations";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/ratelimit";
import { headers } from "next/headers";

export async function verifyTurnstile(token: string): Promise<boolean> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const secretKey = env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) return false;
    
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: formData,
      method: 'POST',
    });

    const outcome = await result.json() as any;
    return !!outcome.success;
  } catch (error) {
    logger.error({ err: error }, "Turnstile verification error");
    return false;
  }
}

export async function validateFileUpload(file: File, maxSizeMB: number = 5): Promise<{ valid: boolean; error?: string }> {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit.` };
  }
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.' };
  }
  return { valid: true };
}

// ─── CONTACT ────────────────────────────────────────────────────────────────────

export async function submitContact(data: { name: string; email: string; message: string; turnstileToken: string }) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";

    if (!await checkRateLimit(`contact_${ip}`, 5, 60000)) {
      return { success: false, error: "Too many requests, please try again later" };
    }

    if (!data.turnstileToken || !(await verifyTurnstile(data.turnstileToken))) {
      return { success: false, error: "CAPTCHA verification failed" };
    }

    const parsed = submitContactSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }
    const d = parsed.data;

    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return { success: false, error: "Database not configured" };

    const id = crypto.randomUUID();
    const result = await env.DB.prepare(
      "INSERT INTO nagrik_contact_messages (id, name, email, message) VALUES (?, ?, ?, ?)"
    ).bind(id, d.name, d.email, d.message).run();

    return { success: result.success };
  } catch (error) {
    logger.error({ err: error }, "Error in submitContact");
    return { success: false, error: "Internal Server Error" };
  }
}

// ─── GEOGRAPHY ──────────────────────────────────────────────────────────────────

export async function getStates() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return [];
    
    const result = await env.DB.prepare("SELECT id, name, name_hi, serial_no FROM states ORDER BY serial_no ASC").all<any>();
    return result.results || [];
  } catch (error) {
    logger.error({ err: error }, "Error fetching states");
    return [];
  }
}

export async function getVidhanSabhas(stateId: string) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB || !stateId) return [];
    
    const result = await env.DB.prepare(
      "SELECT id, name, serial_no FROM vidhan_sabhas WHERE state_id = ? ORDER BY serial_no ASC"
    ).bind(stateId).all<any>();
    return result.results || [];
  } catch (error) {
    logger.error({ err: error }, "Error fetching vidhan sabhas");
    return [];
  }
}

export async function getWards(vidhanSabhaId: string) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB || !vidhanSabhaId) return [];
    
    const result = await env.DB.prepare(
      "SELECT id, name, serial_no FROM wards WHERE vidhan_sabha_id = ? ORDER BY serial_no ASC"
    ).bind(vidhanSabhaId).all<any>();
    return result.results || [];
  } catch (error) {
    logger.error({ err: error }, "Error fetching wards");
    return [];
  }
}

// ─── MEMBERS ──────────────────────────────────────────────────────────────────

export async function submitMember(formData: FormData) {
  try {
    const turnstileToken = formData.get('cf-turnstile-response') as string;
    if (!turnstileToken || !(await verifyTurnstile(turnstileToken))) {
      return { success: false, error: "CAPTCHA verification failed" };
    }

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`member_${ip}`, 5, 60000)) {
      return { success: false, error: "Too many requests, please try again later" };
    }

    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return { success: false, error: "Database not configured" };

    const validationData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      dob: formData.get("dob") as string,
      gender: formData.get("gender") as string,
      guardian_name: formData.get("guardian_name") as string,
      address: formData.get("address") as string,
      state: formData.get("state") as string,
      vidhan_sabha: formData.get("vidhan_sabha") as string,
      ward: formData.get("ward") as string,
      pincode: formData.get("pincode") as string,
      is_registered_voter: formData.get("is_registered_voter") as string,
      is_indian_citizen: formData.get("is_indian_citizen") as string,
      has_criminal_record: formData.get("has_criminal_record") as string,
      criminal_record_details: formData.get("criminal_record_details") as string,
      is_other_party_member: formData.get("is_other_party_member") as string,
      other_party_name: formData.get("other_party_name") as string,
      epic_number: formData.get("epic_number") as string,
      skills: formData.get("skills") as string,
      social_media: formData.get("social_media") as string,
      referral_source: formData.get("referral_source") as string,
      referral_code: formData.get("referral_code") as string,
      password: formData.get("password") as string,
      declaration_agreed: formData.get("declaration_agreed") as string,
    };

    const parsed = submitMemberSchema.safeParse(validationData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const d = parsed.data;
    const is_indian_citizen = d.is_indian_citizen === 'yes' ? 1 : 0;
    const has_criminal_record = d.has_criminal_record === 'yes' ? 1 : 0;
    const declaration_agreed = d.declaration_agreed === 'true' ? 1 : 0;
    
    const supabase = await createClient();
    
    // Create Supabase Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: d.email || `${d.phone}@nagrikparty.in`, // fallback if no email
      password: d.password,
      options: {
        data: { name: d.name, phone: d.phone }
      }
    });

    if (authError || !authData.user) {
      logger.error({ err: authError }, "Supabase Auth Error");
      return { success: false, error: authError?.message || "Authentication failed during signup" };
    }

    const id = authData.user.id;

    const profileFile = formData.get("profile_photo") as File | null;
    const epicFile = formData.get("epic_photo") as File | null;

    if (profileFile && profileFile.size > 0) {
      const v = await validateFileUpload(profileFile);
      if (!v.valid) return { success: false, error: v.error };
    }

    if (epicFile && epicFile.size > 0) {
      const v = await validateFileUpload(epicFile);
      if (!v.valid) return { success: false, error: v.error };
    }

    let profile_photo_key = null;
    let epic_photo_key = null;

    if (env.REPORTS_BUCKET) {
      if (profileFile && profileFile.size > 0) {
        const fileExt = profileFile.name.split('.').pop();
        const fileName = `members/profile_${id}.${fileExt}`;
        const arrayBuffer = await profileFile.arrayBuffer();
        await env.REPORTS_BUCKET.put(fileName, arrayBuffer, {
          httpMetadata: { contentType: profileFile.type }
        });
        profile_photo_key = fileName;
      }
      
      if (epicFile && epicFile.size > 0) {
        const fileExt = epicFile.name.split('.').pop();
        const fileName = `members/epic_${id}.${fileExt}`;
        const arrayBuffer = await epicFile.arrayBuffer();
        await env.REPORTS_BUCKET.put(fileName, arrayBuffer, {
          httpMetadata: { contentType: epicFile.type }
        });
        epic_photo_key = fileName;
      }
    }

    const result = await env.DB.prepare(
      `INSERT INTO nagrik_members (
        id, name, email, phone, dob, gender, guardian_name, address, state, vidhan_sabha,
        ward, pincode, is_registered_voter, is_indian_citizen, has_criminal_record, criminal_record_details, 
        is_other_party_member, other_party_name, epic_number, skills, social_media, referral_source, 
        referral_code, profile_photo_key, epic_photo_key, declaration_agreed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, d.name, d.email, d.phone, d.dob, d.gender, d.guardian_name, d.address, d.state, d.vidhan_sabha,
      d.ward, d.pincode, d.is_registered_voter, is_indian_citizen, has_criminal_record, d.criminal_record_details,
      d.is_other_party_member, d.other_party_name, d.epic_number, d.skills, d.social_media, d.referral_source, 
      d.referral_code, profile_photo_key, epic_photo_key, declaration_agreed
    ).run();

    if (!result.success) {
      logger.error("D1 Insert Error during signup");
      return { success: false, error: "Failed to store profile data" };
    }

    return { success: result.success, id };
  } catch (error) {
    logger.error({ err: error }, "Error in submitMember");
    return { success: false, error: "Internal Server Error" };
  }
}



// ─── REPORTS ────────────────────────────────────────────────────────────────────

export async function submitReport(formData: FormData) {
  try {
    const turnstileToken = formData.get('cf-turnstile-response') as string;
    if (!turnstileToken || !(await verifyTurnstile(turnstileToken))) {
      return { success: false, error: "CAPTCHA verification failed" };
    }

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`report_${ip}`, 5, 60000)) {
      return { success: false, error: "Too many requests, please try again later" };
    }

    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return { success: false, error: "Database not configured" };

    const id = crypto.randomUUID();
    const validationData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      ward: formData.get("ward") as string,
      category: formData.get("category") as string,
      severity: formData.get("severity") as string,
      description: formData.get("description") as string,
    };

    const parsed = submitReportSchema.safeParse(validationData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }
    const d = parsed.data;

    const file = formData.get("file") as File | null;

    if (file && file.size > 0) {
      const v = await validateFileUpload(file);
      if (!v.valid) return { success: false, error: v.error };
    }

    let photo_url = null;

    if (file && file.size > 0 && env.REPORTS_BUCKET) {
      const fileExt = file.name.split('.').pop();
      const fileName = `reports/${id}.${fileExt}`;
      const arrayBuffer = await file.arrayBuffer();

      await env.REPORTS_BUCKET.put(fileName, arrayBuffer, {
        httpMetadata: { contentType: file.type }
      });

      // R2 photo URL is stored as the key path — resolve via a worker or custom domain when serving
      photo_url = fileName;
    }

    const result = await env.DB.prepare(
      "INSERT INTO nagrik_reports (id, name, phone, ward, category, severity, description, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, d.name, d.phone, d.ward, d.category, d.severity, d.description, photo_url).run();

    return { success: result.success, id };
  } catch (error) {
    logger.error({ err: error }, "Error in submitReport");
    return { success: false, error: "Internal Server Error" };
  }
}

export async function getLiveIssues(limit: number = 10, offset: number = 0) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return [];

    const { results } = await env.DB.prepare(
      "SELECT * FROM nagrik_reports ORDER BY created_at DESC LIMIT ? OFFSET ?"
    ).bind(limit, offset).all<any>();

    return results;
  } catch {
    return [];
  }
}



// ─── DONATIONS ──────────────────────────────────────────────────────────────────

export async function submitDonation(data: { donor_name: string; amount: number; purpose: string; transaction_ref: string; turnstileToken: string }) {
  try {
    if (!data.turnstileToken || !(await verifyTurnstile(data.turnstileToken))) {
      return { success: false, error: "CAPTCHA verification failed" };
    }

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`donation_${ip}`, 5, 60000)) {
      return { success: false, error: "Too many requests, please try again later" };
    }

    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return { success: false, error: "Database not configured" };

    const parsed = submitDonationSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }
    const d = parsed.data;

    const id = crypto.randomUUID();
    const result = await env.DB.prepare(
      "INSERT INTO nagrik_donations (id, donor_name, amount, purpose, transaction_ref) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, d.donor_name, d.amount, d.purpose, d.transaction_ref).run();

    return { success: result.success, id };
  } catch (error) {
    logger.error({ err: error }, "Error in submitDonation");
    return { success: false, error: "Internal Server Error" };
  }
}

export async function getDonations() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return [];

    const { results } = await env.DB.prepare(
      "SELECT * FROM nagrik_donations ORDER BY created_at DESC LIMIT 20"
    ).all<any>();

    return results;
  } catch {
    return [];
  }
}

// ─── PRESS RELEASES ─────────────────────────────────────────────────────────────

export async function getPressReleases() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return [];

    const { results } = await env.DB.prepare(
      "SELECT * FROM nagrik_press_releases ORDER BY published_at DESC LIMIT 10"
    ).all<any>();

    return results;
  } catch {
    return [];
  }
}

// ─── LEADERS ────────────────────────────────────────────────────────────────────

export async function getLeaders() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return [];

    const { results } = await env.DB.prepare(
      "SELECT * FROM nagrik_leaders WHERE status = 'ACTIVE' ORDER BY joined_at DESC"
    ).all<any>();

    return results;
  } catch {
    return [];
  }
}

// ─── AGGREGATE STATS ────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return null;

    const [reports, volunteers, donations] = await Promise.all([
      env.DB.prepare("SELECT COUNT(*) as count FROM nagrik_reports").first<{ count: number }>(),
      env.DB.prepare("SELECT COUNT(*) as count FROM nagrik_members").first<{ count: number }>(),
      env.DB.prepare("SELECT COUNT(*) as count FROM nagrik_donations").first<{ count: number }>(),
    ]);

    return {
      reportCount: reports?.count ?? 0,
      volunteerCount: volunteers?.count ?? 0,
      donationCount: donations?.count ?? 0,
    };
  } catch {
    return null;
  }
}

// ─── AUTHENTICATION ─────────────────────────────────────────────────────────────

export async function sendLoginOtp(formData: FormData) {
  try {
    const phone = formData.get("phone") as string;
    
    if (!phone || phone.length < 10) {
      return { success: false, error: "Invalid phone number" };
    }

    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return { success: false, error: "Database not configured" };

    const user = await env.DB.prepare(
      `SELECT phone FROM nagrik_members WHERE phone = ?`
    ).bind(phone).first();

    if (!user) {
      return { success: false, error: "Phone number not registered" };
    }

    const supabase = await createClient();
    
    // We add +91 prefix if not present, assuming India phone numbers based on context,
    // or just let Supabase format it if user types it. We'll ensure it has a plus sign.
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: formattedPhone
    });

    if (otpError) {
      logger.error({ err: otpError }, "Supabase OTP Error");
      return { success: false, error: "Failed to send OTP" };
    }

    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "Error in sendLoginOtp");
    return { success: false, error: "Authentication failed" };
  }
}

export async function verifyLoginOtp(formData: FormData) {
  try {
    const phone = formData.get("phone") as string;
    const token = formData.get("token") as string;

    if (!phone || !token) {
      return { success: false, error: "Phone and OTP are required" };
    }

    const supabase = await createClient();
    
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: "sms"
    });

    if (verifyError) {
      logger.error({ err: verifyError }, "Supabase Verify OTP Error");
      return { success: false, error: "Invalid or expired OTP" };
    }

    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "Error in verifyLoginOtp");
    return { success: false, error: "Verification failed" };
  }
}

export async function getMemberData(id: string) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return null;

    return await env.DB.prepare(
      `SELECT id, name, phone, email, epic_number, is_indian_citizen, has_criminal_record, created_at, profile_photo_key, is_verified, didit_session_id 
       FROM nagrik_members WHERE id = ?`
    ).bind(id).first<any>();
  } catch (error) {
    return null;
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || !user.id) {
      return { success: false, error: "Not authenticated" };
    }

    const validationData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };

    const parsed = updateProfileSchema.safeParse(validationData);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }
    const d = parsed.data;

    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return { success: false, error: "Database not configured" };

    // Build dynamic update query based on provided fields
    const updates = [];
    const values = [];
    
    if (d.name) {
      updates.push("name = ?");
      values.push(d.name);
    }
    if (d.email !== undefined) { // allow empty string for email removal
      updates.push("email = ?");
      values.push(d.email);
    }
    if (d.phone) {
      updates.push("phone = ?");
      values.push(d.phone);
    }

    if (updates.length === 0) {
      return { success: true }; // nothing to update
    }

    values.push(user.id);
    const query = `UPDATE nagrik_members SET ${updates.join(", ")} WHERE id = ?`;

    const result = await env.DB.prepare(query).bind(...values).run();

    if (!result.success) {
      return { success: false, error: "Failed to update profile" };
    }

    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "Error in updateProfile");
    return { success: false, error: "Internal Server Error" };
  }
}
