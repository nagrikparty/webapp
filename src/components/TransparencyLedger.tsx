import React, { useEffect, useState } from "react";
import { ShieldCheck, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Statement {
  id: string;
  reporting_period?: string;
  period_name?: string;
  fiscal_year?: string;
  period_start?: string;
  period_end?: string;
  total_receipts?: number;
  total_expenditure?: number;
  closing_balance?: number;
  opening_balance?: number;
  total_contributions?: number;
  total_expenses?: number;
  is_audited?: boolean;
  is_published?: boolean;
  statement_document_url?: string | null;
  notes?: string | null;
  published_at?: string;
}

interface Transaction {
  id: string;
  statement_id?: string | null;
  transaction_date: string;
  transaction_type: "RECEIPT" | "EXPENDITURE" | "CONTRIBUTION" | "EXPENSE";
  amount: number;
  category: string;
  source_or_payee?: string;
  description?: string;
  status?: "EXTRACTED" | "VERIFIED";
  receipt_voucher_number?: string | null;
  is_public?: boolean;
}

interface DonationConfig {
  is_enabled: boolean;
  legal_status_label?: string;
  upi_id?: string;
  account_name?: string;
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  qr_image_url?: string;
  payment_instructions?: string;
  disclosure_text?: string;
}

export function TransparencyLedger() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);
  const [donationConfig, setDonationConfig] = useState<DonationConfig | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // 1. Fetch donation config
        fetch("/api/v1/donation-config")
          .then((res) => res.json())
          .then((cfg) => setDonationConfig(cfg))
          .catch(() => setDonationConfig({ is_enabled: false }));

        if (!supabase) {
          setLoading(false);
          return;
        }

        // 2. Fetch published statements
        const { data: stmts } = await supabase
          .from("financial_statements")
          .select("*")
          .eq("is_published", true)
          .order("published_at", { ascending: false });

        if (stmts && stmts.length > 0) {
          setStatements(stmts);
        } else {
          setStatements([]);
        }

        // 3. Fetch public transactions
        const { data: txs } = await supabase
          .from("financial_transactions")
          .select("*")
          .eq("is_public", true)
          .order("transaction_date", { ascending: false })
          .limit(100);

        if (txs) {
          setTransactions(txs);
        }
      } catch (err) {
        console.error("Error loading financial transparency data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalReceipts = statements.reduce((acc, s) => acc + Number(s.total_receipts || s.total_contributions || 0), 0);
  const totalExp = statements.reduce((acc, s) => acc + Number(s.total_expenditure || s.total_expenses || 0), 0);
  const netBalance = totalReceipts - totalExp;

  const filteredTxs = selectedPeriod === "ALL"
    ? transactions
    : transactions.filter((t) => t.statement_id === selectedPeriod);

  if (loading) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted)", background: "var(--paper-card)", borderRadius: "4px", border: "1px solid var(--line)" }}>
        Loading published financial accounts and audit records...
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "28px" }}>
      
      {/* Transparency Doctrine Banner */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          padding: "24px 28px",
          borderRadius: "4px",
          border: "1px solid var(--line-strong)",
          display: "grid",
          gap: "16px",
          boxShadow: "var(--shadow)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px" }}>
          <div>
            <div
              className="badge-verified"
              style={{
                fontSize: "11px",
                marginBottom: "8px",
              }}
            >
              <ShieldCheck size={13} /> CASHLESS FORMATION ACCOUNTS
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 6px", fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
              Financial Transparency Ledger
            </h2>
            <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: 0, maxWidth: "700px", lineHeight: "1.6" }}>
              Political clean-up begins at the bank account. Nagrik Party operates on a strictly cashless,
              100% digital audit policy. Pre-registration formation funds and expenditures are recorded with complete source provenance.
            </p>
          </div>

          <div
            style={{
              padding: "14px 18px",
              background: "var(--paper-subtle)",
              borderRadius: "4px",
              border: "1px solid var(--line)",
              textAlign: "right",
              minWidth: "160px",
            }}
          >
            <div style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
              NET FORMATION BALANCE
            </div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--green)", fontFamily: "var(--font-mono)" }}>
              ₹{netBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <small style={{ fontSize: "10.5px", color: "var(--muted)" }}>
              {statements.length > 0 ? "Verified Audited Ledger" : "Pre-registration Accounts"}
            </small>
          </div>
        </div>
      </div>

      {/* Optional Configurable Donation Box (Cleanly hidden if disabled) */}
      {donationConfig?.is_enabled && (
        <div
          className="card"
          style={{
            background: "var(--paper-card)",
            border: "1.5px solid var(--saffron)",
            borderRadius: "4px",
            padding: "24px 28px",
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ flex: 1, minWidth: "min(100%, 240px)" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  color: "var(--saffron)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {donationConfig.legal_status_label || "Contributions currently accepted under the Formation Phase"}
              </span>
              <h3 style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-serif)", margin: "4px 0 8px", color: "var(--ink)" }}>
                Support Formation Phase Operations
              </h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: "0 0 16px", lineHeight: 1.55 }}>
                {donationConfig.payment_instructions || "Scan the UPI QR code or transfer directly to the formation account. All receipts are 100% digital."}
              </p>

              <div style={{ display: "grid", gap: "8px", fontSize: "13px", background: "var(--paper-subtle)", padding: "12px 16px", borderRadius: "3px", border: "1px solid var(--line)" }}>
                {donationConfig.upi_id && (
                  <div>
                    <strong style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", fontSize: "11px" }}>UPI ID: </strong>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--ink)" }}>{donationConfig.upi_id}</span>
                  </div>
                )}
                {donationConfig.account_name && (
                  <div>
                    <strong style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", fontSize: "11px" }}>ACCOUNT NAME: </strong>
                    <span>{donationConfig.account_name}</span>
                  </div>
                )}
                {donationConfig.bank_name && (
                  <div>
                    <strong style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", fontSize: "11px" }}>BANK / BRANCH: </strong>
                    <span>{donationConfig.bank_name}</span>
                  </div>
                )}
                {donationConfig.account_number && (
                  <div>
                    <strong style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", fontSize: "11px" }}>ACCOUNT NUMBER: </strong>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{donationConfig.account_number}</span>
                  </div>
                )}
                {donationConfig.ifsc_code && (
                  <div>
                    <strong style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", fontSize: "11px" }}>IFSC CODE: </strong>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{donationConfig.ifsc_code}</span>
                  </div>
                )}
              </div>

              {donationConfig.disclosure_text && (
                <div style={{ fontSize: "11px", color: "var(--ink-faint)", marginTop: "12px" }}>
                  {donationConfig.disclosure_text}
                </div>
              )}
            </div>

            {donationConfig.qr_image_url && (
              <div style={{ width: "140px", textAlign: "center" }}>
                <img
                  src={donationConfig.qr_image_url}
                  alt="UPI QR Code"
                  style={{ width: "100%", height: "auto", borderRadius: "3px", border: "1px solid var(--line)" }}
                />
                <small style={{ display: "block", fontSize: "11px", color: "var(--muted)", marginTop: "6px" }}>
                  Instant UPI Scan
                </small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reporting Period Statements Summary */}
      {statements.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "16px" }}>
          {statements.map((st) => (
            <div
              key={st.id}
              className="card"
              style={{
                background: "var(--paper-card)",
                border: "1px solid var(--line)",
                borderRadius: "4px",
                padding: "20px",
                boxShadow: "var(--shadow)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--saffron)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                  {st.reporting_period || st.period_name || "Reporting Period"}
                </span>
                <span className="badge-citation">Verified</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "14px 0" }}>
                <div>
                  <small style={{ color: "var(--muted)", fontSize: "11px", display: "block" }}>TOTAL RECEIPTS</small>
                  <strong style={{ fontSize: "15px", color: "var(--green)", fontFamily: "var(--font-mono)" }}>
                    ₹{Number(st.total_receipts || st.total_contributions || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
                <div>
                  <small style={{ color: "var(--muted)", fontSize: "11px", display: "block" }}>TOTAL EXPENSES</small>
                  <strong style={{ fontSize: "15px", color: "var(--red)", fontFamily: "var(--font-mono)" }}>
                    ₹{Number(st.total_expenditure || st.total_expenses || 0).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              {st.notes && (
                <p style={{ fontSize: "12px", color: "var(--muted)", margin: "0 0 10px", lineHeight: 1.45 }}>
                  {st.notes}
                </p>
              )}

              {st.statement_document_url && (
                <a
                  href={st.statement_document_url}
                  style={{ fontSize: "12px", fontWeight: 600, color: "var(--saffron)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <FileText size={13} /> View Certified Statement PDF
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Honest Pending / Empty State */
        <div
          className="card"
          style={{
            background: "var(--paper-card)",
            border: "1px dashed var(--line-strong)",
            borderRadius: "4px",
            padding: "36px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--paper-subtle)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "var(--muted)" }}>
            <FileText size={20} />
          </div>
          <h3 style={{ fontSize: "17px", fontWeight: 700, fontFamily: "var(--font-serif)", margin: "0 0 6px", color: "var(--ink)" }}>
            Formation-Stage Financial Records Under Compilation
          </h3>
          <p style={{ fontSize: "13.5px", color: "var(--muted)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.55 }}>
            Nagrik Party does not publish fabricated or estimated accounts. Pre-registration formation receipts and expenditures are currently undergoing internal audit committee certification and will be published here with document hashes.
          </p>
        </div>
      )}

      {/* Transaction Records Table */}
      {filteredTxs.length > 0 && (
        <div
          className="card"
          style={{
            background: "var(--paper-card)",
            border: "1px solid var(--line)",
            borderRadius: "4px",
            padding: "22px",
            boxShadow: "var(--shadow)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-serif)", margin: 0, color: "var(--ink)" }}>
              Published Transaction Records
            </h3>
            {statements.length > 1 && (
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                style={{ padding: "6px 10px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "12px", fontFamily: "var(--font-mono)" }}
              >
                <option value="ALL">All Reporting Periods</option>
                {statements.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.reporting_period || s.period_name || s.fiscal_year || s.id}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--line-strong)", color: "var(--muted)", fontSize: "11px", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                  <th style={{ padding: "8px 10px" }}>Date</th>
                  <th style={{ padding: "8px 10px" }}>Type</th>
                  <th style={{ padding: "8px 10px" }}>Category</th>
                  <th style={{ padding: "8px 10px" }}>Description</th>
                  <th style={{ padding: "8px 10px", textAlign: "right" }}>Amount</th>
                  <th style={{ padding: "8px 10px", textAlign: "center" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.map((tx) => {
                  const isReceipt = tx.transaction_type === "RECEIPT" || tx.transaction_type === "CONTRIBUTION";
                  return (
                    <tr key={tx.id} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={{ padding: "10px", fontFamily: "var(--font-mono)", color: "var(--muted)", fontSize: "12px" }}>
                        {tx.transaction_date}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <span
                          style={{
                            fontSize: "10.5px",
                            fontFamily: "var(--font-mono)",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "2px",
                            background: isReceipt ? "rgba(29, 86, 53, 0.1)" : "rgba(142, 38, 23, 0.1)",
                            color: isReceipt ? "var(--green)" : "var(--red)",
                          }}
                        >
                          {isReceipt ? "RECEIPT" : "EXPENSE"}
                        </span>
                      </td>
                      <td style={{ padding: "10px", color: "var(--ink)" }}>{tx.category}</td>
                      <td style={{ padding: "10px", color: "var(--muted)" }}>{tx.description || tx.source_or_payee || "–"}</td>
                      <td style={{ padding: "10px", textAlign: "right", fontFamily: "var(--font-mono)", fontWeight: 700, color: isReceipt ? "var(--green)" : "var(--ink)" }}>
                        {isReceipt ? "+" : "-"}₹{Number(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: "10px", textAlign: "center" }}>
                        <span style={{ fontSize: "10.5px", color: "var(--green)", fontWeight: 600 }}>
                          {tx.status || "VERIFIED"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
