import React, { useState, useEffect } from "react";
import {
  CreditCard, Search, Clock, CheckCircle, XCircle, RefreshCw,
  AlertTriangle, Filter,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

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

      const res = await fetch("/api/v1/admin/cards", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        // Fallback to direct client query if endpoint issues
        const { data, error } = await supabase
          .from("membership_cards")
          .select("*, members:member_id(membership_id, full_name, category)")
          .order("issue_date", { ascending: false });
        if (error) throw error;
        setCards((data || []) as MembershipCard[]);
        return;
      }

      const json = await res.json();
      setCards(json.cards || []);
    } catch (err) {
      console.error("Failed to load cards:", err);
    } finally {
      setLoading(false);
    }
  }

  async function revokeCard(cardId: string) {
    const reason = prompt("Please enter the reason for revoking this card (required for statutory audit):");
    if (!reason || !reason.trim()) return;

    setActionLoading(cardId);
    try {
      const { data: { session } } = await supabase!.auth.getSession();
      if (!session) throw new Error("No active session");

      const res = await fetch("/api/v1/admin/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "REVOKE", cardId, reason: reason.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to revoke card");

      await loadCards();
    } catch (err) {
      console.error("Failed to revoke card:", err);
      alert(err instanceof Error ? err.message : "Failed to revoke card.");
    } finally {
      setActionLoading(null);
    }
  }

  async function reissueCard(cardId: string) {
    const reason = prompt("Enter the reason for re-issuing this card (e.g. Card damaged, details updated, loss report):");
    if (!reason || !reason.trim()) return;

    setActionLoading(cardId);
    try {
      const { data: { session } } = await supabase!.auth.getSession();
      if (!session) throw new Error("No active session");

      const res = await fetch("/api/v1/admin/cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "REISSUE", cardId, reason: reason.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reissue card");

      alert(`Successfully re-issued card v${data.card?.card_version || "new"}! Previous card marked SUPERSEDED.`);
      await loadCards();
    } catch (err) {
      console.error("Failed to reissue card:", err);
      alert(err instanceof Error ? err.message : "Failed to reissue card.");
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "10px", marginBottom: "20px" }}>
        {[
          { label: "Total Issued", value: counts.total, icon: CreditCard, color: "var(--ink)" },
          { label: "Active", value: counts.active, icon: CheckCircle, color: "var(--green)" },
          { label: "Revoked", value: counts.revoked, icon: XCircle, color: "var(--red)" },
          { label: "Superseded", value: counts.superseded, icon: RefreshCw, color: "var(--saffron)" },
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
            placeholder="Search by name, card # or membership ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: "3px", border: "1px solid var(--line-strong)", fontSize: "14px", background: "var(--paper)", color: "var(--ink)" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Filter size={14} style={{ color: "var(--muted)" }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "3px", border: "1px solid var(--line-strong)", fontSize: "13.5px", backgroundColor: "var(--paper-card)", color: "var(--ink)" }}
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
        <div className="card" style={{ textAlign: "center", padding: "48px 20px", backgroundColor: "var(--paper-card)", borderRadius: "4px", border: "1px solid var(--line-strong)", boxShadow: "var(--shadow)" }}>
          <CreditCard size={36} style={{ color: "var(--muted)", marginBottom: "12px" }} />
          <h3 style={{ fontSize: "17px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>No Cards Found</h3>
          <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: 0 }}>
            {search || statusFilter !== "ALL" ? "Try adjusting your filters or search terms." : "No membership cards have been issued yet."}
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
                className="card"
                style={{
                  padding: "16px 20px",
                  backgroundColor: "var(--paper-card)",
                  borderRadius: "4px",
                  border: `1px solid ${isRevoked ? "rgba(142, 38, 23, 0.3)" : "var(--line-strong)"}`,
                  boxShadow: "var(--shadow)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  opacity: isRevoked ? 0.75 : 1,
                }}
              >
                <div style={{ flex: 1, minWidth: "220px" }}>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", marginBottom: "4px", fontFamily: "var(--font-serif)" }}>
                    {card.members?.full_name || "—"}
                  </div>
                  <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--muted)", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}>Card: <strong>{card.card_number}</strong></span>
                    <span style={{ fontFamily: "var(--font-mono)" }}>Member: {card.members?.membership_id || "—"}</span>
                    <span style={{ fontFamily: "var(--font-mono)" }}>v{card.card_version}</span>
                    <span style={{ fontFamily: "var(--font-mono)" }}>Issued: {new Date(card.issue_date).toLocaleDateString("en-IN")}</span>
                    <span>{card.members?.category || "—"}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "2px",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.03em",
                      textTransform: "uppercase",
                      backgroundColor: isActive ? "rgba(29, 86, 53, 0.08)" : isRevoked ? "rgba(142, 38, 23, 0.08)" : "rgba(179, 74, 21, 0.08)",
                      color: isActive ? "var(--green)" : isRevoked ? "var(--red)" : "var(--saffron)",
                      border: `1px solid ${isActive ? "rgba(29, 86, 53, 0.25)" : isRevoked ? "rgba(142, 38, 23, 0.25)" : "rgba(179, 74, 21, 0.25)"}`,
                    }}
                  >
                    {card.status}
                  </span>
                  {card.verification_slug && (
                    <a
                      href={`/verify/member/${card.verification_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button"
                      style={{ minHeight: "32px", padding: "4px 10px", fontSize: "11px", borderRadius: "3px", color: "var(--blue)" }}
                      title="Verify"
                    >
                      <CheckCircle size={14} /> Verify
                    </a>
                  )}
                  {isActive && (
                    <>
                      <button
                        onClick={() => reissueCard(card.id)}
                        disabled={actionLoading === card.id}
                        className="button"
                        style={{
                          minHeight: "32px",
                          padding: "4px 10px",
                          fontSize: "11px",
                          fontWeight: 700,
                          backgroundColor: "rgba(179, 74, 21, 0.08)",
                          color: "var(--saffron)",
                          border: "1px solid rgba(179, 74, 21, 0.25)",
                          borderRadius: "3px",
                          cursor: actionLoading === card.id ? "not-allowed" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                        title="Issue replacement card (increments version and supersedes current card)"
                      >
                        <RefreshCw size={12} className={actionLoading === card.id ? "animate-spin" : ""} />
                        {actionLoading === card.id ? "..." : "Reissue"}
                      </button>
                      <button
                        onClick={() => revokeCard(card.id)}
                        disabled={actionLoading === card.id}
                        className="button"
                        style={{
                          minHeight: "32px",
                          padding: "4px 10px",
                          fontSize: "11px",
                          fontWeight: 700,
                          backgroundColor: "rgba(142, 38, 23, 0.06)",
                          color: "var(--red)",
                          border: "1px solid rgba(142, 38, 23, 0.25)",
                          borderRadius: "3px",
                          cursor: actionLoading === card.id ? "not-allowed" : "pointer",
                        }}
                      >
                        {actionLoading === card.id ? "..." : "Revoke"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CR80 Spec Note */}
      <div
        className="card"
        style={{
          marginTop: "24px",
          padding: "14px 18px",
          backgroundColor: "var(--paper-subtle)",
          borderRadius: "4px",
          border: "1px solid var(--line-strong)",
          fontSize: "12.5px",
          color: "var(--muted)",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
        }}
      >
        <AlertTriangle size={16} style={{ color: "var(--saffron)", flexShrink: 0, marginTop: "2px" }} />
        <span>
          <strong style={{ color: "var(--ink)", fontFamily: "var(--font-serif)" }}>CR80 Standards Specification</strong>: All membership cards conform to ISO/IEC 7810 ID-1 format
          (85.60 mm × 53.98 mm). Cards include dual-sided vector print layout, SHA-256 QR verification token,
          and statutory Phase 1 disclaimer. Cards are internal organizational records, not official government-issued identity documents.
        </span>
      </div>
    </div>
  );
}
