import React, { useState, useEffect } from "react";
import {
  FileText, Search, Clock, CheckCircle, XCircle, AlertTriangle,
  Eye, ChevronRight, Filter,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/brand";

interface Application {
  id: string;
  application_number: string;
  status: string;
  membership_category: string;
  submitted_at: string | null;
  created_at: string;
  user_id: string;
  profiles?: { full_name: string; email: string } | null;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  DRAFT: { bg: "#f5f5f5", color: "#8c8c8c", label: "Draft" },
  SUBMITTED: { bg: "#e6f7ff", color: "#1890ff", label: "Submitted" },
  DOCUMENTS_PENDING: { bg: "#fff7e6", color: "#d48806", label: "Docs Pending" },
  UNDER_REVIEW: { bg: "#f0f5ff", color: "#2f54eb", label: "Under Review" },
  NEEDS_CORRECTION: { bg: "#fff2e8", color: "#fa541c", label: "Needs Correction" },
  APPROVED: { bg: "#f6ffed", color: "#389e0d", label: "Approved" },
  REJECTED: { bg: "#fff2f0", color: "#cf1322", label: "Rejected" },
  SUSPENDED: { bg: "#f9f0ff", color: "#722ed1", label: "Suspended" },
  RESIGNED: { bg: "#f5f5f5", color: "#595959", label: "Resigned" },
  ARCHIVED: { bg: "#fafafa", color: "#bfbfbf", label: "Archived" },
};

export function AdminApplicationsView() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [counts, setCounts] = useState({ total: 0, submitted: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("membership_applications")
        .select("*, profiles:user_id(full_name, email)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      const apps = (data || []) as Application[];
      setApplications(apps);

      setCounts({
        total: apps.length,
        submitted: apps.filter((a) => a.status === "SUBMITTED").length,
        pending: apps.filter((a) => ["DOCUMENTS_PENDING", "UNDER_REVIEW", "NEEDS_CORRECTION"].includes(a.status)).length,
        approved: apps.filter((a) => a.status === "APPROVED").length,
        rejected: apps.filter((a) => a.status === "REJECTED").length,
      });
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = applications.filter((a) => {
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    const matchesSearch =
      !search ||
      a.application_number?.toLowerCase().includes(search.toLowerCase()) ||
      a.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.profiles?.email?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
        <Clock size={24} style={{ marginBottom: "8px" }} />
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "20px" }}>
        {[
          { label: "Total", value: counts.total, icon: FileText, color: "var(--ink)" },
          { label: "Submitted", value: counts.submitted, icon: Clock, color: "var(--blue)" },
          { label: "In Review", value: counts.pending, icon: AlertTriangle, color: "var(--saffron)" },
          { label: "Approved", value: counts.approved, icon: CheckCircle, color: "var(--green)" },
          { label: "Rejected", value: counts.rejected, icon: XCircle, color: "var(--red)" },
        ].map((card) => (
          <div
            key={card.label}
            className="card"
            style={{
              padding: "14px 16px",
              backgroundColor: "var(--paper-card)",
              borderRadius: "4px",
              border: "1px solid var(--line-strong)",
              boxShadow: "var(--shadow)",
              textAlign: "center",
            }}
          >
            <card.icon size={18} style={{ color: card.color, marginBottom: "4px" }} />
            <div style={{ fontSize: "22px", fontWeight: 800, fontFamily: "var(--font-mono)" }}>{card.value}</div>
            <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "220px", position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search by name, email, or application #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: "3px", border: "1px solid var(--line-strong)", fontSize: "14px", background: "var(--paper)", color: "var(--ink)" }}
          />
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "6px" }}>
          <Filter size={14} style={{ color: "var(--muted)" }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "3px", border: "1px solid var(--line-strong)", fontSize: "13.5px", backgroundColor: "var(--paper-card)", color: "var(--ink)" }}
          >
            <option value="ALL">All Statuses</option>
            {Object.entries(STATUS_STYLES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "48px 20px", backgroundColor: "var(--paper-card)", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)" }}>
          <FileText size={36} style={{ color: "var(--muted)", marginBottom: "12px" }} />
          <h3 style={{ fontSize: "17px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>No Applications Found</h3>
          <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: 0 }}>
            {search || statusFilter !== "ALL" ? "Try adjusting your filters or search keywords." : "No applications have been submitted yet."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map((app) => {
            const style = STATUS_STYLES[app.status] || STATUS_STYLES.DRAFT;
            return (
              <div
                key={app.id}
                className="card"
                style={{
                  padding: "16px 20px",
                  backgroundColor: "var(--paper-card)",
                  borderRadius: "4px",
                  border: "1px solid var(--line-strong)",
                  boxShadow: "var(--shadow)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: "220px" }}>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", marginBottom: "4px", fontFamily: "var(--font-serif)" }}>
                    {app.profiles?.full_name || "—"}
                  </div>
                  <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--muted)", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-mono)" }}>{app.application_number || "No App #"}</span>
                    <span>{app.profiles?.email || "—"}</span>
                    <span>{app.membership_category || "—"}</span>
                    <span style={{ fontFamily: "var(--font-mono)" }}>{new Date(app.submitted_at || app.created_at).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "2px",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.03em",
                      textTransform: "uppercase",
                      backgroundColor: style.bg,
                      color: style.color,
                      border: `1px solid ${style.color}40`,
                    }}
                  >
                    {style.label}
                  </span>
                  <a
                    href={`/admin/verifications?app=${app.id}`}
                    className="button"
                    style={{ minHeight: "36px", padding: "6px 12px", fontSize: "12.5px", borderRadius: "3px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    title="Review application"
                  >
                    <Eye size={14} /> Review <ChevronRight size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
