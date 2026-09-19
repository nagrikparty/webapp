import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  FileText,
  ShieldCheck,
  Download,
  Compass,
  Megaphone,
  Save,
  Edit3,
  X,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Profile, Member } from "@/lib/types";

interface ApplicationSummary {
  id: string;
  application_number: string;
  status: string;
  membership_category?: string;
  submitted_at?: string;
  reviewed_at?: string;
  correction_notes?: string;
  rejection_reason?: string;
}

interface ParticipationData {
  id?: string;
  interest_areas?: string[];
  skills?: string;
  availability?: string;
  notes?: string;
}

interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  ward?: string;
  status: string;
  created_at: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  target_audience: string;
  created_at: string;
}

interface FormationProgressSummary {
  percentage: number;
  phaseCode: string;
  phaseLabel: string;
  currentPhaseName: string;
}

const ALL_INTEREST_OPTIONS = [
  "Community work",
  "Research",
  "Policy",
  "Technology",
  "Design",
  "Video",
  "Writing",
  "Legal",
  "Data",
  "Media",
  "Outreach",
  "Events",
  "Administration",
  "Translation",
];

export function MemberDashboard() {
  const [loading, setLoading] = useState(true);
  const [needsAuth, setNeedsAuth] = useState(false);

  // Core Data
  const [profile, setProfile] = useState<Profile | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [application, setApplication] = useState<ApplicationSummary | null>(null);
  const [participation, setParticipation] = useState<ParticipationData | null>(null);
  const [assignedTasks, setAssignedTasks] = useState<VolunteerTask[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [formationProgress, setFormationProgress] = useState<FormationProgressSummary | null>(null);

  // Edit Profile & Participation Modal / Drawer State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editWard, setEditWard] = useState("");
  const [editVidhanSabha, setEditVidhanSabha] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [editInterests, setEditInterests] = useState<string[]>([]);
  const [editAvailability, setEditAvailability] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveMsg, setProfileSaveMsg] = useState("");
  const [profileSaveError, setProfileSaveError] = useState("");

  // Card Flip / View State
  const [showCardBack, setShowCardBack] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  async function loadDashboardData() {
    if (!supabase) return;
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setNeedsAuth(true);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/v1/member/status", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.status === 401) {
        setNeedsAuth(true);
        setLoading(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile || null);
        setMember(data.member || null);
        setApplication(data.application || null);
        setParticipation(data.participation || null);
        setAssignedTasks(data.assignedTasks || []);
        setAnnouncements(data.announcements || []);
        setFormationProgress(data.formationProgress || null);

        // Pre-fill editable fields
        if (data.profile) {
          setEditFullName(data.profile.full_name || "");
          setEditPhone(data.profile.phone || "");
          setEditWard(data.profile.ward || "");
          setEditVidhanSabha(data.profile.vidhan_sabha || "");
        }
        if (data.participation) {
          setEditSkills(data.participation.skills || "");
          setEditInterests(data.participation.interest_areas || []);
          setEditAvailability(data.participation.availability || "");
        }
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;

    setSavingProfile(true);
    setProfileSaveMsg("");
    setProfileSaveError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setNeedsAuth(true);
        return;
      }

      const res = await fetch("/api/v1/member/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          full_name: editFullName,
          phone: editPhone,
          ward: editWard,
          vidhan_sabha: editVidhanSabha,
          skills: editSkills,
          interest_areas: editInterests,
          availability: editAvailability,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfileSaveMsg(data.notice || "Profile and participation details updated successfully.");
        if (data.profile) setProfile(data.profile);
        if (data.participation) setParticipation(data.participation);
        setTimeout(() => {
          setIsEditingProfile(false);
          setProfileSaveMsg("");
        }, 2000);
      } else {
        setProfileSaveError(data.error || "Failed to update profile.");
      }
    } catch (err: unknown) {
      setProfileSaveError(err instanceof Error ? err.message : "Network error occurred.");
    } finally {
      setSavingProfile(false);
    }
  }

  function toggleInterest(interest: string) {
    setEditInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  async function downloadCardPdf() {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setDownloadingPdf(true);
    try {
      const res = await fetch("/api/v1/member/card-pdf", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to download card PDF.");
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
      alert(err instanceof Error ? err.message : "Error downloading card PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--muted)" }}>
        <Loader2 className="animate-spin" size={32} style={{ margin: "0 auto 12px", color: "var(--saffron)" }} />
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>Loading your member space...</p>
      </div>
    );
  }

  if (needsAuth) {
    return (
      <div
        className="card"
        style={{
          padding: "44px 28px",
          textAlign: "center",
          background: "var(--paper-card)",
          borderRadius: "4px",
          border: "1px solid var(--line-strong)",
          boxShadow: "var(--shadow)",
          maxWidth: "540px",
          margin: "40px auto",
        }}
      >
        <Clock size={44} style={{ color: "var(--saffron)", margin: "0 auto 16px" }} />
        <h2 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 8px", color: "var(--ink)" }}>
          Sign In to Member Space
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "14px", margin: "0 0 24px", lineHeight: 1.55 }}>
          Please sign in to access your personal member dashboard, verification docket, and digital card.
        </p>
        <a
          href="/login?redirect=/member"
          className="button button-primary"
          style={{ padding: "12px 28px", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          Sign In to Continue &rarr;
        </a>
      </div>
    );
  }

  // Authoritative Member Status Interpretation
  const isApproved = Boolean(member && member.status === "APPROVED");
  const appStatus = application?.status || "NO_APPLICATION";
  const fullName = profile?.full_name || member?.full_name || "Supporter";
  const firstName = fullName.trim().split(" ")[0];

  // Nagrik ID determination
  const nagrikId = member?.membership_id || (application?.application_number ? application.application_number : "Pending Induction");

  // Joined Date determination
  const joinedDate = member?.approved_at
    ? new Date(member.approved_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : application?.submitted_at
    ? new Date(application.submitted_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Recent";

  // Locality details
  const constituency = profile?.vidhan_sabha || "Delhi AC";
  const ward = profile?.ward || "Local Ward";
  const category = member?.category || application?.membership_category || "Primary Member";
  const userInterests = participation?.interest_areas || [];

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto", display: "grid", gap: "22px" }}>

      {/* 1. WELCOME & IDENTITY BANNER */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          borderRadius: "4px",
          padding: "clamp(20px, 3.2vw, 32px)",
          border: "1px solid var(--line-strong)",
          boxShadow: "var(--shadow)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "3px",
              background: "var(--paper)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--line-strong)",
              fontSize: "22px",
              fontWeight: 800,
              fontFamily: "var(--font-serif)",
              color: "var(--saffron)",
              flexShrink: 0,
            }}
          >
            {firstName[0]?.toUpperCase() || "N"}
          </div>

          <div>
            <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              NAGRIK MEMBER SPACE
            </div>
            <h1 style={{ fontSize: "clamp(1.25rem, 2.8vw, 1.65rem)", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "2px 0 4px", color: "var(--ink)" }}>
              Hello, {firstName}
            </h1>
            <div style={{ fontSize: "13px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
              Nagrik ID:{" "}
              <strong style={{ color: "var(--saffron)", fontWeight: 700 }}>
                {nagrikId}
              </strong>
            </div>
          </div>
        </div>

        {/* Status Badge */}
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
          ) : appStatus === "SUBMITTED" || appStatus === "UNDER_REVIEW" ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "2px",
                background: "rgba(22, 53, 92, 0.08)",
                border: "1px solid rgba(22, 53, 92, 0.25)",
                color: "var(--blue)",
                fontWeight: 700,
                fontSize: "12px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
              }}
            >
              <Clock size={15} /> UNDER SCRUTINY
            </span>
          ) : appStatus === "NEEDS_CORRECTION" ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "2px",
                background: "rgba(179, 74, 21, 0.1)",
                border: "1px solid rgba(179, 74, 21, 0.3)",
                color: "var(--saffron)",
                fontWeight: 700,
                fontSize: "12px",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
              }}
            >
              <AlertTriangle size={15} /> CORRECTION REQUIRED
            </span>
          ) : appStatus === "DRAFT" ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "2px",
                background: "var(--paper-subtle)",
                border: "1px solid var(--line)",
                color: "var(--ink)",
                fontWeight: 700,
                fontSize: "12px",
                fontFamily: "var(--font-mono)",
              }}
            >
              DRAFT SAVED
            </span>
          ) : (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "2px",
                background: "rgba(179, 74, 21, 0.08)",
                border: "1px solid rgba(179, 74, 21, 0.2)",
                color: "var(--saffron)",
                fontWeight: 700,
                fontSize: "12px",
                fontFamily: "var(--font-mono)",
              }}
            >
              SUPPORTER · INDUCTION PENDING
            </span>
          )}
        </div>
      </div>

      {/* 2. DYNAMIC NEXT ACTION CARD */}
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
              <strong style={{ fontSize: "15px", color: "var(--ink)" }}>Next Step: Complete Membership Induction</strong>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0", lineHeight: 1.5 }}>
                You have registered a supporter account. Submit your voter verification details and statutory declarations to complete your founding membership induction under Section 29A RPA 1951.
              </p>
            </div>
            <a href="/member/induction" className="button button-primary" style={{ padding: "9px 20px", fontSize: "13px", whiteSpace: "nowrap" }}>
              Start Induction &rarr;
            </a>
          </div>
        )}

        {appStatus === "DRAFT" && (
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
              <strong style={{ fontSize: "15px", color: "var(--ink)" }}>Next Step: Resume Saved Induction Docket</strong>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0", lineHeight: 1.5 }}>
                Your membership application docket ({application?.application_number}) is saved in draft. Continue remaining sections to submit for verification.
              </p>
            </div>
            <a href="/member/induction" className="button button-primary" style={{ padding: "9px 20px", fontSize: "13px", whiteSpace: "nowrap" }}>
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
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
              <AlertTriangle size={20} style={{ color: "var(--saffron)", flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ fontSize: "15px", color: "var(--ink)" }}>Next Step: Scrutiny Desk Correction Required</strong>
                <div style={{ fontSize: "13px", color: "var(--ink)", marginTop: "6px", background: "var(--paper)", padding: "10px 14px", borderRadius: "3px", border: "1px solid var(--line)" }}>
                  {application?.correction_notes || "Please re-verify your proof of residence or clear document scan."}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <a href="/member/induction" className="button button-primary" style={{ padding: "9px 20px", fontSize: "13px" }}>
                Update & Resubmit Docket &rarr;
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
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0", lineHeight: 1.5 }}>
                Your docket ({application?.application_number}) was submitted on{" "}
                {application?.submitted_at ? new Date(application.submitted_at).toLocaleDateString("en-IN") : "recently"}.
                Our scrutiny desk is verifying your electoral details against Section 29A RPA 1951 requirements.
              </p>
            </div>
            <a href="/member/status" className="button" style={{ padding: "8px 18px", fontSize: "13px" }}>
              View Scrutiny Progress
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
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0", lineHeight: 1.5 }}>
                Your organizational membership record is verified. Your digital membership card is active and ready to use.
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setShowCardBack(!showCardBack)}
                className="button"
                style={{ padding: "8px 14px", fontSize: "12.5px" }}
              >
                {showCardBack ? "View Card Front" : "View Card Back / QR"}
              </button>
              <button
                type="button"
                onClick={downloadCardPdf}
                disabled={downloadingPdf}
                className="button button-primary"
                style={{ padding: "8px 16px", fontSize: "12.5px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Download size={14} /> {downloadingPdf ? "Generating..." : "Download Card PDF"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. DIGITAL MEMBERSHIP CARD VIEW */}
      {isApproved && (
        <div
          className="card"
          style={{
            background: "var(--paper-card)",
            padding: "24px 26px",
            borderRadius: "4px",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
                Digital Membership Card
              </h3>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                Organisational identification for Nagrik Party · Not a government-issued document
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowCardBack(!showCardBack)}
              className="button"
              style={{ fontSize: "12px", padding: "6px 12px" }}
            >
              Flip to {showCardBack ? "Front" : "Back (QR Code)"}
            </button>
          </div>

          {/* CR80 Card Mockup */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "100%",
                maxWidth: "420px",
                aspectRatio: "1.586",
                background: "linear-gradient(135deg, #1c1c1a 0%, #2a2a26 100%)",
                borderRadius: "12px",
                padding: "20px 22px",
                color: "#ffffff",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Saffron accent bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "var(--saffron)" }} />

              {!showCardBack ? (
                /* CARD FRONT */
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        NAGRIK PARTY
                      </div>
                      <div style={{ fontSize: "9px", color: "rgba(255, 255, 255, 0.65)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
                        PHASE 1 · FORMATION PHASE
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "9px",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        background: "rgba(245, 130, 32, 0.2)",
                        color: "#f58220",
                        padding: "2px 6px",
                        borderRadius: "2px",
                        border: "1px solid rgba(245, 130, 32, 0.4)",
                      }}
                    >
                      {category.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: "9px", color: "rgba(255, 255, 255, 0.6)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Member Name
                    </div>
                    <div style={{ fontSize: "17px", fontWeight: 700, fontFamily: "var(--font-serif)", letterSpacing: "0.02em" }}>
                      {fullName}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: "10.5px" }}>
                    <div>
                      <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "8.5px", textTransform: "uppercase" }}>
                        Nagrik ID
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "#f58220", fontSize: "12px" }}>
                        {nagrikId}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "8.5px", textTransform: "uppercase" }}>
                        Constituency
                      </div>
                      <div style={{ fontWeight: 600 }}>
                        {constituency}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* CARD BACK */
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "9.5px", fontFamily: "var(--font-mono)", color: "rgba(255, 255, 255, 0.7)" }}>
                      ORGANISATIONAL RECORD
                    </div>
                    <div style={{ fontSize: "9px", color: "rgba(255, 255, 255, 0.5)" }}>
                      Issued: {joinedDate}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "auto 0" }}>
                    <div style={{ background: "#ffffff", padding: "6px", borderRadius: "4px", display: "inline-block" }}>
                      <QRCode
                        value={`https://nagrik.party/verify/member/${encodeURIComponent(nagrikId)}`}
                        size={84}
                      />
                    </div>
                    <div style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.45 }}>
                      <div><strong>QR Verification:</strong></div>
                      <div>Scan to verify digital record on official Nagrik registry.</div>
                      <div style={{ marginTop: "4px", color: "rgba(255, 255, 255, 0.5)", fontSize: "8.5px" }}>
                        Section 29A RPA 1951 Pre-Registration Record
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: "8px", color: "rgba(255, 255, 255, 0.5)", textAlign: "center" }}>
                    Property of Nagrik Party. Valid for internal party operations only.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. TWO-COLUMN: PARTICIPATION & FORMATION PROGRESS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "20px" }}>
        
        {/* Participation & Skills Card */}
        <div
          className="card"
          style={{
            background: "var(--paper-card)",
            borderRadius: "4px",
            padding: "22px 24px",
            border: "1px solid var(--line)",
            boxShadow: "var(--shadow)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-serif)", margin: 0, color: "var(--ink)" }}>
                Your Participation
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="button"
                style={{ fontSize: "12px", padding: "4px 10px", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <Edit3 size={13} /> Edit Skills
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 14px", lineHeight: 1.5 }}>
              Contribution focus areas recorded for Phase 1 volunteer organization:
            </p>

            {userInterests.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                {userInterests.map((interest) => (
                  <span
                    key={interest}
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      background: "var(--paper-subtle)",
                      color: "var(--ink)",
                      padding: "3px 9px",
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
                No contribution areas selected yet.
              </div>
            )}

            {/* Assigned Volunteer Tasks */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px", marginTop: "10px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-mono)", marginBottom: "8px" }}>
                Assigned Tasks ({assignedTasks.length})
              </div>

              {assignedTasks.length > 0 ? (
                <div style={{ display: "grid", gap: "8px" }}>
                  {assignedTasks.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        padding: "10px 12px",
                        background: "var(--paper)",
                        borderRadius: "3px",
                        border: "1px solid var(--line)",
                        fontSize: "12.5px",
                      }}
                    >
                      <div style={{ fontWeight: 700, color: "var(--ink)" }}>{t.title}</div>
                      {t.description && <div style={{ color: "var(--muted)", fontSize: "12px", marginTop: "2px" }}>{t.description}</div>}
                      <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>
                        Status: <strong style={{ textTransform: "capitalize" }}>{t.status}</strong> {t.ward && `· Ward: ${t.ward}`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: "13px", color: "var(--muted)" }}>
                  No tasks have been assigned to you yet.
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: "16px" }}>
            <a
              href="/build-with-us"
              style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--saffron)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              Explore Volunteer Tasks in Build With Us &rarr;
            </a>
          </div>
        </div>

        {/* Formation Progress Card */}
        <div
          className="card"
          style={{
            background: "var(--paper-card)",
            borderRadius: "4px",
            padding: "22px 24px",
            border: "1px solid var(--line)",
            boxShadow: "var(--shadow)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-serif)", margin: 0, color: "var(--ink)" }}>
                Formation Progress
              </h3>
              <span style={{ fontSize: "15px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--saffron)" }}>
                {formationProgress?.percentage ?? 24}%
              </span>
            </div>

            <div style={{ width: "100%", height: "8px", background: "var(--paper-subtle)", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--line)", marginBottom: "14px" }}>
              <div style={{ width: `${formationProgress?.percentage ?? 24}%`, height: "100%", background: "var(--saffron)" }} />
            </div>

            <div style={{ fontSize: "12.5px", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase", marginBottom: "4px" }}>
              {formationProgress?.phaseLabel || "PHASE 1 · FORMATION PHASE"}
            </div>

            <p style={{ fontSize: "13px", color: "var(--ink)", lineHeight: 1.5, margin: "0 0 14px" }}>
              Current stage: <strong>{formationProgress?.currentPhaseName || "Founding Member Induction across Delhi's 70 Assembly constituencies."}</strong>
            </p>

            <p style={{ fontSize: "12.5px", color: "var(--muted)", margin: 0, lineHeight: 1.45 }}>
              Progress is mathematically weighted across 9 statutory milestones required for Section 29A RPA 1951 registration.
            </p>
          </div>

          <div style={{ marginTop: "16px" }}>
            <a
              href="/formation-progress"
              style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--saffron)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              Inspect 9-Stage Legal Roadmap &rarr;
            </a>
          </div>
        </div>

      </div>

      {/* 5. ORGANISATIONAL RECORD & PROFILE SUMMARY */}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-serif)", margin: 0, color: "var(--ink)" }}>
            Profile & Organizational Record
          </h3>
          <button
            type="button"
            onClick={() => setIsEditingProfile(true)}
            className="button"
            style={{ fontSize: "12.5px", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            <Edit3 size={13} /> Edit Profile
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", fontSize: "13px" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              FULL LEGAL NAME
            </div>
            <div style={{ fontSize: "14px", color: "var(--ink)", marginTop: "2px", fontWeight: 600 }}>
              {fullName}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              VIDHAN SABHA (ASSEMBLY)
            </div>
            <div style={{ fontSize: "14px", color: "var(--ink)", marginTop: "2px" }}>
              {constituency}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              WARD / LOCALITY
            </div>
            <div style={{ fontSize: "14px", color: "var(--ink)", marginTop: "2px" }}>
              {ward}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              CATEGORY
            </div>
            <div style={{ fontSize: "14px", color: "var(--ink)", marginTop: "2px" }}>
              {category}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              JOINED DATE
            </div>
            <div style={{ fontSize: "14px", color: "var(--ink)", marginTop: "2px" }}>
              {joinedDate}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              CONTACT PHONE
            </div>
            <div style={{ fontSize: "14px", color: "var(--ink)", marginTop: "2px" }}>
              {profile?.phone || "Not specified"}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>
            Stored securely with SHA-256 cryptographic hashes for Section 29A regulatory filing.
          </div>
          <a
            href="/member/documents"
            style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--saffron)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            Access Encrypted Document Vault &rarr;
          </a>
        </div>
      </div>

      {/* 6. EDIT PROFILE & PARTICIPATION MODAL / DRAWER */}
      {isEditingProfile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
        >
          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              borderRadius: "4px",
              padding: "26px 30px",
              border: "1px solid var(--line-strong)",
              boxShadow: "0 20px 48px rgba(0, 0, 0, 0.2)",
              maxWidth: "580px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 700, margin: 0, fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
                Edit Member Profile & Participation
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            {profileSaveMsg && (
              <div style={{ padding: "10px 14px", background: "rgba(29, 86, 53, 0.08)", border: "1px solid rgba(29, 86, 53, 0.25)", color: "var(--green)", borderRadius: "3px", fontSize: "13px", marginBottom: "14px" }}>
                {profileSaveMsg}
              </div>
            )}
            {profileSaveError && (
              <div style={{ padding: "10px 14px", background: "rgba(220, 38, 38, 0.08)", border: "1px solid rgba(220, 38, 38, 0.25)", color: "var(--red)", borderRadius: "3px", fontSize: "13px", marginBottom: "14px" }}>
                {profileSaveError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} style={{ display: "grid", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Legal Full Name
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", minHeight: "38px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                />
                {isApproved && (
                  <span style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px", display: "block" }}>
                    Changes may require verification by the scrutiny desk.
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    Delhi Vidhan Sabha
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Okhla, New Delhi, etc."
                    value={editVidhanSabha}
                    onChange={(e) => setEditVidhanSabha(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", minHeight: "38px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    Ward / Locality
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ward 188, Zakir Nagar"
                    value={editWard}
                    onChange={(e) => setEditWard(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", minHeight: "38px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98XXXXXXXX"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", minHeight: "38px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>
                  Select Contribution Areas (Click to toggle)
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {ALL_INTEREST_OPTIONS.map((interest) => {
                    const isSelected = editInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        style={{
                          fontSize: "12px",
                          padding: "4px 10px",
                          borderRadius: "3px",
                          border: isSelected ? "1px solid var(--ink)" : "1px solid var(--line)",
                          background: isSelected ? "var(--ink)" : "var(--paper)",
                          color: isSelected ? "#ffffff" : "var(--ink)",
                          cursor: "pointer",
                        }}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Specific Skills or Focus Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Legal drafting, grassroots ground outreach, design, web development..."
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="button"
                  style={{ fontSize: "13px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="button button-primary"
                  style={{ fontSize: "13px", padding: "8px 20px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Save size={14} /> {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. ORGANISATION UPDATES SECTION */}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-serif)", margin: 0, color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Megaphone size={18} style={{ color: "var(--saffron)" }} />
            Party Announcements & Updates
          </h3>
          <span style={{ fontSize: "11.5px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            PHASE 1 DISPATCHES
          </span>
        </div>

        {announcements.length > 0 ? (
          <div style={{ display: "grid", gap: "12px" }}>
            {announcements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  padding: "14px 18px",
                  borderRadius: "3px",
                  border: "1px solid var(--line)",
                  background: "var(--paper)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px", flexWrap: "wrap", gap: "6px" }}>
                  <strong style={{ fontSize: "14px", color: "var(--ink)" }}>{ann.title}</strong>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                    {new Date(ann.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--ink)", margin: 0, lineHeight: 1.5 }}>
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: "13px", color: "var(--muted)", padding: "12px 0" }}>
            No new updates. Check back for official notices regarding the Phase 1 General Body Meeting.
          </div>
        )}
      </div>

      {/* 8. QUICK ACTIONS HUB */}
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
          <strong style={{ display: "block", fontSize: "14.5px", color: "var(--ink)" }}>Membership Card</strong>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>CR80 digital card with verification QR</span>
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
          <strong style={{ display: "block", fontSize: "14.5px", color: "var(--ink)" }}>Document Vault</strong>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>Private encrypted identity dockets</span>
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
          <strong style={{ display: "block", fontSize: "14.5px", color: "var(--ink)" }}>Report Civic Issue</strong>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>File a constituency civic grievance</span>
        </a>
      </div>

    </div>
  );
}
