import React, { useState, useEffect } from "react";
import {
  CreditCard, Search, Clock, CheckCircle, XCircle, RefreshCw,
  AlertTriangle, Filter,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/brand";

interface MembershipCard {
  id: string;
  card_number: string;
  card_version: number;
  issue_date: string;
  status: string;
  qr_token: string;
  verification_slug: string;
  member_id: string;
  members?: { membership_id: string; full_name: string; category: string } | null;
}

export function AdminCardsView() {
  const [cards, setCards] = useState<MembershipCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("membership_cards")
        .select("*, members:member_id(membership_id, full_name, category)")
        .order("issue_date", { ascending: false });

      if (error) throw error;
      setCards((data || []) as MembershipCard[]);
    } catch (err) {
      console.error("Failed to load cards:", err);
    } finally {
      setLoading(false);
    }
  }

  async function revokeCard(cardId: string) {
    if (!supabase || !confirm("Are you sure you want to revoke this card? This action is audited.")) return;
    setActionLoading(cardId);
    try {
      const { error } = await supabase
        .from("membership_cards")
        .update({ status: "REVOKED" })
        .eq("id", cardId);
      if (error) throw error;
      await loadCards();
    } catch (err) {
      console.error("Failed to revoke card:", err);
      alert("Failed to revoke card.");
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = cards.filter((c) => {
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesSearch =
      !search ||
      c.card_number?.toLowerCase().includes(search.toLowerCase()) ||
      c.members?.membership_id?.toLowerCase().includes(search.toLowerCase()) ||
      c.members?.full_name?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    total: cards.length,
    active: cards.filter((c) => c.status === "ACTIVE").length,
    revoked: cards.filter((c) => c.status === "REVOKED").length,
    superseded: cards.filter((c) => c.status === "SUPERSEDED").length,
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
        <Clock size={24} style={{ marginBottom: "8px" }} />
        <p>Loading card registry...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Total Issued", value: counts.total, icon: CreditCard, color: BRAND.colors.ink },
          { label: "Active", value: counts.active, icon: CheckCircle, color: "#389e0d" },
          { label: "Revoked", value: counts.revoked, icon: XCircle, color: "#cf1322" },
          { label: "Superseded", value: counts.superseded, icon: RefreshCw, color: "#d48806" },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              padding: "16px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid var(--line)",
              textAlign: "center",
            }}
          >
            <card.icon size={20} style={{ color: card.color, marginBottom: "6px" }} />
            <div style={{ fontSize: "24px", fontWeight: 800 }}>{card.value}</div>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search by name, card # or membership ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "14px" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Filter size={14} style={{ color: "var(--muted)" }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "14px", backgroundColor: "#fff" }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="REVOKED">Revoked</option>
            <option value="SUPERSEDED">Superseded</option>
          </select>
        </div>
      </div>

      {/* Cards List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid var(--line)" }}>
          <CreditCard size={32} style={{ color: "var(--muted)", marginBottom: "12px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: 700 }}>No Cards Found</h3>
          <p style={{ fontSize: "14px", color: "var(--muted)" }}>
            {search || statusFilter !== "ALL" ? "Try adjusting your filters." : "No membership cards have been issued yet."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map((card) => {
            const isActive = card.status === "ACTIVE";
            const isRevoked = card.status === "REVOKED";
            return (
              <div
                key={card.id}
                style={{
                  padding: "16px 20px",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  border: `1px solid ${isRevoked ? "#ffccc7" : "var(--line)"}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  opacity: isRevoked ? 0.7 : 1,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
                    {card.members?.full_name || "—"}
                  </div>
                  <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--muted)", flexWrap: "wrap" }}>
                    <span>Card: {card.card_number}</span>
                    <span>Member: {card.members?.membership_id || "—"}</span>
                    <span>v{card.card_version}</span>
                    <span>Issued: {new Date(card.issue_date).toLocaleDateString("en-IN")}</span>
                    <span>{card.members?.category || "—"}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "100px",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      backgroundColor: isActive ? "#f6ffed" : isRevoked ? "#fff2f0" : "#fff7e6",
                      color: isActive ? "#389e0d" : isRevoked ? "#cf1322" : "#d48806",
                    }}
                  >
                    {card.status}
                  </span>
                  {card.verification_slug && (
                    <a
                      href={`/verify/member/${card.verification_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: BRAND.colors.blue }}
                      title="Verify"
                    >
                      <CheckCircle size={16} />
                    </a>
                  )}
                  {isActive && (
                    <button
                      onClick={() => revokeCard(card.id)}
                      disabled={actionLoading === card.id}
                      style={{
                        padding: "4px 10px",
                        fontSize: "11px",
                        fontWeight: 600,
                        backgroundColor: "#fff2f0",
                        color: "#cf1322",
                        border: "1px solid #ffccc7",
                        borderRadius: "6px",
                        cursor: actionLoading === card.id ? "not-allowed" : "pointer",
                      }}
                    >
                      {actionLoading === card.id ? "..." : "Revoke"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CR80 Spec Note */}
      <div
        style={{
          marginTop: "24px",
          padding: "14px 18px",
          backgroundColor: "rgba(0, 102, 204, 0.04)",
          borderRadius: "10px",
          border: "1px solid rgba(0, 102, 204, 0.15)",
          fontSize: "12px",
          color: "var(--muted)",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
        }}
      >
        <AlertTriangle size={16} style={{ color: BRAND.colors.saffron, flexShrink: 0, marginTop: "1px" }} />
        <span>
          <strong>CR80 Standard</strong>: All membership cards conform to ISO/IEC 7810 ID-1 format
          (85.60 mm × 53.98 mm). Cards include dual-sided print layout, QR verification code,
          and formation-phase disclaimer. Cards are organizational records, not government-issued IDs.
        </span>
      </div>
    </div>
  );
}
