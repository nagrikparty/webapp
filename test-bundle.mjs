// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
var supabaseKey = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
var hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);
var supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseKey) : null;

// src/pages/api/register-member.ts
import { createClient as createClient2 } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
var POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const parent = formData.get("parent");
    const dob = formData.get("dob");
    const address = formData.get("address");
    const lokSabha = formData.get("lok_sabha");
    const vidhanSabha = formData.get("vidhan_sabha");
    const ward = formData.get("ward");
    const voter_id = formData.get("voter_id");
    const declarationAgreed = formData.get("declaration_agreed") === "true";
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "Identity document is required" }), { status: 400 });
    }
    if (!voter_id) {
      return new Response(JSON.stringify({ error: "Voter ID is required" }), { status: 400 });
    }
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = file.type;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), { status: 500 });
    const ai = new GoogleGenAI({ apiKey });
    const promptText = `You are an identity validation assistant. Below is an identity document and the user's provided details:
Name: [${name}]
DOB: [${dob}]
ID Number: [${voter_id}]

Tasks:
1) Extract the actual Name, DOB, and ID Number from the image.
2) Compare them against the user's provided details. Allow for minor variations (typos, date formats, translations).
3) Determine if it's a match.
Return ONLY a valid JSON object with exactly these keys:
{
  "extracted": { "name": "...", "dob": "...", "idNumber": "..." },
  "isValid": boolean,
  "reason": "..."
}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { data: base64, mimeType } },
            { text: promptText }
          ]
        }
      ]
    });
    let text = response.text || "";
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    let visionResult;
    try {
      visionResult = JSON.parse(text);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Failed to parse vision validation" }), { status: 500 });
    }
    const vision_validation_status = visionResult.isValid ? "success" : "failed";
    const vision_extracted_text = JSON.stringify(visionResult.extracted || {});
    let identity_doc_url = "";
    if (supabase) {
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
      const { data, error } = await supabase.storage.from("documents").upload(fileName, file);
      if (!error && data) {
        identity_doc_url = data.path;
      }
    }
    const recordId = "mem-" + Date.now();
    const record = {
      id: recordId,
      full_name: name,
      email,
      parent_or_spouse_name: parent,
      date_of_birth: dob,
      address,
      lok_sabha: lokSabha,
      vidhan_sabha: vidhanSabha,
      ward,
      voter_id,
      identity_doc_url,
      declaration_agreed: declarationAgreed,
      status: "pending",
      vision_extracted_text,
      vision_validation_status,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl2 = process.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
    const serverSupabase = supabaseUrl2 && serviceRoleKey ? createClient2(supabaseUrl2, serviceRoleKey) : supabase;
    if (serverSupabase) {
      const { error } = await serverSupabase.from("membership_applications").insert(record);
      if (error) {
        console.error("Insert error:", error);
        return new Response(JSON.stringify({ error: "Failed to save application to database" }), { status: 500 });
      }
    } else {
      console.log("No supabase, would have inserted:", record);
    }
    return new Response(JSON.stringify({ success: true, id: recordId }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Registration error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
export {
  POST
};
