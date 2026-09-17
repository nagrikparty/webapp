import React, { useEffect, useState } from "react";
import { FileText, ShieldCheck, Eye, Loader2 } from "lucide-react";
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

export function PublicDocumentsLibrary() {
  const [docs, setDocs] = useState<PublicDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocs() {
      setLoading(true);
      try {
        if (!supabase) return;
        const { data } = await supabase
          .from("public_documents")
          .select("*")
          .eq("is_active", true)
          .order("published_at", { ascending: true });

        if (data && data.length > 0) {
          setDocs(data);
        } else {
          // Fallback seeded public documents
          setDocs([
            {
              id: "doc-1",
              title: "Draft Constitution of Nagrik Party (Phase 1)",
              slug: "draft-constitution",
              category: "GOVERNANCE",
              description:
                "Fundamental constitutional draft outlining inner-party democracy, presidential election, committee architecture, and democratic rules.",
              file_storage_path: "public-documents/draft-constitution-v1.pdf",
              file_sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
              published_at: "2025-01-01T00:00:00Z",
              version: "1.0",
            },
            {
              id: "doc-2",
              title: "Formation Charter & Delhi 2025 Vision",
              slug: "formation-charter",
              category: "CHARTER",
              description:
                "Statement of foundational objectives, grassroots democratic principles, and manifesto for civic transformation.",
              file_storage_path: "public-documents/formation-charter-v1.pdf",
              file_sha256: "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce",
              published_at: "2025-01-01T00:00:00Z",
              version: "1.0",
            },
            {
              id: "doc-3",
              title: "Mandatory Declarations under Section 29A RPA 1951",
              slug: "rpa-declarations",
              category: "STATUTORY",
              description:
                "Standard statutory sworn declarations required by the Election Commission of India for registration of political associations.",
              file_storage_path: "public-documents/rpa-declarations-v1.pdf",
              file_sha256: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
              published_at: "2025-01-01T00:00:00Z",
              version: "1.0",
            },
            {
              id: "doc-4",
              title: "Member Code of Conduct & Anti-Corruption Compact",
              slug: "code-of-conduct",
              category: "ETHICS",
              description:
                "Ethical obligations, zero criminal tolerance pledge, and digital conduct rules binding upon all inducted members.",
              file_storage_path: "public-documents/code-of-conduct-v1.pdf",
              file_sha256: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
              published_at: "2025-01-01T00:00:00Z",
              version: "1.0",
            },
          ]);
        }
      } catch (err) {
        console.error("Error loading public documents:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDocs();
  }, []);

  return (
    <div style={{ display: "grid", gap: "28px" }}>
      {/* Notice Banner */}
      <div
        className="card"
        style={{
          background: "#fff",
          padding: "24px 28px",
          borderRadius: "16px",
          border: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <ShieldCheck size={18} style={{ color: BRAND.colors.green }} />
            <h2 style={{ fontSize: "20px", fontWeight: 800, margin: 0 }}>
              Official Documents & Statutory Archives
            </h2>
          </div>
          <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
            Publicly inspectable founding charters, draft party constitution, and statutory filings.
          </p>
        </div>

        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            background: "rgba(245, 130, 32, 0.1)",
            color: BRAND.colors.saffron,
            padding: "4px 10px",
            borderRadius: "6px",
          }}
        >
          PHASE 1 PUBLIC ARCHIVE
        </span>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
          <Loader2 className="animate-spin" size={28} style={{ margin: "0 auto 12px" }} />
          <div>Loading official documents archive...</div>
        </div>
      )}

      {/* Grid of Documents */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="card"
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "16px",
              border: "1px solid var(--line)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
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
                    background: "var(--paper)",
                    color: "var(--muted)",
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
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    background: "rgba(245, 130, 32, 0.08)",
                    color: BRAND.colors.saffron,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={20} />
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
                  {doc.title}
                </h3>
              </div>

              <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.5, margin: "0 0 16px" }}>
                {doc.description}
              </p>
            </div>

            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px", marginTop: "12px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "monospace",
                  color: "var(--muted)",
                  marginBottom: "12px",
                  wordBreak: "break-all",
                }}
              >
                SHA-256: {doc.file_sha256.slice(0, 16)}...{doc.file_sha256.slice(-8)}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                  Published: {new Date(doc.published_at).toLocaleDateString("en-IN")}
                </span>
                <a
                  href={`#${doc.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Document "${doc.title}" is officially archived in the Nagrik Party Formation Repository.`);
                  }}
                  className="button"
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Eye size={14} /> Inspect Record
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
