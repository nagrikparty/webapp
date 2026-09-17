import React, { useEffect, useState } from "react";
import {
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Layers,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/brand";

interface Template {
  id: string;
  name: string;
  code: string;
  description: string;
  target_authority: string;
  is_active: boolean;
}

interface ExportItem {
  id: string;
  export_number: string;
  status: string;
  total_pages: number;
  file_storage_path: string;
  file_sha256: string;
  generated_at: string;
  submission_templates?: {
    title: string;
    code: string;
  };
}

export function AdminExportsView() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [exports, setExports] = useState<ExportItem[]>([]);
  const [approvedCount, setApprovedCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error("Database not connected");
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/auth?redirect=/admin/exports";
        return;
      }

      const res = await fetch("/api/v1/admin/exports", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load exports data");
      }

      const data = await res.json();
      setTemplates(data.templates || []);
      setExports(data.exports || []);
      setApprovedCount(data.approvedMemberCount || 0);
      if (data.templates?.length > 0 && !selectedTemplateId) {
        setSelectedTemplateId(data.templates[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading exports");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleGenerate() {
    if (!selectedTemplateId) return;
    setGenerating(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (!supabase) throw new Error("Database not connected");
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/auth";
        return;
      }

      const res = await fetch("/api/v1/admin/exports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ templateId: selectedTemplateId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate export bundle");
      }

      setSuccessMsg(
        `Export ${data.exportNumber} successfully generated! Continuous bundle: ${data.totalPages} pages.`
      );
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDownload(exportId: string, exportNumber: string) {
    try {
      if (!supabase) throw new Error("Database not connected");
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const res = await fetch(`/api/v1/admin/exports?download=${exportId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Download failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${exportNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not download file");
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <RefreshCw className="animate-spin" size={32} style={{ margin: "0 auto 16px" }} />
        <p style={{ color: "var(--muted)" }}>Loading submission compilation engine...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "28px" }}>
      {/* Top Banner */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, margin: 0 }}>
              Government Submission Export Engine
            </h2>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                background: "rgba(245, 130, 32, 0.1)",
                color: BRAND.colors.saffron,
                padding: "3px 8px",
                borderRadius: "6px",
              }}
            >
              FORMATION PHASE
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0, maxWidth: "680px" }}>
            Generate page-numbered continuous PDF dossiers for party registration filings, Delhi State
            committee registers, and official regulatory submissions.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              textAlign: "right",
              paddingRight: "16px",
              borderRight: "1px solid var(--line)",
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Approved Members
            </div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: BRAND.colors.green }}>
              {approvedCount}
            </div>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="button"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "14px 18px",
            backgroundColor: "#fff2f0",
            border: "1px solid #ffccc7",
            borderRadius: "10px",
            color: "#cf1322",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div
          style={{
            padding: "14px 18px",
            backgroundColor: "#f6ffed",
            border: "1px solid #b7eb8f",
            borderRadius: "10px",
            color: "#389e0d",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Generator Control Card */}
      <div
        className="card"
        style={{
          background: "#fff",
          padding: "24px 28px",
          borderRadius: "16px",
          border: "1px solid var(--line)",
        }}
      >
        <h3 style={{ fontSize: "17px", fontWeight: 800, margin: "0 0 16px" }}>
          Generate New Regulatory Bundle
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", alignItems: "end" }}>
          <div>
            <label
              htmlFor="template-select"
              style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}
            >
              Select Submission Dossier Template
            </label>
            <select
              id="template-select"
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                fontSize: "14px",
                background: "var(--paper)",
              }}
            >
              {templates.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name} ({tmpl.code}) — {tmpl.target_authority}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating || !selectedTemplateId}
              className="button primary"
              style={{
                width: "100%",
                padding: "12px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontWeight: 700,
              }}
            >
              {generating ? (
                <>
                  <RefreshCw className="animate-spin" size={16} /> Compiling Continuous PDF...
                </>
              ) : (
                <>
                  <Layers size={16} /> Compile & Generate Dossier
                </>
              )}
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            background: "var(--paper)",
            borderRadius: "8px",
            fontSize: "12px",
            color: "var(--muted)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ShieldCheck size={16} style={{ color: BRAND.colors.green }} />
          <span>
            Complies with Rule 19: generates single continuous page numbers (1..N), cover page, master register,
            and annexure schedule with SHA-256 cryptographic verification.
          </span>
        </div>
      </div>

      {/* Generated Exports History */}
      <div
        className="card"
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid var(--line)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, margin: 0 }}>
              Generated Submission Exports Archive
            </h3>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
              Official immutable bundles ready for physical stamping, filing, and audit
            </span>
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)" }}>
            {exports.length} Total Dossiers
          </span>
        </div>

        {exports.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted)" }}>
            <FileText size={40} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <p style={{ margin: 0 }}>No submission dossiers generated yet.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", textAlign: "left" }}>
                <th style={{ padding: "12px 20px" }}>Export Number</th>
                <th style={{ padding: "12px 20px" }}>Template / Dossier</th>
                <th style={{ padding: "12px 20px" }}>Total Pages</th>
                <th style={{ padding: "12px 20px" }}>Generated Date</th>
                <th style={{ padding: "12px 20px" }}>SHA-256 Checksum</th>
                <th style={{ padding: "12px 20px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exports.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "14px 20px", fontWeight: 700, fontFamily: "monospace" }}>
                    {item.export_number}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontWeight: 600 }}>
                      {item.submission_templates?.title || "Founding Member Dossier"}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                      {item.submission_templates?.code || "ECI-REG-01"}
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        background: "var(--paper)",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      {item.total_pages} Pages
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", color: "var(--muted)" }}>
                    {new Date(item.generated_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td style={{ padding: "14px 20px", fontFamily: "monospace", fontSize: "11px", color: "var(--muted)" }}>
                    {item.file_sha256 ? `${item.file_sha256.slice(0, 10)}...${item.file_sha256.slice(-8)}` : "Verified"}
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => handleDownload(item.id, item.export_number)}
                      className="button"
                      style={{
                        padding: "6px 14px",
                        fontSize: "12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Download size={14} /> Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
