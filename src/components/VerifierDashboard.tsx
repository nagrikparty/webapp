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
        className="card"
        style={{
          background: "var(--paper-card)",
          borderRadius: "4px",
          padding: "20px 24px",
          border: "1px solid var(--line-strong)",
          boxShadow: "var(--shadow)",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <h2 style={{ fontSize: "21px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
              Verification Desk & Scrutiny Portal
            </h2>
            <span
              style={{
                fontSize: "10.5px",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "2px",
                background: "rgba(179, 74, 21, 0.08)",
                border: "1px solid rgba(179, 74, 21, 0.25)",
                color: "var(--saffron)",
                textTransform: "uppercase",
              }}
            >
              Audited Desk
            </span>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: 0 }}>
            दस्तावेज़ संवीक्षा और सत्यापन पीठ • Audit applicant declarations, inspect evidence hashes, and approve enrollments.
          </p>
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["ALL", "SUBMITTED", "APPROVED", "NEEDS_CORRECTION", "REJECTED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className="button"
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                padding: "6px 12px",
                borderRadius: "3px",
                background: filterStatus === st ? "var(--ink)" : "var(--paper-card)",
                color: filterStatus === st ? "#fff" : "var(--ink)",
                border: "1px solid var(--line-strong)",
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
            padding: "12px 16px",
            borderRadius: "3px",
            marginBottom: "20px",
            background: feedback.type === "success" ? "rgba(29, 86, 53, 0.08)" : "rgba(142, 38, 23, 0.08)",
            border: feedback.type === "success" ? "1px solid rgba(29, 86, 53, 0.3)" : "1px solid rgba(142, 38, 23, 0.3)",
            color: feedback.type === "success" ? "var(--green)" : "var(--red)",
            fontSize: "13.5px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Split Grid - Mobile First Responsive */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {/* Left Queue List */}
        <div
          className="card"
          style={{
            background: "var(--paper-card)",
            borderRadius: "4px",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow)",
            padding: "16px",
            maxHeight: "750px",
            overflowY: "auto",
          }}
        >
          <div style={{ fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase", marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
            <span>Queue / कतार ({filteredApps.length})</span>
            <span>FILTER: {filterStatus}</span>
          </div>

          {filteredApps.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--muted)", fontSize: "13.5px" }}>
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
                      padding: "12px 14px",
                      borderRadius: "3px",
                      border: isSelected ? "2px solid var(--saffron)" : "1px solid var(--line)",
                      background: isSelected ? "rgba(179, 74, 21, 0.05)" : "var(--paper-card)",
                      cursor: "pointer",
                      transition: "border-color 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "14px", color: "var(--ink)", fontFamily: "var(--font-serif)" }}>{addr?.full_legal_name || "Applicant"}</strong>
                      <span
                        style={{
                          fontSize: "10px",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "2px",
                          background:
                            app.status === "APPROVED"
                              ? "rgba(29, 86, 53, 0.08)"
                              : app.status === "REJECTED"
                              ? "rgba(142, 38, 23, 0.08)"
                              : "rgba(179, 74, 21, 0.08)",
                          border:
                            app.status === "APPROVED"
                              ? "1px solid rgba(29, 86, 53, 0.25)"
                              : app.status === "REJECTED"
                              ? "1px solid rgba(142, 38, 23, 0.25)"
                              : "1px solid rgba(179, 74, 21, 0.25)",
                          color:
                            app.status === "APPROVED"
                              ? "var(--green)"
                              : app.status === "REJECTED"
                              ? "var(--red)"
                              : "var(--saffron)",
                        }}
                      >
                        {app.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                      {app.application_number} • {addr?.vidhan_sabha || "Delhi"} AC
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
              background: "var(--paper-card)",
              borderRadius: "4px",
              border: "1px solid var(--line-strong)",
              boxShadow: "var(--shadow)",
              padding: "24px",
            }}
          >
            {/* Header of Detail */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  Docket: {selectedApp.application_number}
                </span>
                <h3 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "4px 0 0", color: "var(--ink)" }}>
                  {(() => {
                    const a = Array.isArray(selectedApp.member_addresses)
                      ? selectedApp.member_addresses[0]
                      : selectedApp.member_addresses;
                    return a?.full_legal_name || "Applicant Record";
                  })()}
                </h3>
              </div>

              <div style={{ fontSize: "12px", color: "var(--muted)", textAlign: "right", fontFamily: "var(--font-mono)" }}>
                <div>Applied: {selectedApp.submitted_at ? new Date(selectedApp.submitted_at).toLocaleDateString("en-IN") : "Draft"}</div>
                <div>Category: <strong style={{ color: "var(--ink)" }}>{selectedApp.membership_category}</strong></div>
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
                    background: "var(--paper-subtle)",
                    padding: "16px 18px",
                    borderRadius: "3px",
                    border: "1px solid var(--line-strong)",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "12px",
                    fontSize: "13px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>Guardian / Parent:</span>{" "}
                    <div style={{ fontWeight: 700, color: "var(--ink)" }}>{addr?.parent_or_guardian_name || "N/A"}</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>DOB / Gender:</span>{" "}
                    <div style={{ fontWeight: 700, color: "var(--ink)" }}>{addr?.date_of_birth} ({addr?.gender})</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>Vidhan Sabha / Ward:</span>{" "}
                    <div style={{ fontWeight: 700, color: "var(--ink)" }}>{addr?.vidhan_sabha} AC, Ward {addr?.ward || "N/A"}</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>PIN Code:</span>{" "}
                    <div style={{ fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-mono)" }}>{addr?.pincode}</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>EPIC / Voter ID:</span>{" "}
                    <div style={{ fontWeight: 700, color: "var(--saffron)", fontFamily: "var(--font-mono)" }}>{elec?.epic_number || "None provided"}</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>Proof Type:</span>{" "}
                    <div style={{ fontWeight: 700, color: "var(--ink)" }}>{elec?.identity_proof_type || "Voter ID"}</div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>Address:</span>{" "}
                    <div style={{ fontWeight: 600, color: "var(--ink)" }}>{addr?.address_line1}, {addr?.district}, Delhi</div>
                  </div>
                </div>
              );
            })()}

            {/* Document Evidence & OCR Extraction */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "14.5px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 10px", color: "var(--ink)" }}>
                Uploaded Evidence & OCR Extraction
              </h4>

              {selectedApp.documents && selectedApp.documents.length > 0 ? (
                <div style={{ display: "grid", gap: "10px" }}>
                  {selectedApp.documents.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        border: "1px solid var(--line-strong)",
                        borderRadius: "3px",
                        padding: "14px",
                        background: "var(--paper)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "13.5px", color: "var(--ink)" }}>{doc.original_filename}</div>
                        <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px", fontFamily: "var(--font-mono)" }}>
                          SHA-256: {doc.sha256_hash.slice(0, 16)}...
                        </div>
                        {doc.extractions && doc.extractions.length > 0 && (
                          <div style={{ marginTop: "6px", fontSize: "11.5px", background: "var(--paper-subtle)", padding: "4px 8px", borderRadius: "2px", border: "1px solid var(--line)", fontFamily: "var(--font-mono)" }}>
                            <strong>OCR Extracted:</strong>{" "}
                            {doc.extractions.map((ex) => `${ex.field_name}: ${ex.extracted_value}`).join(" | ")}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => viewDocument(doc.id)}
                        className="button"
                        style={{ minHeight: "36px", padding: "6px 12px", fontSize: "12px", borderRadius: "3px", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <Eye size={14} /> View Document
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "14px", background: "var(--paper-subtle)", borderRadius: "3px", color: "var(--muted)", fontSize: "13px", border: "1px solid var(--line)" }}>
                  No documents linked to this application.
                </div>
              )}
            </div>

            {/* Notes & Actions */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "18px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--muted)", marginBottom: "6px" }}>
                Verification Notes / Scrutiny Remarks
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter observations, deficiency notice, or approval remarks..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "3px",
                  border: "1px solid var(--line-strong)",
                  fontSize: "13.5px",
                  background: "var(--paper)",
                  color: "var(--ink)",
                  marginBottom: "16px",
                }}
              />

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleAction("REJECT")}
                  className="button"
                  style={{ minHeight: "42px", padding: "8px 16px", color: "var(--red)", borderColor: "rgba(142, 38, 23, 0.3)", background: "var(--paper-card)", borderRadius: "3px", fontSize: "13px", fontWeight: 700 }}
                >
                  <XCircle size={15} /> Reject
                </button>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleAction("REQUEST_CORRECTION")}
                  className="button"
                  style={{ minHeight: "42px", padding: "8px 16px", color: "var(--saffron)", borderColor: "rgba(179, 74, 21, 0.3)", background: "var(--paper-card)", borderRadius: "3px", fontSize: "13px", fontWeight: 700 }}
                >
                  <AlertCircle size={15} /> Request Correction
                </button>

                <button
                  type="button"
                  disabled={actionLoading || selectedApp.status === "APPROVED"}
                  onClick={() => handleAction("APPROVE")}
                  className="button primary"
                  style={{
                    minHeight: "42px",
                    padding: "8px 20px",
                    background: "var(--green)",
                    borderRadius: "3px",
                    fontSize: "13.5px",
                    fontWeight: 700,
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
          <div className="card" style={{ padding: "60px 24px", textAlign: "center", background: "var(--paper-card)", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)" }}>
            Select an application to begin scrutiny.
          </div>
        )}
      </div>
    </div>
  );
}
