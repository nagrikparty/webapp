import type { APIRoute } from "astro";
import { GoogleGenAI } from "@google/genai";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
    
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = file.type;

    const apiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), { status: 500 });

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [
            {
                role: 'user',
                parts: [
                    { inlineData: { data: base64, mimeType } },
                    { text: 'Analyze this Proposer form for a political candidate or party. Extract the handwritten or printed details into a JSON object. We need: "full_name" (name of proposer), "epic_number" (Voter ID number), "ward" (ward number/name), "vidhan_sabha" (Assembly constituency), "contact_number", "address". Return ONLY a valid JSON object with these keys. If a field is not found or empty, leave it as an empty string "". Do not include markdown code block formatting.' }
                ]
            }
        ]
    });
    
    let text = response.text || "";
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const data = JSON.parse(text);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: unknown) {
    console.error("parse-proposer error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to parse proposer form" }), { status: 500 });
  }
};
