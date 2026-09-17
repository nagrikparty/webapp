import React, { useState, useEffect } from "react";
import { Heart, Calendar, IndianRupee, FileText, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/brand";

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
        style={{
          padding: "16px 20px",
          backgroundColor: "rgba(245, 130, 32, 0.06)",
          border: `1px solid ${BRAND.colors.saffron}33`,
          borderRadius: "12px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <AlertCircle size={18} style={{ color: BRAND.colors.saffron, flexShrink: 0, marginTop: "2px" }} />
        <div style={{ fontSize: "13px", color: "var(--muted)" }}>
          <strong style={{ color: BRAND.colors.ink }}>Formation Phase — Voluntary Support Only</strong>
          <br />
          Nagrik Party is in its formation phase. All contributions are voluntary formation-phase
          support and are not party membership fees or political donations under any statutory framework.
          Full financial transparency is maintained at{" "}
          <a href="/transparency" style={{ color: BRAND.colors.saffron, fontWeight: 600 }}>
            /transparency
          </a>.
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "1px solid var(--line)",
            textAlign: "center",
          }}
        >
          <Heart size={24} style={{ color: BRAND.colors.saffron, marginBottom: "8px" }} />
          <div style={{ fontSize: "28px", fontWeight: 800, color: BRAND.colors.ink }}>{contributions.length}</div>
          <div style={{ fontSize: "13px", color: "var(--muted)" }}>Total Contributions</div>
        </div>

        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "1px solid var(--line)",
            textAlign: "center",
          }}
        >
          <IndianRupee size={24} style={{ color: BRAND.colors.green, marginBottom: "8px" }} />
          <div style={{ fontSize: "28px", fontWeight: 800, color: BRAND.colors.ink }}>
            ₹{totalAmount.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "13px", color: "var(--muted)" }}>Total Amount</div>
        </div>

        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "1px solid var(--line)",
            textAlign: "center",
          }}
        >
          <FileText size={24} style={{ color: BRAND.colors.blue, marginBottom: "8px" }} />
          <div style={{ fontSize: "28px", fontWeight: 800, color: BRAND.colors.ink }}>
            {contributions.filter((c) => c.receipt_number).length}
          </div>
          <div style={{ fontSize: "13px", color: "var(--muted)" }}>Receipts Issued</div>
        </div>
      </div>

      {/* Contributions List */}
      {contributions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 20px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "1px solid var(--line)",
          }}
        >
          <Heart size={32} style={{ color: "var(--muted)", marginBottom: "12px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>No Contributions Yet</h3>
          <p style={{ fontSize: "14px", color: "var(--muted)", maxWidth: "400px", margin: "0 auto 20px" }}>
            Formation-phase support contributions will appear here once recorded.
            All contributions are publicly disclosed in our transparency ledger.
          </p>
          <a
            href="/transparency"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: BRAND.colors.ink,
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            View Transparency Ledger
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {contributions.map((c) => (
            <div
              key={c.id}
              style={{
                padding: "16px 20px",
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid var(--line)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>{c.description}</div>
                <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--muted)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={12} /> {new Date(c.created_at).toLocaleDateString("en-IN")}
                  </span>
                  {c.receipt_number && (
                    <span>Receipt: {c.receipt_number}</span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "18px", fontWeight: 800, color: BRAND.colors.green }}>
                  ₹{c.amount.toLocaleString("en-IN")}
                </div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: "100px",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    backgroundColor: c.status === "confirmed" ? "#f6ffed" : "#fff7e6",
                    color: c.status === "confirmed" ? "#389e0d" : "#d48806",
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
