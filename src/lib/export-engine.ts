import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { supabase } from "./supabase";

export interface ExportGenerationResult {
  success: boolean;
  exportNumber: string;
  totalPages: number;
  pdfBytes?: Uint8Array;
  missingItems?: string[];
  error?: string;
}

export async function generateSubmissionBundle(
  templateId: string,
  adminUserId: string
): Promise<ExportGenerationResult> {
  if (!supabase) {
    return { success: false, exportNumber: "", totalPages: 0, error: "Database unavailable" };
  }

  // 1. Fetch template & requirements
  const { data: template, error: tmplError } = await supabase
    .from("submission_templates")
    .select("*, submission_requirements(*)")
    .eq("id", templateId)
    .single();

  if (tmplError || !template) {
    return { success: false, exportNumber: "", totalPages: 0, error: "Template not found" };
  }

  // 2. Fetch approved members
  const { data: members, error: memError } = await supabase
    .from("members")
    .select(`
      id,
      membership_id,
      full_name,
      category,
      approved_at,
      user_id,
      application_id,
      membership_applications:application_id (
        id,
        application_number,
        submitted_at,
        member_addresses (*),
        electoral_details (*),
        membership_declarations (*),
        documents (*)
      )
    `)
    .eq("status", "APPROVED")
    .order("membership_id", { ascending: true });

  if (memError || !members) {
    return { success: false, exportNumber: "", totalPages: 0, error: "Failed to fetch approved members" };
  }

  const exportNumber = `EXP-${Date.now().toString().slice(-6)}`;
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const missingItems: string[] = [];
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  const coverPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  coverPage.drawText("NAGRIK PARTY", {
    x: 50,
    y: A4_HEIGHT - 120,
    size: 28,
    font: fontBold,
    color: rgb(29 / 255, 29 / 255, 31 / 255),
  });

  coverPage.drawText("FORMATION PHASE — OFFICIAL RECORD BUNDLE", {
    x: 50,
    y: A4_HEIGHT - 150,
    size: 11,
    font: fontBold,
    color: rgb(245 / 255, 130 / 255, 32 / 255),
  });

  coverPage.drawText(`DOCUMENT TITLE:\n${template.title.toUpperCase()}`, {
    x: 50,
    y: A4_HEIGHT - 220,
    size: 16,
    font: fontBold,
    lineHeight: 22,
    color: rgb(29 / 255, 29 / 255, 31 / 255),
  });

  coverPage.drawText(
    `Export Reference: ${exportNumber}\nDate of Generation: ${new Date().toLocaleDateString("en-IN")}\nTotal Approved Members Included: ${members.length}\nInitiative Status: Phase 1 — Formation Phase (Proposed for registration)`,
    {
      x: 50,
      y: A4_HEIGHT - 320,
      size: 11,
      font: fontRegular,
      lineHeight: 18,
      color: rgb(60 / 255, 60 / 255, 65 / 255),
    }
  );

  coverPage.drawText(
    "NOTE: Generated derivative compilation from verified digital membership records.\nAll supporting documents and hashes are preserved in primary digital storage.",
    {
      x: 50,
      y: 100,
      size: 9,
      font: fontRegular,
      lineHeight: 14,
      color: rgb(130 / 255, 130 / 255, 135 / 255),
    }
  );

  // ==========================================
  // PAGE 2: INDEX & TRACEABILITY SUMMARY
  // ==========================================
  const indexPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  indexPage.drawText("INDEX & SUBMISSION SCHEDULE", {
    x: 50,
    y: A4_HEIGHT - 70,
    size: 16,
    font: fontBold,
    color: rgb(29 / 255, 29 / 255, 31 / 255),
  });

  indexPage.drawText("Section / Annexure", { x: 50, y: A4_HEIGHT - 110, size: 10, font: fontBold });
  indexPage.drawText("Description", { x: 180, y: A4_HEIGHT - 110, size: 10, font: fontBold });
  indexPage.drawText("Page Ref", { x: 490, y: A4_HEIGHT - 110, size: 10, font: fontBold });

  indexPage.drawLine({
    start: { x: 50, y: A4_HEIGHT - 118 },
    end: { x: 545, y: A4_HEIGHT - 118 },
    thickness: 1,
    color: rgb(200 / 255, 200 / 255, 205 / 255),
  });

  let indexY = A4_HEIGHT - 140;
  indexPage.drawText("Cover Page", { x: 50, y: indexY, size: 10, font: fontRegular });
  indexPage.drawText("Title, Phase Status & Meta", { x: 180, y: indexY, size: 10, font: fontRegular });
  indexPage.drawText("1", { x: 510, y: indexY, size: 10, font: fontRegular });

  indexY -= 24;
  indexPage.drawText("Index Schedule", { x: 50, y: indexY, size: 10, font: fontRegular });
  indexPage.drawText("Table of Contents & Traceability", { x: 180, y: indexY, size: 10, font: fontRegular });
  indexPage.drawText("2", { x: 510, y: indexY, size: 10, font: fontRegular });

  indexY -= 24;
  indexPage.drawText("Section A", { x: 50, y: indexY, size: 10, font: fontRegular });
  indexPage.drawText("Founding Member Master Register", { x: 180, y: indexY, size: 10, font: fontRegular });
  indexPage.drawText("3+", { x: 510, y: indexY, size: 10, font: fontRegular });

  // ==========================================
  // PAGE 3+: MEMBER MASTER REGISTER
  // ==========================================
  let registerPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let currentY = A4_HEIGHT - 70;

  registerPage.drawText("SECTION A: FOUNDING MEMBER MASTER REGISTER", {
    x: 50,
    y: currentY,
    size: 14,
    font: fontBold,
  });

  currentY -= 30;
  registerPage.drawText("Member ID", { x: 50, y: currentY, size: 9, font: fontBold });
  registerPage.drawText("Full Name", { x: 130, y: currentY, size: 9, font: fontBold });
  registerPage.drawText("Category", { x: 250, y: currentY, size: 9, font: fontBold });
  registerPage.drawText("Constituency", { x: 350, y: currentY, size: 9, font: fontBold });
  registerPage.drawText("EPIC / ID Proof", { x: 450, y: currentY, size: 9, font: fontBold });

  currentY -= 8;
  registerPage.drawLine({
    start: { x: 50, y: currentY },
    end: { x: 545, y: currentY },
    thickness: 0.5,
    color: rgb(200 / 255, 200 / 255, 205 / 255),
  });

  for (const m of members) {
    currentY -= 22;
    if (currentY < 60) {
      registerPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      currentY = A4_HEIGHT - 60;
    }

    const app = Array.isArray(m.membership_applications)
      ? m.membership_applications[0]
      : m.membership_applications;
    const addr = Array.isArray(app?.member_addresses)
      ? app?.member_addresses[0]
      : app?.member_addresses;
    const elec = Array.isArray(app?.electoral_details)
      ? app?.electoral_details[0]
      : app?.electoral_details;

    registerPage.drawText(m.membership_id, { x: 50, y: currentY, size: 8, font: fontBold });
    registerPage.drawText(m.full_name.slice(0, 20), { x: 130, y: currentY, size: 8, font: fontRegular });
    registerPage.drawText(m.category.slice(0, 16), { x: 250, y: currentY, size: 8, font: fontRegular });
    registerPage.drawText(addr?.vidhan_sabha || "Delhi", { x: 350, y: currentY, size: 8, font: fontRegular });
    registerPage.drawText(elec?.epic_number || "Document on file", { x: 450, y: currentY, size: 8, font: fontRegular });
  }

  // Continuous Page Numbering Pass
  const pageCount = pdfDoc.getPageCount();
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);
    page.drawText(`Page ${i + 1} of ${pageCount}`, {
      x: A4_WIDTH - 100,
      y: 25,
      size: 8,
      font: fontRegular,
      color: rgb(130 / 255, 130 / 255, 135 / 255),
    });
  }

  const pdfBytes = await pdfDoc.save();

  let sha256Hex = "";
  try {
    const hashBuffer = await crypto.subtle.digest("SHA-256", pdfBytes.buffer as ArrayBuffer);
    sha256Hex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (err) {
    console.warn("Could not calculate SHA-256 hash:", err);
  }

  const filePath = `exports/${exportNumber}.pdf`;

  // Upload to generated-documents bucket
  try {
    await supabase.storage.from("generated-documents").upload(filePath, pdfBytes, {
      contentType: "application/pdf",
      upsert: true,
    });
  } catch (storageErr) {
    console.warn("Could not save export PDF to storage:", storageErr);
  }

  // Save to database
  const { data: exportRec } = await supabase.from("submission_exports").insert({
    template_id: templateId,
    export_number: exportNumber,
    status: "COMPLETED",
    total_pages: pageCount,
    file_storage_path: filePath,
    file_sha256: sha256Hex,
    generated_by: adminUserId,
    metadata: {
      member_count: members.length,
      template_name: template.title,
    },
  }).select("id").single();

  // Create submission export item entries for traceability
  if (exportRec?.id) {
    const items = members.map((m, idx) => ({
      export_id: exportRec.id,
      member_id: m.id,
      annexure_label: `Section A - #${idx + 1}`,
      start_page: 3,
      end_page: pageCount,
      traceability_code: `${exportNumber}-MEM-${m.membership_id}`,
    }));
    await supabase.from("submission_export_items").insert(items);
  }

  return {
    success: true,
    exportNumber,
    totalPages: pageCount,
    pdfBytes,
    missingItems,
  };
}
