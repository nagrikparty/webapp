import React, { useCallback, useEffect, useState } from "react";
import {
  Award,
  Clock,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Metrics {
  totalApplications: number;
  pendingApplications: number;
  underReviewApplications: number;
  approvedMembers: number;
  rejectedApplications: number;
  needsCorrection: number;
  draftApplications: number;
}

interface DocumentBreakdown {
  address: number;
  electoral: number;
  declaration: number;
  consent: number;
  signature: number;
  documents: number;
}

interface VidhanSabhaCoverage {
  covered: number;
  total: number;
  counts: Record<string, number>;
}

interface ProposerStats {
  total: number;
  verified: number;
  notarized: number;
  submitted: number;
  draft: number;
  rejected: number;
}

interface EciReadiness {
  foundingMembersRequired: number;
  foundingMembersApproved: number;
  foundingMembersVerified: number;
  vidhanSabhaCoverage: number;
  vidhanSabhaTotal: number;
  documentCompleteness: number;
  proposerReadiness: boolean;
  overallReadiness: number;
}

interface RecentApplication {
  id: string;
  application_number: string;
  status: string;
  created_at: string;
}

interface Payload {
  generatedAt: string;
  metrics: Metrics;
  documentBreakdown: DocumentBreakdown;
  completeMembersCount: number;
  vidhanSabhaCoverage: VidhanSabhaCoverage;
  proposerStats: ProposerStats;
  eciReadiness: EciReadiness;
  recentApplications: RecentApplication[];
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ height: "8px", background: "var(--line)", borderRadius: "4px", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, transition: "width 0.5s ease" }} />
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    APPROVED: { bg: "rgba(4, 106, 56, 0.1)", fg: "var(--green)" },
    SUBMITTED: { bg: "rgba(232, 87, 26, 0.1)", fg: "var(--saffron)" },
    UNDER_REVIEW: { bg: "rgba(30, 90, 180, 0.1)", fg: "var(--blue)" },
    NEEDS_CORRECTION: { bg: "rgba(232, 87, 26, 0.1)", fg: "var(--saffron)" },
    REJECTED: { bg: "rgba(200, 30, 30, 0.1)", fg: "#c81e1e" },
    DRAFT: { bg: "rgba(120, 120, 130, 0.1)", fg: "var(--muted)" },
  };
  const c = map[status] || map.DRAFT;
  return (
    <span
      style={{
        fontSize: "10.5px",
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        background: c.bg,
        color: c.fg,
        padding: "2px 7px",
        borderRadius: "2px",
        letterSpacing: "0.04em",
      }}
    >
      {status}
    </span>
  );
}

export function AdminProgressDashboard() {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error("Supabase not configured");
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        setError("Session expired. Please log in again.");
        return;
      }
      const res = await fetch("/api/v1/admin/progress", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      setPayload(await res.json());
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Progress dashboard load failed:", err);
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  const m = payload?.metrics;
  const db = payload?.documentBreakdown;
  const eci = payload?.eciReadiness;
  const ps = payload?.proposerStats;

  const statusCards = [
    { label: "Total Applications", value: m?.totalApplications ?? 0, icon: FileText, color: "var(--blue)" },
    { label: "Awaiting Scrutiny", value: m?.pendingApplications ?? 0, icon: Clock, color: "var(--saffron)" },
    { label: "Under Review", value: m?.underReviewApplications ?? 0, icon: ShieldCheck, color: "var(--blue)" },
    { label: "Approved Founding Members", value: m?.approvedMembers ?? 0, icon: Award, color: "var(--green)" },
    { label: "Needs Correction", value: m?.needsCorrection ?? 0, icon: AlertTriangle, color: "var(--saffron)" },
    { label: "Rejected", value: m?.rejectedApplications ?? 0, icon: XCircle, color: "#c81e1e" },
    { label: "Saved Drafts", value: m?.draftApplications ?? 0, icon: FileText, color: "var(--muted)" },
  ];

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h2
            style={{
              fontSize: "20px",
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              margin: "0 0 4px",
              color: "var(--ink)",
              display: "flex",
              alignItems: "center",
              gap: "9px",
            }}
          >
            <TrendingUp size={20} style={{ color: "var(--green)" }} />
            Formation Progress &amp; ECI Readiness
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: 0 }}>
            Live tracking of founding member induction toward Section 29A RPA 1951 registration. Auto-refreshes every 30s.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {lastRefresh && (
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
              {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button
            type="button"
            onClick={load}
            className="button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              minHeight: "40px",
              padding: "8px 16px",
              borderRadius: "3px",
              fontSize: "13px",
            }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div
          className="card"
          style={{
            background: "rgba(200, 30, 30, 0.06)",
            border: "1px solid rgba(200, 30, 30, 0.3)",
            padding: "14px 18px",
            borderRadius: "4px",
            color: "#c81e1e",
            fontSize: "13px",
          }}
        >
          <strong>Load failed:</strong> {error}
        </div>
      )}

      {/* ECI READINESS METER */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          padding: "24px 26px",
          borderRadius: "4px",
          border: "1px solid var(--line-strong)",
          borderLeft: eci?.proposerReadiness ? "4px solid var(--green)" : "4px solid var(--saffron)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", flexWrap: "wrap", marginBottom: "18px" }}>
          <h3 style={{ fontSize: "17px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: 0, color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
            <ClipboardCheck size={18} style={{ color: eci?.proposerReadiness ? "var(--green)" : "var(--saffron)" }} />
            Section 29A Registration Readiness
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "34px", fontWeight: 800, fontFamily: "var(--font-mono)", color: eci?.proposerReadiness ? "var(--green)" : "var(--saffron)", lineHeight: 1 }}>
              {loading ? "…" : `${eci?.overallReadiness ?? 0}%`}
            </span>
            {eci?.proposerReadiness ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 700, color: "var(--green)" }}>
                <CheckCircle2 size={15} /> ECI READY
              </span>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 700, color: "var(--saffron)" }}>
                <AlertTriangle size={15} /> IN PROGRESS
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gap: "18px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
                Verified Founding Members (Proposers)
              </span>
              <span style={{ fontSize: "13px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--ink)" }}>
                {eci?.foundingMembersVerified ?? 0} / {eci?.foundingMembersRequired ?? 100}
              </span>
            </div>
            <ProgressBar value={eci?.foundingMembersVerified ?? 0} max={eci?.foundingMembersRequired ?? 100} color={eci?.proposerReadiness ? "var(--green)" : "var(--saffron)"} />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
                Delhi Vidhan Sabha Coverage
              </span>
              <span style={{ fontSize: "13px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--ink)" }}>
                {eci?.vidhanSabhaCoverage ?? 0} / {eci?.vidhanSabhaTotal ?? 70} ACs
              </span>
            </div>
            <ProgressBar value={eci?.vidhanSabhaCoverage ?? 0} max={eci?.vidhanSabhaTotal ?? 70} color="var(--blue)" />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>
                Document Completeness (all 6 statutory items)
              </span>
              <span style={{ fontSize: "13px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--ink)" }}>
                {eci?.documentCompleteness ?? 0}%
              </span>
            </div>
            <ProgressBar value={eci?.documentCompleteness ?? 0} max={100} color="var(--green)" />
          </div>
        </div>
      </div>

      {/* STATUS CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "14px" }}>
        {statusCards.map((s) => (
          <div
            key={s.label}
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "16px 18px",
              borderRadius: "4px",
              border: "1px solid var(--line-strong)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "10.5px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                {s.label}
              </span>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div style={{ fontSize: "24px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--ink)" }}>
              {loading ? "…" : s.value}
            </div>
          </div>
        ))}
      </div>

      {/* TWO COLUMN: DOCUMENT BREAKDOWN + PROPOSER PIPELINE */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "14px", alignItems: "start" }}>
        <div
          className="card"
          style={{
            background: "var(--paper-card)",
            padding: "22px",
            borderRadius: "4px",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3 style={{ fontSize: "16px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={17} style={{ color: "var(--blue)" }} />
            Statutory Document Coverage
          </h3>
          <p style={{ fontSize: "12.5px", color: "var(--muted)", margin: "0 0 16px", lineHeight: 1.5 }}>
            Every approved member must have all six records. Missing items block ECI approval.
          </p>
          <div style={{ display: "grid", gap: "12px" }}>
            {[
              { label: "Residential Address & AC", value: db?.address ?? 0, color: "var(--blue)" },
              { label: "EPIC / Electoral Details", value: db?.electoral ?? 0, color: "var(--saffron)" },
              { label: "Constitutional Declaration", value: db?.declaration ?? 0, color: "var(--green)" },
              { label: "DPDP Data Consent", value: db?.consent ?? 0, color: "var(--blue)" },
              { label: "Typed Signature", value: db?.signature ?? 0, color: "var(--saffron)" },
              { label: "Identity Document (verified)", value: db?.documents ?? 0, color: "var(--green)" },
            ].map((row) => (
              <div key={row.label}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "5px" }}>
                  <span style={{ fontSize: "12.5px", color: "var(--ink)" }}>{row.label}</span>
                  <span style={{ fontSize: "12.5px", fontWeight: 800, fontFamily: "var(--font-mono)", color: row.color }}>
                    {loading ? "…" : row.value}
                  </span>
                </div>
                <ProgressBar value={row.value} max={Math.max(1, m?.totalApplications ?? 1)} color={row.color} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid var(--line)", fontSize: "12.5px", color: "var(--muted)" }}>
            Fully complete dockets:{" "}
            <strong style={{ color: "var(--green)", fontFamily: "var(--font-mono)" }}>{loading ? "…" : (payload?.completeMembersCount ?? 0)}</strong>
          </div>
        </div>



        <div
          className="card"
          style={{
            background: "var(--paper-card)",
            padding: "22px",
            borderRadius: "4px",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow)",
          }}
        >
          <h3 style={{ fontSize: "16px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={17} style={{ color: "var(--green)" }} />
            Proposer Pipeline (ECI Section 29A)
          </h3>
          <p style={{ fontSize: "12.5px", color: "var(--muted)", margin: "0 0 16px", lineHeight: 1.5 }}>
            Each approved member auto-becomes an ECI proposer. Affidavits must be notarized before filing.
          </p>
          <div style={{ display: "grid", gap: "10px" }}>
            {[
              { label: "Total Proposer Records", value: ps?.total ?? 0, color: "var(--blue)" },
              { label: "Verified / Filing-Ready", value: ps?.verified ?? 0, color: "var(--green)" },
              { label: "Notarized (awaiting verification)", value: ps?.notarized ?? 0, color: "var(--saffron)" },
              { label: "Submitted", value: ps?.submitted ?? 0, color: "var(--blue)" },
              { label: "Draft", value: ps?.draft ?? 0, color: "var(--muted)" },
              { label: "Rejected", value: ps?.rejected ?? 0, color: "#c81e1e" },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "9px 12px",
                  border: "1px solid var(--line)",
                  borderRadius: "3px",
                  background: "var(--paper-subtle)",
                }}
              >
                <span style={{ fontSize: "12.5px", color: "var(--ink)" }}>{row.label}</span>
                <span style={{ fontSize: "14px", fontWeight: 800, fontFamily: "var(--font-mono)", color: row.color }}>
                  {loading ? "…" : row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "14px" }}>
        {[
          { href: "/admin/verifications", label: "Scrutiny Queue", desc: "Review & approve pending dockets", color: "var(--saffron)" },
          { href: "/admin/eci-filing", label: "ECI Filing Dossier", desc: "Compile Section 29A application", color: "var(--green)" },
          { href: "/admin/proposers", label: "Proposer Register", desc: "Notarized affidavits & EPIC records", color: "var(--blue)" },
          { href: "/admin/members", label: "Member Register", desc: "Master founding member roll", color: "var(--ink)" },
          { href: "/admin/exports", label: "Print & Export", desc: "Continuous page-numbered PDF bundle", color: "var(--blue)" },
          { href: "/admin/settings", label: "Roles & Audit", desc: "Staff permissions & audit trail", color: "var(--muted)" },
        ].map((a) => (
          <a
            key={a.href}
            href={a.href}
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "18px 20px",
              borderRadius: "4px",
              border: "1px solid var(--line-strong)",
              boxShadow: "var(--shadow)",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-serif)", color: "var(--ink)" }}>{a.label}</div>
              <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "3px" }}>{a.desc}</div>
            </div>
            <ArrowRight size={16} style={{ color: a.color, flexShrink: 0 }} />
          </a>
        ))}
      </div>
    </div>
  );
}

