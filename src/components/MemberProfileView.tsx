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
  Sparkles,
  Layers,
  Compass
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Profile, Member, MembershipApplication, MembershipCard } from "@/lib/types";

export function MemberProfileView() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [application, setApplication] = useState<MembershipApplication | null>(null);
  const [card, setCard] = useState<MembershipCard | null>(null);
  const [formationPercentage, setFormationPercentage] = useState<number>(24);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    async function loadData() {
      // Fetch formation progress
      fetch("/api/v1/formation-progress")
        .then((res) => res.json())
        .then((d) => {
          if (d.percentage) setFormationPercentage(d.percentage);
        })
        .catch(() => {});

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
        Loading member record...
      </div>
    );
  }

  if (needsAuth) {
    return (
      <div className="card" style={{ padding: "40px 24px", textAlign: "center", background: "var(--paper-card)", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)", maxWidth: "560px", margin: "0 auto" }}>
        <Clock size={44} style={{ color: "var(--saffron)", margin: "0 auto 16px" }} />
        <h2 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", fontWeight: 700, marginBottom: "8px", color: "var(--ink)" }}>Sign In to View Status</h2>
        <p style={{ color: "var(--muted)", fontSize: "14px", maxWidth: "440px", margin: "0 auto 24px", lineHeight: 1.55 }}>
          Please sign in to view your verification status, membership docket, and participation records.
        </p>
        <a href="/login" className="button button-primary" style={{ padding: "12px 28px", fontSize: "14.5px" }}>
          Sign In &rarr;
        </a>
      </div>
    );
  }

  const isApproved = Boolean(member && member.status === "APPROVED");
  const appStatus = application?.status || "NO_APPLICATION";
  const firstName = profile?.full_name ? profile.full_name.trim().split(" ")[0] : "Member";
  const nagrikId = member?.membership_id || (application ? application.application_number : "Pending Induction");

  // Extract participation areas if available
  const participationInterests: string[] = application?.member_participation
    ? (Array.isArray(application.member_participation)
        ? application.member_participation[0]?.interest_areas || []
        : application.member_participation.interest_areas || [])
    : [];

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto", display: "grid", gap: "24px" }}>
      
      {/* Editorial Member Greeting Card */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          borderRadius: "4px",
          padding: "clamp(20px, 3vw, 32px)",
          border: "1px solid var(--line-strong)",
          boxShadow: "var(--shadow)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
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
            {firstName[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
              MEMBER PORTAL
            </div>
            <h1 style={{ fontSize: "22px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "2px 0 4px", color: "var(--ink)" }}>
              Hello, {firstName}
            </h1>
            <div style={{ fontSize: "13px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
              Nagrik ID: <strong style={{ color: "var(--saffron)" }}>{nagrikId}</strong>
            </div>
          </div>
        </div>

        <div>
          {isApproved ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "2px",
                background: "rgba(29, 86, 53, 0.08)",
                border: "1px solid rgba(29, 86, 53, 0.25)",
                color: "var(--green)",
                fontWeight: 700,
                fontSize: "12px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
              }}
            >
              <CheckCircle2 size={15} /> ACTIVE MEMBER
            </span>
          ) : (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
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
                    : "1px solid rgba(179, 74, 21, 0.25)",
                color: "var(--saffron)",
                fontWeight: 700,
                fontSize: "12px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
              }}
            >
              <Clock size={15} /> STATUS: {appStatus.replace(/_/g, " ")}
            </span>
          )}
        </div>
      </div>

      {/* Next Step / Guidance Banner */}
      <div>
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
              <strong style={{ fontSize: "15px", color: "var(--ink)" }}>Next Step: Complete Digital Induction</strong>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
                You have registered your supporter account. Complete the progressive induction flow to submit your voter details and statutory affirmations.
              </div>
            </div>
            <a href="/member/induction" className="button button-primary" style={{ padding: "8px 18px", fontSize: "13px" }}>
              Start Induction &rarr;
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
              <strong style={{ fontSize: "15px", color: "var(--ink)" }}>Next Step: Resume Saved Induction Draft</strong>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
                Your membership application docket ({application?.application_number}) is saved in draft. Complete remaining sections to submit for verification.
              </div>
            </div>
            <a href="/member/induction" className="button button-primary" style={{ padding: "8px 18px", fontSize: "13px" }}>
              Resume Induction &rarr;
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
                <strong style={{ fontSize: "15px", color: "var(--ink)" }}>Next Step: Scrutiny Desk Correction Required</strong>
                <div style={{ fontSize: "13px", color: "var(--ink)", marginTop: "6px", background: "var(--paper)", padding: "10px 14px", borderRadius: "3px", border: "1px solid var(--line)" }}>
                  {application?.correction_notes || application?.rejection_reason || "Please update your proof of residence or verify voter ID details."}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <a href="/member/induction" className="button button-primary" style={{ padding: "8px 18px", fontSize: "13px" }}>
                Edit & Resubmit Docket &rarr;
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
              <strong style={{ fontSize: "15px", color: "var(--ink)" }}>Next Step: Application Under Scrutiny</strong>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
                Your docket was submitted on{" "}
                {application?.submitted_at ? new Date(application.submitted_at).toLocaleDateString("en-IN") : "recently"}.
                Our verification desk is reviewing your voter details against Section 29A statutory criteria.
              </div>
            </div>
            <a href="/member/status" className="button" style={{ padding: "8px 16px", fontSize: "13px" }}>
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
              <strong style={{ fontSize: "15px", color: "var(--ink)", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={18} style={{ color: "var(--green)" }} />
                Active Founding Member in Good Standing
              </strong>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
                Official Membership ID: <strong style={{ color: "var(--ink)", fontFamily: "var(--font-mono)" }}>{member?.membership_id}</strong>. Your organizational membership record is verified.
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <a href="/member/membership-card" className="button button-primary" style={{ padding: "8px 16px", fontSize: "12.5px" }}>
                <CreditCard size={14} style={{ marginRight: 6 }} /> View Card
              </a>
              <a href="/api/v1/member/card-pdf" download="nagrik-party-membership-card.pdf" className="button" style={{ padding: "8px 16px", fontSize: "12.5px" }}>
                <Download size={14} style={{ marginRight: 6 }} /> PDF
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Two Columns: Participation & Formation Progress */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "20px" }}>
        
        {/* Left: Your Participation */}
        <div
          className="card"
          style={{
            background: "var(--paper-card)",
            borderRadius: "4px",
            padding: "22px 24px",
            border: "1px solid var(--line)",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-serif)", margin: "0 0 12px", color: "var(--ink)" }}>
            Your Participation & Skills
          </h3>
          <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 14px", lineHeight: 1.5 }}>
            Areas you indicated you can contribute to during Phase 1:
          </p>

          {participationInterests.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              {participationInterests.map((interest) => (
                <span
                  key={interest}
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    background: "var(--paper-subtle)",
                    color: "var(--ink)",
                    padding: "4px 10px",
                    borderRadius: "3px",
                    border: "1px solid var(--line)",
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}>
              No specific skill areas recorded yet.
            </div>
          )}

          <a
            href="/build-with-us"
            style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--saffron)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            Explore Available Tasks in Build With Us &rarr;
          </a>
        </div>

        {/* Right: Formation Progress Tracker */}
        <div
          className="card"
          style={{
            background: "var(--paper-card)",
            borderRadius: "4px",
            padding: "22px 24px",
            border: "1px solid var(--line)",
            boxShadow: "var(--shadow)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-serif)", margin: 0, color: "var(--ink)" }}>
              Formation Progress
            </h3>
            <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--saffron)" }}>
              {formationPercentage}%
            </span>
          </div>

          <div style={{ width: "100%", height: "8px", background: "var(--paper-subtle)", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--line)", marginBottom: "14px" }}>
            <div style={{ width: `${formationPercentage}%`, height: "100%", background: "var(--saffron)" }} />
          </div>

          <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.5, margin: "0 0 14px" }}>
            Current stage: Founding Member Induction across Delhi's 70 Assembly constituencies.
          </p>

          <a
            href="/formation-progress"
            style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--saffron)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            Inspect 9-Stage Legal Roadmap &rarr;
          </a>
        </div>

      </div>

      {/* Record Details Summary */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          borderRadius: "4px",
          padding: "22px 26px",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-serif)", margin: "0 0 16px", color: "var(--ink)" }}>
          Organisational Record Details
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", fontSize: "13px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              CONSTITUENCY
            </div>
            <div style={{ fontSize: "14px", color: "var(--ink)", marginTop: "2px" }}>
              {profile?.vidhan_sabha || "Delhi AC"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              WARD / AREA
            </div>
            <div style={{ fontSize: "14px", color: "var(--ink)", marginTop: "2px" }}>
              {profile?.ward || "Local Ward"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              CATEGORY
            </div>
            <div style={{ fontSize: "14px", color: "var(--ink)", marginTop: "2px" }}>
              {member?.category || application?.membership_category || "Primary Member"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              STATUS DATE
            </div>
            <div style={{ fontSize: "14px", color: "var(--ink)", marginTop: "2px" }}>
              {member?.approved_at
                ? new Date(member.approved_at).toLocaleDateString("en-IN")
                : application?.submitted_at
                ? new Date(application.submitted_at).toLocaleDateString("en-IN")
                : "Active"}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
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
            textDecoration: "none",
            display: "block",
            color: "inherit",
          }}
        >
          <CreditCard size={20} style={{ color: "var(--saffron)", marginBottom: "6px" }} />
          <strong style={{ display: "block", fontSize: "15px", color: "var(--ink)" }}>Membership Card</strong>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>CR80 digital organizational card & QR</span>
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
            textDecoration: "none",
            display: "block",
            color: "inherit",
          }}
        >
          <FileText size={20} style={{ color: "var(--blue)", marginBottom: "6px" }} />
          <strong style={{ display: "block", fontSize: "15px", color: "var(--ink)" }}>Document Vault</strong>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>Private encrypted member uploads</span>
        </a>

        <a
          href="/issues"
          className="card"
          style={{
            background: "var(--paper-card)",
            padding: "18px 20px",
            borderRadius: "4px",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow)",
            textDecoration: "none",
            display: "block",
            color: "inherit",
          }}
        >
          <Compass size={20} style={{ color: "var(--green)", marginBottom: "6px" }} />
          <strong style={{ display: "block", fontSize: "15px", color: "var(--ink)" }}>Report Civic Issue</strong>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>File a local constituency problem</span>
        </a>
      </div>

    </div>
  );
}
