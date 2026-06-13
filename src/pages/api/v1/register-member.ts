import type { APIRoute } from "astro";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import { GoogleGenAI } from "@google/genai";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const parent = formData.get("parent") as string;
    const dob = formData.get("dob") as string;
    const address = formData.get("address") as string;
    const lokSabha = formData.get("lok_sabha") as string;
    const vidhanSabha = formData.get("vidhan_sabha") as string;
    const ward = formData.get("ward") as string;
    const voter_id = formData.get("voter_id") as string;
    const declarationAgreed = formData.get("declaration_agreed") === "true";
    const referredBy = formData.get("referred_by") as string;
    const file = formData.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "Identity document is required" }), { status: 400 });
    }
    if (!voter_id) {
      return new Response(JSON.stringify({ error: "Voter ID is required" }), { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = file.type;

    const apiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
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
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: base64, mimeType } },
            { text: promptText }
          ]
        }
      ]
    });
    
    let text = response.text || "";
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    let visionResult;
    try {
      visionResult = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ error: "Failed to parse vision validation" }), { status: 500 });
    }

    const vision_validation_status = visionResult.isValid ? "success" : "failed";
    const vision_extracted_text = JSON.stringify(visionResult.extracted || {});

    let identity_doc_url = "";
    if (supabase) {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const { data, error } = await supabase.storage.from("documents").upload(fileName, file);
      if (!error && data) {
        identity_doc_url = data.path;
      }
    }

    const recordId = crypto.randomUUID();
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
      voter_id: voter_id,
      identity_doc_url,
      declaration_agreed: declarationAgreed,
      referred_by: referredBy || null,
      status: "pending",
      vision_extracted_text,
      vision_validation_status,
      created_at: new Date().toISOString()
    };

    if (!hasSupabaseConfig || !supabase) {
      console.log("No supabase configured, would have inserted:", record);
    } else {
      const { error } = await supabase.from("membership_applications").insert(record);
      if (error) {
         console.error("Insert error:", error);
         return new Response(JSON.stringify({ error: "Failed to save application to database" }), { status: 500 });
      }
    }

    return new Response(JSON.stringify({ success: true, id: recordId }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Registration error:", err);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};
