import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle, ShieldAlert, MapPin, Megaphone } from "lucide-react";
import type { Profile, Task, Issue, Announcement } from "@/lib/types";

export function VolunteerDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tab, setTab] = useState<"tasks" | "issues" | "announcements" | "settings">("tasks");

  const [fullName, setFullName] = useState("");
  const [ward, setWard] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/auth";
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setFullName(profileData.full_name || "");
      setWard(profileData.ward || "");
    }

    const { data: tasksData } = await supabase
      .from("volunteer_tasks")
      .select("*")
      .or(`status.eq.open,assigned_to.eq.${user.id}`)
      .order("created_at", { ascending: false });
    if (tasksData) setTasks(tasksData);

    let issueQuery = supabase.from("issues").select("*").eq("status", "submitted").order("created_at", { ascending: false });
    if (profileData?.ward) {
      issueQuery = issueQuery.eq("ward", profileData.ward);
    }
    const { data: issuesData } = await issueQuery;
    if (issuesData) setIssues(issuesData);

    const { data: announcementsData } = await supabase
      .from("announcements")
      .select("*")
      .in("target_audience", ["all", "volunteers"])
      .order("created_at", { ascending: false });
    if (announcementsData) setAnnouncements(announcementsData);

    setLoading(false);
  }

  async function claimTask(taskId: string) {
    if (!profile) return;
    try {
      await fetch("/api/v1/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${(await supabase?.auth.getSession())?.data.session?.access_token || ""}` },
        body: JSON.stringify({ action: "claim-task", taskId })
      });
    } catch {
      // Network error
    }
    loadDashboard();
  }

  async function completeTask(taskId: string) {
    try {
      await fetch("/api/v1/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${(await supabase?.auth.getSession())?.data.session?.access_token || ""}` },
        body: JSON.stringify({ action: "complete-task", taskId })
      });
    } catch {
      // Network error
    }
    loadDashboard();
  }

  async function verifyIssue(issueId: string) {
    try {
      await fetch("/api/v1/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${(await supabase?.auth.getSession())?.data.session?.access_token || ""}` },
        body: JSON.stringify({ action: "verify-issue", issueId })
      });
    } catch {
      // Network error
    }
    loadDashboard();
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    try {
      await fetch("/api/v1/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${(await supabase?.auth.getSession())?.data.session?.access_token || ""}` },
        body: JSON.stringify({ action: "save-profile", fullName, ward })
      });
    } catch {
      // Network error
    }
    loadDashboard();
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <Loader2 className="spin" size={32} style={{ margin: "0 auto 12px", color: "var(--muted)" }} />
        <p style={{ color: "var(--muted)", fontSize: "14px", letterSpacing: "0.04em" }}>
          LOADING VOLUNTEER DOSSIER... / लोड हो रहा है...
        </p>
      </div>
    );
  }

  return (
    <div data-testid="volunteer-dashboard-content" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Welcome Card */}
      <div style={{
        background: "var(--paper-card)",
        border: "1px solid var(--line-strong)",
        borderRadius: "4px",
        padding: "24px",
        boxShadow: "var(--paper-shadow)",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "4px 8px",
          border: "1px solid var(--line-strong)",
          borderRadius: "3px",
          color: "var(--muted)",
          background: "var(--paper-subtle)",
        }}>
          VOLUNTEER CADRE / स्वयंसेवक काडर
        </div>
        <h2 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "24px",
          color: "var(--ink)",
          margin: "0 0 8px",
        }}>
          Welcome, {profile?.full_name || "Volunteer"}
        </h2>
        <p style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          margin: 0,
          color: "var(--muted)",
          fontSize: "14px",
        }}>
          <MapPin size={15} style={{ color: "var(--red)" }} />
          <span>
            {profile?.ward
              ? `Assigned Ward: ${profile.ward} / आवंटित वार्ड: ${profile.ward}`
              : "No ward assigned yet. Update in Settings. / वार्ड सेटिंग्स में निर्धारित करें।"}
          </span>
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        borderBottom: "1px solid var(--line)",
        paddingBottom: "12px",
      }}>
        <button
          className={`button ${tab === "tasks" ? "primary" : ""}`}
          onClick={() => setTab("tasks")}
          type="button"
          style={{ minHeight: "44px", borderRadius: "3px", fontSize: "14px" }}
        >
          Tasks ({tasks.length}) / कार्य
        </button>
        <button
          className={`button ${tab === "issues" ? "primary" : ""}`}
          onClick={() => setTab("issues")}
          type="button"
          style={{ minHeight: "44px", borderRadius: "3px", fontSize: "14px" }}
        >
          Verify Issues ({issues.length}) / मुद्दा सत्यापन
        </button>
        <button
          className={`button ${tab === "announcements" ? "primary" : ""}`}
          onClick={() => setTab("announcements")}
          type="button"
          style={{ minHeight: "44px", borderRadius: "3px", fontSize: "14px" }}
        >
          Announcements ({announcements.length}) / घोषणाएं
        </button>
        <button
          className={`button ${tab === "settings" ? "primary" : ""}`}
          onClick={() => setTab("settings")}
          type="button"
          style={{ minHeight: "44px", borderRadius: "3px", fontSize: "14px" }}
        >
          Profile Settings / प्रोफाइल सेटिंग्स
        </button>
      </div>

      {/* Tasks Tab */}
      {tab === "tasks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {tasks.length === 0 ? (
            <div style={{
              background: "var(--paper-card)",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              padding: "32px",
              textAlign: "center",
              color: "var(--muted)",
            }}>
              No active tasks available right now. / वर्तमान में कोई सक्रिय कार्य उपलब्ध नहीं है।
            </div>
          ) : (
            tasks.map(t => (
              <div
                key={t.id}
                style={{
                  background: "var(--paper-card)",
                  border: "1px solid var(--line-strong)",
                  borderRadius: "4px",
                  padding: "20px",
                  boxShadow: "var(--paper-shadow)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div style={{ flex: "1 1 300px" }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", margin: "0 0 6px", color: "var(--ink)" }}>
                    {t.title}
                  </h3>
                  <p style={{ margin: "0 0 10px", color: "var(--muted)", fontSize: "14px", lineHeight: "1.5" }}>
                    {t.description}
                  </p>
                  {t.ward && (
                    <span style={{
                      fontSize: "12px",
                      padding: "2px 8px",
                      border: "1px solid var(--line-strong)",
                      borderRadius: "3px",
                      background: "var(--paper-subtle)",
                      color: "var(--ink)",
                    }}>
                      Ward: {t.ward}
                    </span>
                  )}
                </div>
                <div>
                  {t.status === "open" && (
                    <button
                      className="button"
                      onClick={() => claimTask(t.id)}
                      type="button"
                      style={{ minHeight: "44px", borderRadius: "3px" }}
                    >
                      Claim Task / दायित्व लें
                    </button>
                  )}
                  {t.status === "assigned" && t.assigned_to === profile?.id && (
                    <button
                      className="button primary"
                      onClick={() => completeTask(t.id)}
                      type="button"
                      style={{ minHeight: "44px", borderRadius: "3px" }}
                    >
                      Mark Complete / पूर्ण मार्क करें
                    </button>
                  )}
                  {t.status === "completed" && (
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "var(--green)",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}>
                      <CheckCircle size={16} /> Completed / पूर्ण
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Issues Tab */}
      {tab === "issues" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "14px" }}>
            Review unverified civic grievances filed by residents and perform ground verification:
            <br />
            नागरिकों द्वारा दर्ज की गई शिकायतों की जमीनी जांच करें:
          </p>
          {issues.length === 0 ? (
            <div style={{
              background: "var(--paper-card)",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              padding: "32px",
              textAlign: "center",
              color: "var(--muted)",
            }}>
              No pending issues requiring verification in your area. / आपके क्षेत्र में कोई लंबित मुद्दा नहीं है।
            </div>
          ) : (
            issues.map(iss => (
              <div
                key={iss.id}
                style={{
                  background: "var(--paper-card)",
                  border: "1px solid var(--line-strong)",
                  borderRadius: "4px",
                  padding: "20px",
                  boxShadow: "var(--paper-shadow)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div style={{ flex: "1 1 300px" }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", margin: "0 0 6px", color: "var(--ink)" }}>
                    {iss.title}
                  </h3>
                  <p style={{ margin: "0 0 10px", color: "var(--muted)", fontSize: "14px", lineHeight: "1.5" }}>
                    {iss.description}
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: "12px",
                      padding: "2px 8px",
                      border: "1px solid var(--line-strong)",
                      borderRadius: "3px",
                      background: "var(--paper-subtle)",
                      color: "var(--ink)",
                    }}>
                      Category: {iss.category}
                    </span>
                    <span style={{
                      fontSize: "12px",
                      padding: "2px 8px",
                      border: "1px solid var(--line-strong)",
                      borderRadius: "3px",
                      background: "var(--paper-subtle)",
                      color: "var(--ink)",
                    }}>
                      Ward: {iss.ward}
                    </span>
                  </div>
                </div>
                <button
                  className="button primary"
                  onClick={() => verifyIssue(iss.id)}
                  type="button"
                  style={{ minHeight: "44px", borderRadius: "3px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <ShieldAlert size={16} /> Verify Ground Issue / सत्यापन करें
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Announcements Tab */}
      {tab === "announcements" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {announcements.length === 0 ? (
            <div style={{
              background: "var(--paper-card)",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              padding: "32px",
              textAlign: "center",
              color: "var(--muted)",
            }}>
              No circular announcements posted yet. / अभी कोई घोषणा जारी नहीं की गई है।
            </div>
          ) : (
            announcements.map(a => (
              <div
                key={a.id}
                style={{
                  background: "var(--paper-card)",
                  border: "1px solid var(--line-strong)",
                  borderRadius: "4px",
                  padding: "20px",
                  boxShadow: "var(--paper-shadow)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <Megaphone size={22} style={{ color: "var(--red)", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", margin: "0 0 6px", color: "var(--ink)" }}>
                    {a.title}
                  </h3>
                  <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: "14px", lineHeight: "1.5" }}>
                    {a.content}
                  </p>
                  <span style={{
                    fontSize: "12px",
                    color: "var(--muted)",
                    padding: "2px 8px",
                    border: "1px solid var(--line)",
                    borderRadius: "3px",
                    background: "var(--paper-subtle)",
                  }}>
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Settings Tab */}
      {tab === "settings" && (
        <div style={{
          background: "var(--paper-card)",
          border: "1px solid var(--line-strong)",
          borderRadius: "4px",
          padding: "24px",
          boxShadow: "var(--paper-shadow)",
          maxWidth: "540px",
        }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", margin: "0 0 16px", color: "var(--ink)" }}>
            Cadre Settings / काडर विवरण
          </h3>
          <form onSubmit={saveSettings} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label htmlFor="fullName" style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Full Name / पूरा नाम
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your Name"
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "3px",
                  border: "1px solid var(--line-strong)",
                  background: "var(--paper-subtle)",
                  fontSize: "14px",
                  color: "var(--ink)",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label htmlFor="ward" style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Assigned Ward / वार्ड क्रमांक
              </label>
              <input
                id="ward"
                type="text"
                value={ward}
                onChange={e => setWard(e.target.value)}
                placeholder="e.g. Ward 12"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "3px",
                  border: "1px solid var(--line-strong)",
                  background: "var(--paper-subtle)",
                  fontSize: "14px",
                  color: "var(--ink)",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              type="submit"
              className="button primary"
              style={{ minHeight: "44px", borderRadius: "3px", marginTop: "8px", alignSelf: "flex-start" }}
            >
              Save Cadre Details / सुरक्षित करें
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
