globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as submitMemberSchema } from '../../chunks/validations_DFcAlvCZ.mjs';
import { l as logger } from '../../chunks/logger_CkpZmJYy.mjs';
import { v as verifyTurnstile, c as checkRateLimit, a as validateFileUpload } from '../../chunks/_utils_DruJU8pL.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_DNSRmELw.mjs';

const POST = async (context) => {
  try {
    const formData = await context.request.formData();
    const env = context.locals.runtime.env;
    const turnstileToken = formData.get("cf-turnstile-response");
    if (!turnstileToken || !await verifyTurnstile(turnstileToken, env)) {
      return new Response(JSON.stringify({ success: false, error: "CAPTCHA verification failed" }), { status: 400 });
    }
    const ip = context.request.headers.get("x-forwarded-for") || "unknown";
    if (!await checkRateLimit(`member_${ip}`, 5, 6e4)) {
      return new Response(JSON.stringify({ success: false, error: "Too many requests, please try again later" }), { status: 429 });
    }
    if (!env.DB) return new Response(JSON.stringify({ success: false, error: "Database not configured" }), { status: 500 });
    const validationData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      dob: formData.get("dob"),
      gender: formData.get("gender"),
      guardian_name: formData.get("guardian_name"),
      address: formData.get("address"),
      state: formData.get("state"),
      vidhan_sabha: formData.get("vidhan_sabha"),
      ward: formData.get("ward"),
      pincode: formData.get("pincode"),
      is_registered_voter: formData.get("is_registered_voter"),
      is_indian_citizen: formData.get("is_indian_citizen"),
      has_criminal_record: formData.get("has_criminal_record"),
      criminal_record_details: formData.get("criminal_record_details"),
      is_other_party_member: formData.get("is_other_party_member"),
      other_party_name: formData.get("other_party_name"),
      epic_number: formData.get("epic_number"),
      skills: formData.get("skills"),
      social_media: formData.get("social_media"),
      referral_source: formData.get("referral_source"),
      referral_code: formData.get("referral_code"),
      password: formData.get("password"),
      declaration_agreed: formData.get("declaration_agreed")
    };
    const parsed = submitMemberSchema.safeParse(validationData);
    if (!parsed.success) {
      return new Response(JSON.stringify({ success: false, error: parsed.error.issues[0].message }), { status: 400 });
    }
    const d = parsed.data;
    const is_indian_citizen = d.is_indian_citizen === "yes" ? 1 : 0;
    const has_criminal_record = d.has_criminal_record === "yes" ? 1 : 0;
    const declaration_agreed = d.declaration_agreed === "true" ? 1 : 0;
    const supabase = context.locals.supabase;
    if (!supabase) {
      return new Response(JSON.stringify({ success: false, error: "Supabase not initialized" }), { status: 500 });
    }
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: d.email || `${d.phone}@nagrikparty.in`,
      // fallback if no email
      password: d.password,
      options: {
        data: { name: d.name, phone: d.phone }
      }
    });
    if (authError || !authData.user) {
      logger.error({ err: authError }, "Supabase Auth Error");
      return new Response(JSON.stringify({ success: false, error: authError?.message || "Authentication failed during signup" }), { status: 400 });
    }
    const id = authData.user.id;
    const profileFile = formData.get("profile_photo");
    const epicFile = formData.get("epic_photo");
    if (profileFile && profileFile.size > 0) {
      const v = await validateFileUpload(profileFile);
      if (!v.valid) return new Response(JSON.stringify({ success: false, error: v.error }), { status: 400 });
    }
    if (epicFile && epicFile.size > 0) {
      const v = await validateFileUpload(epicFile);
      if (!v.valid) return new Response(JSON.stringify({ success: false, error: v.error }), { status: 400 });
    }
    let profile_photo_key = null;
    let epic_photo_key = null;
    if (env.REPORTS_BUCKET) {
      if (profileFile && profileFile.size > 0) {
        const fileExt = profileFile.name.split(".").pop();
        const fileName = `members/profile_${id}.${fileExt}`;
        const arrayBuffer = await profileFile.arrayBuffer();
        await env.REPORTS_BUCKET.put(fileName, arrayBuffer, {
          httpMetadata: { contentType: profileFile.type }
        });
        profile_photo_key = fileName;
      }
      if (epicFile && epicFile.size > 0) {
        const fileExt = epicFile.name.split(".").pop();
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
      id,
      d.name,
      d.email,
      d.phone,
      d.dob,
      d.gender,
      d.guardian_name,
      d.address,
      d.state,
      d.vidhan_sabha,
      d.ward,
      d.pincode,
      d.is_registered_voter,
      is_indian_citizen,
      has_criminal_record,
      d.criminal_record_details,
      d.is_other_party_member,
      d.other_party_name,
      d.epic_number,
      d.skills,
      d.social_media,
      d.referral_source,
      d.referral_code,
      profile_photo_key,
      epic_photo_key,
      declaration_agreed
    ).run();
    if (!result.success) {
      logger.error("D1 Insert Error during signup");
      return new Response(JSON.stringify({ success: false, error: "Failed to store profile data" }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: result.success, id }), { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error in submitMember");
    return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
