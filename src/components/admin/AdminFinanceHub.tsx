import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  QrCode,
  Receipt,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Building,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminFinanceView } from "@/components/AdminFinanceView";

interface DonationConfig {
  id: string;
  is_enabled: boolean;
  legal_status_label: string;
  upi_id: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  qr_image_url: string;
  payment_instructions: string;
  disclosure_text: string;
}

interface TransactionRow {
  id: string;
  user_id: string;
  amount: number;
  transaction_id: string;
  created_at: string;
  profiles?: { full_name?: string; email?: string } | null;
}

export function AdminFinanceHub() {
  const [activeTab, setActiveTab] = useState<"statements" | "config" | "transactions">("statements");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "config" || tabParam === "transactions" || tabParam === "statements") {
      setActiveTab(tabParam);
    }
  }, []);

  function switchTab(tab: "statements" | "config" | "transactions") {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }

  // --- CONFIG TAB STATE ---
  const [config, setConfig] = useState<DonationConfig>({
    id: "default",
    is_enabled: false,
    legal_status_label: "Contributions currently accepted under the Formation Phase",
    upi_id: "",
    account_name: "Nagrik Party (Formation Account)",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    qr_image_url: "",
    payment_instructions: "Scan the UPI QR code or transfer directly to the formation account. Retain reference UTR for audit receipting.",
    disclosure_text: "Nagrik Party operates on a strictly digital, zero-cash basis. Every receipt is auditable under RPA 1951.",
  });
  const [configLoading, setConfigLoading] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [configMsg, setConfigMsg] = useState("");

  async function fetchConfig() {
    setConfigLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) headers["Authorization"] = `Bearer ${session.access_token}`;

      const res = await fetch("/api/v1/admin/donation-config", { headers });
      if (res.ok) {
        const data = await res.json();
        if (data) setConfig((prev) => ({ ...prev, ...data }));
      }
    } catch {
      // error
    } finally {
      setConfigLoading(false);
    }
  }

  async function handleSaveConfig(e: React.FormEvent) {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) headers["Authorization"] = `Bearer ${session.access_token}`;

      const res = await fetch("/api/v1/admin/donation-config", {
        method: "POST",
        headers,
        body: JSON.stringify(config),
      });

      if (res.ok) {
        setConfigMsg("Donation & UPI configuration saved successfully.");
        setTimeout(() => setConfigMsg(""), 3500);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save configuration.");
      }
    } catch {
      alert("Network error updating configuration.");
    } finally {
      setSavingConfig(false);
    }
  }

  // --- TRANSACTIONS TAB STATE ---
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [txLoading, setTxLoading] = useState(false);

  async function fetchTransactions() {
    setTxLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setTransactions(data || []);
    } catch {
      // error
    } finally {
      setTxLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "config") fetchConfig();
    if (activeTab === "transactions") fetchTransactions();
  }, [activeTab]);

  const totalRaised = transactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {/* Sub-tab Switcher */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid var(--line-strong)",
          paddingBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => switchTab("statements")}
          className="button"
          style={{
            background: activeTab === "statements" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "statements" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "statements" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <FileSpreadsheet size={16} />
          Published Transparency Statements
        </button>

        <button
          type="button"
          onClick={() => switchTab("config")}
          className="button"
          style={{
            background: activeTab === "config" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "config" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "config" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <QrCode size={16} />
          Donation & UPI Acceptance Config
        </button>

        <button
          type="button"
          onClick={() => switchTab("transactions")}
          className="button"
          style={{
            background: activeTab === "transactions" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "transactions" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "transactions" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <Receipt size={16} />
          Contribution Records ({transactions.length})
        </button>
      </div>

      {/* --- TAB 1: STATEMENTS --- */}
      {activeTab === "statements" && (
        <div>
          <AdminFinanceView />
        </div>
      )}

      {/* --- TAB 2: CONFIG --- */}
      {activeTab === "config" && (
        <div style={{ display: "grid", gap: "20px" }}>
          {configMsg && (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(29, 86, 53, 0.08)",
                border: "1px solid rgba(29, 86, 53, 0.25)",
                color: "var(--green)",
                borderRadius: "3px",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {configMsg}
            </div>
          )}

          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "24px 28px",
              borderRadius: "4px",
              border: "1px solid var(--line)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 4px", fontFamily: "var(--font-serif)" }}>
                  Voluntary Contribution & UPI Gateway Settings
                </h3>
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
                  Configure digital contribution collection in compliance with Phase 1 zero-cash transparency rules.
                </p>
              </div>

              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "2px",
                  background: config.is_enabled ? "rgba(29, 86, 53, 0.1)" : "rgba(179, 74, 21, 0.1)",
                  color: config.is_enabled ? "var(--green)" : "var(--saffron)",
                  border: "1px solid var(--line)",
                }}
              >
                {config.is_enabled ? "CONTRIBUTIONS ACTIVE" : "CONTRIBUTIONS DISABLED"}
              </span>
            </div>

            {configLoading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>Loading configuration...</div>
            ) : (
              <form onSubmit={handleSaveConfig} style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", background: "var(--paper)", borderRadius: "3px", border: "1px solid var(--line)" }}>
                  <input
                    type="checkbox"
                    id="enable_donations"
                    checked={config.is_enabled}
                    onChange={(e) => setConfig((prev) => ({ ...prev, is_enabled: e.target.checked }))}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <label htmlFor="enable_donations" style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: 700, color: "var(--ink)" }}>
                    Enable Public Contribution Acceptance (Show UPI Gateway Widget on website)
                  </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      UPI ID (VPA)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. nagrikparty@bank"
                      value={config.upi_id || ""}
                      onChange={(e) => setConfig((prev) => ({ ...prev, upi_id: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={config.account_name || ""}
                      onChange={(e) => setConfig((prev) => ({ ...prev, account_name: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. State Bank of India"
                      value={config.bank_name || ""}
                      onChange={(e) => setConfig((prev) => ({ ...prev, bank_name: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={config.account_number || ""}
                      onChange={(e) => setConfig((prev) => ({ ...prev, account_number: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={config.ifsc_code || ""}
                      onChange={(e) => setConfig((prev) => ({ ...prev, ifsc_code: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                      QR Code Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /images/donation-qr.png"
                      value={config.qr_image_url || ""}
                      onChange={(e) => setConfig((prev) => ({ ...prev, qr_image_url: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    Legal Status Label
                  </label>
                  <input
                    type="text"
                    value={config.legal_status_label || ""}
                    onChange={(e) => setConfig((prev) => ({ ...prev, legal_status_label: e.target.value }))}
                    style={{ width: "100%", padding: "8px 12px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    Payment Instructions for Citizens
                  </label>
                  <textarea
                    rows={2}
                    value={config.payment_instructions || ""}
                    onChange={(e) => setConfig((prev) => ({ ...prev, payment_instructions: e.target.value }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    Statutory Transparency Disclosure
                  </label>
                  <textarea
                    rows={2}
                    value={config.disclosure_text || ""}
                    onChange={(e) => setConfig((prev) => ({ ...prev, disclosure_text: e.target.value }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                  />
                </div>

                <div style={{ marginTop: "8px" }}>
                  <button
                    type="submit"
                    disabled={savingConfig}
                    className="button primary"
                    style={{ padding: "10px 22px", minHeight: "42px", borderRadius: "3px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700 }}
                  >
                    <Save size={15} /> {savingConfig ? "Saving Settings..." : "Save Donation Configuration"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 3: TRANSACTIONS --- */}
      {activeTab === "transactions" && (
        <div style={{ display: "grid", gap: "20px" }}>
          {/* Summary Banner */}
          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "20px 24px",
              borderRadius: "4px",
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
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", fontWeight: 700, textTransform: "uppercase", color: "var(--muted)" }}>
                Total Recorded Contributions
              </span>
              <div style={{ fontSize: "28px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--green)" }}>
                ₹{totalRaised.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                From {transactions.length} digitally verified receipts
              </div>
            </div>

            <button
              type="button"
              onClick={fetchTransactions}
              className="button"
              style={{ fontSize: "12px", padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <RefreshCw size={13} /> Refresh Transactions
            </button>
          </div>

          {/* Transactions Table */}
          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "20px 24px",
              borderRadius: "4px",
              border: "1px solid var(--line)",
              boxShadow: "var(--shadow)",
            }}
          >
            <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 14px", fontFamily: "var(--font-serif)" }}>
              Recorded Contribution Ledger ({transactions.length})
            </h4>

            {txLoading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>Loading records...</div>
            ) : transactions.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>No transactions recorded yet.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--line-strong)", background: "var(--paper)" }}>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase" }}>Transaction ID / UTR</th>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase" }}>Amount</th>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase" }}>Donor Ref</th>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase" }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} style={{ borderBottom: "1px solid var(--line)" }}>
                        <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                          {tx.transaction_id}
                        </td>
                        <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--green)" }}>
                          ₹{Number(tx.amount).toLocaleString("en-IN")}
                        </td>
                        <td style={{ padding: "10px 12px", color: "var(--muted)", fontSize: "12px" }}>
                          {tx.user_id ? `${tx.user_id.slice(0, 8)}...` : "Anonymous"}
                        </td>
                        <td style={{ padding: "10px 12px", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                          {new Date(tx.created_at).toLocaleString("en-IN")}
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
    </div>
  );
}
