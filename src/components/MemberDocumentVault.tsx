import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  FileText,
  Upload,
  Eye,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { BRAND } from "@/lib/brand";
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
      <div className="card" style={{ padding: "40px", textAlign: "center", background: "#fff", borderRadius: "16px", border: "1px solid var(--line)" }}>
        <FileText size={40} style={{ color: BRAND.colors.saffron, margin: "0 auto 16px" }} />
        <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "8px" }}>Sign In to Access Document Vault</h2>
        <p style={{ color: "var(--muted)", maxWidth: "480px", margin: "0 auto 24px" }}>
          Your uploaded documents are securely vaulted with encrypted storage. Please sign in to access your records.
        </p>
        <a href="/login" className="button button-primary" style={{ padding: "10px 24px" }}>
          Log In
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid var(--line)",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 4px" }}>
            Digital Document Vault
          </h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
            Encrypted private storage with SHA-256 integrity verification.
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
            style={{ cursor: uploading ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
            Upload Document
          </label>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#fff2f0",
            border: "1px solid #ffccc7",
            borderRadius: "8px",
            color: "#cf1322",
            fontSize: "14px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <Loader2 className="animate-spin" size={32} style={{ margin: "0 auto 12px" }} />
          <div>Accessing secure vault...</div>
        </div>
      ) : documents.length === 0 ? (
        <div
          className="card"
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "48px 24px",
            textAlign: "center",
            border: "1px solid var(--line)",
          }}
        >
          <FileText size={48} style={{ color: "var(--muted)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px" }}>No Documents in Vault</h3>
          <p style={{ color: "var(--muted)", fontSize: "14px", maxWidth: "420px", margin: "0 auto 20px" }}>
            Documents uploaded during digital induction or for identity verification will be securely stored here.
          </p>
          <a href="/member/induction" className="button primary">
            Start Digital Induction
          </a>
        </div>
      ) : (
        <div className="card" style={{ background: "#fff", borderRadius: "16px", border: "1px solid var(--line)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", textAlign: "left" }}>
                <th style={{ padding: "14px 16px" }}>Document</th>
                <th style={{ padding: "14px 16px" }}>Type</th>
                <th style={{ padding: "14px 16px" }}>SHA-256 Hash</th>
                <th style={{ padding: "14px 16px" }}>Status</th>
                <th style={{ padding: "14px 16px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 600 }}>{doc.original_filename}</div>
                    <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
                      {(doc.file_size / 1024).toFixed(1)} KB • v{doc.current_version} • {new Date(doc.created_at).toLocaleDateString("en-IN")}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        background: "var(--paper)",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {doc.document_type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontFamily: "monospace", fontSize: "11px", color: "var(--muted)" }}>
                    {doc.sha256_hash.slice(0, 10)}...{doc.sha256_hash.slice(-8)}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 8px",
                        borderRadius: "100px",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor:
                          doc.verification_status === "VERIFIED"
                            ? "rgba(0, 135, 62, 0.1)"
                            : doc.verification_status === "REJECTED"
                            ? "rgba(255, 59, 48, 0.1)"
                            : "rgba(245, 130, 32, 0.1)",
                        color:
                          doc.verification_status === "VERIFIED"
                            ? BRAND.colors.green
                            : doc.verification_status === "REJECTED"
                            ? "var(--red)"
                            : BRAND.colors.saffron,
                      }}
                    >
                      {doc.verification_status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => viewDocument(doc.id)}
                      className="button"
                      style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
