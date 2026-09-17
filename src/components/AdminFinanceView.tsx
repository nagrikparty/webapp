import React, { useEffect, useState } from "react";
import {
  FileSpreadsheet,
  Plus,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/brand";

interface FinancialStatement {
  id: string;
  fiscal_year: string;
  period_name: string;
  statement_type: string;
  total_receipts: number;
  total_expenditure: number;
  closing_balance: number;
  is_audited: boolean;
  auditor_name: string | null;
  published_at: string;
  notes: string;
}

export function AdminFinanceView() {
  const [statements, setStatements] = useState<FinancialStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStmt, setNewStmt] = useState({
    fiscal_year: "2024-2025",
    period_name: "Phase 1 Formation Accounts",
    statement_type: "FORMATION_STAGE",
    total_receipts: 0,
    total_expenditure: 0,
    closing_balance: 0,
    is_audited: true,
    auditor_name: "Internal Audit Committee",
    notes: "Public disclosure in accordance with transparency principles.",
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function loadStatements() {
    setLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("financial_statements")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setStatements(data || []);
    } catch (err) {
      console.error("Error loading financial statements:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatements();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      if (!supabase) throw new Error("Database not connected");
      const { error } = await supabase.from("financial_statements").insert({
        ...newStmt,
        closing_balance: Number(newStmt.total_receipts) - Number(newStmt.total_expenditure),
      });

      if (error) throw error;
      setMsg("Financial statement published successfully!");
      setShowAddModal(false);
      await loadStatements();
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "Failed to publish statement");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: "24px" }}>
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
            <h2 style={{ fontSize: "22px", fontWeight: 800, margin: 0 }}>
              Financial Transparency Ledger
            </h2>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                background: "rgba(0, 135, 62, 0.1)",
                color: BRAND.colors.green,
                padding: "3px 8px",
                borderRadius: "6px",
              }}
            >
              100% DISCLOSURE
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "var(--muted)", margin: 0 }}>
            Manage published formation accounts, voluntary contributions, and administrative expenditure disclosures.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="button primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Plus size={15} /> Publish Statement
          </button>
          <button
            type="button"
            onClick={loadStatements}
            className="button"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {msg && (
        <div
          style={{
            padding: "14px 18px",
            backgroundColor: "#f6ffed",
            border: "1px solid #b7eb8f",
            borderRadius: "10px",
            color: "#389e0d",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <CheckCircle2 size={18} />
          <span>{msg}</span>
        </div>
      )}

      {/* Published Statements Table */}
      <div
        className="card"
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid var(--line)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 800, margin: 0 }}>
            Published Financial Disclosures ({statements.length})
          </h3>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>
            Publicly visible on the /transparency page
          </span>
        </div>

        {loading ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted)" }}>
            <RefreshCw className="animate-spin" size={28} style={{ margin: "0 auto 12px" }} />
            <div>Loading financial disclosures...</div>
          </div>
        ) : statements.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted)" }}>
            <FileSpreadsheet size={36} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <div>No financial statements published yet.</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", textAlign: "left" }}>
                <th style={{ padding: "12px 18px" }}>Fiscal Period</th>
                <th style={{ padding: "12px 18px" }}>Type</th>
                <th style={{ padding: "12px 18px" }}>Total Receipts (₹)</th>
                <th style={{ padding: "12px 18px" }}>Total Expenditure (₹)</th>
                <th style={{ padding: "12px 18px" }}>Closing Balance (₹)</th>
                <th style={{ padding: "12px 18px" }}>Audit Status</th>
                <th style={{ padding: "12px 18px" }}>Published Date</th>
              </tr>
            </thead>
            <tbody>
              {statements.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ fontWeight: 700 }}>{s.period_name}</div>
                    <div style={{ fontSize: "11px", color: "var(--muted)" }}>FY {s.fiscal_year}</div>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        background: "var(--paper)",
                        fontWeight: 600,
                        fontSize: "11px",
                      }}
                    >
                      {s.statement_type}
                    </span>
                  </td>
                  <td style={{ padding: "14px 18px", fontWeight: 700, color: BRAND.colors.green }}>
                    ₹{Number(s.total_receipts).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "14px 18px", fontWeight: 700, color: "var(--red)" }}>
                    ₹{Number(s.total_expenditure).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "14px 18px", fontWeight: 800 }}>
                    ₹{Number(s.closing_balance).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    {s.is_audited ? (
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "100px",
                          fontSize: "11px",
                          fontWeight: 700,
                          background: "rgba(0, 135, 62, 0.1)",
                          color: BRAND.colors.green,
                        }}
                      >
                        AUDITED ({s.auditor_name || "Internal"})
                      </span>
                    ) : (
                      <span style={{ fontSize: "11px", color: "var(--muted)" }}>Provisional</span>
                    )}
                  </td>
                  <td style={{ padding: "14px 18px", color: "var(--muted)" }}>
                    {new Date(s.published_at).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Publish Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            className="card"
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "28px",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 16px" }}>
              Publish New Financial Statement
            </h3>
            <form onSubmit={handleCreate} style={{ display: "grid", gap: "14px", fontSize: "13px" }}>
              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>
                  Fiscal Year
                </label>
                <input
                  type="text"
                  required
                  value={newStmt.fiscal_year}
                  onChange={(e) => setNewStmt({ ...newStmt, fiscal_year: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--line)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>
                  Period / Description
                </label>
                <input
                  type="text"
                  required
                  value={newStmt.period_name}
                  onChange={(e) => setNewStmt({ ...newStmt, period_name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--line)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>
                    Total Receipts (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newStmt.total_receipts}
                    onChange={(e) => setNewStmt({ ...newStmt, total_receipts: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--line)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>
                    Total Expenditure (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newStmt.total_expenditure}
                    onChange={(e) => setNewStmt({ ...newStmt, total_expenditure: Number(e.target.value) })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--line)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>
                  Auditor Name
                </label>
                <input
                  type="text"
                  value={newStmt.auditor_name}
                  onChange={(e) => setNewStmt({ ...newStmt, auditor_name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--line)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 700, marginBottom: "4px" }}>
                  Notes / Public Remark
                </label>
                <textarea
                  rows={2}
                  value={newStmt.notes}
                  onChange={(e) => setNewStmt({ ...newStmt, notes: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid var(--line)" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="button"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="button primary" disabled={submitting}>
                  {submitting ? "Publishing..." : "Confirm & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
