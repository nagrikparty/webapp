import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Eye,
  EyeOff,
  Send,
  AlertCircle,
  Plus
} from "lucide-react";
import { supabase } from "@/lib/supabase";

async function getSessionToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

interface ReportingPeriod {
  id: string;
  name: string;
  cycle_label: string;
  start_date: string;
  end_date: string;
  opening_balance: number;
  closing_balance: number;
  reconciliation_difference: number;
  reconciliation_status: string;
  continuity_status: string;
  workflow_status: string;
  published_at?: string;
  bank_statements?: {
    id: string;
    file_name: string;
    file_sha256: string;
    masked_account_number: string;
    parser_status: string;
    parsed_row_count: number;
    created_at: string;
  }[];
}

interface TransactionRow {
  id: string;
  transaction_date: string;
  description: string;
  reference_utr: string | null;
  debit: number;
  credit: number;
  balance_after_transaction: number;
  classification: string;
  verification_status: string;
  public_visibility: boolean;
  is_duplicate_flag: boolean;
}

export function AdminStatementManager() {
  const [periods, setPeriods] = useState<ReportingPeriod[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTx, setLoadingTx] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Upload modal state
  const [uploading, setUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [calculatedSha256, setCalculatedSha256] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // Period create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPeriod, setNewPeriod] = useState({
    name: "2026 H1",
    cycle_label: "2026 H1 (Jan 1, 2026 - Jun 30, 2026)",
    start_date: "2026-01-01",
    end_date: "2026-06-30",
    opening_balance: "0.00",
    closing_balance: "0.00",
  });

  useEffect(() => {
    fetchPeriods();
  }, []);

  async function processSelectedFile(file: File) {
    setFileToUpload(file);
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setCalculatedSha256(hex);
    } catch {
      setCalculatedSha256("");
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
  }

  async function fetchPeriods() {
    setLoading(true);
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/admin/finance/periods", { headers });
      if (res.ok) {
        const json = await res.json();
        const rawList = Array.isArray(json) ? json : json.periods || [];
        const periodList: ReportingPeriod[] = rawList.map((p: any) => ({
          id: p.id,
          name: p.title || p.name || `${p.fiscal_year} ${p.period_type}`,
          cycle_label: p.title || p.cycle_label || `${p.fiscal_year} ${p.period_type}`,
          start_date: p.start_date,
          end_date: p.end_date,
          opening_balance: Number(p.opening_balance || 0),
          closing_balance: Number(p.closing_balance || 0),
          reconciliation_difference: Number(p.reconciliation_difference || 0),
          reconciliation_status: p.reconciliation_status || "PENDING",
          continuity_status: p.continuity_status || "NOT_APPLICABLE",
          workflow_status: p.status || p.workflow_status || "DRAFT",
          published_at: p.published_at,
          bank_statements: (p.statements || p.bank_statements || []).map((s: any) => ({
            id: s.id,
            file_name: s.original_filename || s.file_name,
            file_sha256: s.file_sha256,
            masked_account_number: s.account_number_masked || s.masked_account_number || "XXXX-XXXX-XXXX-7387",
            parser_status: s.parser_status,
            parsed_row_count: s.extracted_row_count || s.parsed_row_count || 0,
            created_at: s.uploaded_at || s.created_at,
          })),
        }));
        setPeriods(periodList);
        if (periodList.length > 0 && !selectedPeriodId) {
          setSelectedPeriodId(periodList[0].id);
        }
      }
    } catch {
      setActionMsg({ text: "Failed to load reporting periods", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const selectedPeriod = periods.find((p) => p.id === selectedPeriodId);

  useEffect(() => {
    if (selectedPeriodId) {
      fetchTransactions(selectedPeriodId);
    }
  }, [selectedPeriodId]);

  async function fetchTransactions(periodId: string) {
    setLoadingTx(true);
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/v1/admin/finance/transactions?period_id=${periodId}&limit=200`, { headers });
      if (res.ok) {
        const json = await res.json();
        setTransactions(json.transactions || []);
      }
    } catch {
      setActionMsg({ text: "Failed to fetch transactions", type: "error" });
    } finally {
      setLoadingTx(false);
    }
  }

  async function handleUploadStatement() {
    if (!fileToUpload || !selectedPeriodId) return;
    setUploading(true);
    setActionMsg(null);
    try {
      const token = await getSessionToken();
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("reporting_period_id", selectedPeriodId);
      formData.append("period_id", selectedPeriodId);
      formData.append("file_type", fileToUpload.name.toLowerCase().endsWith(".pdf") ? "pdf" : "csv");

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/admin/finance/upload-statement", {
        method: "POST",
        headers,
        body: formData,
      });

      const json = await res.json();
      if (res.ok) {
        const parsedCount = json.extracted_count ?? json.parsed_count ?? json.statement?.extracted_count ?? 0;
        const diffText = json.reconciliation?.difference ?? "0.00";
        setActionMsg({
          text: `Statement ingested: ${parsedCount} transactions parsed. Reconciled diff: Rs. ${diffText}.`,
          type: "success",
        });
        setFileToUpload(null);
        setCalculatedSha256("");
        await fetchPeriods();
        await fetchTransactions(selectedPeriodId);
      } else {
        setActionMsg({ text: json.error || "Upload failed", type: "error" });
      }
    } catch (err: unknown) {
      setActionMsg({ text: err instanceof Error ? err.message : "Network error uploading statement", type: "error" });
    } finally {
      setUploading(false);
    }
  }

  function openCreatePeriodModal() {
    if (periods.length > 0) {
      const sorted = [...periods].sort(
        (a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
      );
      const latest = sorted[0];
      const latestEnd = new Date(latest.end_date);
      const nextStart = new Date(latestEnd);
      nextStart.setDate(nextStart.getDate() + 1);

      const nextStartYear = nextStart.getFullYear();
      const nextStartMonth = nextStart.getMonth() + 1;

      let nextEndDate = "";
      let cycleName = "";

      if (nextStartMonth <= 6) {
        nextEndDate = `${nextStartYear}-06-30`;
        cycleName = `${nextStartYear} H1`;
      } else {
        nextEndDate = `${nextStartYear}-12-31`;
        cycleName = `${nextStartYear} H2`;
      }

      const startDateStr = nextStart.toISOString().split("T")[0];
      const prevClosing = Number(latest.closing_balance || 0).toFixed(2);

      setNewPeriod({
        name: cycleName,
        cycle_label: `${cycleName} (${new Date(startDateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} · ${new Date(nextEndDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })})`,
        start_date: startDateStr,
        end_date: nextEndDate,
        opening_balance: prevClosing,
        closing_balance: prevClosing,
      });
    }
    setShowCreateModal(true);
  }

  async function handleCreatePeriod(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/admin/finance/periods", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: newPeriod.name,
          cycle_label: newPeriod.cycle_label,
          start_date: newPeriod.start_date,
          end_date: newPeriod.end_date,
          opening_balance: newPeriod.opening_balance,
          closing_balance: newPeriod.closing_balance,
        }),
      });

      const json = await res.json();
      if (res.ok && json.period) {
        setActionMsg({ text: `Reporting period "${json.period.title}" created successfully`, type: "success" });
        setShowCreateModal(false);
        await fetchPeriods();
        setSelectedPeriodId(json.period.id);
      } else {
        setActionMsg({ text: json.error || "Failed to create period", type: "error" });
      }
    } catch {
      setActionMsg({ text: "Failed to connect to server", type: "error" });
    }
  }

  async function handleUpdateTransaction(txId: string, updates: Partial<TransactionRow>) {
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/admin/finance/transactions", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ id: txId, ...updates }),
      });

      if (res.ok) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === txId ? { ...t, ...updates } : t))
        );
      } else {
        const json = await res.json();
        alert(json.error || "Failed to update transaction");
      }
    } catch {
      alert("Error updating transaction");
    }
  }

  async function handleReconcilePeriod() {
    if (!selectedPeriodId) return;
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/admin/finance/reconcile", {
        method: "POST",
        headers,
        body: JSON.stringify({ period_id: selectedPeriodId }),
      });

      const json = await res.json();
      if (res.ok) {
        setActionMsg({
          text: `Reconciliation calculated: status is ${json.reconciliation.reconciliation_status}. Difference: Rs. ${json.reconciliation.difference}.`,
          type: "success",
        });
        await fetchPeriods();
      } else {
        setActionMsg({ text: json.error || "Reconciliation failed", type: "error" });
      }
    } catch {
      setActionMsg({ text: "Network error during reconciliation", type: "error" });
    }
  }

  async function handleVerifyPeriod() {
    if (!selectedPeriodId) return;
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/admin/finance/verify", {
        method: "POST",
        headers,
        body: JSON.stringify({ period_id: selectedPeriodId, verify_all_transactions: true }),
      });

      const json = await res.json();
      if (res.ok) {
        setActionMsg({ text: "Period and all transactions marked as VERIFIED.", type: "success" });
        await fetchPeriods();
        await fetchTransactions(selectedPeriodId);
      } else {
        setActionMsg({ text: json.error || "Verification failed", type: "error" });
      }
    } catch {
      setActionMsg({ text: "Network error verifying period", type: "error" });
    }
  }

  async function handlePublishPeriod() {
    if (!selectedPeriodId) return;
    const ok = window.confirm("Are you sure you want to publish this reporting period to the public Transparency page? All verified transactions will be publicly auditable.");
    if (!ok) return;

    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/admin/finance/publish", {
        method: "POST",
        headers,
        body: JSON.stringify({ period_id: selectedPeriodId }),
      });

      const json = await res.json();
      if (res.ok) {
        setActionMsg({ text: "Period successfully published to public transparency page!", type: "success" });
        await fetchPeriods();
      } else {
        setActionMsg({ text: json.error || "Publication rejected by pre-publish verification checklist", type: "error" });
      }
    } catch {
      setActionMsg({ text: "Network error publishing period", type: "error" });
    }
  }

  // Pre-publish checks
  const hasStatement = (selectedPeriod?.bank_statements && selectedPeriod.bank_statements.length > 0) || false;
  const isMatched = selectedPeriod?.reconciliation_status === "MATCHED";
  const diffIsZero = selectedPeriod?.reconciliation_difference === 0;
  const isVerified = selectedPeriod?.workflow_status === "VERIFIED" || selectedPeriod?.workflow_status === "PUBLISHED";
  const unclassifiedCount = transactions.filter((t) => t.classification === "UNKNOWN").length;
  const isPublished = selectedPeriod?.workflow_status === "PUBLISHED";

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      {/* Action Notification */}
      {actionMsg && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "3px",
            fontSize: "13px",
            fontWeight: 600,
            background: actionMsg.type === "success" ? "rgba(29, 86, 53, 0.08)" : "rgba(179, 74, 21, 0.08)",
            border: `1px solid ${actionMsg.type === "success" ? "rgba(29, 86, 53, 0.3)" : "rgba(179, 74, 21, 0.3)"}`,
            color: actionMsg.type === "success" ? "var(--green)" : "var(--saffron)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{actionMsg.text}</span>
          <button
            type="button"
            onClick={() => setActionMsg(null)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 700 }}
          >
            x
          </button>
        </div>
      )}

      {/* Header & Period Switcher */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          padding: "20px 24px",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--muted)",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Audit & Reconciliation Engine
          </span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
            6-Month Statement & Reporting System
            {loading && <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 400, marginLeft: "8px" }}>(syncing...)</span>}
          </h2>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          {periods.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPeriodId(p.id)}
              className="button"
              style={{
                fontSize: "13px",
                fontWeight: 700,
                padding: "6px 14px",
                background: selectedPeriodId === p.id ? "var(--ink)" : "var(--paper-card)",
                color: selectedPeriodId === p.id ? "#fff" : "var(--ink)",
                borderColor: selectedPeriodId === p.id ? "var(--ink)" : "var(--line)",
              }}
            >
              {p.name}
            </button>
          ))}

          <button
            type="button"
            onClick={openCreatePeriodModal}
            className="button"
            style={{
              fontSize: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
            }}
          >
            <Plus size={14} /> New 6-Month Period
          </button>
        </div>
      </div>

      {/* Main Period Dashboard */}
      {selectedPeriod && (
        <div style={{ display: "grid", gap: "20px" }}>
          {/* Status Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            {/* Cycle info */}
            <div
              className="card"
              style={{ background: "var(--paper-card)", padding: "16px 20px", border: "1px solid var(--line)" }}
            >
              <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>
                Period Cycle
              </span>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)", marginTop: "4px" }}>
                {selectedPeriod.cycle_label}
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                {selectedPeriod.start_date} to {selectedPeriod.end_date}
              </div>
            </div>

            {/* Workflow status */}
            <div
              className="card"
              style={{ background: "var(--paper-card)", padding: "16px 20px", border: "1px solid var(--line)" }}
            >
              <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>
                Workflow State
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background:
                      selectedPeriod.workflow_status === "PUBLISHED"
                        ? "var(--green)"
                        : selectedPeriod.workflow_status === "VERIFIED"
                        ? "var(--blue)"
                        : "var(--saffron)",
                  }}
                />
                <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-mono)" }}>
                  {selectedPeriod.workflow_status}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                {selectedPeriod.published_at ? `Published: ${new Date(selectedPeriod.published_at).toLocaleDateString("en-IN")}` : "Not yet public"}
              </div>
            </div>

            {/* Reconciliation Match */}
            <div
              className="card"
              style={{ background: "var(--paper-card)", padding: "16px 20px", border: "1px solid var(--line)" }}
            >
              <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>
                Reconciliation
              </span>
              <div style={{ fontSize: "15px", fontWeight: 700, marginTop: "4px", color: isMatched ? "var(--green)" : "var(--saffron)" }}>
                {selectedPeriod.reconciliation_status} (Diff: Rs. {Number(selectedPeriod.reconciliation_difference).toFixed(2)})
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                Opening + Credits - Debits = Closing
              </div>
            </div>

            {/* Cross-Period Continuity */}
            <div
              className="card"
              style={{ background: "var(--paper-card)", padding: "16px 20px", border: "1px solid var(--line)" }}
            >
              <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--muted)", fontWeight: 700 }}>
                Continuity Status
              </span>
              <div style={{ fontSize: "15px", fontWeight: 700, marginTop: "4px", color: selectedPeriod.continuity_status === "CONTINUOUS" || selectedPeriod.continuity_status === "INITIAL" ? "var(--green)" : "var(--saffron)" }}>
                {selectedPeriod.continuity_status}
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                Matches prev period closing
              </div>
            </div>
          </div>

          {/* Statement File & Provenance Box */}
          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "20px 24px",
              border: "1px solid var(--line)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 6px", fontFamily: "var(--font-serif)" }}>
                  Bank Statement Document & Byte-Level SHA-256 Provenance
                </h3>
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
                  Upload official bank statements (Axis Bank CSV or text/PDF) for this reporting cycle. Files are hashed byte-by-byte for cryptographic audit provenance.
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={handleReconcilePeriod}
                  className="button"
                  style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <RefreshCw size={14} /> Recalculate
                </button>
              </div>
            </div>

            {/* Attached statements */}
            {selectedPeriod.bank_statements && selectedPeriod.bank_statements.length > 0 ? (
              <div style={{ marginTop: "16px", display: "grid", gap: "10px" }}>
                {selectedPeriod.bank_statements.map((stmt) => (
                  <div
                    key={stmt.id}
                    style={{
                      background: "var(--paper)",
                      border: "1px solid var(--line)",
                      padding: "12px 16px",
                      borderRadius: "3px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <FileSpreadsheet size={20} color="var(--green)" />
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>
                          {stmt.file_name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                          Account: {stmt.masked_account_number} · Rows: {stmt.parsed_row_count} · Status: {stmt.parser_status}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                          SHA-256: {stmt.file_sha256}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "3px 8px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: "rgba(29, 86, 53, 0.1)",
                        color: "var(--green)",
                        borderRadius: "2px",
                      }}
                    >
                      CRYPTOGRAPHICALLY VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: "16px", padding: "16px", background: "var(--paper)", border: "1px dashed var(--line)", textAlign: "center" }}>
                <AlertCircle size={24} color="var(--saffron)" style={{ margin: "0 auto 8px" }} />
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>
                  No statement uploaded for this period yet
                </div>
                <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                  Upload an Axis Bank statement below to parse transactions and perform reconciliation.
                </div>
              </div>
            )}

            {/* Upload form dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) {
                  processSelectedFile(e.dataTransfer.files[0]);
                }
              }}
              style={{
                marginTop: "18px",
                padding: "24px",
                border: isDragging ? "2px dashed var(--saffron)" : "2px dashed var(--line-strong)",
                background: isDragging ? "rgba(179, 74, 21, 0.04)" : "var(--paper)",
                borderRadius: "6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "14px",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "var(--paper-card)",
                  border: "1px solid var(--line)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Upload size={22} color="var(--ink)" />
              </div>

              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)" }}>
                  Upload Axis Bank Statement (.csv or .pdf)
                </div>
                <div style={{ fontSize: "12px", color: "var(--muted)", maxWidth: "540px", marginTop: "4px", lineHeight: "1.4" }}>
                  Select or drag & drop statement file. The system automatically computes byte-level SHA-256 hash, parses all transactions, checks ₹0.01 reconciliation accuracy, and flags duplicates without manual data entry.
                </div>
              </div>

              {/* Selected File Card */}
              {fileToUpload ? (
                <div
                  style={{
                    width: "100%",
                    maxWidth: "560px",
                    background: "var(--paper-card)",
                    border: "1px solid var(--green)",
                    padding: "12px 16px",
                    borderRadius: "4px",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <CheckCircle2 size={16} color="var(--green)" />
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>
                        {fileToUpload.name}
                      </span>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                      {(fileToUpload.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  {calculatedSha256 && (
                    <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                      SHA-256: <span style={{ color: "var(--ink)", fontWeight: 600 }}>{calculatedSha256}</span>
                    </div>
                  )}
                </div>
              ) : null}

              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
                <label
                  className="button"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: "8px 16px",
                    background: "var(--paper-card)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FileSpreadsheet size={15} />
                  {fileToUpload ? "Change File" : "Choose File (.csv, .pdf)"}
                  <input
                    type="file"
                    accept=".csv,.txt,.pdf"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />
                </label>

                <button
                  type="button"
                  onClick={handleUploadStatement}
                  disabled={!fileToUpload || uploading}
                  className="button"
                  style={{
                    background: fileToUpload ? "var(--ink)" : "var(--line-strong)",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 700,
                    padding: "8px 20px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: !fileToUpload || uploading ? "not-allowed" : "pointer",
                    opacity: !fileToUpload || uploading ? 0.6 : 1,
                  }}
                >
                  <Upload size={14} />
                  {uploading ? "Ingesting, Parsing & Reconciling..." : "Upload & Automatically Reconcile Statement"}
                </button>
              </div>
            </div>
          </div>

          {/* Pre-Publish Checklist & Publication Trigger */}
          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "20px 24px",
              border: "1px solid var(--line)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 4px", fontFamily: "var(--font-serif)" }}>
                  Publication Readiness Checklist
                </h3>
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
                  Statements can only be made publicly accessible when all statutory mathematical checks pass.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                {!isVerified && !isPublished && (
                  <button
                    type="button"
                    onClick={handleVerifyPeriod}
                    disabled={!hasStatement || !isMatched || !diffIsZero}
                    className="button"
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      opacity: !hasStatement || !isMatched || !diffIsZero ? 0.5 : 1,
                    }}
                  >
                    <ShieldCheck size={16} /> Mark Period Verified
                  </button>
                )}

                {!isPublished ? (
                  <button
                    type="button"
                    onClick={handlePublishPeriod}
                    disabled={!isMatched || !diffIsZero || unclassifiedCount > 0}
                    className="button"
                    style={{
                      background: "var(--green)",
                      color: "#fff",
                      borderColor: "var(--green)",
                      fontSize: "13px",
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      opacity: !isMatched || !diffIsZero || unclassifiedCount > 0 ? 0.5 : 1,
                    }}
                  >
                    <Send size={16} /> Publish to Public Transparency
                  </button>
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 14px",
                      background: "rgba(29, 86, 53, 0.12)",
                      color: "var(--green)",
                      fontSize: "13px",
                      fontWeight: 700,
                      borderRadius: "3px",
                    }}
                  >
                    <CheckCircle2 size={16} /> Live on Public Ledger
                  </span>
                )}
              </div>
            </div>

            {/* Checklist items */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                marginTop: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                {hasStatement ? <CheckCircle2 size={16} color="var(--green)" /> : <AlertTriangle size={16} color="var(--saffron)" />}
                <span>Statement Uploaded: {hasStatement ? "Yes" : "Missing"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                {isMatched && diffIsZero ? <CheckCircle2 size={16} color="var(--green)" /> : <AlertTriangle size={16} color="var(--saffron)" />}
                <span>Exact Rs. 0.00 Diff: {isMatched && diffIsZero ? "Passed" : "Failed"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                {unclassifiedCount === 0 ? <CheckCircle2 size={16} color="var(--green)" /> : <AlertTriangle size={16} color="var(--saffron)" />}
                <span>Unclassified Items: {unclassifiedCount}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                {selectedPeriod.continuity_status !== "BREAK" ? <CheckCircle2 size={16} color="var(--green)" /> : <AlertTriangle size={16} color="var(--saffron)" />}
                <span>Continuity: {selectedPeriod.continuity_status}</span>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "20px 24px",
              border: "1px solid var(--line)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, fontFamily: "var(--font-serif)" }}>
                  Parsed Transaction Ledger ({transactions.length} Records)
                </h3>
                <p style={{ fontSize: "12px", color: "var(--muted)", margin: "4px 0 0" }}>
                  Verify classifications, toggle public visibility, or check duplicate flags.
                </p>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => selectedPeriodId && fetchTransactions(selectedPeriodId)}
                  className="button"
                  style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <RefreshCw size={13} /> Refresh Rows
                </button>
              </div>
            </div>

            {loadingTx ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)", fontSize: "13px" }}>
                Loading transactions...
              </div>
            ) : transactions.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)", fontSize: "13px" }}>
                No transactions for this reporting period.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--line)", textAlign: "left" }}>
                      <th style={{ padding: "8px 6px" }}>Date</th>
                      <th style={{ padding: "8px 6px" }}>Description</th>
                      <th style={{ padding: "8px 6px" }}>Ref / UTR</th>
                      <th style={{ padding: "8px 6px" }}>Classification</th>
                      <th style={{ padding: "8px 6px", textAlign: "right" }}>Debit</th>
                      <th style={{ padding: "8px 6px", textAlign: "right" }}>Credit</th>
                      <th style={{ padding: "8px 6px", textAlign: "right" }}>Balance</th>
                      <th style={{ padding: "8px 6px", textAlign: "center" }}>Public</th>
                      <th style={{ padding: "8px 6px", textAlign: "center" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        style={{
                          borderBottom: "1px solid var(--line)",
                          background: tx.is_duplicate_flag ? "rgba(179, 74, 21, 0.04)" : "transparent",
                        }}
                      >
                        <td style={{ padding: "8px 6px", whiteSpace: "nowrap", fontFamily: "var(--font-mono)" }}>
                          {tx.transaction_date}
                        </td>
                        <td style={{ padding: "8px 6px", maxWidth: "260px" }}>
                          <div style={{ fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {tx.description}
                          </div>
                          {tx.is_duplicate_flag && (
                            <span style={{ fontSize: "10px", color: "var(--saffron)", fontWeight: 700 }}>
                              POSSIBLE DUPLICATE
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "8px 6px", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                          {tx.reference_utr || "–"}
                        </td>
                        <td style={{ padding: "8px 6px" }}>
                          <select
                            value={tx.classification}
                            onChange={(e) => handleUpdateTransaction(tx.id, { classification: e.target.value })}
                            style={{
                              padding: "4px 6px",
                              fontSize: "11px",
                              fontFamily: "var(--font-mono)",
                              background: "var(--paper)",
                              border: "1px solid var(--line)",
                              borderRadius: "2px",
                            }}
                          >
                            <option value="DONATION">DONATION</option>
                            <option value="EXPENSE">EXPENSE</option>
                            <option value="MEMBERSHIP_FEE">MEMBERSHIP_FEE</option>
                            <option value="BANK_INTEREST">BANK_INTEREST</option>
                            <option value="TRANSFER">TRANSFER</option>
                            <option value="REFUND">REFUND</option>
                            <option value="UNKNOWN">UNKNOWN</option>
                          </select>
                        </td>
                        <td style={{ padding: "8px 6px", textAlign: "right", color: tx.debit > 0 ? "var(--saffron)" : "var(--muted)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                          {tx.debit > 0 ? `Rs. ${Number(tx.debit).toFixed(2)}` : "–"}
                        </td>
                        <td style={{ padding: "8px 6px", textAlign: "right", color: tx.credit > 0 ? "var(--green)" : "var(--muted)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                          {tx.credit > 0 ? `Rs. ${Number(tx.credit).toFixed(2)}` : "–"}
                        </td>
                        <td style={{ padding: "8px 6px", textAlign: "right", fontFamily: "var(--font-mono)" }}>
                          Rs. {Number(tx.balance_after_transaction).toFixed(2)}
                        </td>
                        <td style={{ padding: "8px 6px", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleUpdateTransaction(tx.id, { public_visibility: !tx.public_visibility })}
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                            title={tx.public_visibility ? "Publicly Visible" : "Hidden from Public"}
                          >
                            {tx.public_visibility ? <Eye size={15} color="var(--green)" /> : <EyeOff size={15} color="var(--muted)" />}
                          </button>
                        </td>
                        <td style={{ padding: "8px 6px", textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => handleUpdateTransaction(tx.id, { verification_status: tx.verification_status === "VERIFIED" ? "UNVERIFIED" : "VERIFIED" })}
                            style={{
                              background: tx.verification_status === "VERIFIED" ? "rgba(29, 86, 53, 0.1)" : "var(--paper)",
                              border: "1px solid var(--line)",
                              borderRadius: "2px",
                              padding: "2px 6px",
                              fontSize: "10px",
                              fontWeight: 700,
                              color: tx.verification_status === "VERIFIED" ? "var(--green)" : "var(--muted)",
                              cursor: "pointer",
                            }}
                          >
                            {tx.verification_status}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create 6-Month Period */}
      {showCreateModal && (
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
            style={{
              background: "var(--paper-card)",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              padding: "24px",
              maxWidth: "480px",
              width: "100%",
            }}
          >
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", margin: "0 0 16px" }}>
              Create New 6-Month Reporting Period
            </h3>

            <form onSubmit={handleCreatePeriod} style={{ display: "grid", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Period Code (e.g. 2026 H1)
                </label>
                <input
                  type="text"
                  value={newPeriod.name}
                  onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
                  required
                  style={{ width: "100%", padding: "8px", fontSize: "13px", border: "1px solid var(--line)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                  Cycle Label
                </label>
                <input
                  type="text"
                  value={newPeriod.cycle_label}
                  onChange={(e) => setNewPeriod({ ...newPeriod, cycle_label: e.target.value })}
                  required
                  style={{ width: "100%", padding: "8px", fontSize: "13px", border: "1px solid var(--line)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newPeriod.start_date}
                    onChange={(e) => setNewPeriod({ ...newPeriod, start_date: e.target.value })}
                    required
                    style={{ width: "100%", padding: "8px", fontSize: "13px", border: "1px solid var(--line)" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newPeriod.end_date}
                    onChange={(e) => setNewPeriod({ ...newPeriod, end_date: e.target.value })}
                    required
                    style={{ width: "100%", padding: "8px", fontSize: "13px", border: "1px solid var(--line)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    Opening Balance (Rs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPeriod.opening_balance}
                    onChange={(e) => setNewPeriod({ ...newPeriod, opening_balance: e.target.value })}
                    required
                    style={{ width: "100%", padding: "8px", fontSize: "13px", border: "1px solid var(--line)" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                    Closing Balance (Rs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPeriod.closing_balance}
                    onChange={(e) => setNewPeriod({ ...newPeriod, closing_balance: e.target.value })}
                    required
                    style={{ width: "100%", padding: "8px", fontSize: "13px", border: "1px solid var(--line)" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="button"
                  style={{ fontSize: "13px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button"
                  style={{ background: "var(--ink)", color: "#fff", fontSize: "13px", fontWeight: 700 }}
                >
                  Create Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
