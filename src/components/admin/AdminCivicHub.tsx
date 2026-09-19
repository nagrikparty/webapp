import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  AlertCircle,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Play,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CrimeRow {
  id: string;
  crime_type: string;
  title: string;
  source_url: string;
  incident_date: string;
}

interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  lok_sabha?: string;
  vidhan_sabha?: string;
  ward?: string;
  status: string;
  created_at: string;
}

interface ManifestoItem {
  id: string;
  title: string;
  title_hi?: string;
  lok_sabha?: string;
  vidhan_sabha?: string;
  ward?: string;
  category?: string;
  vote_count: number;
  created_at: string;
}

export function AdminCivicHub() {
  const [activeTab, setActiveTab] = useState<"crimes" | "issues" | "manifesto">("crimes");

  // Read URL query tab on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "issues" || tabParam === "manifesto" || tabParam === "crimes") {
      setActiveTab(tabParam);
    }
  }, []);

  function switchTab(tab: "crimes" | "issues" | "manifesto") {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }

  // --- TAB 1: CRIMES STATE ---
  const [crimes, setCrimes] = useState<CrimeRow[]>([]);
  const [crimesLoading, setCrimesLoading] = useState(false);
  const [crimeCategory, setCrimeCategory] = useState("Rape");
  const [crimeTitle, setCrimeTitle] = useState("");
  const [crimeUrl, setCrimeUrl] = useState("");
  const [crimeDate, setCrimeDate] = useState(new Date().toISOString().split("T")[0]);
  const [crimeMsg, setCrimeMsg] = useState("");

  async function fetchCrimes() {
    setCrimesLoading(true);
    try {
      const types = ["Rape", "Murder", "Kidnapping", "Robbery", "Extortion"];
      let all: CrimeRow[] = [];
      for (const cat of types) {
        const res = await fetch(`/api/v1/crimes?type=${cat}`);
        if (res.ok) {
          const data = await res.json();
          all = [...all, ...data];
        }
      }
      all.sort((a, b) => new Date(b.incident_date).getTime() - new Date(a.incident_date).getTime());
      setCrimes(all);
    } catch {
      // network fallback
    } finally {
      setCrimesLoading(false);
    }
  }

  async function handleAddCrime(e: React.FormEvent) {
    e.preventDefault();
    if (!crimeTitle || !crimeUrl || !crimeDate) {
      alert("Please fill all citation fields.");
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const res = await fetch("/api/v1/crimes", {
        method: "POST",
        headers,
        body: JSON.stringify({
          crime_type: crimeCategory,
          title: crimeTitle,
          source_url: crimeUrl,
          incident_date: crimeDate,
        }),
      });

      if (res.ok) {
        setCrimeTitle("");
        setCrimeUrl("");
        setCrimeMsg("Citation successfully added to verified records.");
        setTimeout(() => setCrimeMsg(""), 3500);
        fetchCrimes();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to record citation.");
      }
    } catch {
      alert("Network error occurred.");
    }
  }

  async function handleDeleteCrime(id: string) {
    if (!confirm("Are you sure you want to delete this crime citation?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const res = await fetch(`/api/v1/crimes?id=${id}`, { method: "DELETE", headers });
      if (res.ok) fetchCrimes();
    } catch {
      // network error
    }
  }

  // --- TAB 2: ISSUES STATE ---
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [issueStatusFilter, setIssueStatusFilter] = useState("all");
  const [issueSearch, setIssueSearch] = useState("");
  const [issueMsg, setIssueMsg] = useState("");

  async function fetchIssues() {
    setIssuesLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const url = issueStatusFilter === "all"
        ? "/api/v1/admin/issues"
        : `/api/v1/admin/issues?status=${issueStatusFilter}`;
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch {
      // network fallback
    } finally {
      setIssuesLoading(false);
    }
  }

  async function handleUpdateIssueStatus(id: string, newStatus: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const res = await fetch("/api/v1/admin/issues", {
        method: "POST",
        headers,
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setIssueMsg(`Issue updated to ${newStatus}.`);
        setTimeout(() => setIssueMsg(""), 3000);
        fetchIssues();
      }
    } catch {
      // network error
    }
  }

  async function handleDeleteIssue(id: string) {
    if (!confirm("Are you sure you want to permanently delete this issue report?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const res = await fetch(`/api/v1/admin/issues?id=${id}`, { method: "DELETE", headers });
      if (res.ok) fetchIssues();
    } catch {
      // network error
    }
  }

  // --- TAB 3: MANIFESTO STATE ---
  const [manifestoItems, setManifestoItems] = useState<ManifestoItem[]>([]);
  const [manifestoLoading, setManifestoLoading] = useState(false);
  const [newProposalTitle, setNewProposalTitle] = useState("");
  const [newProposalHindi, setNewProposalHindi] = useState("");
  const [newProposalCategory, setNewProposalCategory] = useState("Civic Infrastructure");
  const [newProposalWard, setNewProposalWard] = useState("");
  const [manifestoMsg, setManifestoMsg] = useState("");
  const [runningPipeline, setRunningPipeline] = useState(false);

  async function fetchManifesto() {
    setManifestoLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const res = await fetch("/api/v1/admin/manifesto-items", { headers });
      if (res.ok) {
        const data = await res.json();
        setManifestoItems(data);
      }
    } catch {
      // network fallback
    } finally {
      setManifestoLoading(false);
    }
  }

  async function handleAddProposal(e: React.FormEvent) {
    e.preventDefault();
    if (!newProposalTitle.trim()) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const res = await fetch("/api/v1/admin/manifesto-items", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: newProposalTitle,
          title_hi: newProposalHindi,
          category: newProposalCategory,
          ward: newProposalWard,
        }),
      });
      if (res.ok) {
        setNewProposalTitle("");
        setNewProposalHindi("");
        setNewProposalWard("");
        setManifestoMsg("Manifesto proposal published successfully.");
        setTimeout(() => setManifestoMsg(""), 3500);
        fetchManifesto();
      }
    } catch {
      // error
    }
  }

  async function handleDeleteProposal(id: string) {
    if (!confirm("Are you sure you want to delete this manifesto proposal?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const res = await fetch(`/api/v1/admin/manifesto-items?id=${id}`, { method: "DELETE", headers });
      if (res.ok) fetchManifesto();
    } catch {
      // error
    }
  }

  async function triggerTopicPipeline() {
    setRunningPipeline(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
      const res = await fetch("/api/v1/admin/run-topic-pipeline", { method: "POST", headers });
      if (res.ok) {
        setManifestoMsg("Topic pipeline completed. Mentions and aggregates updated.");
      } else {
        setManifestoMsg("Pipeline run returned an error.");
      }
      setTimeout(() => setManifestoMsg(""), 4000);
    } catch {
      setManifestoMsg("Network error running pipeline.");
    } finally {
      setRunningPipeline(false);
    }
  }

  // Load active tab data
  useEffect(() => {
    if (activeTab === "crimes") fetchCrimes();
    if (activeTab === "issues") fetchIssues();
    if (activeTab === "manifesto") fetchManifesto();
  }, [activeTab, issueStatusFilter]);

  const filteredIssues = issues.filter((iss) => {
    if (!issueSearch) return true;
    const s = issueSearch.toLowerCase();
    return (
      iss.title.toLowerCase().includes(s) ||
      (iss.description && iss.description.toLowerCase().includes(s)) ||
      (iss.ward && iss.ward.toLowerCase().includes(s))
    );
  });

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {/* Tab Selector Header */}
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
          onClick={() => switchTab("crimes")}
          className="button"
          style={{
            background: activeTab === "crimes" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "crimes" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "crimes" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <ShieldAlert size={16} />
          Verified Crime Tracker ({crimes.length})
        </button>

        <button
          type="button"
          onClick={() => switchTab("issues")}
          className="button"
          style={{
            background: activeTab === "issues" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "issues" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "issues" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <AlertCircle size={16} />
          Citizen Issues & Grievances ({issues.length})
        </button>

        <button
          type="button"
          onClick={() => switchTab("manifesto")}
          className="button"
          style={{
            background: activeTab === "manifesto" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "manifesto" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "manifesto" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <FileText size={16} />
          Manifesto & Policy Proposals ({manifestoItems.length})
        </button>
      </div>

      {/* --- TAB 1: CRIMES VIEW --- */}
      {activeTab === "crimes" && (
        <div style={{ display: "grid", gap: "20px" }}>
          {crimeMsg && (
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
              {crimeMsg}
            </div>
          )}

          {/* Add Crime Citation Form */}
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
            <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 14px", fontFamily: "var(--font-serif)" }}>
              Add Verified Crime Citation
            </h3>
            <form
              onSubmit={handleAddCrime}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                alignItems: "end",
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Category
                </label>
                <select
                  value={crimeCategory}
                  onChange={(e) => setCrimeCategory(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                >
                  <option value="Rape">Rape</option>
                  <option value="Murder">Murder</option>
                  <option value="Kidnapping">Kidnapping</option>
                  <option value="Robbery">Robbery</option>
                  <option value="Extortion">Extortion</option>
                </select>
              </div>

              <div style={{ minWidth: "240px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Article Headline
                </label>
                <input
                  type="text"
                  placeholder="Verified police / news incident headline"
                  value={crimeTitle}
                  onChange={(e) => setCrimeTitle(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                />
              </div>

              <div style={{ minWidth: "240px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Source URL
                </label>
                <input
                  type="url"
                  placeholder="https://thehindu.com/..."
                  value={crimeUrl}
                  onChange={(e) => setCrimeUrl(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Incident Date
                </label>
                <input
                  type="date"
                  value={crimeDate}
                  onChange={(e) => setCrimeDate(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="button primary"
                  style={{ width: "100%", minHeight: "40px", borderRadius: "3px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "13px", fontWeight: 700 }}
                >
                  <Plus size={16} /> Record Citation
                </button>
              </div>
            </form>
          </div>

          {/* Citations Roster */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: 700, margin: 0, fontFamily: "var(--font-serif)" }}>
                Verified Incidents Roster ({crimes.length})
              </h4>
              <button
                type="button"
                onClick={fetchCrimes}
                className="button"
                style={{ fontSize: "12px", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            {crimesLoading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>Loading citations...</div>
            ) : crimes.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>No citations found.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--line-strong)", background: "var(--paper)" }}>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase" }}>Category</th>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase" }}>Headline</th>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase" }}>Incident Date</th>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase" }}>Source</th>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crimes.map((c) => (
                      <tr key={c.id} style={{ borderBottom: "1px solid var(--line)" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 700 }}>
                          <span
                            style={{
                              padding: "2px 7px",
                              borderRadius: "2px",
                              fontSize: "11px",
                              fontFamily: "var(--font-mono)",
                              background: c.crime_type === "Rape" ? "rgba(220, 38, 38, 0.1)" : "rgba(179, 74, 21, 0.08)",
                              color: c.crime_type === "Rape" ? "#dc2626" : "var(--saffron)",
                              border: "1px solid var(--line)",
                            }}
                          >
                            {c.crime_type}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", fontWeight: 600 }}>{c.title}</td>
                        <td style={{ padding: "10px 12px", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                          {c.incident_date}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <a
                            href={c.source_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "var(--blue)", display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "none", fontSize: "12px" }}
                          >
                            View Source <ExternalLink size={12} />
                          </a>
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteCrime(c.id)}
                            style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", padding: "4px" }}
                            title="Delete citation"
                          >
                            <Trash2 size={16} />
                          </button>
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

      {/* --- TAB 2: ISSUES VIEW --- */}
      {activeTab === "issues" && (
        <div style={{ display: "grid", gap: "20px" }}>
          {issueMsg && (
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
              {issueMsg}
            </div>
          )}

          {/* Search & Filter Bar */}
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
                placeholder="Search citizen issues by title, description, or ward..."
                value={issueSearch}
                onChange={(e) => setIssueSearch(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", minHeight: "38px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={15} style={{ color: "var(--muted)" }} />
              <select
                value={issueStatusFilter}
                onChange={(e) => setIssueStatusFilter(e.target.value)}
                style={{ padding: "8px 12px", minHeight: "38px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_investigation">Under Investigation</option>
                <option value="resolved">Resolved</option>
              </select>

              <button
                type="button"
                onClick={fetchIssues}
                className="button"
                style={{ fontSize: "12px", padding: "8px 12px" }}
              >
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {/* Issues List */}
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
              Reported Citizen Grievances ({filteredIssues.length})
            </h4>

            {issuesLoading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>Loading reported issues...</div>
            ) : filteredIssues.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>No issues found matching criteria.</div>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {filteredIssues.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "16px 18px",
                      border: "1px solid var(--line)",
                      borderRadius: "3px",
                      background: "var(--paper)",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "260px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontFamily: "var(--font-mono)",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "2px",
                            background: item.status === "resolved" ? "rgba(29, 86, 53, 0.1)" : "rgba(179, 74, 21, 0.1)",
                            color: item.status === "resolved" ? "var(--green)" : "var(--saffron)",
                            textTransform: "uppercase",
                          }}
                        >
                          {item.status}
                        </span>
                        {item.category && (
                          <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                            Category: {item.category}
                          </span>
                        )}
                        {item.ward && (
                          <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                            · Ward: {item.ward}
                          </span>
                        )}
                      </div>

                      <h5 style={{ fontSize: "14.5px", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
                        {item.title}
                      </h5>
                      <p style={{ fontSize: "13px", color: "var(--ink)", margin: 0, lineHeight: 1.5 }}>
                        {item.description}
                      </p>
                      <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "6px" }}>
                        Reported on {new Date(item.created_at).toLocaleDateString("en-IN")}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {item.status !== "under_investigation" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateIssueStatus(item.id, "under_investigation")}
                          className="button"
                          style={{ fontSize: "12px", padding: "6px 10px" }}
                        >
                          Mark Investigating
                        </button>
                      )}
                      {item.status !== "resolved" && (
                        <button
                          type="button"
                          onClick={() => handleUpdateIssueStatus(item.id, "resolved")}
                          className="button primary"
                          style={{ fontSize: "12px", padding: "6px 10px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <CheckCircle2 size={13} /> Mark Resolved
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteIssue(item.id)}
                        style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", padding: "4px" }}
                        title="Delete issue"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 3: MANIFESTO VIEW --- */}
      {activeTab === "manifesto" && (
        <div style={{ display: "grid", gap: "20px" }}>
          {manifestoMsg && (
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
              {manifestoMsg}
            </div>
          )}

          {/* Trigger Topic Pipeline Banner */}
          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              padding: "18px 22px",
              borderRadius: "4px",
              border: "1px solid var(--line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
            }}
          >
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 4px", fontFamily: "var(--font-serif)" }}>
                Topic Aggregations & Mention Indexer
              </h4>
              <p style={{ fontSize: "12.5px", color: "var(--muted)", margin: 0 }}>
                Run the topic pipeline to re-calculate citizen sentiment, indexed mentions, and regional weights.
              </p>
            </div>
            <button
              type="button"
              onClick={triggerTopicPipeline}
              disabled={runningPipeline}
              className="button primary"
              style={{ padding: "8px 16px", fontSize: "12.5px", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Play size={13} /> {runningPipeline ? "Running Pipeline..." : "Run Topic Pipeline"}
            </button>
          </div>

          {/* Add Proposal Form */}
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
              Create New Manifesto & Policy Proposal
            </h4>
            <form
              onSubmit={handleAddProposal}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                alignItems: "end",
              }}
            >
              <div style={{ minWidth: "240px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Proposal Title (English)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24/7 Clean Drinking Water for all Delhi wards"
                  value={newProposalTitle}
                  onChange={(e) => setNewProposalTitle(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Title (Hindustani / Hindi)
                </label>
                <input
                  type="text"
                  placeholder="e.g. सभी वार्डों के लिए 24 घंटे साफ पानी"
                  value={newProposalHindi}
                  onChange={(e) => setNewProposalHindi(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Category
                </label>
                <select
                  value={newProposalCategory}
                  onChange={(e) => setNewProposalCategory(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                >
                  <option value="Civic Infrastructure">Civic Infrastructure</option>
                  <option value="Education & Healthcare">Education & Healthcare</option>
                  <option value="Anti-Corruption & Scrutiny">Anti-Corruption & Scrutiny</option>
                  <option value="Women Safety & Law">Women Safety & Law</option>
                  <option value="Environment & Water">Environment & Water</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Target Ward / Assembly (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Okhla or Ward 188"
                  value={newProposalWard}
                  onChange={(e) => setNewProposalWard(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="button primary"
                  style={{ width: "100%", minHeight: "40px", borderRadius: "3px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "13px", fontWeight: 700 }}
                >
                  <Plus size={15} /> Publish Proposal
                </button>
              </div>
            </form>
          </div>

          {/* Proposals List */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h4 style={{ fontSize: "15px", fontWeight: 700, margin: 0, fontFamily: "var(--font-serif)" }}>
                Active Policy Proposals & Voter Turnout ({manifestoItems.length})
              </h4>
              <button
                type="button"
                onClick={fetchManifesto}
                className="button"
                style={{ fontSize: "12px", padding: "6px 12px" }}
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            {manifestoLoading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>Loading proposals...</div>
            ) : manifestoItems.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>No policy proposals recorded yet.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--line-strong)", background: "var(--paper)" }}>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase" }}>Proposal Title</th>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase" }}>Category</th>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase" }}>Locality Scope</th>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", textAlign: "center" }}>Votes</th>
                      <th style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manifestoItems.map((item) => (
                      <tr key={item.id} style={{ borderBottom: "1px solid var(--line)" }}>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ fontWeight: 700, color: "var(--ink)" }}>{item.title}</div>
                          {item.title_hi && (
                            <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>{item.title_hi}</div>
                          )}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", background: "var(--paper-subtle)", padding: "2px 6px", border: "1px solid var(--line)", borderRadius: "2px" }}>
                            {item.category || "General"}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "var(--muted)", fontSize: "12px" }}>
                          {item.ward || item.vidhan_sabha || "Delhi-wide"}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "center" }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--green)", fontSize: "14px" }}>
                            {item.vote_count || 0}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteProposal(item.id)}
                            style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", padding: "4px" }}
                            title="Delete proposal"
                          >
                            <Trash2 size={16} />
                          </button>
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
