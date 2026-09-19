import React, { useState, useEffect } from "react";
import {
  Layers,
  FileCheck2,
  Milestone,
  Save,
  RefreshCw,
  Shield,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminExportsView } from "@/components/AdminExportsView";
import { PublicDocumentsLibrary } from "@/components/PublicDocumentsLibrary";

async function getSessionToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

interface FoundingMilestone {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "UPCOMING" | "IN_PROGRESS" | "COMPLETED";
  weight: number;
  public_note?: string;
  sort_order: number;
  completed_at?: string;
}

export function AdminComplianceHub() {
  const [activeTab, setActiveTab] = useState<"exports" | "vault" | "milestones">("exports");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "vault" || tabParam === "milestones" || tabParam === "exports") {
      setActiveTab(tabParam);
    }
  }, []);

  function switchTab(tab: "exports" | "vault" | "milestones") {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }

  // --- MILESTONES TAB STATE ---
  const [milestones, setMilestones] = useState<FoundingMilestone[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [milestoneMsg, setMilestoneMsg] = useState("");

  async function fetchMilestones() {
    setMilestonesLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("founding_milestones")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setMilestones(data || []);
    } catch {
      // error
    } finally {
      setMilestonesLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "milestones") {
      fetchMilestones();
    }
  }, [activeTab]);

  function updateLocalMilestone(id: string, updates: Partial<FoundingMilestone>) {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }

  async function handleSaveMilestone(milestone: FoundingMilestone) {
    setSavingId(milestone.id);
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/v1/admin/milestones", {
        method: "POST",
        headers,
        body: JSON.stringify({
          milestoneId: milestone.id,
          status: milestone.status,
          weight: milestone.weight,
          publicNote: milestone.public_note,
        }),
      });

      if (res.ok) {
        setMilestoneMsg(`Milestone "${milestone.title}" updated successfully.`);
        setTimeout(() => setMilestoneMsg(""), 3500);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update milestone");
      }
    } catch {
      alert("Network error updating milestone.");
    } finally {
      setSavingId(null);
    }
  }

  // Calculate weighted progress
  const totalWeight = milestones.reduce((acc, m) => acc + Number(m.weight || 1), 0);
  const completedWeight = milestones
    .filter((m) => m.status === "COMPLETED")
    .reduce((acc, m) => acc + Number(m.weight || 1), 0);
  const inProgressWeight = milestones
    .filter((m) => m.status === "IN_PROGRESS")
    .reduce((acc, m) => acc + Number(m.weight || 1) * 0.5, 0);
  const progressPercent = totalWeight > 0 ? Math.round(((completedWeight + inProgressWeight) / totalWeight) * 100) : 0;

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
          onClick={() => switchTab("exports")}
          className="button"
          style={{
            background: activeTab === "exports" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "exports" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "exports" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <Layers size={16} />
          ECI Continuous Submission Exports
        </button>

        <button
          type="button"
          onClick={() => switchTab("vault")}
          className="button"
          style={{
            background: activeTab === "vault" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "vault" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "vault" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <FileCheck2 size={16} />
          Statutory Charters Vault
        </button>

        <button
          type="button"
          onClick={() => switchTab("milestones")}
          className="button"
          style={{
            background: activeTab === "milestones" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "milestones" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "milestones" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <Milestone size={16} />
          Founding Roadmap & Milestones
        </button>
      </div>

      {/* --- TAB 1: EXPORTS --- */}
      {activeTab === "exports" && (
        <div>
          <AdminExportsView />
        </div>
      )}

      {/* --- TAB 2: VAULT --- */}
      {activeTab === "vault" && (
        <div>
          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "16px 20px",
              borderRadius: "4px",
              border: "1px solid var(--line)",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Shield size={22} style={{ color: "var(--saffron)" }} />
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "var(--ink)" }}>
                Permanent Statutory Documents Repository
              </h4>
              <p style={{ fontSize: "12px", color: "var(--muted)", margin: 0 }}>
                Foundational charters, draft constitution, and Section 29A statutory declarations with verified SHA-256 cryptographic hashes.
              </p>
            </div>
          </div>
          <PublicDocumentsLibrary />
        </div>
      )}

      {/* --- TAB 3: MILESTONES --- */}
      {activeTab === "milestones" && (
        <div style={{ display: "grid", gap: "20px" }}>
          {milestoneMsg && (
            <div
              style={{
                padding: "10px 14px",
                background: "rgba(4, 106, 56, 0.08)",
                border: "1px solid rgba(4, 106, 56, 0.25)",
                color: "var(--green)",
                borderRadius: "3px",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {milestoneMsg}
            </div>
          )}

          {/* Progress Header Card */}
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
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, fontFamily: "var(--font-serif)" }}>
                  Phase 1 Formation Progress
                </h3>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "var(--green)",
                    background: "rgba(4, 106, 56, 0.08)",
                    padding: "2px 8px",
                    borderRadius: "2px",
                    border: "1px solid rgba(4, 106, 56, 0.2)",
                  }}
                >
                  {progressPercent}% COMPLETE
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>
                Weighted statutory completion score calculated from official milestones.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchMilestones}
              className="button"
              style={{ fontSize: "12px", padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <RefreshCw size={13} /> Refresh Milestones
            </button>
          </div>

          {/* Milestones List */}
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
            <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 16px", fontFamily: "var(--font-serif)" }}>
              Official Milestones Management ({milestones.length})
            </h4>

            {milestonesLoading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>Loading milestones...</div>
            ) : milestones.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>No milestones defined.</div>
            ) : (
              <div style={{ display: "grid", gap: "14px" }}>
                {milestones.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: "16px 20px",
                      borderRadius: "4px",
                      border: "1px solid var(--line)",
                      background: "var(--paper)",
                      display: "grid",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700, color: "var(--muted)" }}>
                            Step {m.sort_order}
                          </span>
                          <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", background: "var(--paper-card)", border: "1px solid var(--line)", padding: "1px 6px", borderRadius: "2px" }}>
                            {m.category}
                          </span>
                        </div>
                        <h5 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 4px", color: "var(--ink)" }}>
                          {m.title}
                        </h5>
                        <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
                          {m.description}
                        </p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase", marginBottom: "2px" }}>
                            Status
                          </label>
                          <select
                            value={m.status}
                            onChange={(e) => updateLocalMilestone(m.id, { status: e.target.value as "UPCOMING" | "IN_PROGRESS" | "COMPLETED" })}
                            style={{ padding: "6px 10px", minHeight: "36px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper-card)", fontSize: "12.5px", fontWeight: 600 }}
                          >
                            <option value="UPCOMING">Upcoming</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase", marginBottom: "2px" }}>
                            Weight
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            min="0.5"
                            max="10"
                            value={m.weight}
                            onChange={(e) => updateLocalMilestone(m.id, { weight: parseFloat(e.target.value) || 1.0 })}
                            style={{ width: "65px", padding: "6px 8px", minHeight: "36px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper-card)", fontSize: "12.5px", fontFamily: "var(--font-mono)" }}
                          />
                        </div>

                        <div style={{ alignSelf: "end" }}>
                          <button
                            type="button"
                            onClick={() => handleSaveMilestone(m)}
                            disabled={savingId === m.id}
                            className="button primary"
                            style={{ minHeight: "36px", padding: "6px 14px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                          >
                            <Save size={13} /> {savingId === m.id ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px" }}>
                        Public Progress Note / Status Brief
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Verified by founding committee, ready for Nirvachan Sadan filing."
                        value={m.public_note || ""}
                        onChange={(e) => updateLocalMilestone(m.id, { public_note: e.target.value })}
                        style={{ width: "100%", padding: "6px 10px", minHeight: "34px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper-card)", fontSize: "12.5px" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
