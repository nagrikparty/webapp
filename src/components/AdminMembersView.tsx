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
          background: "#fff",
          padding: "20px 24px",
          borderRadius: "14px",
          border: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", flex: 1, minWidth: "280px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={18}
              style={{ position: "absolute", left: "14px", top: "12px", color: "var(--muted)" }}
            />
            <input
              type="text"
              placeholder="Search by name, Membership ID (e.g. NAG-...), or Card Number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 42px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                fontSize: "14px",
                background: "var(--paper)",
              }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid var(--line)",
              fontSize: "14px",
              background: "var(--paper)",
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
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Members Table */}
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
            Master Member Register ({filteredMembers.length})
          </h3>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>
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
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", textAlign: "left" }}>
                <th style={{ padding: "12px 18px" }}>Member ID</th>
                <th style={{ padding: "12px 18px" }}>Full Legal Name</th>
                <th style={{ padding: "12px 18px" }}>Category</th>
                <th style={{ padding: "12px 18px" }}>Constituency</th>
                <th style={{ padding: "12px 18px" }}>Card Status</th>
                <th style={{ padding: "12px 18px" }}>Approved Date</th>
                <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
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
                    <td style={{ padding: "14px 18px", fontWeight: 700, fontFamily: "monospace", color: BRAND.colors.saffron }}>
                      {m.membership_id}
                    </td>
                    <td style={{ padding: "14px 18px", fontWeight: 700 }}>
                      {m.full_name}
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
                        {m.category}
                      </span>
                    </td>
                    <td style={{ padding: "14px 18px", color: "var(--muted)" }}>
                      {addr?.vidhan_sabha || "Delhi"}
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      {card ? (
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
                          ACTIVE ({card.card_number})
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", color: "var(--muted)" }}>Pending Card</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 18px", color: "var(--muted)" }}>
                      {new Date(m.approved_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      {card && (
                        <a
                          href={`/verify/member/${card.card_number}`}
                          target="_blank"
                          rel="noreferrer"
                          className="button"
                          style={{
                            padding: "5px 10px",
                            fontSize: "11px",
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
        )}
      </div>
    </div>
  );
}
