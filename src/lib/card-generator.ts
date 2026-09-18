import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export interface CardData {
  membershipId: string;
  fullName: string;
  category: string;
  vidhanSabha: string;
  district: string;
  state: string;
  issueDate: string;
  verificationUrl: string;
  qrPngBase64?: string;
  photoPngBase64?: string;
}

// CR80 Dimensions in Points (1 point = 1/72 inch)
// 85.60 mm = 3.370 inches = 242.64 pt
// 53.98 mm = 2.125 inches = 153.00 pt
export const CR80_WIDTH = 242.64;
export const CR80_HEIGHT = 153.00;

export async function generateCR80CardPdf(data: CardData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ==========================================
  // PAGE 1: FRONT OF CR80 CARD
  // ==========================================
  const frontPage = pdfDoc.addPage([CR80_WIDTH, CR80_HEIGHT]);

  // White Card Background
  frontPage.drawRectangle({
    x: 0,
    y: 0,
    width: CR80_WIDTH,
    height: CR80_HEIGHT,
    color: rgb(1, 1, 1),
  });

  // Top Accent Tricolor Header Bands (Saffron and Green)
  frontPage.drawRectangle({
    x: 0,
    y: CR80_HEIGHT - 6,
    width: CR80_WIDTH / 2,
    height: 6,
    color: rgb(245 / 255, 130 / 255, 32 / 255), // Saffron
  });
  frontPage.drawRectangle({
    x: CR80_WIDTH / 2,
    y: CR80_HEIGHT - 6,
    width: CR80_WIDTH / 2,
    height: 6,
    color: rgb(0 / 255, 135 / 255, 62 / 255), // Green
  });

  // Header Title
  frontPage.drawText("NAGRIK PARTY", {
    x: 14,
    y: CR80_HEIGHT - 22,
    size: 13,
    font: fontBold,
    color: rgb(29 / 255, 29 / 255, 31 / 255),
  });

  // Phase Badge
  frontPage.drawText("FORMATION PHASE · MEMBERSHIP CARD", {
    x: 14,
    y: CR80_HEIGHT - 32,
    size: 5.5,
    font: fontBold,
    color: rgb(134 / 255, 134 / 255, 139 / 255),
  });

  // Horizontal separator line
  frontPage.drawLine({
    start: { x: 14, y: CR80_HEIGHT - 36 },
    end: { x: CR80_WIDTH - 14, y: CR80_HEIGHT - 36 },
    thickness: 0.5,
    color: rgb(220 / 255, 220 / 255, 225 / 255),
  });

  // Member Photo placeholder / box
  const photoBoxX = 14;
  const photoBoxY = 28;
  const photoBoxW = 60;
  const photoBoxH = 75;

  frontPage.drawRectangle({
    x: photoBoxX,
    y: photoBoxY,
    width: photoBoxW,
    height: photoBoxH,
    color: rgb(245 / 255, 245 / 255, 247 / 255),
    borderColor: rgb(200 / 255, 200 / 255, 205 / 255),
    borderWidth: 0.5,
  });

  if (data.photoPngBase64) {
    try {
      const cleanBase64 = data.photoPngBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      const photoBytes = Buffer.from(cleanBase64, "base64");
      const embeddedPhoto = await pdfDoc.embedPng(photoBytes);
      frontPage.drawImage(embeddedPhoto, {
        x: photoBoxX,
        y: photoBoxY,
        width: photoBoxW,
        height: photoBoxH,
      });
    } catch {
      // fallback to silhouette text
      frontPage.drawText("PHOTO", {
        x: photoBoxX + 18,
        y: photoBoxY + 35,
        size: 8,
        font: fontRegular,
        color: rgb(160 / 255, 160 / 255, 165 / 255),
      });
    }
  } else {
    frontPage.drawText("PHOTO", {
      x: photoBoxX + 18,
      y: photoBoxY + 35,
      size: 8,
      font: fontRegular,
      color: rgb(160 / 255, 160 / 255, 165 / 255),
    });
  }

  // Member Details Area (Right of Photo)
  const detailX = 84;
  let currentY = CR80_HEIGHT - 50;

  frontPage.drawText("MEMBER NAME", {
    x: detailX,
    y: currentY,
    size: 5.5,
    font: fontBold,
    color: rgb(134 / 255, 134 / 255, 139 / 255),
  });
  currentY -= 11;
  frontPage.drawText(data.fullName.toUpperCase(), {
    x: detailX,
    y: currentY,
    size: 9.5,
    font: fontBold,
    color: rgb(29 / 255, 29 / 255, 31 / 255),
  });

  currentY -= 14;
  frontPage.drawText("MEMBERSHIP ID", {
    x: detailX,
    y: currentY,
    size: 5.5,
    font: fontBold,
    color: rgb(134 / 255, 134 / 255, 139 / 255),
  });
  currentY -= 11;
  frontPage.drawText(data.membershipId, {
    x: detailX,
    y: currentY,
    size: 10,
    font: fontBold,
    color: rgb(245 / 255, 130 / 255, 32 / 255),
  });

  currentY -= 14;
  frontPage.drawText("CATEGORY", {
    x: detailX,
    y: currentY,
    size: 5.5,
    font: fontBold,
    color: rgb(134 / 255, 134 / 255, 139 / 255),
  });
  currentY -= 10;
  frontPage.drawText(data.category, {
    x: detailX,
    y: currentY,
    size: 8,
    font: fontRegular,
    color: rgb(29 / 255, 29 / 255, 31 / 255),
  });

  // Footer Tagline
  frontPage.drawText("Kaam dikhna chahiye.", {
    x: 14,
    y: 12,
    size: 7,
    font: fontBold,
    color: rgb(100 / 255, 100 / 255, 105 / 255),
  });

  // ==========================================
  // PAGE 2: BACK OF CR80 CARD
  // ==========================================
  const backPage = pdfDoc.addPage([CR80_WIDTH, CR80_HEIGHT]);

  backPage.drawRectangle({
    x: 0,
    y: 0,
    width: CR80_WIDTH,
    height: CR80_HEIGHT,
    color: rgb(1, 1, 1),
  });

  // Embed QR Code if provided
  const qrX = 14;
  const qrY = CR80_HEIGHT - 80;
  const qrSize = 65;

  if (data.qrPngBase64) {
    try {
      const cleanQr = data.qrPngBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      const qrBytes = Buffer.from(cleanQr, "base64");
      const embeddedQr = await pdfDoc.embedPng(qrBytes);
      backPage.drawImage(embeddedQr, {
        x: qrX,
        y: qrY,
        width: qrSize,
        height: qrSize,
      });
    } catch {
      backPage.drawRectangle({
        x: qrX,
        y: qrY,
        width: qrSize,
        height: qrSize,
        color: rgb(245 / 255, 245 / 255, 247 / 255),
        borderWidth: 0.5,
        borderColor: rgb(200 / 255, 200 / 255, 205 / 255),
      });
    }
  }

  // Right side details on back
  const backDetailX = 90;
  let backY = CR80_HEIGHT - 24;

  backPage.drawText("CONSTITUENCY / REGION", {
    x: backDetailX,
    y: backY,
    size: 5.5,
    font: fontBold,
    color: rgb(134 / 255, 134 / 255, 139 / 255),
  });
  backY -= 10;
  backPage.drawText(`${data.vidhanSabha} AC, ${data.district}`, {
    x: backDetailX,
    y: backY,
    size: 7.5,
    font: fontRegular,
    color: rgb(29 / 255, 29 / 255, 31 / 255),
  });

  backY -= 14;
  backPage.drawText("DATE OF ISSUE", {
    x: backDetailX,
    y: backY,
    size: 5.5,
    font: fontBold,
    color: rgb(134 / 255, 134 / 255, 139 / 255),
  });
  backY -= 10;
  backPage.drawText(data.issueDate, {
    x: backDetailX,
    y: backY,
    size: 7.5,
    font: fontRegular,
    color: rgb(29 / 255, 29 / 255, 31 / 255),
  });

  backY -= 14;
  backPage.drawText("VERIFICATION URL", {
    x: backDetailX,
    y: backY,
    size: 5.5,
    font: fontBold,
    color: rgb(134 / 255, 134 / 255, 139 / 255),
  });
  backY -= 10;
  backPage.drawText(data.verificationUrl, {
    x: backDetailX,
    y: backY,
    size: 6.5,
    font: fontRegular,
    color: rgb(0 / 255, 122 / 255, 255 / 255),
  });

  // Statutory Non-Government Identity Disclaimer (Bottom Box)
  backPage.drawRectangle({
    x: 10,
    y: 8,
    width: CR80_WIDTH - 20,
    height: 38,
    color: rgb(248 / 255, 248 / 255, 250 / 255),
    borderColor: rgb(230 / 255, 230 / 255, 235 / 255),
    borderWidth: 0.5,
  });

  backPage.drawText("ORGANISATIONAL MEMBERSHIP CARD • NOT A GOVERNMENT IDENTITY DOCUMENT", {
    x: 14,
    y: 36,
    size: 4.8,
    font: fontBold,
    color: rgb(100 / 255, 100 / 255, 105 / 255),
  });

  backPage.drawText(
    "This card certifies voluntary party enrollment during Phase 1 (Formation Phase). It does not substitute for\nany official photo identity card or electoral registration issued by the Government of India or ECI.\nWebsite: https://nagrik.party",
    {
      x: 14,
      y: 26,
      size: 4.5,
      font: fontRegular,
      lineHeight: 7,
      color: rgb(120 / 255, 120 / 255, 125 / 255),
    }
  );

  return await pdfDoc.save();
}
