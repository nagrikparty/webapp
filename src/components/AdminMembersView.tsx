import React, { useEffect, useState } from "react";
import {
  Search,
  Users,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/brand";

interface MemberItem {
  id: string;
  membership_id: string;
  full_name: string;
  category: string;
  status: string;
  approved_at: string;
  membership_applications?: {
    id: string;
    application_number: string;
    submitted_at: string;
    member_addresses?: Array<{
      vidhan_sabha?: string;
      district?: string;
      state?: string;
    }>;
  };
  membership_cards?: Array<{
    card_number: string;
    status: string;
  }>;
}

export function AdminMembersView() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  async function loadMembers() {
    setLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("members")
        .select(`
          id,
          membership_id,
          full_name,
          category,
          status,
          approved_at,
          membership_applications (
            id,
            application_number,
            submitted_at,
            member_addresses (*)
          ),
          membership_cards (
            card_number,
            status
          )
        `)
        .order("approved_at", { ascending: false });

      if (error) throw error;
      setMembers((data as unknown as MemberItem[]) || []);
    } catch (err) {
      console.error("Error loading members:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, []);

  const filteredMembers = members.filter((m) => {
    const matchCat = categoryFilter === "ALL" || m.category === categoryFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      m.full_name?.toLowerCase().includes(q) ||
      m.membership_id?.toLowerCase().includes(q) ||
      m.membership_cards?.[0]?.card_number?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      {/* Search & Filter Header */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          padding: "18px 22px",
          borderRadius: "4px",
          border: "1px solid var(--line-strong)",
          boxShadow: "var(--shadow)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", flex: 1, minWidth: "260px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search
              size={16}
              style={{ position: "absolute", left: "14px", top: "12px", color: "var(--muted)" }}
            />
            <input
              type="text"
              placeholder="Search by name, Membership ID (e.g. NAG-...), or Card Number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 14px 9px 38px",
                borderRadius: "3px",
                border: "1px solid var(--line-strong)",
                fontSize: "13.5px",
                background: "var(--paper)",
                color: "var(--ink)",
              }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: "9px 14px",
              borderRadius: "3px",
              border: "1px solid var(--line-strong)",
              fontSize: "13.5px",
              background: "var(--paper-card)",
              color: "var(--ink)",
            }}
          >
            <option value="ALL">All Categories</option>
            <option value="Primary Member">Primary Member</option>
            <option value="Active Member">Active Member</option>
            <option value="Founding Member">Founding Member</option>
          </select>
        </div>

        <button
          type="button"
          onClick={loadMembers}
          className="button"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", minHeight: "38px", padding: "8px 16px", borderRadius: "3px", fontSize: "13px" }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Members Table */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          borderRadius: "4px",
          border: "1px solid var(--line-strong)",
          overflow: "hidden",
          boxShadow: "var(--shadow)",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <h3 style={{ fontSize: "16px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
            Master Member Register ({filteredMembers.length})
          </h3>
          <span style={{ fontSize: "11.5px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            Sequential membership numbers issued upon full verification
          </span>
        </div>

        {loading ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted)" }}>
            <RefreshCw className="animate-spin" size={28} style={{ margin: "0 auto 12px" }} />
            <div>Loading verified member records...</div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted)" }}>
            <Users size={36} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <div>No members found matching your search.</div>
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--paper-subtle)", borderBottom: "1px solid var(--line-strong)", textAlign: "left" }}>
                  <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Member ID</th>
                  <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Full Legal Name</th>
                  <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Category</th>
                  <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Constituency</th>
                  <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Card Status</th>
                  <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)" }}>Approved Date</th>
                  <th style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => {
                  const addr = Array.isArray(m.membership_applications?.member_addresses)
                    ? m.membership_applications?.member_addresses[0]
                    : m.membership_applications?.member_addresses;
                  const card = m.membership_cards?.[0];

                  return (
                    <tr key={m.id} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--saffron)" }}>
                        {m.membership_id}
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-serif)" }}>
                        {m.full_name}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            padding: "2px 7px",
                            borderRadius: "2px",
                            background: "var(--paper-subtle)",
                            border: "1px solid var(--line)",
                            fontWeight: 600,
                            fontSize: "11px",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {m.category}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--muted)" }}>
                        {addr?.vidhan_sabha || "Delhi"} AC
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {card ? (
                          <span
                            style={{
                              padding: "2px 7px",
                              borderRadius: "2px",
                              fontSize: "10.5px",
                              fontWeight: 700,
                              fontFamily: "var(--font-mono)",
                              letterSpacing: "0.03em",
                              background: "rgba(29, 86, 53, 0.08)",
                              border: "1px solid rgba(29, 86, 53, 0.25)",
                              color: "var(--green)",
                            }}
                          >
                            ACTIVE ({card.card_number})
                          </span>
                        ) : (
                          <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>Pending Card</span>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                        {new Date(m.approved_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        {card && (
                          <a
                            href={`/verify/member/${card.card_number}`}
                            target="_blank"
                            rel="noreferrer"
                            className="button"
                            style={{
                              minHeight: "32px",
                              padding: "4px 10px",
                              fontSize: "11px",
                              borderRadius: "3px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <ExternalLink size={12} /> Verify
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
