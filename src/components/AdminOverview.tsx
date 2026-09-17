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
    <div style={{ display: "grid", gap: "28px" }}>
      {/* Top Banner */}
      <div
        className="card"
        style={{
          background: "#fff",
          padding: "24px 28px",
          borderRadius: "16px",
          border: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, margin: 0 }}>Executive Command Center</h2>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                background: "rgba(245, 130, 32, 0.1)",
                color: BRAND.colors.saffron,
                padding: "3px 8px",
                borderRadius: "6px",
              }}
            >
              PHASE 1 FORMATION
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
            {BRAND.fullName} • Independent political initiative working toward formal party formation & registration.
          </p>
        </div>

        <button
          type="button"
          onClick={loadStats}
          className="button"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <RefreshCw size={15} /> Refresh Data
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <div
          className="card"
          style={{ background: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid var(--line)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Approved Members
            </span>
            <Award size={18} style={{ color: BRAND.colors.green }} />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: BRAND.colors.green }}>
            {loading ? "..." : stats.approvedMembers}
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
            Verified with sequential ID
          </div>
        </div>

        <div
          className="card"
          style={{ background: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid var(--line)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Awaiting Scrutiny
            </span>
            <AlertTriangle size={18} style={{ color: BRAND.colors.saffron }} />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: BRAND.colors.saffron }}>
            {loading ? "..." : stats.pendingApplications}
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
            In verification queue
          </div>
        </div>

        <div
          className="card"
          style={{ background: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid var(--line)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Submission Dossiers
            </span>
            <Layers size={18} style={{ color: BRAND.colors.blue }} />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: BRAND.colors.blue }}>
            {loading ? "..." : stats.totalExports}
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
            Compiled continuous bundles
          </div>
        </div>

        <div
          className="card"
          style={{ background: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid var(--line)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Public Disclosures
            </span>
            <TrendingUp size={18} style={{ color: BRAND.colors.saffron }} />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--ink)" }}>
            {loading ? "..." : stats.totalStatements}
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
            Published balance sheets
          </div>
        </div>
      </div>

      {/* Admin Quick Action Hub */}
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "16px" }}>Administrative Operations</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          <a
            href="/admin/verifications"
            className="card"
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "14px",
              border: "1px solid var(--line)",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            <div>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(245, 130, 32, 0.1)",
                  color: BRAND.colors.saffron,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <FileCheck2 size={24} />
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 6px" }}>
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
                color: BRAND.colors.saffron,
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
              background: "#fff",
              padding: "24px",
              borderRadius: "14px",
              border: "1px solid var(--line)",
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
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(0, 102, 204, 0.1)",
                  color: BRAND.colors.blue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Layers size={24} />
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 6px" }}>
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
                color: BRAND.colors.blue,
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
              background: "#fff",
              padding: "24px",
              borderRadius: "14px",
              border: "1px solid var(--line)",
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
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(0, 135, 62, 0.1)",
                  color: BRAND.colors.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Users size={24} />
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 6px" }}>
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
                color: BRAND.colors.green,
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
              background: "#fff",
              padding: "24px",
              borderRadius: "14px",
              border: "1px solid var(--line)",
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
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(245, 130, 32, 0.1)",
                  color: BRAND.colors.saffron,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <FileSpreadsheet size={24} />
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 6px" }}>
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
                color: BRAND.colors.saffron,
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
