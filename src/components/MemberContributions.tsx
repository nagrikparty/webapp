import React, { useState, useEffect } from "react";
import { Heart, Calendar, IndianRupee, FileText, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Contribution {
  id: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  created_at: string;
  receipt_number?: string;
}

export function MemberContributions() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    loadContributions();
  }, []);

  async function loadContributions() {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      // Attempt to load from financial_transactions table
      const { data, error } = await supabase
        .from("financial_transactions")
        .select("*")
        .eq("contributor_user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: Contribution[] = data.map((row: Record<string, unknown>) => ({
          id: row.id as string,
          amount: (row.amount as number) || 0,
          type: (row.transaction_type as string) || "contribution",
          status: (row.status as string) || "confirmed",
          description: (row.description as string) || "Formation support contribution",
          created_at: row.created_at as string,
          receipt_number: row.receipt_number as string | undefined,
        }));
        setContributions(mapped);
        setTotalAmount(mapped.reduce((sum, c) => sum + c.amount, 0));
      }
    } catch (err) {
      console.warn("Could not load contributions:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
        <Clock size={24} style={{ marginBottom: "8px" }} />
        <p>Loading contributions...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Formation Phase Notice */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          backgroundColor: "rgba(179, 74, 21, 0.06)",
          border: "1px solid rgba(179, 74, 21, 0.25)",
          borderRadius: "4px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          boxShadow: "var(--shadow)",
        }}
      >
        <AlertCircle size={18} style={{ color: "var(--saffron)", flexShrink: 0, marginTop: "2px" }} />
        <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
          <strong style={{ color: "var(--ink)", fontFamily: "var(--font-serif)" }}>Formation Phase: Voluntary Support Only / स्वैच्छिक गठन सहयोग</strong>
          <br />
          Nagrik Party is in its formation phase. All contributions are strictly voluntary support towards organisational formation and statutory filings. Zero cash policy is enforced.
          Full financial disclosure is maintained at{" "}
          <a href="/transparency" style={{ color: "var(--saffron)", fontWeight: 700, textDecoration: "underline" }}>
            /transparency
          </a>.
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "14px",
          marginBottom: "28px",
        }}
      >
        <div
          className="card"
          style={{
            padding: "20px",
            backgroundColor: "var(--paper-card)",
            borderRadius: "4px",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow)",
            textAlign: "center",
          }}
        >
          <Heart size={22} style={{ color: "var(--saffron)", marginBottom: "8px" }} />
          <div style={{ fontSize: "26px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--ink)" }}>{contributions.length}</div>
          <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginTop: "2px" }}>Total Contributions</div>
        </div>

        <div
          className="card"
          style={{
            padding: "20px",
            backgroundColor: "var(--paper-card)",
            borderRadius: "4px",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow)",
            textAlign: "center",
          }}
        >
          <IndianRupee size={22} style={{ color: "var(--green)", marginBottom: "8px" }} />
          <div style={{ fontSize: "26px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--green)" }}>
            ₹{totalAmount.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginTop: "2px" }}>Total Amount (Cashless)</div>
        </div>

        <div
          className="card"
          style={{
            padding: "20px",
            backgroundColor: "var(--paper-card)",
            borderRadius: "4px",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow)",
            textAlign: "center",
          }}
        >
          <FileText size={22} style={{ color: "var(--blue)", marginBottom: "8px" }} />
          <div style={{ fontSize: "26px", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--ink)" }}>
            {contributions.filter((c) => c.receipt_number).length}
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginTop: "2px" }}>Receipts Issued</div>
        </div>
      </div>

      {/* Contributions List */}
      {contributions.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "48px 20px",
            backgroundColor: "var(--paper-card)",
            borderRadius: "4px",
            border: "1px solid var(--line-strong)",
            boxShadow: "var(--shadow)",
          }}
        >
          <Heart size={36} style={{ color: "var(--muted)", marginBottom: "12px" }} />
          <h3 style={{ fontSize: "18px", fontFamily: "var(--font-serif)", fontWeight: 700, marginBottom: "4px", color: "var(--ink)" }}>No Contributions Yet</h3>
          <div style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: "12px" }}>अभी कोई सहयोग दर्ज नहीं है</div>
          <p style={{ fontSize: "13.5px", color: "var(--muted)", maxWidth: "420px", margin: "0 auto 20px", lineHeight: 1.5 }}>
            Formation-phase support contributions will appear here once recorded with digital voucher hashes.
            All contributions are publicly disclosed in our transparency ledger.
          </p>
          <a
            href="/transparency"
            className="button primary"
            style={{
              display: "inline-block",
              minHeight: "44px",
              padding: "10px 24px",
              borderRadius: "3px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            View Transparency Ledger / पारदर्शिता बहीखाता
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {contributions.map((c) => (
            <div
              key={c.id}
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
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", marginBottom: "4px" }}>{c.description}</div>
                <div style={{ display: "flex", gap: "14px", fontSize: "12px", color: "var(--muted)", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-mono)" }}>
                    <Calendar size={12} /> {new Date(c.created_at).toLocaleDateString("en-IN")}
                  </span>
                  {c.receipt_number && (
                    <span style={{ fontFamily: "var(--font-mono)" }}>Receipt: <strong>{c.receipt_number}</strong></span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--green)", fontFamily: "var(--font-mono)" }}>
                  ₹{c.amount.toLocaleString("en-IN")}
                </div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "2px",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    backgroundColor: c.status === "confirmed" ? "rgba(29, 86, 53, 0.08)" : "rgba(179, 74, 21, 0.08)",
                    border: c.status === "confirmed" ? "1px solid rgba(29, 86, 53, 0.25)" : "1px solid rgba(179, 74, 21, 0.25)",
                    color: c.status === "confirmed" ? "var(--green)" : "var(--saffron)",
                  }}
                >
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
