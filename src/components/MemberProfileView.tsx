import React, { useEffect, useState } from "react";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Profile, Member, MembershipApplication } from "@/lib/types";

export function MemberProfileView() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [application, setApplication] = useState<MembershipApplication | null>(null);

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
      const res = await fetch("/api/v1/member/status", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const json = await res.json();
        setProfile(json.profile);
        setMember(json.member);
        setApplication(json.application);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading member profile...</div>;
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

  const isApproved = member && member.status === "APPROVED";
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
                padding: "4px 10px",
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
                padding: "4px 10px",
                borderRadius: "2px",
                background: "rgba(179, 74, 21, 0.08)",
                border: "1px solid rgba(179, 74, 21, 0.25)",
                color: "var(--saffron)",
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

        {!isApproved && (
          <div
            style={{
              marginTop: "24px",
              padding: "16px 18px",
              background: "var(--paper-subtle)",
              borderRadius: "3px",
              border: "1px solid var(--line-strong)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <strong style={{ fontSize: "13.5px", color: "var(--ink)" }}>Complete Digital Induction / डिजिटल इंडक्शन पूर्ण करें</strong>
              <div style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "2px" }}>
                Submit required declarations and identity evidence for verification.
              </div>
            </div>
            <a href="/member/induction" className="button primary" style={{ minHeight: "40px", padding: "8px 18px", fontSize: "13px", fontWeight: 700, borderRadius: "3px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              Continue Induction <ArrowRight size={14} />
            </a>
          </div>
        )}
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
          }}
        >
          <div style={{ fontWeight: 700, fontFamily: "var(--font-serif)", fontSize: "15px", marginBottom: "4px", color: "var(--ink)" }}>Membership Card</div>
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>Preview & CR80 Print PDF</div>
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
          }}
        >
          <div style={{ fontWeight: 700, fontFamily: "var(--font-serif)", fontSize: "15px", marginBottom: "4px", color: "var(--ink)" }}>Document Vault</div>
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>Encrypted Private Storage</div>
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
          }}
        >
          <div style={{ fontWeight: 700, fontFamily: "var(--font-serif)", fontSize: "15px", marginBottom: "4px", color: "var(--ink)" }}>Audit & Status</div>
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>Live Verification Trace</div>
        </a>
      </div>
    </div>
  );
}
