import React, { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  CreditCard,
  FileText,
  ShieldCheck,
  Download,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Profile, Member, MembershipApplication, MembershipCard } from "@/lib/types";

export function MemberProfileView() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [application, setApplication] = useState<MembershipApplication | null>(null);
  const [card, setCard] = useState<MembershipCard | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setNeedsAuth(true);
        setLoading(false);
        return;
      }

      const token = session.access_token;
      try {
        const res = await fetch("/api/v1/member/status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const json = await res.json();
          setProfile(json.profile);
          setMember(json.member);
          setApplication(json.application);
          setCard(json.card);
        }
      } catch (err) {
        console.error("Failed to load status:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "60px", textAlign: "center", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
        Loading member record & standing...
      </div>
    );
  }

  if (needsAuth) {
    return (
      <div className="card" style={{ padding: "40px 24px", textAlign: "center", background: "var(--paper-card)", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)", maxWidth: "580px", margin: "0 auto" }}>
        <Clock size={44} style={{ color: "var(--saffron)", margin: "0 auto 16px" }} />
        <h2 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", fontWeight: 700, marginBottom: "4px", color: "var(--ink)" }}>Sign In to View Status</h2>
        <div style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: "12px" }}>स्थिति देखने के लिए लॉगिन करें</div>
        <p style={{ color: "var(--muted)", fontSize: "13.5px", maxWidth: "460px", margin: "0 auto 24px", lineHeight: 1.5 }}>
          Please sign in to view your verification status, induction docket, and membership application record.
        </p>
        <a href="/login" className="button primary" style={{ minHeight: "44px", padding: "10px 24px", borderRadius: "3px", fontSize: "14px", fontWeight: 700 }}>
          Log In / प्रवेश करें
        </a>
      </div>
    );
  }

  const isApproved = Boolean(member && member.status === "APPROVED");
  const appStatus = application?.status || "NO_APPLICATION";

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      {/* Top Banner Status */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          borderRadius: "4px",
          padding: "24px",
          border: "1px solid var(--line-strong)",
          boxShadow: "var(--shadow)",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "3px",
              background: "var(--paper-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--line-strong)",
              fontSize: "22px",
              fontWeight: 800,
              fontFamily: "var(--font-serif)",
              color: "var(--saffron)",
            }}
          >
            {profile?.full_name ? profile.full_name[0].toUpperCase() : "N"}
          </div>
          <div>
            <h2 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 4px", color: "var(--ink)" }}>
              {profile?.full_name || "Supporter / Member"}
            </h2>
            <div style={{ fontSize: "12.5px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{profile?.email}</div>
          </div>
        </div>

        <div>
          {isApproved ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "2px",
                background: "rgba(29, 86, 53, 0.08)",
                border: "1px solid rgba(29, 86, 53, 0.25)",
                color: "var(--green)",
                fontWeight: 700,
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
              }}
            >
              <CheckCircle2 size={14} /> APPROVED MEMBER / सत्यापित सदस्य
            </div>
          ) : (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "2px",
                background:
                  appStatus === "NEEDS_CORRECTION"
                    ? "rgba(179, 74, 21, 0.12)"
                    : appStatus === "REJECTED"
                    ? "rgba(142, 38, 23, 0.08)"
                    : "rgba(179, 74, 21, 0.08)",
                border:
                  appStatus === "NEEDS_CORRECTION"
                    ? "1px solid rgba(179, 74, 21, 0.3)"
                    : appStatus === "REJECTED"
                    ? "1px solid rgba(142, 38, 23, 0.3)"
                    : "1px solid rgba(179, 74, 21, 0.25)",
                color:
                  appStatus === "NEEDS_CORRECTION"
                    ? "var(--saffron)"
                    : appStatus === "REJECTED"
                    ? "var(--red)"
                    : "var(--saffron)",
                fontWeight: 700,
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
              }}
            >
              <Clock size={14} /> {appStatus.replace(/_/g, " ")}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic "What Do I Need To Do Next?" Guidance Banner */}
      <div style={{ marginBottom: "24px" }}>
        {appStatus === "NO_APPLICATION" && (
          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              borderRadius: "4px",
              padding: "20px 24px",
              border: "1px solid var(--line-strong)",
              borderLeft: "4px solid var(--saffron)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <strong style={{ fontSize: "14px", color: "var(--ink)" }}>Step 1: Begin Digital Induction (डिजिटल इंडक्शन शुरू करें)</strong>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
                You have registered your supporter account. Complete the 10-step induction wizard to submit your identity proof and statutory affirmations.
              </div>
            </div>
            <a href="/member/induction" className="button primary" style={{ minHeight: "38px", padding: "6px 16px", fontSize: "12.5px", fontWeight: 700, borderRadius: "3px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              Start Induction <ArrowRight size={14} />
            </a>
          </div>
        )}

        {(appStatus === "DRAFT" || appStatus === "DOCUMENTS_PENDING") && (
          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              borderRadius: "4px",
              padding: "20px 24px",
              border: "1px solid var(--line-strong)",
              borderLeft: "4px solid var(--saffron)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <strong style={{ fontSize: "14px", color: "var(--ink)" }}>Induction In Progress: Resume Draft (इंडक्शन अधूरा है)</strong>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
                Your membership application docket ({application?.application_number}) is in draft. Complete your required details and submit for verification.
              </div>
            </div>
            <a href="/member/induction" className="button primary" style={{ minHeight: "38px", padding: "6px 16px", fontSize: "12.5px", fontWeight: 700, borderRadius: "3px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              Resume Induction <ArrowRight size={14} />
            </a>
          </div>
        )}

        {appStatus === "NEEDS_CORRECTION" && (
          <div
            className="card"
            style={{
              background: "rgba(179, 74, 21, 0.04)",
              borderRadius: "4px",
              padding: "20px 24px",
              border: "1px solid rgba(179, 74, 21, 0.3)",
              borderLeft: "4px solid var(--saffron)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
              <AlertTriangle size={18} style={{ color: "var(--saffron)", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ fontSize: "14px", color: "var(--ink)" }}>Action Required: Scrutiny Desk Deficiency Notice (संशोधन आवश्यक)</strong>
                <div style={{ fontSize: "13px", color: "var(--ink)", marginTop: "6px", background: "var(--paper)", padding: "10px 14px", borderRadius: "3px", border: "1px solid var(--line)" }}>
                  {application?.correction_notes || application?.rejection_reason || "Please update your proof of residence or verify voter ID details."}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <a href="/member/induction" className="button primary" style={{ minHeight: "38px", padding: "6px 16px", fontSize: "12.5px", fontWeight: 700, borderRadius: "3px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                Edit & Resubmit Docket <ArrowRight size={14} />
              </a>
            </div>
          </div>
        )}

        {(appStatus === "SUBMITTED" || appStatus === "UNDER_REVIEW") && (
          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              borderRadius: "4px",
              padding: "20px 24px",
              border: "1px solid var(--line-strong)",
              borderLeft: "4px solid var(--blue)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <strong style={{ fontSize: "14px", color: "var(--ink)" }}>Under Scrutiny by Verification Desk (संवीक्षाधीन)</strong>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
                Your docket ({application?.application_number}) was submitted on{" "}
                {application?.submitted_at ? new Date(application.submitted_at).toLocaleDateString("en-IN") : "today"} and is queued for verification against statutory criteria.
              </div>
            </div>
            <a href="/member/status" className="button" style={{ minHeight: "38px", padding: "6px 14px", fontSize: "12.5px", borderRadius: "3px" }}>
              View Audit Status
            </a>
          </div>
        )}

        {isApproved && (
          <div
            className="card"
            style={{
              background: "rgba(29, 86, 53, 0.04)",
              borderRadius: "4px",
              padding: "20px 24px",
              border: "1px solid rgba(29, 86, 53, 0.25)",
              borderLeft: "4px solid var(--green)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <strong style={{ fontSize: "14.5px", color: "var(--ink)", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={18} style={{ color: "var(--green)" }} />
                Active Member in Good Standing (सत्यापित सक्रिय सदस्यता)
              </strong>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
                Official Membership ID: <strong style={{ color: "var(--ink)", fontFamily: "var(--font-mono)" }}>{member?.membership_id}</strong> • Card v{card?.card_version || 1} issued on {card?.issue_date ? new Date(card.issue_date).toLocaleDateString("en-IN") : "Approval"}.
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <a href="/member/membership-card" className="button primary" style={{ minHeight: "38px", padding: "6px 14px", fontSize: "12px", fontWeight: 700, borderRadius: "3px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <CreditCard size={14} /> View Card
              </a>
              <a href="/api/v1/member/card-pdf" download="nagrik-party-membership-card.pdf" className="button" style={{ minHeight: "38px", padding: "6px 14px", fontSize: "12px", borderRadius: "3px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Download size={14} /> Download PDF
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          borderRadius: "4px",
          padding: "24px 28px",
          border: "1px solid var(--line-strong)",
          boxShadow: "var(--shadow)",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: "14px", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
              Organisational Record Details
            </h3>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>सांगठनिक पंजी विवरण</div>
          </div>
          <span style={{ fontSize: "10.5px", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
            CONFIDENTIAL DOCKET
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", fontSize: "13.5px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              Membership ID / संख्या
            </div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--saffron)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
              {member?.membership_id || (application ? `App: ${application.application_number}` : "Not Assigned")}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              Category / श्रेणी
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)", marginTop: "4px" }}>
              {member?.category || application?.membership_category || "Public Supporter"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              Constituency / विधान सभा
            </div>
            <div style={{ fontSize: "14px", color: "var(--ink)", marginTop: "4px" }}>
              {profile?.vidhan_sabha || "Not set"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              Ward / Locality / वार्ड
            </div>
            <div style={{ fontSize: "14px", color: "var(--ink)", marginTop: "4px" }}>{profile?.ward || "Not set"}</div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              Contact Phone / फोन
            </div>
            <div style={{ fontSize: "14px", color: "var(--ink)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>{profile?.phone || "Not set"}</div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              Enrolled Date / पंजीकरण तिथि
            </div>
            <div style={{ fontSize: "14px", color: "var(--ink)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>
              {member?.approved_at
                ? new Date(member.approved_at).toLocaleDateString("en-IN")
                : application?.submitted_at
                ? new Date(application.submitted_at).toLocaleDateString("en-IN")
                : "In draft"}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
        <a
          href="/member/membership-card"
          className="card"
          style={{
            background: "var(--paper-card)",
            padding: "18px 20px",
            borderRadius: "4px",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow)",
            textAlign: "center",
            display: "block",
            textDecoration: "none",
          }}
        >
          <CreditCard size={22} style={{ color: "var(--saffron)", margin: "0 auto 6px" }} />
          <div style={{ fontWeight: 700, fontFamily: "var(--font-serif)", fontSize: "15px", marginBottom: "4px", color: "var(--ink)" }}>Membership Card</div>
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>CR80 Vector Layout & QR</div>
        </a>

        <a
          href="/member/documents"
          className="card"
          style={{
            background: "var(--paper-card)",
            padding: "18px 20px",
            borderRadius: "4px",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow)",
            textAlign: "center",
            display: "block",
            textDecoration: "none",
          }}
        >
          <FileText size={22} style={{ color: "var(--blue)", margin: "0 auto 6px" }} />
          <div style={{ fontWeight: 700, fontFamily: "var(--font-serif)", fontSize: "15px", marginBottom: "4px", color: "var(--ink)" }}>Document Vault</div>
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>Encrypted Private Evidence</div>
        </a>

        <a
          href="/member/status"
          className="card"
          style={{
            background: "var(--paper-card)",
            padding: "18px 20px",
            borderRadius: "4px",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow)",
            textAlign: "center",
            display: "block",
            textDecoration: "none",
          }}
        >
          <Clock size={22} style={{ color: "var(--green)", margin: "0 auto 6px" }} />
          <div style={{ fontWeight: 700, fontFamily: "var(--font-serif)", fontSize: "15px", marginBottom: "4px", color: "var(--ink)" }}>Audit & Status</div>
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>Live Verification Trace</div>
        </a>
      </div>
    </div>
  );
}
