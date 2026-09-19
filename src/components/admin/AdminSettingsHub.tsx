import React, { useState, useEffect } from "react";
import {
  Settings,
  Clock,
  Search,
  UserCog,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminSettingsView } from "@/components/AdminSettingsView";
import { AdminAuditView } from "@/components/AdminAuditView";

async function getSessionToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: "PUBLIC" | "MEMBER" | "VERIFIER" | "ADMIN" | "SUPER_ADMIN";
  created_at: string;
}

export function AdminSettingsHub() {
  const [activeTab, setActiveTab] = useState<"config" | "roles" | "audit">("config");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "roles" || tabParam === "audit" || tabParam === "config") {
      setActiveTab(tabParam);
    }
  }, []);

  function switchTab(tab: "config" | "roles" | "audit") {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }

  // --- ROLES TAB STATE ---
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [roleMsg, setRoleMsg] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchProfiles() {
    setProfilesLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setProfiles(data || []);
    } catch {
      // error
    } finally {
      setProfilesLoading(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setUpdatingId(userId);
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/admin/change-role", {
        method: "POST",
        headers,
        body: JSON.stringify({ userId, newRole }),
      });

      if (res.ok) {
        setRoleMsg(`User role successfully changed to ${newRole}.`);
        setTimeout(() => setRoleMsg(""), 3500);
        setProfiles((prev) =>
          prev.map((p) => (p.id === userId ? { ...p, role: newRole as UserProfile["role"] } : p))
        );
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update role");
      }
    } catch {
      alert("Network error updating role.");
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    if (activeTab === "roles") fetchProfiles();
  }, [activeTab]);

  const filteredProfiles = profiles.filter((p) => {
    if (!userSearch) return true;
    const s = userSearch.toLowerCase();
    return (
      (p.email && p.email.toLowerCase().includes(s)) ||
      (p.full_name && p.full_name.toLowerCase().includes(s)) ||
      p.role.toLowerCase().includes(s)
    );
  });

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
          <Settings size={16} />
          System Configuration
        </button>

        <button
          type="button"
          onClick={() => switchTab("roles")}
          className="button"
          style={{
            background: activeTab === "roles" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "roles" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "roles" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <UserCog size={16} />
          Staff Access & Role Control
        </button>

        <button
          type="button"
          onClick={() => switchTab("audit")}
          className="button"
          style={{
            background: activeTab === "audit" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "audit" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "audit" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <Clock size={16} />
          Statutory Audit Trail
        </button>
      </div>

      {/* --- TAB 1: CONFIG --- */}
      {activeTab === "config" && (
        <div>
          <AdminSettingsView />
        </div>
      )}

      {/* --- TAB 2: ROLES --- */}
      {activeTab === "roles" && (
        <div style={{ display: "grid", gap: "20px" }}>
          {roleMsg && (
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
              {roleMsg}
            </div>
          )}

          {/* Search bar */}
          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "16px 20px",
              borderRadius: "4px",
              border: "1px solid var(--line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px" }}>
              <Search size={16} style={{ color: "var(--muted)" }} />
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", minHeight: "38px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
              />
            </div>

            <button
              type="button"
              onClick={fetchProfiles}
              className="button"
              style={{ fontSize: "12px", padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <RefreshCw size={13} /> Refresh Users
            </button>
          </div>

          {/* User Roles Table */}
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
              Registered Staff & Member Directory ({filteredProfiles.length})
            </h4>

            {profilesLoading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>Loading user accounts...</div>
            ) : filteredProfiles.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>No matching profiles found.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--line-strong)", background: "var(--paper)" }}>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase" }}>User / Email</th>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase" }}>Current Role</th>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase" }}>Registered Date</th>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", textAlign: "right" }}>Assign Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProfiles.map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid var(--line)" }}>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ fontWeight: 700, color: "var(--ink)" }}>{p.full_name || "Name not provided"}</div>
                          <div style={{ fontSize: "12px", color: "var(--muted)" }}>{p.email}</div>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "11px",
                              fontWeight: 700,
                              padding: "2px 7px",
                              borderRadius: "2px",
                              border: "1px solid var(--line)",
                              background:
                                p.role === "SUPER_ADMIN"
                                  ? "rgba(220, 38, 38, 0.1)"
                                  : p.role === "ADMIN"
                                  ? "rgba(179, 74, 21, 0.1)"
                                  : p.role === "VERIFIER"
                                  ? "rgba(22, 53, 92, 0.1)"
                                  : "var(--paper-subtle)",
                              color:
                                p.role === "SUPER_ADMIN"
                                  ? "var(--red)"
                                  : p.role === "ADMIN"
                                  ? "var(--saffron)"
                                  : p.role === "VERIFIER"
                                  ? "var(--blue)"
                                  : "var(--ink)",
                            }}
                          >
                            {p.role}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                          {new Date(p.created_at).toLocaleDateString("en-IN")}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>
                          <select
                            disabled={updatingId === p.id}
                            value={p.role}
                            onChange={(e) => handleRoleChange(p.id, e.target.value)}
                            style={{
                              padding: "6px 10px",
                              minHeight: "34px",
                              borderRadius: "3px",
                              border: "1px solid var(--line)",
                              background: "var(--paper)",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            <option value="PUBLIC">PUBLIC</option>
                            <option value="MEMBER">MEMBER</option>
                            <option value="VERIFIER">VERIFIER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                          </select>
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

      {/* --- TAB 3: AUDIT --- */}
      {activeTab === "audit" && (
        <div>
          <AdminAuditView />
        </div>
      )}
    </div>
  );
}
