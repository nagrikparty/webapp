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
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/brand";

interface SystemStats {
  totalProfiles: number;
  pendingApplications: number;
  approvedMembers: number;
  totalExports: number;
  totalStatements: number;
}

export function AdminOverview() {
  const [stats, setStats] = useState<SystemStats>({
    totalProfiles: 0,
    pendingApplications: 0,
    approvedMembers: 0,
    totalExports: 0,
    totalStatements: 0,
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
        { count: exportsCount },
        { count: statementsCount },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("membership_applications")
          .select("*", { count: "exact", head: true })
          .eq("application_status", "SUBMITTED"),
        supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "APPROVED"),
        supabase.from("submission_exports").select("*", { count: "exact", head: true }),
        supabase.from("financial_statements").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        totalProfiles: profilesCount || 0,
        pendingApplications: pendingAppsCount || 0,
        approvedMembers: membersCount || 0,
        totalExports: exportsCount || 0,
        totalStatements: statementsCount || 0,
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
            <h2 style={{ fontSize: "21px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: 0, color: "var(--ink)" }}>Executive Command Center</h2>
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
              PHASE 1 FORMATION
            </span>
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: 0 }}>
            {BRAND.fullName} • Independent political initiative working toward formal party formation & registration.
          </p>
        </div>

        <button
          type="button"
          onClick={loadStats}
          className="button"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", minHeight: "40px", padding: "8px 16px", borderRadius: "3px", fontSize: "13px" }}
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
        <div
          className="card"
          style={{ background: "var(--paper-card)", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)" }}
        >
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

        <div
          className="card"
          style={{ background: "var(--paper-card)", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              Awaiting Scrutiny
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

        <div
          className="card"
          style={{ background: "var(--paper-card)", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              Submission Dossiers
            </span>
            <Layers size={18} style={{ color: "var(--blue)" }} />
          </div>
          <div style={{ fontSize: "26px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--blue)" }}>
            {loading ? "..." : stats.totalExports}
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "4px" }}>
            Compiled continuous bundles
          </div>
        </div>

        <div
          className="card"
          style={{ background: "var(--paper-card)", padding: "18px 20px", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              Public Disclosures
            </span>
            <TrendingUp size={18} style={{ color: "var(--saffron)" }} />
          </div>
          <div style={{ fontSize: "26px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--ink)" }}>
            {loading ? "..." : stats.totalStatements}
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--muted)", marginTop: "4px" }}>
            Published balance sheets
          </div>
        </div>
      </div>

      {/* Admin Quick Action Hub */}
      <div>
        <h3 style={{ fontSize: "17px", fontFamily: "var(--font-serif)", fontWeight: 700, color: "var(--ink)", marginBottom: "14px" }}>Administrative Operations</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
          <a
            href="/admin/verifications"
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
                <FileCheck2 size={22} />
              </div>
              <h4 style={{ fontSize: "15px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
                Verification & Scrutiny Desk
              </h4>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Audit identity proofs (Voter ID, Aadhaar), inspect OCR extractions, and issue sequential member cards.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--saffron)",
                marginTop: "16px",
              }}
            >
              Open Scrutiny Desk <ArrowRight size={14} />
            </div>
          </a>

          <a
            href="/admin/exports"
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
              <h4 style={{ fontSize: "15px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
                Continuous Submission Export Engine
              </h4>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Compile continuous page-numbered PDF dossiers with cover, index, master register, and annexure items.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--blue)",
                marginTop: "16px",
              }}
            >
              Generate Submissions <ArrowRight size={14} />
            </div>
          </a>

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
              <h4 style={{ fontSize: "15px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
                Founding Member Register
              </h4>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Search, filter, and inspect enrolled members across Delhi's 70 assembly constituencies.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--green)",
                marginTop: "16px",
              }}
            >
              View Member Register <ArrowRight size={14} />
            </div>
          </a>

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
              <h4 style={{ fontSize: "15px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
                Financial Transparency Ledger
              </h4>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                Publish audited receipts, expenditure statements, and ensure compliance with RPA 1951 transparency.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--saffron)",
                marginTop: "16px",
              }}
            >
              Manage Ledger <ArrowRight size={14} />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
