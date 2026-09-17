import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/brand";
import type { MembershipApplication } from "@/lib/types";

export function VerifierDashboard() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<MembershipApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    if (!supabase) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/auth";
      return;
    }

    try {
      const res = await fetch("/api/v1/admin/verifications", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (res.ok && data.applications) {
        setApplications(data.applications);
        if (data.applications.length > 0 && !selectedApp) {
          setSelectedApp(data.applications[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(action: "APPROVE" | "REJECT" | "REQUEST_CORRECTION") {
    if (!selectedApp || !supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setActionLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/v1/admin/verifications", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          action,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      setFeedback({
        type: "success",
        message:
          action === "APPROVE"
            ? `Membership approved! Assigned Member ID: ${data.membership_id}`
            : action === "REJECT"
            ? "Application marked as rejected."
            : "Correction request recorded for applicant.",
      });

      setNotes("");
      await loadApplications();
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Action failed",
      });
    } finally {
      setActionLoading(false);
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
        alert(data.error || "Could not retrieve document");
      }
    } catch {
      alert("Error fetching document link");
    }
  }

  const filteredApps = applications.filter((app) => {
    if (filterStatus === "ALL") return true;
    return app.status === filterStatus;
  });

  if (loading) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <Loader2 className="animate-spin" size={32} style={{ margin: "0 auto 12px" }} />
        <div>Loading verification queue...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
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
          <h2 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 4px" }}>
            Verification Desk & Scrutiny Portal
          </h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
            Audit applicant declarations, verify uploaded evidence, and approve membership enrollments.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {["ALL", "SUBMITTED", "APPROVED", "NEEDS_CORRECTION", "REJECTED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className="button"
              style={{
                fontSize: "12px",
                padding: "6px 12px",
                background: filterStatus === st ? "var(--ink)" : "#fff",
                color: filterStatus === st ? "#fff" : "var(--ink)",
              }}
            >
              {st.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "10px",
            marginBottom: "20px",
            background: feedback.type === "success" ? "#f6ffed" : "#fff2f0",
            border: feedback.type === "success" ? "1px solid #b7eb8f" : "1px solid #ffccc7",
            color: feedback.type === "success" ? "#389e0d" : "#cf1322",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Split Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px" }}>
        {/* Left Queue List */}
        <div
          className="card"
          style={{
            background: "#fff",
            borderRadius: "16px",
            border: "1px solid var(--line)",
            padding: "16px",
            maxHeight: "750px",
            overflowY: "auto",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: "12px" }}>
            Queue ({filteredApps.length})
          </div>

          {filteredApps.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--muted)", fontSize: "14px" }}>
              No applications match this filter.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "8px" }}>
              {filteredApps.map((app) => {
                const addr = Array.isArray(app.member_addresses) ? app.member_addresses[0] : app.member_addresses;
                const isSelected = selectedApp?.id === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      setSelectedApp(app);
                      setFeedback(null);
                    }}
                    style={{
                      padding: "14px",
                      borderRadius: "10px",
                      border: isSelected ? `2px solid ${BRAND.colors.saffron}` : "1px solid var(--line)",
                      background: isSelected ? "rgba(245, 130, 32, 0.04)" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "14px" }}>{addr?.full_legal_name || "Applicant"}</strong>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "100px",
                          background:
                            app.status === "APPROVED"
                              ? "rgba(0, 135, 62, 0.1)"
                              : app.status === "REJECTED"
                              ? "rgba(255, 59, 48, 0.1)"
                              : "rgba(245, 130, 32, 0.1)",
                          color:
                            app.status === "APPROVED"
                              ? BRAND.colors.green
                              : app.status === "REJECTED"
                              ? "var(--red)"
                              : BRAND.colors.saffron,
                        }}
                      >
                        {app.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--muted)" }}>
                      {app.application_number} • {addr?.vidhan_sabha || "Delhi"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Detail Pane */}
        {selectedApp ? (
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid var(--line)",
              padding: "28px",
            }}
          >
            {/* Header of Detail */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <span style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Application {selectedApp.application_number}
                </span>
                <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "4px 0 0" }}>
                  {(() => {
                    const a = Array.isArray(selectedApp.member_addresses)
                      ? selectedApp.member_addresses[0]
                      : selectedApp.member_addresses;
                    return a?.full_legal_name || "Applicant Record";
                  })()}
                </h3>
              </div>

              <div style={{ fontSize: "12px", color: "var(--muted)", textAlign: "right" }}>
                <div>Applied: {selectedApp.submitted_at ? new Date(selectedApp.submitted_at).toLocaleDateString("en-IN") : "Draft"}</div>
                <div>Category: <strong>{selectedApp.membership_category}</strong></div>
              </div>
            </div>

            {/* Personal & Electoral Data Summary */}
            {(() => {
              const addr = Array.isArray(selectedApp.member_addresses)
                ? selectedApp.member_addresses[0]
                : selectedApp.member_addresses;
              const elec = Array.isArray(selectedApp.electoral_details)
                ? selectedApp.electoral_details[0]
                : selectedApp.electoral_details;

              return (
                <div
                  style={{
                    background: "var(--paper)",
                    padding: "20px",
                    borderRadius: "12px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                    fontSize: "13px",
                    marginBottom: "24px",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--muted)" }}>Guardian / Parent:</span>{" "}
                    <strong>{addr?.parent_or_guardian_name || "N/A"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>DOB / Gender:</span>{" "}
                    <strong>{addr?.date_of_birth} ({addr?.gender})</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Vidhan Sabha:</span>{" "}
                    <strong>{addr?.vidhan_sabha} AC, Ward: {addr?.ward || "N/A"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>PIN Code:</span>{" "}
                    <strong>{addr?.pincode}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>EPIC / Voter ID:</span>{" "}
                    <strong>{elec?.epic_number || "None provided"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)" }}>Proof Type:</span>{" "}
                    <strong>{elec?.identity_proof_type || "Voter ID"}</strong>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <span style={{ color: "var(--muted)" }}>Address:</span>{" "}
                    <strong>{addr?.address_line1}, {addr?.district}, Delhi</strong>
                  </div>
                </div>
              );
            })()}

            {/* Document Evidence & OCR Extraction */}
            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 12px" }}>
                Uploaded Evidence & OCR Extraction
              </h4>

              {selectedApp.documents && selectedApp.documents.length > 0 ? (
                <div style={{ display: "grid", gap: "12px" }}>
                  {selectedApp.documents.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        border: "1px solid var(--line)",
                        borderRadius: "10px",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "14px" }}>{doc.original_filename}</div>
                        <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px", fontFamily: "monospace" }}>
                          SHA-256: {doc.sha256_hash.slice(0, 16)}...
                        </div>
                        {doc.extractions && doc.extractions.length > 0 && (
                          <div style={{ marginTop: "8px", fontSize: "12px", background: "var(--paper)", padding: "6px 10px", borderRadius: "6px" }}>
                            <strong>OCR Extracted:</strong>{" "}
                            {doc.extractions.map((ex) => `${ex.field_name}: ${ex.extracted_value}`).join(" | ")}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => viewDocument(doc.id)}
                        className="button"
                        style={{ fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <Eye size={14} /> View Document
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "16px", background: "var(--paper)", borderRadius: "8px", color: "var(--muted)", fontSize: "13px" }}>
                  No documents linked to this application.
                </div>
              )}
            </div>

            {/* Notes & Actions */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Verification Notes / Scrutiny Remarks
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter observations, deficiency notice, or approval remarks..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--line)",
                  fontSize: "13px",
                  marginBottom: "16px",
                }}
              />

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleAction("REJECT")}
                  className="button"
                  style={{ color: "var(--red)", borderColor: "#ffccc7", background: "#fff" }}
                >
                  <XCircle size={16} /> Reject
                </button>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleAction("REQUEST_CORRECTION")}
                  className="button"
                  style={{ color: BRAND.colors.saffron, borderColor: "#ffe7ba", background: "#fff" }}
                >
                  <AlertCircle size={16} /> Request Correction
                </button>

                <button
                  type="button"
                  disabled={actionLoading || selectedApp.status === "APPROVED"}
                  onClick={() => handleAction("APPROVE")}
                  className="button primary"
                  style={{
                    background: BRAND.colors.green,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                  Approve Membership & Issue Card
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: "60px", textAlign: "center", background: "#fff", borderRadius: "16px" }}>
            Select an application to begin scrutiny.
          </div>
        )}
      </div>
    </div>
  );
}
