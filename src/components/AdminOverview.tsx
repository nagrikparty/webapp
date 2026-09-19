import React, { useEffect, useState } from "react";
import {
  Users,
  FileCheck2,
  FileSpreadsheet,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Award,
  Layers,
  ShieldAlert,
  AlertCircle,
  Megaphone,
  Settings,
  Receipt,
  FileText,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/brand";

interface SystemStats {
  totalProfiles: number;
  pendingApplications: number;
  approvedMembers: number;
  totalCrimes: number;
  openIssues: number;
  totalExports: number;
  totalStatements: number;
  volunteersCount: number;
}

export function AdminOverview() {
  const [stats, setStats] = useState<SystemStats>({
    totalProfiles: 0,
    pendingApplications: 0,
    approvedMembers: 0,
    totalCrimes: 0,
    openIssues: 0,
    totalExports: 0,
    totalStatements: 0,
    volunteersCount: 0,
  });
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    setLoading(true);
    try {
      if (!supabase) return;

      const [
        { count: profilesCount },
        { count: pendingAppsCount },
        { count: membersCount },
        { count: crimesCount },
        { count: issuesCount },
        { count: exportsCount },
        { count: statementsCount },
        { count: volunteersCount },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("membership_applications").select("*", { count: "exact", head: true }).in("status", ["SUBMITTED", "UNDER_REVIEW"]),
        supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "APPROVED"),
        supabase.from("crimes").select("*", { count: "exact", head: true }),
        supabase.from("issues").select("*", { count: "exact", head: true }).neq("status", "resolved"),
        supabase.from("submission_exports").select("*", { count: "exact", head: true }),
        supabase.from("financial_statements").select("*", { count: "exact", head: true }),
        supabase.from("volunteer_applications").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        totalProfiles: profilesCount || 0,
        pendingApplications: pendingAppsCount || 0,
        approvedMembers: membersCount || 0,
        totalCrimes: crimesCount || 0,
        openIssues: issuesCount || 0,
        totalExports: exportsCount || 0,
        totalStatements: statementsCount || 0,
        volunteersCount: volunteersCount || 0,
      });
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      {/* Top Banner */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          padding: "22px 26px",
          borderRadius: "4px",
          border: "1px solid var(--line-strong)",
          boxShadow: "var(--shadow)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <h2 style={{ fontSize: "21px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
              Executive Command Hub
            </h2>
            <span
              style={{
                fontSize: "10.5px",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                background: "rgba(179, 74, 21, 0.08)",
                border: "1px solid rgba(179, 74, 21, 0.25)",
                color: "var(--saffron)",
                padding: "2px 7px",
                borderRadius: "2px",
                letterSpacing: "0.04em",
              }}
            >
              PHASE 1 · FORMATION PHASE
            </span>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: 0 }}>
            {BRAND.fullName} · Central executive engine for Phase 1 formation oversight, document scrutiny, and statutory compliance.
          </p>
        </div>

        <button
          type="button"
          onClick={loadStats}
          className="button"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", minHeight: "40px", padding: "8px 16px", borderRadius: "3px", fontSize: "13px" }}
        >
          <RefreshCw size={14} /> Refresh Engine
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
        <div className="card" style={{ background: "var(--paper-card)", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              Approved Members
            </span>
            <Award size={18} style={{ color: "var(--green)" }} />
          </div>
          <div style={{ fontSize: "26px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--green)" }}>
            {loading ? "..." : stats.approvedMembers}
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "4px" }}>
            Verified with sequential ID
          </div>
        </div>

        <div className="card" style={{ background: "var(--paper-card)", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              Pending Scrutiny
            </span>
            <AlertTriangle size={18} style={{ color: "var(--saffron)" }} />
          </div>
          <div style={{ fontSize: "26px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--saffron)" }}>
            {loading ? "..." : stats.pendingApplications}
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "4px" }}>
            In verification queue
          </div>
        </div>

        <div className="card" style={{ background: "var(--paper-card)", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              Crime Citations
            </span>
            <ShieldAlert size={18} style={{ color: "#dc2626" }} />
          </div>
          <div style={{ fontSize: "26px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--ink)" }}>
            {loading ? "..." : stats.totalCrimes}
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "4px" }}>
            Verified legal citations
          </div>
        </div>

        <div className="card" style={{ background: "var(--paper-card)", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              Active Grievances
            </span>
            <AlertCircle size={18} style={{ color: "var(--blue)" }} />
          </div>
          <div style={{ fontSize: "26px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--blue)" }}>
            {loading ? "..." : stats.openIssues}
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "4px" }}>
            Citizen reports under review
          </div>
        </div>
      </div>

      {/* Parent Modules Navigation Grid */}
      <div>
        <h3 style={{ fontSize: "17px", fontFamily: "var(--font-serif)", fontWeight: 700, color: "var(--ink)", marginBottom: "14px" }}>
          Central Operational Modules
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {/* Module 1: Membership */}
          <a
            href="/admin/members"
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "22px",
              borderRadius: "4px",
              border: "1px solid var(--line-strong)",
              boxShadow: "var(--shadow)",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "3px",
                  background: "rgba(29, 86, 53, 0.08)",
                  border: "1px solid rgba(29, 86, 53, 0.25)",
                  color: "var(--green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                <Users size={22} />
              </div>
              <h4 style={{ fontSize: "16px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
                Membership & Verification Desk
              </h4>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Intake queues, identity document scrutiny, EPIC voter verification, member register, and sequential ID card console.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "var(--green)", marginTop: "16px" }}>
              Open Membership Hub <ArrowRight size={14} />
            </div>
          </a>

          {/* Module 2: Civic Engine */}
          <a
            href="/admin/civic"
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "22px",
              borderRadius: "4px",
              border: "1px solid var(--line-strong)",
              boxShadow: "var(--shadow)",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "3px",
                  background: "rgba(179, 74, 21, 0.08)",
                  border: "1px solid rgba(179, 74, 21, 0.25)",
                  color: "var(--saffron)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                <ShieldAlert size={22} />
              </div>
              <h4 style={{ fontSize: "16px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
                Civic & Governance Engine
              </h4>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Verified crime citation management, citizen issue review and resolution, and manifesto policy deliberations with vote tracking.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "var(--saffron)", marginTop: "16px" }}>
              Open Civic Engine <ArrowRight size={14} />
            </div>
          </a>

          {/* Module 3: Compliance & Vault */}
          <a
            href="/admin/compliance"
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "22px",
              borderRadius: "4px",
              border: "1px solid var(--line-strong)",
              boxShadow: "var(--shadow)",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "3px",
                  background: "rgba(22, 53, 92, 0.08)",
                  border: "1px solid rgba(22, 53, 92, 0.25)",
                  color: "var(--blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                <Layers size={22} />
              </div>
              <h4 style={{ fontSize: "16px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
                Statutory Compliance & Vault
              </h4>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Compile continuous page-numbered ECI registration dossiers, inspect 24 statutory charters, and track formation milestones.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "var(--blue)", marginTop: "16px" }}>
              Open Compliance Vault <ArrowRight size={14} />
            </div>
          </a>

          {/* Module 4: Finance & Transparency */}
          <a
            href="/admin/finance"
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "22px",
              borderRadius: "4px",
              border: "1px solid var(--line-strong)",
              boxShadow: "var(--shadow)",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "3px",
                  background: "rgba(179, 74, 21, 0.08)",
                  border: "1px solid rgba(179, 74, 21, 0.25)",
                  color: "var(--saffron)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                <FileSpreadsheet size={22} />
              </div>
              <h4 style={{ fontSize: "16px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
                Financial Transparency & Donations
              </h4>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Publish audited receipts and balance sheets, manage cashless UPI donation configuration, and audit donor provenance.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "var(--saffron)", marginTop: "16px" }}>
              Open Finance Hub <ArrowRight size={14} />
            </div>
          </a>

          {/* Module 5: Operations & Fieldwork */}
          <a
            href="/admin/operations"
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "22px",
              borderRadius: "4px",
              border: "1px solid var(--line-strong)",
              boxShadow: "var(--shadow)",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "3px",
                  background: "rgba(29, 86, 53, 0.08)",
                  border: "1px solid rgba(29, 86, 53, 0.25)",
                  color: "var(--green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                <Megaphone size={22} />
              </div>
              <h4 style={{ fontSize: "16px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
                Operations & Fieldwork
              </h4>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Process volunteer applications across Delhi wards, assign and track field tasks, and broadcast targeted announcements.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "var(--green)", marginTop: "16px" }}>
              Open Operations Hub <ArrowRight size={14} />
            </div>
          </a>

          {/* Module 6: System & Security */}
          <a
            href="/admin/settings"
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "22px",
              borderRadius: "4px",
              border: "1px solid var(--line-strong)",
              boxShadow: "var(--shadow)",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "3px",
                  background: "rgba(22, 53, 92, 0.08)",
                  border: "1px solid rgba(22, 53, 92, 0.25)",
                  color: "var(--blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                }}
              >
                <Settings size={22} />
              </div>
              <h4 style={{ fontSize: "16px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
                System Configuration & Audit
              </h4>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Configure formation phase parameters, manage staff security roles (Super Admin, Verifier), and view tamper-evident logs.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "var(--blue)", marginTop: "16px" }}>
              Open System & Audit <ArrowRight size={14} />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
