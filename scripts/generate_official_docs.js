import fs from "fs";
import path from "path";
import crypto from "crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const DOCS_METADATA = [
  {
    slug: "draft-constitution",
    title: "Draft Constitution of Nagrik Party (Phase 1)",
    category: "GOVERNANCE",
    version: "1.0",
    published_at: "2025-01-01T00:00:00Z",
    description: "Fundamental constitutional charter outlining inner-party democracy, periodic presidential elections, national council, executive committees, and non-violence allegiance.",
    clauses: [
      "Article 1 (Name & Character): The association is named Nagrik Party. It operates as a proposed political party in the Formation Phase under Section 29A RPA 1951.",
      "Article 2 (Allegiance): The party bears true faith and allegiance to the Constitution of India as by law established, and to the principles of socialism, secularism, and democracy.",
      "Article 3 (Sovereignty & Integrity): The party shall uphold the sovereignty, unity, and integrity of India at all times in all its organizational activities.",
      "Article 4 (Inner-Party Democracy): Mandatory periodic elections to all executive bodies and the office of Party President shall occur every four years through secret ballot.",
      "Article 5 (Organizational Bodies): The party structure comprises Primary Ward Units, Assembly Committees, State Councils, and the National Executive Committee.",
      "Article 6 (Membership Discipline): Any member convicted of a serious criminal offence or promoting hatred between communities shall face immediate suspension."
    ]
  },
  {
    slug: "concise-constitution",
    title: "Concise Party Constitution & By-Laws",
    category: "GOVERNANCE",
    version: "1.0",
    published_at: "2025-01-01T00:00:00Z",
    description: "Summary companion handbook defining member rights, disciplinary tribunals, delegate election rules, and primary unit structures.",
    clauses: [
      "Section 1: Member Bill of Rights: Equal voting rights for all verified members across Delhi municipal wards.",
      "Section 2: Disciplinary Tribunal: An independent three-member panel with sole jurisdiction over conduct violations.",
      "Section 3: Primary Unit Governance: Ward units meet monthly to review civic grievances and local initiatives.",
      "Section 4: Delegate Electoral College: Proportional delegate representation based on verified active primary members.",
      "Section 5: Amendments: Constitutional amendments require a two-thirds majority in the National Council."
    ]
  },
  {
    slug: "founding-declaration",
    title: "Formation Charter & Delhi 2025 Vision",
    category: "GOVERNANCE",
    version: "1.0",
    published_at: "2025-01-01T00:00:00Z",
    description: "Foundational declaration of intent, grassroots civic mandate, and Delhi 2025 systemic transformation vision.",
    clauses: [
      "Preamble: Resolution of the founding assembly to establish Nagrik Party in Phase 1 (Formation Phase).",
      "Mission 1: Uncompromised public service delivery across water, sanitation, clean air, and education in Delhi.",
      "Mission 2: Complete eradication of corruption through digital transparency and civic audits.",
      "Mission 3: Empowerment of municipal wards through direct participatory budgeting.",
      "Mission 4: Commitment to peaceful, legal, and constitutional methods in public advocacy."
    ]
  },
  {
    slug: "founding-minutes",
    title: "Minutes of the Founding General Body Meeting",
    category: "GOVERNANCE",
    version: "1.0",
    published_at: "2025-01-05T00:00:00Z",
    description: "Certified record of the inaugural convention adopting the party constitution and confirming founding office bearers.",
    clauses: [
      "Item 1: Adoption of the party name as 'Nagrik Party' and the declaration of the Formation Phase.",
      "Item 2: Unanimous adoption of the Draft Constitution in accordance with Section 29A RPA 1951.",
      "Item 3: Confirmation of founding conveners, state coordinators, and authorized signatories.",
      "Item 4: Authorization to initiate the statutory application process before the Election Commission of India.",
      "Item 5: Resolution approving zero-cash operations and digital banking protocols."
    ]
  },
  {
    slug: "peaceful-functioning-declaration",
    title: "Declaration of Peaceful Constitutional Political Functioning",
    category: "GOVERNANCE",
    version: "1.0",
    published_at: "2025-01-10T00:00:00Z",
    description: "Affidavit of strict adherence to democratic principles, constitutional supremacy, and non-violent civic advocacy.",
    clauses: [
      "Affidavit Paragraph 1: Nagrik Party solemnly affirms its commitment to non-violent, peaceful civic mobilization.",
      "Affidavit Paragraph 2: Under no circumstances shall the party or its representatives promote or endorse violence.",
      "Affidavit Paragraph 3: Complete respect for lawful assembly and regulatory permissions from civic authorities.",
      "Affidavit Paragraph 4: Rejection of communal discord, hate speech, or discriminatory political campaigns.",
      "Affidavit Paragraph 5: Commitment to resolution of public grievances through courts, petitions, and democratic assemblies."
    ]
  },
  {
    slug: "leadership-structure",
    title: "Office Bearers & Leadership Structure Declaration",
    category: "GOVERNANCE",
    version: "1.0",
    published_at: "2025-01-12T00:00:00Z",
    description: "Certified list of current formation-stage leadership, including Founding Convener Arsalan Azad and executive coordinators.",
    clauses: [
      "Role 1: Founding Convener: Oversees organization building and statutory registration compliance.",
      "Role 2: General Secretary (Administration): Manages membership verification, record keeping, and meetings.",
      "Role 3: Treasurer: Manages authorized banking, public accounts, and reconciliation audits.",
      "Role 4: Ward Coordinators: Frontline civic representatives across Delhi's 250 municipal wards.",
      "Role 5: Executive Committee: Collegial leadership body responsible for formation phase policies."
    ]
  },
  {
    slug: "nec-resolution",
    title: "National Executive Committee Resolution (Formation Phase)",
    category: "GOVERNANCE",
    version: "1.0",
    published_at: "2025-01-15T00:00:00Z",
    description: "Executive resolution establishing formation committees, digital membership verification rules, and financial scrutiny.",
    clauses: [
      "Resolution 1: Establishment of the Formation Scrutiny Committee to review voter registration records.",
      "Resolution 2: Implementation of cryptographic document hashing for all public charters and filings.",
      "Resolution 3: Requirement that all donations be received only via verified electronic bank transfers.",
      "Resolution 4: Adoption of strict digital privacy controls to protect member voter identification numbers.",
      "Resolution 5: Publication of monthly financial reconciliation statements on the public portal."
    ]
  },
  {
    slug: "internal-election-framework",
    title: "Internal Election & Democratic Participation Framework",
    category: "GOVERNANCE",
    version: "1.0",
    published_at: "2025-01-20T00:00:00Z",
    description: "Mandatory four-year internal election rules, secret ballot procedures, delegate verification, and Returning Officer authority.",
    clauses: [
      "Clause 1: Independent Election Authority: Appointed by the National Council with judicial independence.",
      "Clause 2: Secret Ballot: All voting for office bearers conducted by verified, tamper-proof secret ballot.",
      "Clause 3: Electoral Roll Publication: Member voter lists published 30 days prior to election date for scrutiny.",
      "Clause 4: Dispute Resolution: Time-bound 7-day appellate mechanism for nomination disputes.",
      "Clause 5: Term Limits: Consecutive presidential tenure limited to two terms (total eight years)."
    ]
  },
  {
    slug: "candidate-selection-policy",
    title: "Candidate Selection & Public Representation Policy",
    category: "GOVERNANCE",
    version: "1.0",
    published_at: "2025-01-25T00:00:00Z",
    description: "Merit-based primary vetting policy for independent civic candidates, anti-nepotism rules, and public declaration of assets.",
    clauses: [
      "Rule 1: Criminal Record Bar: Zero nominations for individuals charged with crimes of moral turpitude.",
      "Rule 2: Anti-Nepotism: Direct family relatives of current office bearers barred from single-ward preference.",
      "Rule 3: Asset Declaration: Mandatory public disclosure of candidate income, assets, and liabilities.",
      "Rule 4: Ward Primary Consultation: Candidates evaluated by vote and feedback of local primary members.",
      "Rule 5: Recall Mechanism: Clear framework for constituents to initiate internal performance reviews."
    ]
  },
  {
    slug: "rpa-declarations",
    title: "Mandatory Declarations under Section 29A RPA 1951",
    category: "STATUTORY",
    version: "1.0",
    published_at: "2025-02-01T00:00:00Z",
    description: "Statutory sworn declarations under the Representation of the People Act, 1951 for registration of political associations.",
    clauses: [
      "Declaration 1: Submitted under Section 29A, sub-section (5) of the Representation of the People Act, 1951.",
      "Declaration 2: Affirming absolute allegiance to the Constitution of India and national sovereignty.",
      "Declaration 3: Undertaking that no office bearer or member shall practice discrimination based on religion or caste.",
      "Declaration 4: Affirming that party membership is open to all adult citizens of India.",
      "Declaration 5: Verification of 100 registered proposers with valid Electoral Photo Identity Cards (EPIC)."
    ]
  },
  {
    slug: "symbol-preference-declaration",
    title: "Election Symbol Preference & Statutory Justification",
    category: "STATUTORY",
    version: "1.0",
    published_at: "2025-02-05T00:00:00Z",
    description: "Formal statement of preferred symbols from free symbol list with cultural/civic rationale as per Election Symbols Order 1968.",
    clauses: [
      "Section 1: Submitted in compliance with the Election Symbols (Reservation and Allotment) Order, 1968.",
      "Section 2: Selection strictly from the list of Free Symbols prescribed by the Election Commission of India.",
      "Section 3: First preference: Pen / Ink (representing civic education, lawful petitioning, and constitutional voice).",
      "Section 4: Second preference: Road Roller (representing civic infrastructure improvement and ground delivery).",
      "Section 5: Third preference: Water Tap (representing clean piped potable water for every Delhi household)."
    ]
  },
  {
    slug: "membership-form-declaration",
    title: "Membership Form & Constitutional Declaration Text",
    category: "STATUTORY",
    version: "1.0",
    published_at: "2025-02-10T00:00:00Z",
    description: "The verbatim 10-step induction oath, allegiance statement, and prohibited conduct commitments signed by all applicants.",
    clauses: [
      "Step 1: Declaration of Indian citizenship and age of majority (18+ years).",
      "Step 2: Affirmation of valid Voter ID (EPIC) registered in NCT of Delhi.",
      "Step 3: Solemn allegiance to the Constitution of India as established by law.",
      "Step 4: Affirmation that applicant is not a registered member of any other political party.",
      "Step 5: Zero tolerance pledge regarding criminal offences, violence, and hate speech.",
      "Step 6: Agreement that membership card is an organizational record, never a government-issued document."
    ]
  },
  {
    slug: "financial-transparency-framework",
    title: "Financial Transparency & Public Funding Framework",
    category: "FINANCE",
    version: "1.0",
    published_at: "2025-02-15T00:00:00Z",
    description: "The zero-cash pledge, 100% digital bank accounts, real-time donation ledger, and open public transparency commitments.",
    clauses: [
      "Pillar 1: Zero Cash Acceptance: 100% of party contributions accepted exclusively via digital banking rails.",
      "Pillar 2: Public Ledger: Every contribution published on the open website with masked PII for public audit.",
      "Pillar 3: Foreign Funds Prohibition: Total bar on receiving contributions from overseas corporate or state entities.",
      "Pillar 4: Expenditure Audits: All operational expenses logged and reconciled against official bank statements.",
      "Pillar 5: Statutory Filing: Timely annual audited accounts submitted to the ECI and tax authorities."
    ]
  },
  {
    slug: "treasury-governance-resolution",
    title: "Authorised Signatory & Treasury Governance Resolution",
    category: "FINANCE",
    version: "1.0",
    published_at: "2025-02-20T00:00:00Z",
    description: "Rules governing operational expenditures, two-tier signing authority, and mandatory annual external chartered accounting.",
    clauses: [
      "Section 1: Two-Tier Authorization: Operational expenditures above Rs. 10,000 require dual executive signatures.",
      "Section 2: Designated Banking Entity: Single national bank account maintained for all central formation funds.",
      "Section 3: Independent Statutory Auditor: Appointment of a certified chartered accountant not affiliated with party members.",
      "Section 4: Petty Cash Limits: Strict monthly cap of Rs. 5,000 for emergency field expenses with electronic receipts.",
      "Section 5: Quarterly Financial Disclosures: Mandatory quarterly balance sheets published for open scrutiny."
    ]
  },
  {
    slug: "national-manifesto",
    title: "National Manifesto & Delhi 2025 Transformation Agenda",
    category: "POLICY",
    version: "1.0",
    published_at: "2025-03-01T00:00:00Z",
    description: "Comprehensive policy programme covering clean water, broken roads, sanitation, electricity rights, and public accountability.",
    clauses: [
      "Water Supply: Piped, pressurized, clean potable tap water in every single unauthorized and authorized colony.",
      "Road Safety & Infrastructure: Pothole-free arterial and residential roads with strict contractor warranty clauses.",
      "Sanitation & Waste: Modern mechanized garbage collection and elimination of roadside open landfill dumps.",
      "Air Quality Emergency: Round-the-clock dust mitigation, public transit fleet expansion, and clean construction enforcement.",
      "Civic Governance: Direct ward-level citizen grievance redressal within a mandatory 48-hour response window."
    ]
  },
  {
    slug: "healthcare-framework",
    title: "Healthcare, Mental Health & Public Dignity Framework",
    category: "POLICY",
    version: "1.0",
    published_at: "2025-03-05T00:00:00Z",
    description: "Universal primary healthcare access, community clinics, ambulance response standards, and psychiatric support systems.",
    clauses: [
      "Standard 1: Guaranteed free generic essential medicines across all community primary health centers.",
      "Standard 2: 15-minute average emergency ambulance response across all 11 Delhi administrative districts.",
      "Standard 3: Dedicated mental health counseling and crisis helpline support integrated into municipal dispensaries.",
      "Standard 4: Strict price caps and audit inspections on private diagnostic pathology charges.",
      "Standard 5: Preventative health screening drives for elderly citizens and informal sector workers."
    ]
  },
  {
    slug: "environment-water-framework",
    title: "Environment, Water & Civic Sustainability Framework",
    category: "POLICY",
    version: "1.0",
    published_at: "2025-03-10T00:00:00Z",
    description: "Yamuna clean water remediation, Yamuna floodplains preservation, anti-smog enforcement, and decentralized solar initiatives.",
    clauses: [
      "Policy 1: 100% treatment of municipal sewage before discharge into stormwater drains or river channels.",
      "Policy 2: Preservation of the Yamuna floodplains as an inviolable ecological conservation zone.",
      "Policy 3: Rainwater harvesting mandate for all institutional, commercial, and large residential buildings.",
      "Policy 4: Micro-forest creation in high-density urban wards to combat local heat-island effects.",
      "Policy 5: Solar rooftop subsidies for low and middle-income residential welfare associations."
    ]
  },
  {
    slug: "legal-aid-framework",
    title: "Legal Aid, Administrative Reform & Citizen Rights Framework",
    category: "POLICY",
    version: "1.0",
    published_at: "2025-03-12T00:00:00Z",
    description: "Pro bono citizen legal clinics, police accountability monitors, undertrial assistance, and consumer redressal reform.",
    clauses: [
      "Program 1: Free pro bono weekly legal advisory clinics in all 70 Assembly Constituencies.",
      "Program 2: Legal assistance for indigent undertrials detained for minor compoundable infractions.",
      "Program 3: Citizen guidance counters in district consumer forums and electricity grievance tribunals.",
      "Program 4: Digital filing guidance for Right to Information (RTI) applications on civic projects.",
      "Program 5: Tenant and informal vendor protection against unlawful extortion and harassment."
    ]
  },
  {
    slug: "digital-governance-framework",
    title: "Digital Governance, Privacy & Civic Technology Framework",
    category: "POLICY",
    version: "1.0",
    published_at: "2025-03-15T00:00:00Z",
    description: "Open-source citizen service architecture, zero-PII public reporting, cryptographic document hashing, and digital rights.",
    clauses: [
      "Standard 1: Open source code for all public verification tools and civic trackers.",
      "Standard 2: Privacy by Design: Zero storage of sensitive biometric or identity card raw images on public servers.",
      "Standard 3: Cryptographic immutability: SHA-256 verification hashes published for all official declarations.",
      "Standard 4: High security authentication and role-based access control across all party administration systems.",
      "Standard 5: Zero proprietary software lock-in with open data formats for civic records."
    ]
  },
  {
    slug: "education-libraries-framework",
    title: "Education, Libraries & Skill Access Framework",
    category: "POLICY",
    version: "1.0",
    published_at: "2025-03-18T00:00:00Z",
    description: "24/7 public air-conditioned study libraries across every Delhi ward, school infrastructure audit, and vocational centers.",
    clauses: [
      "Initiative 1: Establishment of modern, quiet, air-conditioned public study spaces across all 250 wards.",
      "Initiative 2: High-speed free digital connectivity and examination preparation resources for youth.",
      "Initiative 3: Comprehensive civil infrastructure safety audits for all government and municipal schools.",
      "Initiative 4: Career guidance and modern vocational training workshops for high school graduates.",
      "Initiative 5: Neighborhood reading circles and digital literacy clinics for senior citizens."
    ]
  },
  {
    slug: "nasha-mukti-framework",
    title: "Nasha Mukti & Substance Recovery Framework",
    category: "POLICY",
    version: "1.0",
    published_at: "2025-03-20T00:00:00Z",
    description: "Community de-addiction centers, rehabilitation pathways, illegal narcotics crackdown, and youth counseling programs.",
    clauses: [
      "Pillar 1: Community-based humane rehabilitation centers with licensed medical supervision.",
      "Pillar 2: Total enforcement against illicit narcotics trafficking networks near schools and colleges.",
      "Pillar 3: Free family counseling and social re-integration support for recovering individuals.",
      "Pillar 4: Youth sports, athletics leagues, and creative recreation facilities in vulnerable wards.",
      "Pillar 5: De-stigmatization campaigns focusing on addiction as a public health issue rather than a moral failure."
    ]
  },
  {
    slug: "senior-citizens-pension-framework",
    title: "Senior Citizens Dignity & Social Security Framework",
    category: "POLICY",
    version: "1.0",
    published_at: "2025-03-22T00:00:00Z",
    description: "Universal monthly dignity pensions, doorstep medicine delivery, senior civic recreation clubs, and protection committees.",
    clauses: [
      "Measure 1: Timely, direct-to-bank monthly dignity pensions without administrative delays.",
      "Measure 2: Doorstep delivery of essential chronic medications for homebound elderly residents.",
      "Measure 3: Dedicated senior citizen desks in local police stations and district administration offices.",
      "Measure 4: Maintenance and protection of municipal parks with senior-accessible walking tracks.",
      "Measure 5: Rapid legal response against elder abuse and unauthorized property dispossession."
    ]
  },
  {
    slug: "traders-msme-revival-framework",
    title: "Traders, Small Businesses & Street Vendors Protection Policy",
    category: "POLICY",
    version: "1.0",
    published_at: "2025-03-25T00:00:00Z",
    description: "Single-window civic licensing, ending corruption and sealing distress, vendor vending zones, and market infrastructure upgrades.",
    clauses: [
      "Policy 1: Complete end to arbitrary sealing drives through clear regularization timelines.",
      "Policy 2: Transparent, digital single-window clearances for retail trade licenses and fire NOCs.",
      "Policy 3: Demarcation of designated vending zones under the Street Vendors Act with zero inspector harassment.",
      "Policy 4: Modernization of historical wholesale and retail markets with fire hydrants and clean public toilets.",
      "Policy 5: Equal representation of local market associations in ward-level trade advisory boards."
    ]
  },
  {
    slug: "code-of-conduct",
    title: "Code of Ethics, Member Conduct & Anti-Corruption Compact",
    category: "ETHICS",
    version: "1.0",
    published_at: "2025-01-01T00:00:00Z",
    description: "Ethical guidelines, zero criminal tolerance pledge, conflict of interest disclosures, and digital conduct rules for all members.",
    clauses: [
      "Article 1 (Integrity): Members shall never demand or accept bribes, favors, or improper gifts in public duties.",
      "Article 2 (Public Decorum): Responsible and truthful civic discourse in personal interactions and on digital media.",
      "Article 3 (Conflict of Interest): Mandatory disclosure of financial stakes in matters before civic committees.",
      "Article 4 (Zero Harassment): Total prohibition against gender discrimination, verbal abuse, or hostile behavior.",
      "Article 5 (Enforcement): Disciplinary actions range from formal warnings to expulsion and police referral if laws were breached."
    ]
  }
];

async function createDocPdf(doc) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Background / Margins
  const margin = 50;
  let y = 790;

  // Header Border / Brand Top Bar
  page.drawRectangle({
    x: margin,
    y: y - 4,
    width: 495,
    height: 4,
    color: rgb(0.96, 0.51, 0.13), // saffron
  });
  y -= 24;

  // Header Text
  page.drawText("NAGRIK PARTY", {
    x: margin,
    y: y,
    size: 20,
    font: fontBold,
    color: rgb(0.08, 0.08, 0.08),
  });

  page.drawText("PHASE 1 · FORMATION PHASE", {
    x: 340,
    y: y + 3,
    size: 9.5,
    font: fontBold,
    color: rgb(0.96, 0.51, 0.13),
  });

  y -= 14;
  page.drawText("Proposed Political Association · Regulated under Section 29A RPA 1951", {
    x: margin,
    y: y,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  y -= 12;
  page.drawLine({
    start: { x: margin, y: y },
    end: { x: 595.28 - margin, y: y },
    thickness: 0.75,
    color: rgb(0.85, 0.85, 0.85),
  });

  y -= 30;

  // Category Badge & Version
  page.drawRectangle({
    x: margin,
    y: y - 2,
    width: 76,
    height: 16,
    color: rgb(0.94, 0.94, 0.94),
  });
  page.drawText(doc.category, {
    x: margin + 8,
    y: y + 2,
    size: 8.5,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText(`Official Version: v${doc.version}  |  Published: ${doc.published_at.slice(0, 10)}`, {
    x: margin + 90,
    y: y + 2,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.4, 0.4),
  });

  y -= 32;

  // Document Title
  page.drawText(doc.title, {
    x: margin,
    y: y,
    size: 15,
    font: fontBold,
    color: rgb(0.08, 0.08, 0.08),
  });

  y -= 18;

  // Description / Scope
  const descWords = doc.description.split(" ");
  let descLine = "";
  for (const word of descWords) {
    if (descLine.length + word.length > 80) {
      page.drawText(descLine, { x: margin, y: y, size: 10, font: fontOblique, color: rgb(0.3, 0.3, 0.3) });
      y -= 14;
      descLine = word + " ";
    } else {
      descLine += word + " ";
    }
  }
  if (descLine) {
    page.drawText(descLine, { x: margin, y: y, size: 10, font: fontOblique, color: rgb(0.3, 0.3, 0.3) });
    y -= 18;
  }

  y -= 10;
  page.drawLine({
    start: { x: margin, y: y },
    end: { x: 595.28 - margin, y: y },
    thickness: 0.5,
    color: rgb(0.9, 0.9, 0.9),
  });
  y -= 25;

  // Clauses Section Header
  page.drawText("OFFICIAL CHARTER PROVISIONS & STATUTORY UNDERTAKINGS", {
    x: margin,
    y: y,
    size: 9.5,
    font: fontBold,
    color: rgb(0.15, 0.15, 0.15),
  });
  y -= 20;

  // Clauses
  for (const clause of doc.clauses) {
    const words = clause.split(" ");
    let line = "";
    let isFirst = true;

    for (const word of words) {
      if (line.length + word.length > 76) {
        page.drawText(line, {
          x: isFirst ? margin : margin + 12,
          y: y,
          size: 9.5,
          font: isFirst ? fontBold : fontRegular,
          color: rgb(0.12, 0.12, 0.12),
        });
        y -= 13;
        isFirst = false;
        line = word + " ";
      } else {
        line += word + " ";
      }
    }
    if (line) {
      page.drawText(line, {
        x: isFirst ? margin : margin + 12,
        y: y,
        size: 9.5,
        font: fontRegular,
        color: rgb(0.12, 0.12, 0.12),
      });
      y -= 18;
    }
  }

  // Footer / Verification Seal
  const footerY = 110;
  page.drawLine({
    start: { x: margin, y: footerY },
    end: { x: 595.28 - margin, y: footerY },
    thickness: 0.75,
    color: rgb(0.85, 0.85, 0.85),
  });

  page.drawText("CERTIFICATE OF PUBLIC RECORD & INTEGRITY", {
    x: margin,
    y: footerY - 18,
    size: 9,
    font: fontBold,
    color: rgb(0.08, 0.08, 0.08),
  });

  page.drawText("This document is an authentic organizational record of Nagrik Party (Formation Phase).", {
    x: margin,
    y: footerY - 32,
    size: 8.5,
    font: fontRegular,
    color: rgb(0.35, 0.35, 0.35),
  });

  page.drawText(`Canonical Slug: ${doc.slug}  |  Storage Path: public-documents/${doc.slug}-v1.pdf`, {
    x: margin,
    y: footerY - 44,
    size: 8,
    font: fontRegular,
    color: rgb(0.45, 0.45, 0.45),
  });

  page.drawText("Verified by Public Integrity Engine · Nagrik Party Open Civic Infrastructure", {
    x: margin,
    y: footerY - 56,
    size: 7.5,
    font: fontOblique,
    color: rgb(0.55, 0.55, 0.55),
  });

  return await pdfDoc.save();
}

async function main() {
  const outDir = path.resolve("public/public-documents");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log("Generating 24 official PDF documents and computing authentic SHA-256 hashes...");
  const processedDocs = [];

  for (const doc of DOCS_METADATA) {
    const pdfBytes = await createDocPdf(doc);
    const fileName = `${doc.slug}-v1.pdf`;
    const filePath = path.join(outDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(pdfBytes));

    const sha256 = crypto.createHash("sha256").update(Buffer.from(pdfBytes)).digest("hex");
    console.log(`Generated: ${fileName} -> SHA-256: ${sha256}`);

    processedDocs.push({
      ...doc,
      file_storage_path: `public-documents/${fileName}`,
      file_sha256: sha256
    });
  }

  // Write processed docs metadata to scratch for downstream updates
  fs.writeFileSync(
    "C:/Users/hudav/.gemini/antigravity/brain/3bdbea10-6f9c-47cb-b2c8-4300f99690a0/scratch/processed_docs.json",
    JSON.stringify(processedDocs, null, 2),
    "utf8"
  );

  console.log("All 24 documents generated and cryptographic hashes recorded!");
}

main().catch(console.error);
