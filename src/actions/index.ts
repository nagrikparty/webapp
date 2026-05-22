"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createClient } from "@/lib/supabase/server";

// ─── CONTACT ────────────────────────────────────────────────────────────────────

export async function submitContact(data: { name: string; email: string; message: string }) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return { success: false, error: "Database not configured" };

    const id = crypto.randomUUID();
    const result = await env.DB.prepare(
      "INSERT INTO nagrik_contact_messages (id, name, email, message) VALUES (?, ?, ?, ?)"
    ).bind(id, data.name, data.email, data.message).run();

    return { success: result.success };
  } catch (error) {
    console.error("Error in submitContact:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

// ─── GEOGRAPHY ──────────────────────────────────────────────────────────────────

export async function getStates() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return [];
    
    const result = await env.DB.prepare("SELECT id, name, name_hi, serial_no FROM states ORDER BY serial_no ASC").all();
    return result.results || [];
  } catch (error) {
    console.error("Error fetching states:", error);
    return [];
  }
}

export async function getVidhanSabhas(stateId: string) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB || !stateId) return [];
    
    const result = await env.DB.prepare(
      "SELECT id, name, serial_no FROM vidhan_sabhas WHERE state_id = ? ORDER BY serial_no ASC"
    ).bind(stateId).all();
    return result.results || [];
  } catch (error) {
    console.error("Error fetching vidhan sabhas:", error);
    return [];
  }
}

export async function getWards(vidhanSabhaId: string) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB || !vidhanSabhaId) return [];
    
    const result = await env.DB.prepare(
      "SELECT id, name, serial_no FROM wards WHERE vidhan_sabha_id = ? ORDER BY serial_no ASC"
    ).bind(vidhanSabhaId).all();
    return result.results || [];
  } catch (error) {
    console.error("Error fetching wards:", error);
    return [];
  }
}

// ─── MEMBERS ──────────────────────────────────────────────────────────────────

export async function submitMember(formData: FormData) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return { success: false, error: "Database not configured" };

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const dob = formData.get("dob") as string;
    const gender = formData.get("gender") as string;
    const guardian_name = formData.get("guardian_name") as string;
    const address = formData.get("address") as string;
    const state = formData.get("state") as string;
    const vidhan_sabha = formData.get("vidhan_sabha") as string;
    const ward = formData.get("ward") as string;
    const pincode = formData.get("pincode") as string;
    const is_registered_voter = formData.get("is_registered_voter") as string;
    const is_indian_citizen = formData.get("is_indian_citizen") === 'yes' ? 1 : 0;
    const has_criminal_record = formData.get("has_criminal_record") === 'yes' ? 1 : 0;
    const criminal_record_details = formData.get("criminal_record_details") as string;
    const is_other_party_member = formData.get("is_other_party_member") as string;
    const other_party_name = formData.get("other_party_name") as string;
    const epic_number = formData.get("epic_number") as string;
    const skills = formData.get("skills") as string;
    const social_media = formData.get("social_media") as string;
    const referral_source = formData.get("referral_source") as string;
    const referral_code = formData.get("referral_code") as string;
    const password = formData.get("password") as string;
    const declaration_agreed = formData.get("declaration_agreed") === 'true' ? 1 : 0;
    
    const supabase = await createClient();
    
    // Create Supabase Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password || "defaultPassword123",
      options: {
        data: { name, phone }
      }
    });

    if (authError || !authData.user) {
      console.error("Supabase Auth Error:", authError);
      return { success: false, error: authError?.message || "Authentication failed during signup" };
    }

    const id = authData.user.id;

    const profileFile = formData.get("profile_photo") as File | null;
    const epicFile = formData.get("epic_photo") as File | null;

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
      id, name, email, phone, dob, gender, guardian_name, address, state, vidhan_sabha,
      ward, pincode, is_registered_voter, is_indian_citizen, has_criminal_record, criminal_record_details,
      is_other_party_member, other_party_name, epic_number, skills, social_media, referral_source, 
      referral_code, profile_photo_key, epic_photo_key, declaration_agreed
    ).run();

    if (!result.success) {
      // If DB fails, we should ideally rollback Supabase user, but for now we'll just log it.
      console.error("D1 Insert Error during signup");
      return { success: false, error: "Failed to store profile data" };
    }

    return { success: result.success, id };
  } catch (error) {
    console.error("Error in submitMember:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function getVolunteerCount() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return 0;

    const result = await env.DB.prepare("SELECT COUNT(*) as count FROM nagrik_members").first<{ count: number }>();
    return result?.count ?? 0;
  } catch {
    return 0;
  }
}

// ─── REPORTS ────────────────────────────────────────────────────────────────────

export async function submitReport(formData: FormData) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return { success: false, error: "Database not configured" };

    const id = crypto.randomUUID();
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const ward = formData.get("ward") as string;
    const category = formData.get("category") as string;
    const severity = formData.get("severity") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File | null;

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
    ).bind(id, name, phone, ward, category, severity, description, photo_url).run();

    return { success: result.success, id };
  } catch (error) {
    console.error("Error in submitReport:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function getLiveIssues() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return [];

    const { results } = await env.DB.prepare(
      "SELECT * FROM nagrik_reports ORDER BY created_at DESC LIMIT 10"
    ).all();

    return results;
  } catch {
    return [];
  }
}

export async function getReportCount() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return 0;

    const result = await env.DB.prepare("SELECT COUNT(*) as count FROM nagrik_reports").first<{ count: number }>();
    return result?.count ?? 0;
  } catch {
    return 0;
  }
}

// ─── DONATIONS ──────────────────────────────────────────────────────────────────

export async function submitDonation(data: { donor_name: string; amount: number; purpose: string; transaction_ref: string }) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return { success: false, error: "Database not configured" };

    const id = crypto.randomUUID();
    const result = await env.DB.prepare(
      "INSERT INTO nagrik_donations (id, donor_name, amount, purpose, transaction_ref) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, data.donor_name, data.amount, data.purpose, data.transaction_ref).run();

    return { success: result.success, id };
  } catch (error) {
    console.error("Error in submitDonation:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function getDonations() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return [];

    const { results } = await env.DB.prepare(
      "SELECT * FROM nagrik_donations ORDER BY created_at DESC LIMIT 20"
    ).all();

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
    ).all();

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
    ).all();

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

export async function loginMember(formData: FormData) {
  try {
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    if (!phone || !password) {
      return { success: false, error: "Phone and password are required" };
    }

    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return { success: false, error: "Database not configured" };

    const user = await env.DB.prepare(
      `SELECT email FROM nagrik_members WHERE phone = ?`
    ).bind(phone).first();

    if (!user || !user.email) {
      return { success: false, error: "Invalid phone or password" };
    }

    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email as string,
      password: password
    });

    if (signInError) {
      return { success: false, error: "Invalid phone or password" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in loginMember:", error);
    return { success: false, error: "Authentication failed" };
  }
}

export async function getMemberData(id: string) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (!env.DB) return null;

    return await env.DB.prepare(
      `SELECT id, name, phone, email, epic_number, is_indian_citizen, has_criminal_record, created_at, profile_photo_key, is_verified, didit_session_id 
       FROM nagrik_members WHERE id = ?`
    ).bind(id).first();
  } catch (error) {
    return null;
  }
}
