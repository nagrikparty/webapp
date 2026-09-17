import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/brand";
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
      <div className="card" style={{ padding: "40px", textAlign: "center", background: "#fff", borderRadius: "16px", border: "1px solid var(--line)" }}>
        <Clock size={40} style={{ color: BRAND.colors.saffron, margin: "0 auto 16px" }} />
        <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "8px" }}>Sign In to View Status</h2>
        <p style={{ color: "var(--muted)", maxWidth: "480px", margin: "0 auto 24px" }}>
          Please sign in to view your verification status and membership application details.
        </p>
        <a href="/login" className="button button-primary" style={{ padding: "10px 24px" }}>
          Log In
        </a>
      </div>
    );
  }

  const isApproved = member && member.status === "APPROVED";
  const appStatus = application?.status || "NO_APPLICATION";

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Top Banner Status */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid var(--line)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
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
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "var(--paper)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--line)",
              fontSize: "24px",
              fontWeight: 800,
              color: BRAND.colors.saffron,
            }}
          >
            {profile?.full_name ? profile.full_name[0].toUpperCase() : "N"}
          </div>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 4px" }}>
              {profile?.full_name || "Supporter / Member"}
            </h2>
            <div style={{ fontSize: "13px", color: "var(--muted)" }}>{profile?.email}</div>
          </div>
        </div>

        <div>
          {isApproved ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "100px",
                background: "rgba(0, 135, 62, 0.1)",
                color: BRAND.colors.green,
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              <CheckCircle2 size={16} /> APPROVED MEMBER
            </div>
          ) : (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "100px",
                background: "rgba(245, 130, 32, 0.1)",
                color: BRAND.colors.saffron,
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              <Clock size={16} /> {appStatus.replace(/_/g, " ")}
            </div>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div
        className="card"
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "28px",
          border: "1px solid var(--line)",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ fontSize: "17px", fontWeight: 800, margin: "0 0 20px" }}>Organisational Record Details</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "14px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Membership ID
            </div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: BRAND.colors.saffron, marginTop: "4px" }}>
              {member?.membership_id || (application ? `App: ${application.application_number}` : "Not Assigned")}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Category
            </div>
            <div style={{ fontSize: "15px", fontWeight: 700, marginTop: "4px" }}>
              {member?.category || application?.membership_category || "Public Supporter"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Vidhan Sabha Constituency
            </div>
            <div style={{ fontSize: "15px", marginTop: "4px" }}>
              {profile?.vidhan_sabha || "Not set"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Ward / Locality
            </div>
            <div style={{ fontSize: "15px", marginTop: "4px" }}>{profile?.ward || "Not set"}</div>
          </div>

          <div>
            <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Contact Phone
            </div>
            <div style={{ fontSize: "15px", marginTop: "4px" }}>{profile?.phone || "Not set"}</div>
          </div>

          <div>
            <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Enrolled / Applied Date
            </div>
            <div style={{ fontSize: "15px", marginTop: "4px" }}>
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
              padding: "16px",
              background: "var(--paper)",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <strong>Complete Digital Induction</strong>
              <div style={{ fontSize: "13px", color: "var(--muted)" }}>
                Submit required declarations and identity documents for verification.
              </div>
            </div>
            <a href="/member/induction" className="button primary" style={{ fontSize: "13px" }}>
              Continue Induction <ArrowRight size={14} />
            </a>
          </div>
        )}
      </div>

      {/* Quick Action Navigation Tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
        <a
          href="/member/membership-card"
          className="card"
          style={{
            background: "#fff",
            padding: "18px",
            borderRadius: "12px",
            border: "1px solid var(--line)",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>Membership Card</div>
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>Preview & CR80 Print PDF</div>
        </a>

        <a
          href="/member/documents"
          className="card"
          style={{
            background: "#fff",
            padding: "18px",
            borderRadius: "12px",
            border: "1px solid var(--line)",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>Document Vault</div>
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>Encrypted Private Storage</div>
        </a>

        <a
          href="/member/status"
          className="card"
          style={{
            background: "#fff",
            padding: "18px",
            borderRadius: "12px",
            border: "1px solid var(--line)",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>Audit & Status</div>
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>Live Verification Trace</div>
        </a>
      </div>
    </div>
  );
}
