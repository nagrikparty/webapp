import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Download, ShieldCheck, AlertCircle, AlertOctagon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/brand";
import { Logo } from "./Logo";
import type { Member, MembershipCard, Profile } from "@/lib/types";

export function MemberCardView() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [card, setCard] = useState<MembershipCard | null>(null);
  const [downloading, setDownloading] = useState(false);

  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    loadCardData();
  }, []);

  async function loadCardData() {
    if (!supabase) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setNeedsAuth(true);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/v1/member/status", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setProfile(data.profile);
      setMember(data.member);
      setCard(data.card);
    }
    setLoading(false);
  }

  async function downloadPdf() {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setDownloading(true);
    try {
      const res = await fetch("/api/v1/member/card-pdf", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to download card PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${member?.membership_id || "nagrik-party"}-membership-card.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error downloading card PDF");
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <Loader2 className="animate-spin" size={32} style={{ margin: "0 auto 12px" }} />
        <p>Loading your membership card...</p>
      </div>
    );
  }

  if (needsAuth) {
    return (
      <div
        className="card"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "48px 24px",
          textAlign: "center",
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid var(--line)",
        }}
      >
        <ShieldCheck size={48} style={{ color: BRAND.colors.saffron, margin: "0 auto 16px" }} />
        <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px" }}>Sign In to View Membership Card</h3>
        <p style={{ color: "var(--muted)", fontSize: "14px", maxWidth: "440px", margin: "0 auto 20px" }}>
          CR80 membership cards are issued to verified party members. Please log in with your registered account.
        </p>
        <a href="/login" className="button button-primary" style={{ padding: "10px 24px" }}>
          Log In
        </a>
      </div>
    );
  }

  if (!member || member.status !== "APPROVED") {
    return (
      <div
        className="card"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "48px 24px",
          textAlign: "center",
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid var(--line)",
        }}
      >
        <AlertCircle size={48} style={{ color: BRAND.colors.saffron, margin: "0 auto 16px" }} />
        <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px" }}>Card Not Yet Issued</h3>
        <p style={{ color: "var(--muted)", fontSize: "14px", maxWidth: "440px", margin: "0 auto 20px" }}>
          In accordance with party principles, active printable membership cards are only generated once your digital induction has been fully verified and approved by the organisation.
        </p>
        <a href="/member/induction" className="button primary">
          Check Induction Status
        </a>
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "https://nagrik.party";
  const verificationUrl = `${origin}/verify/member/${member.membership_id}`;
  const isRevoked = card?.status === "REVOKED";

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Action Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 4px" }}>
            Printable Membership Card (CR80)
          </h2>
          <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
            Standards-compliant CR80 (85.60 mm × 53.98 mm) digital preview and vector print PDF.
          </p>
        </div>

        <button
          type="button"
          disabled={downloading || isRevoked}
          onClick={downloadPdf}
          className="button primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            fontSize: "14px",
          }}
        >
          {downloading ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
          Download CR80 Print PDF
        </button>
      </div>

      {isRevoked && (
        <div
          style={{
            padding: "14px 18px",
            background: "#fff2f0",
            border: "1px solid #ffccc7",
            borderRadius: "10px",
            color: "#cf1322",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <AlertOctagon size={20} />
          <div>
            <strong>This card has been revoked:</strong> {card?.revocation_reason || "Superseded or withdrawn."}
          </div>
        </div>
      )}

      {/* DUAL-SIDED CR80 CARD PREVIEW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {/* FRONT */}
        <div>
          <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>
            Card Front
          </div>
          <div
            style={{
              aspectRatio: "85.6 / 53.98",
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid var(--line)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              position: "relative",
              overflow: "hidden",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Top Accent Lines */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", display: "flex" }}>
              <div style={{ width: "50%", background: BRAND.colors.saffron }} />
              <div style={{ width: "50%", background: BRAND.colors.green }} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: "14px", letterSpacing: "0.02em" }}>NAGRIK PARTY</div>
                  <div style={{ fontSize: "7px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.05em" }}>
                    FORMATION PHASE — MEMBERSHIP CARD
                  </div>
                </div>
                <Logo width={32} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {/* Photo Box */}
              <div
                style={{
                  width: "56px",
                  height: "70px",
                  background: "var(--paper)",
                  borderRadius: "6px",
                  border: "1px solid var(--line)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  color: "var(--muted)",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                PHOTO
              </div>

              {/* Data Fields */}
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: "7px", color: "var(--muted)", fontWeight: 700 }}>NAME</div>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "var(--ink)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {member.full_name.toUpperCase()}
                </div>

                <div style={{ fontSize: "7px", color: "var(--muted)", fontWeight: 700, marginTop: "6px" }}>MEMBERSHIP ID</div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: BRAND.colors.saffron, fontFamily: "monospace" }}>
                  {member.membership_id}
                </div>

                <div style={{ fontSize: "7px", color: "var(--muted)", fontWeight: 700, marginTop: "6px" }}>CATEGORY</div>
                <div style={{ fontSize: "9px", fontWeight: 600, color: "var(--ink)" }}>{member.category}</div>
              </div>
            </div>

            <div style={{ fontSize: "8px", fontWeight: 700, color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: "4px" }}>
              Kaam dikhna chahiye.
            </div>
          </div>
        </div>

        {/* BACK */}
        <div>
          <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px" }}>
            Card Back
          </div>
          <div
            style={{
              aspectRatio: "85.6 / 53.98",
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid var(--line)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
              position: "relative",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              {/* QR Code */}
              <div style={{ background: "#fff", padding: "4px", borderRadius: "6px", border: "1px solid var(--line)", flexShrink: 0 }}>
                <QRCode value={verificationUrl} size={64} level="M" />
              </div>

              <div style={{ fontSize: "9px", display: "grid", gap: "4px" }}>
                <div>
                  <div style={{ fontSize: "6.5px", color: "var(--muted)", fontWeight: 700 }}>CONSTITUENCY</div>
                  <div style={{ fontWeight: 600 }}>{profile?.vidhan_sabha || "Delhi"}, Delhi</div>
                </div>
                <div>
                  <div style={{ fontSize: "6.5px", color: "var(--muted)", fontWeight: 700 }}>ISSUE DATE</div>
                  <div style={{ fontWeight: 600 }}>{card?.issue_date || new Date().toISOString().split("T")[0]}</div>
                </div>
                <div>
                  <div style={{ fontSize: "6.5px", color: "var(--muted)", fontWeight: 700 }}>VERIFICATION</div>
                  <div style={{ color: "var(--blue)", fontSize: "7.5px", wordBreak: "break-all" }}>
                    nagrik.party/verify/member/{member.membership_id}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div
              style={{
                background: "var(--paper)",
                padding: "6px",
                borderRadius: "6px",
                fontSize: "6px",
                lineHeight: 1.3,
                color: "var(--muted)",
                textAlign: "justify",
              }}
            >
              <strong>ORGANISATIONAL MEMBERSHIP CARD • NOT A GOVERNMENT IDENTITY DOCUMENT.</strong> This card certifies enrollment in the Nagrik Party register (Phase 1 — Formation Phase). It does not substitute for any official government identity document or voter card.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "28px",
          padding: "16px",
          background: "var(--paper)",
          borderRadius: "12px",
          fontSize: "13px",
          color: "var(--muted)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <ShieldCheck size={20} style={{ color: BRAND.colors.green, flexShrink: 0 }} />
        <div>
          <strong>Privacy Safeguard:</strong> This card intentionally omits private contact details, complete home addresses, and sensitive identity numbers. Anyone scanning the QR code sees only the verified member status.
        </div>
      </div>
    </div>
  );
}
