import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Download, ShieldCheck, AlertCircle, AlertOctagon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
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
          maxWidth: "580px",
          margin: "0 auto",
          padding: "40px 24px",
          textAlign: "center",
          background: "var(--paper-card)",
          borderRadius: "4px",
          border: "1px solid var(--line-strong)",
          boxShadow: "var(--shadow)",
        }}
      >
        <ShieldCheck size={44} style={{ color: "var(--saffron)", margin: "0 auto 16px" }} />
        <h3 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
          Sign In to View Membership Card
        </h3>
        <div style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: "12px" }}>
          सदस्यता कार्ड देखने के लिए लॉगिन करें
        </div>
        <p style={{ color: "var(--muted)", fontSize: "13.5px", maxWidth: "440px", margin: "0 auto 20px" }}>
          Standards-compliant CR80 cards are issued strictly to verified party members. Please log in with your registered account.
        </p>
        <a href="/login" className="button primary" style={{ minHeight: "44px", padding: "10px 28px", borderRadius: "3px", fontSize: "14px", fontWeight: 700 }}>
          Log In / प्रवेश करें
        </a>
      </div>
    );
  }

  if (!member || member.status !== "APPROVED") {
    return (
      <div
        className="card"
        style={{
          maxWidth: "580px",
          margin: "0 auto",
          padding: "40px 24px",
          textAlign: "center",
          background: "var(--paper-card)",
          borderRadius: "4px",
          border: "1px solid var(--line-strong)",
          boxShadow: "var(--shadow)",
        }}
      >
        <AlertCircle size={44} style={{ color: "var(--saffron)", margin: "0 auto 16px" }} />
        <h3 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
          Card Not Yet Issued
        </h3>
        <div style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: "12px" }}>
          सदस्यता कार्ड अभी जारी नहीं हुआ है
        </div>
        <p style={{ color: "var(--muted)", fontSize: "13.5px", maxWidth: "460px", margin: "0 auto 24px", lineHeight: 1.5 }}>
          In accordance with party principles, active printable membership cards are generated only once your digital induction has been fully scrutinized and approved by the verification desk.
        </p>
        <a href="/member/induction" className="button primary" style={{ minHeight: "44px", padding: "10px 24px", borderRadius: "3px", fontSize: "14px", fontWeight: 700 }}>
          Check Induction Status / स्थिति देखें
        </a>
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "https://nagrik.party";
  const verificationUrl = `${origin}/verify/member/${member.membership_id}`;
  const isRevoked = card?.status === "REVOKED";

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      {/* Action Header */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          borderRadius: "4px",
          border: "1px solid var(--line-strong)",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
          boxShadow: "var(--shadow)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <h2 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
              Printable Membership Card (CR80)
            </h2>
            <span
              style={{
                fontSize: "10.5px",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "2px",
                background: "rgba(4, 106, 56, 0.08)",
                border: "1px solid rgba(4, 106, 56, 0.25)",
                color: "var(--green)",
                textTransform: "uppercase",
              }}
            >
              Verified Active
            </span>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: 0 }}>
            मान्यता प्राप्त CR80 (85.60 mm × 53.98 mm) डिजिटल पहचान पत्र और सत्यापन प्रपत्र।
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
            minHeight: "44px",
            padding: "10px 20px",
            fontSize: "13.5px",
            fontWeight: 700,
            borderRadius: "3px",
          }}
        >
          {downloading ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
          Download CR80 Print PDF / पीडीएफ डाउनलोड करें
        </button>
      </div>

      {isRevoked && (
        <div
          style={{
            padding: "14px 18px",
            background: "rgba(220, 38, 38, 0.06)",
            border: "1px solid rgba(220, 38, 38, 0.3)",
            borderRadius: "3px",
            color: "var(--red)",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <AlertOctagon size={20} />
          <div style={{ fontSize: "13.5px" }}>
            <strong>This card has been revoked / यह कार्ड रद्द किया गया है:</strong> {card?.revocation_reason || "Superseded or withdrawn."}
          </div>
        </div>
      )}

      {/* DUAL-SIDED CR80 CARD PREVIEW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        {/* FRONT */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
            <span>Card Front / मुख पृष्ठ</span>
            <span>CR80 • 85.6 × 54 mm</span>
          </div>
          <div
            style={{
              aspectRatio: "85.6 / 53.98",
              background: "#fffefb",
              borderRadius: "4px",
              border: "1px solid rgba(36, 30, 22, 0.25)",
              boxShadow: "0 2px 4px rgba(35, 30, 20, 0.08), 0 8px 24px rgba(35, 30, 20, 0.06)",
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
              <div style={{ width: "50%", background: "var(--saffron)" }} />
              <div style={{ width: "50%", background: "var(--green)" }} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "14px", fontFamily: "var(--font-serif)", letterSpacing: "0.02em", color: "var(--ink)" }}>
                    NAGRIK PARTY
                  </div>
                  <div style={{ fontSize: "7.5px", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.05em", fontFamily: "var(--font-mono)" }}>
                    FORMATION PHASE · MEMBERSHIP CARD
                  </div>
                </div>
                <Logo width={32} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {/* Photo Box */}
              <div
                style={{
                  width: "58px",
                  height: "72px",
                  background: "var(--paper-subtle)",
                  borderRadius: "2px",
                  border: "1px dashed var(--line-strong)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "8.5px",
                  color: "var(--muted)",
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  flexShrink: 0,
                }}
              >
                PHOTO
              </div>

              {/* Data Fields */}
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: "7px", color: "var(--muted)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>FULL NAME / नाम</div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--ink)", fontFamily: "var(--font-serif)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {member.full_name.toUpperCase()}
                </div>

                <div style={{ fontSize: "7px", color: "var(--muted)", fontWeight: 700, marginTop: "5px", fontFamily: "var(--font-mono)" }}>MEMBERSHIP ID / सदस्यता संख्या</div>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--saffron)", fontFamily: "var(--font-mono)" }}>
                  {member.membership_id}
                </div>

                <div style={{ fontSize: "7px", color: "var(--muted)", fontWeight: 700, marginTop: "5px", fontFamily: "var(--font-mono)" }}>CATEGORY / श्रेणी</div>
                <div style={{ fontSize: "9px", fontWeight: 700, color: "var(--ink)" }}>{member.category}</div>
              </div>
            </div>

            <div style={{ fontSize: "8.5px", fontWeight: 700, color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontStyle: "italic", fontFamily: "var(--font-serif)" }}>काम दिखना चाहिए।</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "7.5px" }}>CIVIC DOCKET</span>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--muted)", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
            <span>Card Back / पृष्ठ भाग</span>
            <span>SECURE VERIFICATION</span>
          </div>
          <div
            style={{
              aspectRatio: "85.6 / 53.98",
              background: "#fffefb",
              borderRadius: "4px",
              border: "1px solid rgba(36, 30, 22, 0.25)",
              boxShadow: "0 2px 4px rgba(35, 30, 20, 0.08), 0 8px 24px rgba(35, 30, 20, 0.06)",
              position: "relative",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              {/* QR Code */}
              <div style={{ background: "#ffffff", padding: "4px", borderRadius: "2px", border: "1px solid var(--line-strong)", flexShrink: 0 }}>
                <QRCode value={verificationUrl} size={64} level="M" />
              </div>

              <div style={{ fontSize: "9px", display: "grid", gap: "5px" }}>
                <div>
                  <div style={{ fontSize: "6.5px", color: "var(--muted)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>CONSTITUENCY / विधान सभा</div>
                  <div style={{ fontWeight: 700, color: "var(--ink)" }}>{profile?.vidhan_sabha || "Delhi"}, Delhi</div>
                </div>
                <div>
                  <div style={{ fontSize: "6.5px", color: "var(--muted)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>ISSUE DATE / जारी तिथि</div>
                  <div style={{ fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-mono)" }}>{card?.issue_date || new Date().toISOString().split("T")[0]}</div>
                </div>
                <div>
                  <div style={{ fontSize: "6.5px", color: "var(--muted)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>PUBLIC VERIFY URL</div>
                  <div style={{ color: "var(--blue)", fontSize: "7.5px", wordBreak: "break-all", fontFamily: "var(--font-mono)" }}>
                    nagrik.party/verify/member/{member.membership_id}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div
              style={{
                background: "var(--paper-subtle)",
                padding: "6px 8px",
                borderRadius: "2px",
                fontSize: "6.5px",
                lineHeight: 1.35,
                color: "var(--muted)",
                textAlign: "justify",
                border: "1px solid var(--line)",
              }}
            >
              <strong>ORGANISATIONAL MEMBERSHIP CARD • NOT A GOVERNMENT IDENTITY DOCUMENT.</strong> This card certifies enrollment in the Nagrik Party register (Phase 1, Formation Phase). It does not substitute for any official government voter identity card.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          background: "var(--paper-subtle)",
          borderRadius: "4px",
          border: "1px solid var(--line)",
          fontSize: "13px",
          color: "var(--muted)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <ShieldCheck size={20} style={{ color: "var(--green)", flexShrink: 0 }} />
        <div>
          <strong>Privacy Safeguard / गोपनीयता संरक्षण:</strong> This card intentionally omits private contact phone numbers, complete home addresses, and sensitive identity numbers. Anyone scanning the QR code sees strictly the verified public member confirmation.
        </div>
      </div>
    </div>
  );
}
