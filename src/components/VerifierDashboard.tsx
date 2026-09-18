import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  Check,
  ShieldCheck,
  FileText,
  History,
  UserCheck,
  AlertTriangle,
  FileCheck,
  Lock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type {
  MembershipApplication,
  MemberAddress,
  ElectoralDetails,
  MembershipDeclaration,
  MembershipConsent,
  SignatureRecord,
  DocumentRecord,
  MembershipStatusHistoryItem,
} from "@/lib/types";

const getFirst = <T,>(val: T | T[] | null | undefined): T | null => {
  if (!val) return null;
  if (Array.isArray(val)) return val[0] || null;
  return val;
};

export function VerifierDashboard() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<MembershipApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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
    setCurrentUserId(session.user.id);

    try {
      const res = await fetch("/api/v1/admin/verifications", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (res.ok && data.applications) {
        setApplications(data.applications);
        if (data.applications.length > 0) {
          // Keep current selection if still in list, otherwise select first
          setSelectedApp((prev) => {
            if (!prev) return data.applications[0];
            const found = data.applications.find((a: MembershipApplication) => a.id === prev.id);
            return found || data.applications[0];
          });
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
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      setFeedback({
        type: "success",
        message:
          action === "APPROVE"
            ? `Membership approved! Issued Membership ID: ${data.membership_id}`
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
        <Loader2 className="animate-spin" size={32} style={{ margin: "0 auto 12px", color: "var(--saffron)" }} />
        <div style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "14px" }}>Loading verification queue...</div>
      </div>
    );
  }

  // Active item child data
  const addr = getFirst<MemberAddress>(selectedApp?.member_addresses);
  const elec = getFirst<ElectoralDetails>(selectedApp?.electoral_details);
  const decl = getFirst<MembershipDeclaration>(selectedApp?.membership_declarations);
  const consent = getFirst<MembershipConsent>(selectedApp?.membership_consents);
  const sig = getFirst<SignatureRecord>(selectedApp?.signatures);
  const docs = (selectedApp?.documents || []) as DocumentRecord[];
  const history = (selectedApp?.membership_status_history || []) as MembershipStatusHistoryItem[];

  const isSelf = Boolean(currentUserId && selectedApp?.user_id === currentUserId);
  const isApproved = selectedApp?.status === "APPROVED";

  // Statutory Scrutiny Checklist evaluation
  const checks = [
    {
      id: "name",
      label: "Full Legal Name & Parentage",
      pass: Boolean(addr?.full_legal_name && addr?.parent_or_guardian_name),
      detail: addr?.full_legal_name ? `${addr.full_legal_name} (${addr.parent_or_guardian_name || "Parent"})` : "Missing",
    },
    {
      id: "address",
      label: "Delhi Vidhan Sabha & Address",
      pass: Boolean(addr?.vidhan_sabha && addr?.address_line1 && addr?.pincode),
      detail: addr?.vidhan_sabha ? `${addr.vidhan_sabha} AC • PIN: ${addr.pincode}` : "Incomplete",
    },
    {
      id: "electoral",
      label: "Identity / Electoral Proof",
      pass: Boolean(elec?.identity_proof_type || (docs.length > 0)),
      detail: elec?.epic_number ? `EPIC: ${elec.epic_number}` : (elec?.identity_proof_type || (docs.length > 0 ? `${docs.length} Evidence File(s)` : "None provided")),
    },
    {
      id: "declaration",
      label: "Constitutional Affirmation (§29A RPA)",
      pass: Boolean(decl?.accepts_constitution && decl?.bears_true_faith && decl?.upholds_sovereignty && decl?.no_other_party_membership),
      detail: decl ? `Agreed on ${new Date(decl.agreed_at).toLocaleDateString("en-IN")}` : "Unrecorded",
    },
    {
      id: "consent",
      label: "DPDP Statutory Data Consent",
      pass: Boolean(consent?.agreed_at),
      detail: consent ? `Consented on ${new Date(consent.agreed_at).toLocaleDateString("en-IN")}` : "Unrecorded",
    },
    {
      id: "signature",
      label: "Typed Confirmation Signature",
      pass: Boolean(sig?.typed_name),
      detail: sig?.typed_name ? `"${sig.typed_name}" (${new Date(sig.signed_at).toLocaleDateString("en-IN")})` : "Missing",
    },
  ];

  const allChecksPassed = checks.every((c) => c.pass);

  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
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
            <ShieldCheck size={22} style={{ color: "var(--saffron)" }} />
            <h2 style={{ fontSize: "21px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
              Verification Desk & Statutory Scrutiny
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
            दस्तावेज़ संवीक्षा और सत्यापन पीठ • Audit applicant declarations, inspect evidence hashes, and verify enrollments against statutory standards.
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

      {/* Main Split Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "20px" }}>
        {/* Left Queue List */}
        <div
          className="card"
          style={{
            background: "var(--paper-card)",
            borderRadius: "4px",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow)",
            padding: "16px",
            maxHeight: "860px",
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
                const a = getFirst<MemberAddress>(app.member_addresses);
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
                      background: isSelected ? "rgba(179, 74, 21, 0.05)" : "var(--paper)",
                      cursor: "pointer",
                      transition: "border-color 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "14px", color: "var(--ink)", fontFamily: "var(--font-serif)" }}>{a?.full_legal_name || "Applicant"}</strong>
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
                              : app.status === "NEEDS_CORRECTION"
                              ? "rgba(179, 74, 21, 0.12)"
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
                      {app.application_number} • {a?.vidhan_sabha || "Delhi"} AC
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid var(--line)", paddingBottom: "16px" }}>
              <div>
                <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  Docket: {selectedApp.application_number}
                </span>
                <h3 style={{ fontSize: "22px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "4px 0 0", color: "var(--ink)" }}>
                  {addr?.full_legal_name || "Applicant Record"}
                </h3>
                <div style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "2px" }}>
                  {addr?.email} • {addr?.phone}
                </div>
              </div>

              <div style={{ fontSize: "12px", color: "var(--muted)", textAlign: "right", fontFamily: "var(--font-mono)" }}>
                <div>Applied: <strong style={{ color: "var(--ink)" }}>{selectedApp.submitted_at ? new Date(selectedApp.submitted_at).toLocaleDateString("en-IN") : "Draft"}</strong></div>
                <div>Category: <strong style={{ color: "var(--ink)" }}>{selectedApp.membership_category}</strong></div>
                <div>Status: <strong style={{ color: selectedApp.status === "APPROVED" ? "var(--green)" : "var(--saffron)" }}>{selectedApp.status}</strong></div>
              </div>
            </div>

            {/* Anti-Self-Approval Alert */}
            {isSelf && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "3px",
                  marginBottom: "20px",
                  background: "rgba(142, 38, 23, 0.08)",
                  border: "1px solid rgba(142, 38, 23, 0.3)",
                  color: "var(--red)",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Lock size={18} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Strict Governance Rule:</strong> Self-approval is strictly prohibited under party scrutiny regulations. Because this application belongs to your account, an independent verifier or administrator must complete this review.
                </span>
              </div>
            )}

            {/* Statutory Scrutiny Checklist */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h4 style={{ fontSize: "14.5px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: 0, color: "var(--ink)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <FileCheck size={16} style={{ color: allChecksPassed ? "var(--green)" : "var(--saffron)" }} />
                  Statutory Scrutiny Checklist (वैधानिक संवीक्षा जांच सूची)
                </h4>
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "3px",
                    background: allChecksPassed ? "rgba(29, 86, 53, 0.08)" : "rgba(179, 74, 21, 0.08)",
                    border: allChecksPassed ? "1px solid rgba(29, 86, 53, 0.3)" : "1px solid rgba(179, 74, 21, 0.3)",
                    color: allChecksPassed ? "var(--green)" : "var(--saffron)",
                  }}
                >
                  {checks.filter((c) => c.pass).length} / {checks.length} Checks Satisfied
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "8px" }}>
                {checks.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "3px",
                      border: item.pass ? "1px solid rgba(29, 86, 53, 0.2)" : "1px solid rgba(179, 74, 21, 0.25)",
                      background: item.pass ? "rgba(29, 86, 53, 0.03)" : "rgba(179, 74, 21, 0.03)",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                    }}
                  >
                    {item.pass ? (
                      <CheckCircle2 size={16} style={{ color: "var(--green)", flexShrink: 0, marginTop: "2px" }} />
                    ) : (
                      <AlertTriangle size={16} style={{ color: "var(--saffron)", flexShrink: 0, marginTop: "2px" }} />
                    )}
                    <div>
                      <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--ink)" }}>{item.label}</div>
                      <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                        {item.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal & Electoral Data Summary */}
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
                <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>Parent / Guardian:</span>
                <div style={{ fontWeight: 700, color: "var(--ink)" }}>{addr?.parent_or_guardian_name || "N/A"}</div>
              </div>
              <div>
                <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>DOB / Gender:</span>
                <div style={{ fontWeight: 700, color: "var(--ink)" }}>{addr?.date_of_birth} ({addr?.gender})</div>
              </div>
              <div>
                <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>Vidhan Sabha / Ward:</span>
                <div style={{ fontWeight: 700, color: "var(--ink)" }}>{addr?.vidhan_sabha} AC, Ward {addr?.ward || "N/A"}</div>
              </div>
              <div>
                <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>PIN Code / State:</span>
                <div style={{ fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-mono)" }}>{addr?.pincode} ({addr?.state || "Delhi"})</div>
              </div>
              <div>
                <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>EPIC / Voter ID:</span>
                <div style={{ fontWeight: 700, color: "var(--saffron)", fontFamily: "var(--font-mono)" }}>{elec?.epic_number || "None provided"}</div>
              </div>
              <div>
                <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>Proof Document:</span>
                <div style={{ fontWeight: 700, color: "var(--ink)" }}>{elec?.identity_proof_type || "Voter ID"}</div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <span style={{ color: "var(--muted)", fontSize: "11.5px" }}>Residential Address:</span>
                <div style={{ fontWeight: 600, color: "var(--ink)" }}>
                  {addr?.address_line1}{addr?.address_line2 ? `, ${addr.address_line2}` : ""}, {addr?.district}, {addr?.state || "Delhi"} - {addr?.pincode}
                </div>
              </div>
            </div>

            {/* Document Evidence & OCR Provenance Badges */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "14.5px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 10px", color: "var(--ink)", display: "flex", alignItems: "center", gap: "6px" }}>
                <FileText size={16} />
                Document Vault & Provenance Badges
              </h4>

              {docs.length > 0 ? (
                <div style={{ display: "grid", gap: "10px" }}>
                  {docs.map((doc) => (
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
                      <div style={{ flex: 1, minWidth: "260px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, fontSize: "13.5px", color: "var(--ink)" }}>{doc.original_filename}</span>
                          {/* Provenance Badges */}
                          <span
                            style={{
                              fontSize: "10px",
                              fontFamily: "var(--font-mono)",
                              padding: "1px 6px",
                              borderRadius: "2px",
                              background: "rgba(29, 86, 53, 0.08)",
                              border: "1px solid rgba(29, 86, 53, 0.25)",
                              color: "var(--green)",
                            }}
                          >
                            Source: Uploaded
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              fontFamily: "var(--font-mono)",
                              padding: "1px 6px",
                              borderRadius: "2px",
                              background: doc.ocr_status === "EXTRACTED" || doc.ocr_status === "CONFIRMED_BY_MEMBER" ? "rgba(29, 86, 53, 0.08)" : "rgba(179, 74, 21, 0.08)",
                              border: "1px solid var(--line)",
                              color: doc.ocr_status === "EXTRACTED" || doc.ocr_status === "CONFIRMED_BY_MEMBER" ? "var(--green)" : "var(--saffron)",
                            }}
                          >
                            OCR: {doc.ocr_status || "PENDING"}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              fontFamily: "var(--font-mono)",
                              padding: "1px 6px",
                              borderRadius: "2px",
                              background: "rgba(0, 0, 0, 0.04)",
                              border: "1px solid var(--line)",
                              color: "var(--muted)",
                            }}
                          >
                            Type: {doc.document_type}
                          </span>
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                          SHA-256: {doc.sha256_hash ? `${doc.sha256_hash.slice(0, 20)}...` : "Verified"} • {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : "Stored"}
                        </div>
                        {doc.extractions && doc.extractions.length > 0 && (
                          <div style={{ marginTop: "6px", fontSize: "11.5px", background: "var(--paper-subtle)", padding: "6px 10px", borderRadius: "2px", border: "1px solid var(--line)", fontFamily: "var(--font-mono)" }}>
                            <strong>OCR Extracted Fields:</strong>{" "}
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
                        <Eye size={14} /> View Evidence
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: "14px", background: "var(--paper-subtle)", borderRadius: "3px", color: "var(--muted)", fontSize: "13px", border: "1px solid var(--line)" }}>
                  No documents linked to this docket.
                </div>
              )}
            </div>

            {/* Declarations, Consents & Digital Signature */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "14px", marginBottom: "20px" }}>
              {/* Constitutional Affirmation */}
              <div style={{ padding: "14px", background: "var(--paper-subtle)", borderRadius: "3px", border: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <ShieldCheck size={16} style={{ color: decl?.accepts_constitution ? "var(--green)" : "var(--saffron)" }} />
                  <strong style={{ fontSize: "13px", color: "var(--ink)" }}>Statutory Affirmations (RPA 1951)</strong>
                </div>
                <div style={{ fontSize: "12px", color: "var(--ink)", lineHeight: 1.5 }}>
                  <div>✓ True faith and allegiance to the Constitution of India</div>
                  <div>✓ Principles of socialism, secularism, and democracy</div>
                  <div>✓ Upholds sovereignty, unity, and integrity of India</div>
                  <div>✓ No membership of any other political party</div>
                </div>
                <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                  {decl?.agreed_at ? `Agreed: ${new Date(decl.agreed_at).toLocaleString("en-IN")}` : "Not yet affirmed"}
                  {decl?.ip_address && ` • IP: ${decl.ip_address}`}
                </div>
              </div>

              {/* Digital Signature */}
              <div style={{ padding: "14px", background: "var(--paper-subtle)", borderRadius: "3px", border: "1px solid var(--line)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <UserCheck size={16} style={{ color: sig?.typed_name ? "var(--green)" : "var(--saffron)" }} />
                  <strong style={{ fontSize: "13px", color: "var(--ink)" }}>Digital Signature Record</strong>
                </div>
                <div style={{ fontSize: "13px", color: "var(--ink)", fontFamily: "var(--font-serif)", fontStyle: "italic", padding: "6px 10px", background: "var(--paper)", border: "1px solid var(--line-strong)", borderRadius: "2px" }}>
                  {sig?.typed_name ? `"${sig.typed_name}"` : "Awaiting signature"}
                </div>
                <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                  Type: {sig?.signature_type || "TYPED_CONFIRMATION"}
                  {sig?.signed_at && ` • Signed: ${new Date(sig.signed_at).toLocaleString("en-IN")}`}
                  {sig?.ip_address && ` • IP: ${sig.ip_address}`}
                </div>
              </div>
            </div>

            {/* Scrutiny Status History / Audit Trail */}
            {history.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "13.5px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 8px", color: "var(--ink)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <History size={15} style={{ color: "var(--muted)" }} />
                  Status History & Scrutiny Log
                </h4>
                <div style={{ border: "1px solid var(--line)", borderRadius: "3px", overflow: "hidden" }}>
                  {history.map((h, i) => (
                    <div
                      key={h.id || i}
                      style={{
                        padding: "8px 12px",
                        borderBottom: i < history.length - 1 ? "1px solid var(--line)" : "none",
                        fontSize: "12px",
                        background: "var(--paper)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--ink)" }}>
                          {h.previous_status || "INIT"} ➔ {h.new_status}
                        </span>
                        {h.reason && <span style={{ color: "var(--muted)", marginLeft: "8px" }}>• {h.reason}</span>}
                      </div>
                      <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                        {new Date(h.created_at).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verifier Notes & Action Bar */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "18px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--muted)", marginBottom: "6px" }}>
                Verification Notes / Deficiency Observations
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter statutory scrutiny observations, specific document deficiencies, or approval remarks..."
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
                  disabled={actionLoading || isSelf}
                  onClick={() => handleAction("REJECT")}
                  className="button"
                  style={{ minHeight: "42px", padding: "8px 16px", color: "var(--red)", borderColor: "rgba(142, 38, 23, 0.3)", background: "var(--paper-card)", borderRadius: "3px", fontSize: "13px", fontWeight: 700, cursor: isSelf ? "not-allowed" : "pointer" }}
                >
                  <XCircle size={15} /> Reject
                </button>

                <button
                  type="button"
                  disabled={actionLoading || isSelf}
                  onClick={() => handleAction("REQUEST_CORRECTION")}
                  className="button"
                  style={{ minHeight: "42px", padding: "8px 16px", color: "var(--saffron)", borderColor: "rgba(179, 74, 21, 0.3)", background: "var(--paper-card)", borderRadius: "3px", fontSize: "13px", fontWeight: 700, cursor: isSelf ? "not-allowed" : "pointer" }}
                >
                  <AlertCircle size={15} /> Request Correction
                </button>

                <button
                  type="button"
                  disabled={actionLoading || isApproved || isSelf || !allChecksPassed}
                  onClick={() => handleAction("APPROVE")}
                  className="button primary"
                  title={
                    isSelf
                      ? "Self-approval is prohibited"
                      : !allChecksPassed
                      ? "Statutory scrutiny items incomplete"
                      : ""
                  }
                  style={{
                    minHeight: "42px",
                    padding: "8px 20px",
                    background: (isSelf || isApproved || !allChecksPassed) ? "var(--muted)" : "var(--green)",
                    borderRadius: "3px",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: (isSelf || isApproved || !allChecksPassed) ? "not-allowed" : "pointer",
                  }}
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                  {isApproved ? "Already Approved" : "Approve Membership & Issue Card"}
                </button>
              </div>

              {isSelf && (
                <div style={{ marginTop: "8px", textAlign: "right", fontSize: "12px", color: "var(--red)", fontWeight: 600 }}>
                  Self-approval prohibited: Another verifier must scrutinize your application.
                </div>
              )}
              {!isSelf && !allChecksPassed && (
                <div style={{ marginTop: "8px", textAlign: "right", fontSize: "12px", color: "var(--saffron)", fontWeight: 600 }}>
                  Please review missing items above before approving docket.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: "60px 24px", textAlign: "center", background: "var(--paper-card)", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)" }}>
            Select an application from the queue to inspect statutory evidence and begin scrutiny.
          </div>
        )}
      </div>
    </div>
  );
}
