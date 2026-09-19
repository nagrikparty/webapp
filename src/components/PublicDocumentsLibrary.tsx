import React, { useEffect, useState } from "react";
import { FileText, ShieldCheck, Eye, Search, X, Copy, Check, ExternalLink, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/brand";

interface PublicDoc {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  file_storage_path: string;
  file_sha256: string;
  published_at: string;
  version: string;
}

const OFFICIAL_DOCS: PublicDoc[] = [
  {
    id: "doc-1",
    title: "Draft Constitution of Nagrik Party (Phase 1)",
    slug: "draft-constitution",
    category: "GOVERNANCE",
    description: "Fundamental constitutional charter outlining inner-party democracy, periodic presidential elections, national council, executive committees, and non-violence allegiance.",
    file_storage_path: "public-documents/draft-constitution-v1.pdf",
    file_sha256: "ee10e4b7da1ef761013fe9c0063db2500df79b75cd9c349d573c3adca899818d",
    published_at: "2025-01-01T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-2",
    title: "Concise Party Constitution & By-Laws",
    slug: "concise-constitution",
    category: "GOVERNANCE",
    description: "Summary companion handbook defining member rights, disciplinary tribunals, delegate election rules, and primary unit structures.",
    file_storage_path: "public-documents/concise-constitution-v1.pdf",
    file_sha256: "fefa23ab695c719a057b55a65d01b742ead32512889d07fe6b1d060274db06a0",
    published_at: "2025-01-01T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-3",
    title: "Formation Charter & Delhi 2025 Vision",
    slug: "founding-declaration",
    category: "GOVERNANCE",
    description: "Foundational declaration of intent, grassroots civic mandate, and Delhi 2025 systemic transformation vision.",
    file_storage_path: "public-documents/founding-declaration-v1.pdf",
    file_sha256: "17f8e7bd5993847c407946abcf8998ea7d43035d2957e7f89a46b7ef633e1b9d",
    published_at: "2025-01-01T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-4",
    title: "Minutes of the Founding General Body Meeting",
    slug: "founding-minutes",
    category: "GOVERNANCE",
    description: "Certified record of the inaugural convention adopting the party constitution and confirming founding office bearers.",
    file_storage_path: "public-documents/founding-minutes-v1.pdf",
    file_sha256: "e0a2d315c9419ce9fe06cab10abde7050306b3182a6348fbf60dd4f70f06734e",
    published_at: "2025-01-05T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-5",
    title: "Declaration of Peaceful Constitutional Political Functioning",
    slug: "peaceful-functioning-declaration",
    category: "GOVERNANCE",
    description: "Affidavit of strict adherence to democratic principles, constitutional supremacy, and non-violent civic advocacy.",
    file_storage_path: "public-documents/peaceful-functioning-declaration-v1.pdf",
    file_sha256: "4446325ef9e5865d5bc87b345a06c76eda84656df7a0b16e4d0b7d837c35f7e8",
    published_at: "2025-01-10T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-6",
    title: "Office Bearers & Leadership Structure Declaration",
    slug: "leadership-structure",
    category: "GOVERNANCE",
    description: "Certified list of current formation-stage leadership, including Founding Convener Arsalan Azad and executive coordinators.",
    file_storage_path: "public-documents/leadership-structure-v1.pdf",
    file_sha256: "d5de0a9cb4c3c2d44715054f4e19b5fcbe65ade682f0f2dbc3dab8b83d8c10b9",
    published_at: "2025-01-12T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-7",
    title: "National Executive Committee Resolution (Formation Phase)",
    slug: "nec-resolution",
    category: "GOVERNANCE",
    description: "Executive resolution establishing formation committees, digital membership verification rules, and financial scrutiny.",
    file_storage_path: "public-documents/nec-resolution-v1.pdf",
    file_sha256: "382eb8ab2acd8587f8610539b74f81980d5cc5752a31c2789daef825084a52f8",
    published_at: "2025-01-15T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-8",
    title: "Internal Election & Democratic Participation Framework",
    slug: "internal-election-framework",
    category: "GOVERNANCE",
    description: "Mandatory four-year internal election rules, secret ballot procedures, delegate verification, and Returning Officer authority.",
    file_storage_path: "public-documents/internal-election-framework-v1.pdf",
    file_sha256: "de2406c25967508f77cc4a891480d553c7be1af96dd1d17646b2153a26b38ccb",
    published_at: "2025-01-20T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-9",
    title: "Candidate Selection & Public Representation Policy",
    slug: "candidate-selection-policy",
    category: "GOVERNANCE",
    description: "Merit-based primary vetting policy for independent civic candidates, anti-nepotism rules, and public declaration of assets.",
    file_storage_path: "public-documents/candidate-selection-policy-v1.pdf",
    file_sha256: "11b0c839616aef725e1ac527ff23890ac7e8cf75ddc846b2755fa9687f751ebf",
    published_at: "2025-01-25T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-10",
    title: "Mandatory Declarations under Section 29A RPA 1951",
    slug: "rpa-declarations",
    category: "STATUTORY",
    description: "Statutory sworn declarations under the Representation of the People Act, 1951 for registration of political associations.",
    file_storage_path: "public-documents/rpa-declarations-v1.pdf",
    file_sha256: "816d6fb31e82e09adac3916092c55e5edf0893ed50f18adef91e91f653c19546",
    published_at: "2025-02-01T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-11",
    title: "Election Symbol Preference & Statutory Justification",
    slug: "symbol-preference-declaration",
    category: "STATUTORY",
    description: "Formal statement of preferred symbols from free symbol list with cultural/civic rationale as per Election Symbols Order 1968.",
    file_storage_path: "public-documents/symbol-preference-declaration-v1.pdf",
    file_sha256: "d891588b79429022a519251ac17938f1df0d1f10e9381dceb58dadd4abfb1fc3",
    published_at: "2025-02-05T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-12",
    title: "Membership Form & Constitutional Declaration Text",
    slug: "membership-form-declaration",
    category: "STATUTORY",
    description: "The verbatim 10-step induction oath, allegiance statement, and prohibited conduct commitments signed by all applicants.",
    file_storage_path: "public-documents/membership-form-declaration-v1.pdf",
    file_sha256: "e53d4700eb52457e252b48906c7bff45d8819df3dc38e6379a3572cdba751774",
    published_at: "2025-02-10T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-13",
    title: "Financial Transparency & Public Funding Framework",
    slug: "financial-transparency-framework",
    category: "FINANCE",
    description: "The zero-cash pledge, 100% digital bank accounts, real-time donation ledger, and open public transparency commitments.",
    file_storage_path: "public-documents/financial-transparency-framework-v1.pdf",
    file_sha256: "4b2013f8330cef87fb181de4f47eda40ddbe6ad302ce01904373a8ffd4bffac3",
    published_at: "2025-02-15T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-14",
    title: "Authorised Signatory & Treasury Governance Resolution",
    slug: "treasury-governance-resolution",
    category: "FINANCE",
    description: "Rules governing operational expenditures, two-tier signing authority, and mandatory annual external chartered accounting.",
    file_storage_path: "public-documents/treasury-governance-resolution-v1.pdf",
    file_sha256: "79e71f4b5566f097104072229f2bf4e683ad7523a5ef328ac4a74678705e0603",
    published_at: "2025-02-20T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-15",
    title: "National Manifesto & Delhi 2025 Transformation Agenda",
    slug: "national-manifesto",
    category: "POLICY",
    description: "Comprehensive policy programme covering clean water, broken roads, sanitation, electricity rights, and public accountability.",
    file_storage_path: "public-documents/national-manifesto-v1.pdf",
    file_sha256: "71aea6bda85497167b76b1b38800b2d9d598036a79807581596844251b8b3155",
    published_at: "2025-03-01T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-16",
    title: "Healthcare, Mental Health & Public Dignity Framework",
    slug: "healthcare-framework",
    category: "POLICY",
    description: "Universal primary healthcare access, community clinics, ambulance response standards, and psychiatric support systems.",
    file_storage_path: "public-documents/healthcare-framework-v1.pdf",
    file_sha256: "f44ba5026399a74782d9b89272f2f1a910bb18f358fbac87d85c7f702453904f",
    published_at: "2025-03-05T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-17",
    title: "Environment, Water & Civic Sustainability Framework",
    slug: "environment-water-framework",
    category: "POLICY",
    description: "Yamuna clean water remediation, Yamuna floodplains preservation, anti-smog enforcement, and decentralized solar initiatives.",
    file_storage_path: "public-documents/environment-water-framework-v1.pdf",
    file_sha256: "cbb5a7a65cedc2e3a9826a5b84631c40c44fb3c968893bda5292c12b5c597f41",
    published_at: "2025-03-10T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-18",
    title: "Legal Aid, Administrative Reform & Citizen Rights Framework",
    slug: "legal-aid-framework",
    category: "POLICY",
    description: "Pro bono citizen legal clinics, police accountability monitors, undertrial assistance, and consumer redressal reform.",
    file_storage_path: "public-documents/legal-aid-framework-v1.pdf",
    file_sha256: "60a9e86e95194ceebe09a77f70d0252aa1fde77b267f571811e9e1932f17d3e5",
    published_at: "2025-03-12T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-19",
    title: "Digital Governance, Privacy & Civic Technology Framework",
    slug: "digital-governance-framework",
    category: "POLICY",
    description: "Open-source citizen service architecture, zero-PII public reporting, cryptographic document hashing, and digital rights.",
    file_storage_path: "public-documents/digital-governance-framework-v1.pdf",
    file_sha256: "95b875229545dd28c28ba380159873d82c67bf37895eeb3db7fe5d1322e38407",
    published_at: "2025-03-15T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-20",
    title: "Education, Libraries & Skill Access Framework",
    slug: "education-libraries-framework",
    category: "POLICY",
    description: "24/7 public air-conditioned study libraries across every Delhi ward, school infrastructure audit, and vocational centers.",
    file_storage_path: "public-documents/education-libraries-framework-v1.pdf",
    file_sha256: "1a92c4abe3d85d61afdfec5513c87eb6c41d19324367795d28a3d8dbd7a47aa1",
    published_at: "2025-03-18T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-21",
    title: "Nasha Mukti & Substance Recovery Framework",
    slug: "nasha-mukti-framework",
    category: "POLICY",
    description: "Community de-addiction centers, rehabilitation pathways, illegal narcotics crackdown, and youth counseling programs.",
    file_storage_path: "public-documents/nasha-mukti-framework-v1.pdf",
    file_sha256: "567c6959e7f0307957f3134e0539cdf8f83974e90d97906b11601a8f10768def",
    published_at: "2025-03-20T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-22",
    title: "Senior Citizens Dignity & Social Security Framework",
    slug: "senior-citizens-pension-framework",
    category: "POLICY",
    description: "Universal monthly dignity pensions, doorstep medicine delivery, senior civic recreation clubs, and protection committees.",
    file_storage_path: "public-documents/senior-citizens-pension-framework-v1.pdf",
    file_sha256: "cd1620384b8b912466bbf558fd1028a94dbe806fed22de5d734c3c510a3f92e3",
    published_at: "2025-03-22T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-23",
    title: "Traders, Small Businesses & Street Vendors Protection Policy",
    slug: "traders-msme-revival-framework",
    category: "POLICY",
    description: "Single-window civic licensing, ending corruption and sealing distress, vendor vending zones, and market infrastructure upgrades.",
    file_storage_path: "public-documents/traders-msme-revival-framework-v1.pdf",
    file_sha256: "1f508cad71840ab31f7cdc8a0e548545d3833303986fe9847c8a95e3ee0cf1ab",
    published_at: "2025-03-25T00:00:00Z",
    version: "1.0",
  },
  {
    id: "doc-24",
    title: "Code of Ethics, Member Conduct & Anti-Corruption Compact",
    slug: "code-of-conduct",
    category: "ETHICS",
    description: "Ethical guidelines, zero criminal tolerance pledge, conflict of interest disclosures, and digital conduct rules for all members.",
    file_storage_path: "public-documents/code-of-conduct-v1.pdf",
    file_sha256: "43459523ae04d720e45f08b810aad688bfaaa8aa61c053f63a0368640849faa0",
    published_at: "2025-01-01T00:00:00Z",
    version: "1.0",
  }
];

const LEGAL_SLUG_MAP: Record<string, string> = {
  "draft-constitution": "/legal/constitution",
  "party-constitution": "/legal/constitution",
  "internal-rulebook": "/legal/rulebook",
  "code-of-conduct": "/legal/ethics",
  "data-protection-privacy": "/legal/digital-governance",
  "financial-transparency-framework": "/legal/financial-transparency",
  "candidate-selection-policy": "/legal/candidate-selection",
  "internal-election-framework": "/legal/internal-democracy",
  "official-communication-policy": "/legal/official-communication",
};

export function PublicDocumentsLibrary() {
  const [docs, setDocs] = useState<PublicDoc[]>(OFFICIAL_DOCS);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inspectDoc, setInspectDoc] = useState<PublicDoc | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    async function loadFromDB() {
      if (!supabase) return;
      try {
        const { data } = await supabase
          .from("public_documents")
          .select("*")
          .eq("is_active", true)
          .order("published_at", { ascending: true });

        if (data && data.length > 0) {
          // Merge DB docs with official catalog
          const dbSlugs = new Set(data.map((d: { slug: string }) => d.slug));
          const remaining = OFFICIAL_DOCS.filter((d) => !dbSlugs.has(d.slug));
          setDocs([...data, ...remaining]);
        }
      } catch (err) {
        console.error("Error checking DB public documents:", err);
      }
    }
    loadFromDB();
  }, []);

  const categories = ["ALL", "GOVERNANCE", "STATUTORY", "FINANCE", "POLICY", "ETHICS"];

  const filteredDocs = docs.filter((doc) => {
    const matchesCategory = selectedCategory === "ALL" || doc.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      {/* Header Banner */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          padding: "22px 26px",
          borderRadius: "4px",
          border: "1px solid var(--line-strong)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          boxShadow: "var(--shadow)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <ShieldCheck size={18} style={{ color: "var(--green)" }} />
            <h2 style={{ fontSize: "19px", fontWeight: 700, margin: 0, fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
              Official Charters & Policy Frameworks Archive
            </h2>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: 0 }}>
            Publicly inspectable founding charters, draft party constitution, statutory filings, and 9 sectoral frameworks.
          </p>
        </div>

        <span
          className="badge-citation"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            background: "var(--paper-subtle)",
            color: "var(--saffron)",
            borderColor: "rgba(232, 87, 26, 0.3)",
          }}
        >
          {docs.length} OFFICIAL CHARTERS PUBLISHED
        </span>
      </div>

      {/* Search and Filter Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className="button"
              style={{
                fontSize: "12px",
                padding: "4px 12px",
                minHeight: "36px",
                borderRadius: "3px",
                fontWeight: selectedCategory === cat ? 700 : 500,
                background: selectedCategory === cat ? "var(--ink)" : "var(--paper-card)",
                color: selectedCategory === cat ? "#fff" : "var(--ink-body)",
                borderColor: selectedCategory === cat ? "var(--ink)" : "var(--line-strong)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "min(100%, 240px)", flex: "1 1 200px" }}>
          <Search size={14} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--muted)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            style={{
              padding: "8px 12px 8px 34px",
              fontSize: "13px",
              borderRadius: "3px",
              border: "1px solid var(--line-strong)",
              background: "#ffffff",
              color: "var(--ink)",
              width: "100%",
              minHeight: "44px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Grid of Documents */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "18px" }}>
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "22px",
              borderRadius: "4px",
              border: "1px solid var(--line)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "var(--shadow)",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background:
                      doc.category === "GOVERNANCE"
                        ? "rgba(245, 130, 32, 0.1)"
                        : doc.category === "STATUTORY"
                        ? "rgba(0, 102, 204, 0.1)"
                        : doc.category === "FINANCE"
                        ? "rgba(0, 135, 62, 0.1)"
                        : "var(--paper)",
                    color:
                      doc.category === "GOVERNANCE"
                        ? BRAND.colors.saffron
                        : doc.category === "STATUTORY"
                        ? "#0066cc"
                        : doc.category === "FINANCE"
                        ? BRAND.colors.green
                        : "var(--ink)",
                  }}
                >
                  {doc.category}
                </span>
                <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600 }}>
                  v{doc.version}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "3px",
                    background: "var(--paper-subtle)",
                    color: "var(--saffron)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    border: "1px solid var(--line)",
                  }}
                >
                  <FileText size={18} />
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, lineHeight: 1.3, fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
                  {doc.title}
                </h3>
              </div>

              <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.5, margin: "0 0 16px" }}>
                {doc.description}
              </p>
            </div>

            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", marginTop: "12px" }}>
              <div
                className="badge-citation"
                style={{
                  fontSize: "10.5px",
                  display: "block",
                  color: "var(--muted)",
                  marginBottom: "12px",
                  wordBreak: "break-all",
                  padding: "4px 8px",
                }}
              >
                SHA-256: {doc.file_sha256.slice(0, 16)}...{doc.file_sha256.slice(-8)}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                  Published: {new Date(doc.published_at).toLocaleDateString("en-IN")}
                </span>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {LEGAL_SLUG_MAP[doc.slug] && (
                    <a
                      href={LEGAL_SLUG_MAP[doc.slug]}
                      className="button button-primary"
                      style={{
                        padding: "4px 10px",
                        fontSize: "11.5px",
                        minHeight: "32px",
                        borderRadius: "2px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <ExternalLink size={12} /> Read Charter
                    </a>
                  )}
                  <a
                    href={`/public-documents/${doc.slug}-v1.pdf`}
                    download={`${doc.slug}-v1.pdf`}
                    className="button"
                    style={{
                      padding: "4px 10px",
                      fontSize: "11.5px",
                      minHeight: "32px",
                      borderRadius: "2px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      textDecoration: "none",
                    }}
                    title="Download Official PDF Charter"
                  >
                    <Download size={12} /> PDF
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setInspectDoc(doc);
                      setCopiedHash(false);
                    }}
                    className="button"
                    style={{
                      padding: "4px 10px",
                      fontSize: "11.5px",
                      minHeight: "32px",
                      borderRadius: "2px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <Eye size={13} /> Inspect
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Inspection Modal */}
      {inspectDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="doc-inspect-title"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setInspectDoc(null);
          }}
        >
          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              border: "1px solid var(--line-strong)",
              borderRadius: "4px",
              padding: "28px",
              maxWidth: "580px",
              width: "100%",
              boxShadow: "var(--shadow-elevated)",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: "rgba(245, 130, 32, 0.1)",
                    color: "var(--saffron)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {inspectDoc.category} · v{inspectDoc.version}
                </span>
                <h3 id="doc-inspect-title" style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-serif)", margin: "10px 0 4px", color: "var(--ink)" }}>
                  {inspectDoc.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectDoc(null)}
                aria-label="Close"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted)",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.55, margin: "0 0 20px" }}>
              {inspectDoc.description}
            </p>

            <div style={{ background: "var(--paper-subtle)", border: "1px solid var(--line)", borderRadius: "3px", padding: "16px", marginBottom: "20px" }}>
              <div style={{ fontSize: "11.5px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--ink)", marginBottom: "6px", textTransform: "uppercase" }}>
                Cryptographic Integrity Record
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "10px", wordBreak: "break-all", fontFamily: "var(--font-mono)" }}>
                SHA-256: <strong>{inspectDoc.file_sha256}</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(inspectDoc.file_sha256);
                  setCopiedHash(true);
                  setTimeout(() => setCopiedHash(false), 2000);
                }}
                className="button"
                style={{ fontSize: "12px", padding: "4px 12px", minHeight: "32px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                {copiedHash ? <Check size={14} style={{ color: "var(--green)" }} /> : <Copy size={14} />}
                <span>{copiedHash ? "Checksum Copied" : "Copy Full SHA-256"}</span>
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                Published: {new Date(inspectDoc.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <a
                  href={`/public-documents/${inspectDoc.slug}-v1.pdf`}
                  download={`${inspectDoc.slug}-v1.pdf`}
                  className="button"
                  style={{
                    fontSize: "13px",
                    padding: "8px 16px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none",
                  }}
                >
                  <Download size={14} /> Download Verified PDF
                </a>
                {LEGAL_SLUG_MAP[inspectDoc.slug] && (
                  <a
                    href={LEGAL_SLUG_MAP[inspectDoc.slug]}
                    className="button button-primary"
                    style={{ fontSize: "13px", padding: "8px 16px" }}
                  >
                    Open Full Charter &rarr;
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setInspectDoc(null)}
                  className="button"
                  style={{ fontSize: "13px", padding: "8px 16px" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
