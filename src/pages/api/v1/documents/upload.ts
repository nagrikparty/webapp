import type { APIRoute } from "astro";
import { requireAuth, logAuditEvent } from "@/lib/auth";
import { createApiSupabase } from "@/lib/supabase";
import { GoogleGenAI } from "@google/genai";

async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const POST: APIRoute = async ({ request }) => {
  const authResult = await requireAuth(request);
  if ("response" in authResult) return authResult.response;
  const { ctx } = authResult;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const documentType = (formData.get("document_type") as string) || "identity_proof";
    const applicationId = (formData.get("application_id") as string) || null;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({
          error: "Unsupported file format. Please upload JPEG, PNG, WEBP, or PDF.",
        }),
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: "File size exceeds 5MB limit." }),
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Calculate SHA-256 hash for document integrity and traceability
    const sha256Hash = await sha256Hex(arrayBuffer);

    const scopedSupabase = createApiSupabase(ctx.token);
    if (!scopedSupabase) {
      return new Response(JSON.stringify({ error: "Database client unavailable" }), { status: 500 });
    }

    const replaceDocumentId = (formData.get("replace_document_id") as string) || null;
    const replacementReason = (formData.get("reason") as string) || "Updated document version";

    let documentId = replaceDocumentId || crypto.randomUUID();
    const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    let storagePath = "";
    let versionNumber = 1;

    if (replaceDocumentId) {
      // Version replacement workflow
      const { data: existingDoc, error: fetchErr } = await scopedSupabase
        .from("documents")
        .select("*")
        .eq("id", replaceDocumentId)
        .eq("user_id", ctx.user.id)
        .single();

      if (fetchErr || !existingDoc) {
        return new Response(JSON.stringify({ error: "Existing document not found or access denied" }), { status: 404 });
      }

      versionNumber = (existingDoc.current_version || 1) + 1;
      storagePath = `${ctx.user.id}/${replaceDocumentId}/v${versionNumber}.${extension}`;

      const { error: uploadError } = await scopedSupabase.storage
        .from("member-documents")
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error on replacement:", uploadError);
        return new Response(JSON.stringify({ error: "Failed to upload document version" }), { status: 500 });
      }

      await scopedSupabase.from("document_versions").insert({
        document_id: replaceDocumentId,
        version_number: versionNumber,
        storage_path: storagePath,
        sha256_hash: sha256Hash,
        file_size: file.size,
        uploaded_by: ctx.user.id,
        reason_for_replacement: replacementReason,
      });

      await scopedSupabase
        .from("documents")
        .update({
          current_version: versionNumber,
          storage_path: storagePath,
          sha256_hash: sha256Hash,
          file_size: file.size,
          original_filename: sanitizedFilename,
          mime_type: file.type,
          ocr_status: file.type.startsWith("image/") ? "PENDING" : "NOT_APPLICABLE",
          verification_status: "UPLOADED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", replaceDocumentId);

      await logAuditEvent(
        ctx.user.id,
        ctx.profile.role,
        "DOCUMENT_VERSION_CREATED",
        "documents",
        replaceDocumentId,
        {
          version_number: versionNumber,
          filename: sanitizedFilename,
          sha256: sha256Hash,
          size: file.size,
          reason: replacementReason,
        },
        request
      );
    } else {
      // Initial upload workflow
      storagePath = `${ctx.user.id}/${documentId}/original.${extension}`;

      const { error: uploadError } = await scopedSupabase.storage
        .from("member-documents")
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        return new Response(JSON.stringify({ error: "Failed to upload document to secure storage" }), {
          status: 500,
        });
      }

      const { data: docRecord, error: docError } = await scopedSupabase
        .from("documents")
        .insert({
          id: documentId,
          user_id: ctx.user.id,
          application_id: applicationId,
          document_type: documentType,
          original_filename: sanitizedFilename,
          mime_type: file.type,
          file_size: file.size,
          storage_path: storagePath,
          sha256_hash: sha256Hash,
          current_version: 1,
          ocr_status: file.type.startsWith("image/") ? "PENDING" : "NOT_APPLICABLE",
          verification_status: "UPLOADED",
        })
        .select()
        .single();

      if (docError || !docRecord) {
        console.error("Document DB insert error:", docError);
        return new Response(JSON.stringify({ error: "Failed to create document record" }), { status: 500 });
      }

      await scopedSupabase.from("document_versions").insert({
        document_id: documentId,
        version_number: 1,
        storage_path: storagePath,
        sha256_hash: sha256Hash,
        file_size: file.size,
        uploaded_by: ctx.user.id,
        reason_for_replacement: "Initial upload",
      });

      await logAuditEvent(
        ctx.user.id,
        ctx.profile.role,
        "DOCUMENT_UPLOADED",
        "documents",
        documentId,
        {
          document_type: documentType,
          filename: sanitizedFilename,
          sha256: sha256Hash,
          size: file.size,
        },
        request
      );
    }

    // Perform OCR extraction if image and Gemini API key is available
    const apiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const extractedFields: Record<string, string> = {};

    if (apiKey && file.type.startsWith("image/")) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const base64 = buffer.toString("base64");
        const promptText = `You are a document OCR assistant for civic membership records. Extract visible structured fields from this document (such as full name, date of birth / age, voter ID or EPIC number, address or constituency if present).
Return ONLY a valid JSON object:
{
  "full_name": "...",
  "date_of_birth": "...",
  "id_number": "...",
  "confidence": 0.95
}`;

        const aiResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                { inlineData: { data: base64, mimeType: file.type } },
                { text: promptText },
              ],
            },
          ],
        });

        let text = aiResponse.text || "";
        text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(text);

        if (parsed.full_name) {
          extractedFields["full_name"] = parsed.full_name;
          await scopedSupabase.from("document_extractions").insert({
            document_id: documentId,
            field_name: "full_name",
            extracted_value: parsed.full_name,
            confidence: parsed.confidence || 0.9,
            source: "gemini-2.5-flash",
          });
        }
        if (parsed.date_of_birth) {
          extractedFields["date_of_birth"] = parsed.date_of_birth;
          await scopedSupabase.from("document_extractions").insert({
            document_id: documentId,
            field_name: "date_of_birth",
            extracted_value: parsed.date_of_birth,
            confidence: parsed.confidence || 0.9,
            source: "gemini-2.5-flash",
          });
        }
        if (parsed.id_number) {
          extractedFields["id_number"] = parsed.id_number;
          await scopedSupabase.from("document_extractions").insert({
            document_id: documentId,
            field_name: "id_number",
            extracted_value: parsed.id_number,
            confidence: parsed.confidence || 0.9,
            source: "gemini-2.5-flash",
          });
        }

        await scopedSupabase
          .from("documents")
          .update({ ocr_status: "EXTRACTED", verification_status: "OCR_COMPLETE" })
          .eq("id", documentId);
      } catch (ocrErr) {
        console.warn("OCR extraction skipped or failed gracefully:", ocrErr);
        await scopedSupabase
          .from("documents")
          .update({ ocr_status: "FAILED" })
          .eq("id", documentId);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        document: {
          id: documentId,
          original_filename: sanitizedFilename,
          sha256_hash: sha256Hash,
          mime_type: file.type,
          file_size: file.size,
          storage_path: storagePath,
          extracted_fields: extractedFields,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    console.error("Document upload route error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }),
      { status: 500 }
    );
  }
};
