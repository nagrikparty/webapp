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
        model: 'gemini-2.5-flash',
        contents: [
            {
                role: 'user',
                parts: [
                    { inlineData: { data: base64, mimeType } },
                    { text: 'Analyze this identity document (Aadhaar or Voter ID). Extract the following details: Full Name, Date of Birth (format: YYYY-MM-DD), and ID Number (EPIC number or Aadhaar number). Return ONLY a valid JSON object with the exact keys: "name", "dob", "idNumber", "type" (either "Voter ID" or "Aadhaar"). If the document is unreadable, invalid, or not an identity card, return exactly: {"error": "unreadable"}. Do not include markdown code block formatting.' }
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
    console.error("parse-id error:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Failed to parse identity document" }), { status: 500 });
  }
};
