import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  FileText,
  Upload,
  Eye,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { DocumentRecord } from "@/lib/types";

export function MemberDocumentVault() {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    if (!supabase) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setNeedsAuth(true);
      setLoading(false);
      return;
    }

    const { data, error: fetchErr } = await supabase
      .from("documents")
      .select("*, document_extractions(*)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!fetchErr && data) {
      setDocuments(data as DocumentRecord[]);
    }
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, docType: string = "other") {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", docType);

    try {
      const res = await fetch("/api/v1/documents/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      await loadDocuments();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload error");
    } finally {
      setUploading(false);
    }
  }

  async function viewDocument(docId: string) {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const res = await fetch("/api/v1/documents/signed-url", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentId: docId }),
      });

      const data = await res.json();
      if (res.ok && data.signed_url) {
        window.open(data.signed_url, "_blank");
      } else {
        alert(data.error || "Could not generate secure view URL.");
      }
    } catch (err) {
      alert("Error retrieving document link.");
    }
  }

  if (needsAuth) {
    return (
      <div className="card" style={{ padding: "40px 24px", textAlign: "center", background: "var(--paper-card)", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)", maxWidth: "580px", margin: "0 auto" }}>
        <FileText size={44} style={{ color: "var(--saffron)", margin: "0 auto 16px" }} />
        <h2 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", fontWeight: 700, marginBottom: "4px", color: "var(--ink)" }}>Sign In to Access Document Vault</h2>
        <div style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: "12px" }}>दस्तावेज़ वॉल्ट देखने के लिए लॉगिन करें</div>
        <p style={{ color: "var(--muted)", fontSize: "13.5px", maxWidth: "460px", margin: "0 auto 24px", lineHeight: 1.5 }}>
          Your uploaded documents are vaulted in private encrypted storage with cryptographic integrity hashes. Please sign in to access your records.
        </p>
        <a href="/login" className="button primary" style={{ minHeight: "44px", padding: "10px 24px", borderRadius: "3px", fontSize: "14px", fontWeight: 700 }}>
          Log In / प्रवेश करें
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "920px", margin: "0 auto" }}>
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          borderRadius: "4px",
          padding: "20px 24px",
          border: "1px solid var(--line-strong)",
          marginBottom: "24px",
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
            <h2 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
              Digital Document Vault
            </h2>
            <span
              style={{
                fontSize: "10.5px",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "2px",
                background: "rgba(22, 53, 92, 0.08)",
                border: "1px solid rgba(22, 53, 92, 0.25)",
                color: "var(--blue)",
                textTransform: "uppercase",
              }}
            >
              SHA-256 Vault
            </span>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: 0 }}>
            गोपनीय एन्क्रिप्टेड दस्तावेज़ वॉल्ट • SHA-256 अखंडता सत्यापन और विधिक साक्ष्य।
          </p>
        </div>

        <div>
          <input
            type="file"
            id="vault-upload"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(e) => handleUpload(e, "other")}
            style={{ display: "none" }}
            disabled={uploading}
          />
          <label
            htmlFor="vault-upload"
            className="button primary"
            style={{
              cursor: uploading ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              minHeight: "44px",
              padding: "10px 20px",
              fontSize: "13.5px",
              fontWeight: 700,
              borderRadius: "3px",
            }}
          >
            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
            Upload Document / दस्तावेज़ अपलोड करें
          </label>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "rgba(142, 38, 23, 0.06)",
            border: "1px solid rgba(142, 38, 23, 0.3)",
            borderRadius: "3px",
            color: "var(--red)",
            fontSize: "13.5px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
          <Loader2 className="animate-spin" size={32} style={{ margin: "0 auto 12px" }} />
          <div style={{ fontSize: "14px" }}>Accessing secure vault...</div>
        </div>
      ) : documents.length === 0 ? (
        <div
          className="card"
          style={{
            background: "var(--paper-card)",
            borderRadius: "4px",
            padding: "48px 24px",
            textAlign: "center",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow)",
          }}
        >
          <FileText size={44} style={{ color: "var(--muted)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: "18px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 4px", color: "var(--ink)" }}>No Documents in Vault</h3>
          <div style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: "12px" }}>वॉल्ट में कोई दस्तावेज़ नहीं है</div>
          <p style={{ color: "var(--muted)", fontSize: "13.5px", maxWidth: "440px", margin: "0 auto 20px", lineHeight: 1.5 }}>
            Identity proof and eligibility records uploaded during your digital induction will be securely archived here with audit hash verification.
          </p>
          <a href="/member/induction" className="button primary" style={{ minHeight: "44px", padding: "10px 24px", borderRadius: "3px", fontSize: "14px", fontWeight: 700 }}>
            Start Digital Induction / इंडक्शन शुरू करें
          </a>
        </div>
      ) : (
        <div className="card" style={{ background: "var(--paper-card)", borderRadius: "4px", border: "1px solid var(--line-strong)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--paper-subtle)", borderBottom: "1px solid var(--line-strong)", textAlign: "left" }}>
                  <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Document / दस्तावेज़</th>
                  <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Type / प्रकार</th>
                  <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>SHA-256 Hash</th>
                  <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Status / स्थिति</th>
                  <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 700, color: "var(--ink)" }}>{doc.original_filename}</div>
                      <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px", fontFamily: "var(--font-mono)" }}>
                        {(doc.file_size / 1024).toFixed(1)} KB • v{doc.current_version} • {new Date(doc.created_at).toLocaleDateString("en-IN")}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          padding: "3px 8px",
                          background: "var(--paper-subtle)",
                          borderRadius: "2px",
                          border: "1px solid var(--line)",
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {doc.document_type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)" }}>
                      {doc.sha256_hash.slice(0, 10)}...{doc.sha256_hash.slice(-8)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "2px",
                          fontSize: "10.5px",
                          fontWeight: 700,
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.03em",
                          backgroundColor:
                            doc.verification_status === "VERIFIED"
                              ? "rgba(29, 86, 53, 0.08)"
                              : doc.verification_status === "REJECTED"
                              ? "rgba(142, 38, 23, 0.08)"
                              : "rgba(179, 74, 21, 0.08)",
                          border:
                            doc.verification_status === "VERIFIED"
                              ? "1px solid rgba(29, 86, 53, 0.25)"
                              : doc.verification_status === "REJECTED"
                              ? "1px solid rgba(142, 38, 23, 0.25)"
                              : "1px solid rgba(179, 74, 21, 0.25)",
                          color:
                            doc.verification_status === "VERIFIED"
                              ? "var(--green)"
                              : doc.verification_status === "REJECTED"
                              ? "var(--red)"
                              : "var(--saffron)",
                        }}
                      >
                        {doc.verification_status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => viewDocument(doc.id)}
                        className="button"
                        style={{ minHeight: "36px", padding: "6px 14px", fontSize: "12px", borderRadius: "3px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
