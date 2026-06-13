import React, { useEffect, useState } from "react";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";
import { Loader2, CheckCircle, ShieldAlert, User, MapPin, Megaphone } from "lucide-react";
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
      <div className="dashboard-loader">
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  return (
    <div data-testid="volunteer-dashboard-content" className="dashboard-content-grid">
      <div className="card feature dashboard-welcome-card volunteer">
        <h2 className="dashboard-welcome-title">Welcome, {profile?.full_name || "Volunteer"}</h2>
        <p className="dashboard-welcome-subtitle">
          <MapPin size={14} className="dashboard-welcome-icon" />
          {profile?.ward ? `Assigned to ${profile.ward}` : "Please set your ward in Settings"}
        </p>
      </div>

      <div className="dashboard-tabs">
        <button className={`button ${tab === "tasks" ? "primary" : ""}`} onClick={() => setTab("tasks")} type="button">Digital & Offline Tasks</button>
        <button className={`button ${tab === "issues" ? "primary" : ""}`} onClick={() => setTab("issues")} type="button">Verify Local Issues</button>
        <button className={`button ${tab === "announcements" ? "primary" : ""}`} onClick={() => setTab("announcements")} type="button">Announcements</button>
        <button className={`button ${tab === "settings" ? "primary" : ""}`} onClick={() => setTab("settings")} type="button">Profile Settings</button>
      </div>

      {tab === "tasks" && (
        <div className="dashboard-list">
          {tasks.length === 0 ? (
            <p className="text-muted">No available tasks at the moment.</p>
          ) : (
            tasks.map(t => (
              <div key={t.id} className="card dashboard-card">
                <div className="task-row">
                  <div>
                    <h3 className="m-0 mb-1">{t.title}</h3>
                    <p className="task-desc">{t.description}</p>
                    {t.ward && <span className="task-tag">{t.ward}</span>}
                  </div>
                  <div>
                    {t.status === "open" && (
                      <button className="button" onClick={() => claimTask(t.id)} type="button">Claim Task</button>
                    )}
                    {t.status === "assigned" && t.assigned_to === profile?.id && (
                      <button className="button primary" onClick={() => completeTask(t.id)} type="button">Mark Complete</button>
                    )}
                    {t.status === "completed" && (
                      <span className="task-complete-badge">
                        <CheckCircle size={16} /> Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "issues" && (
        <div className="dashboard-list">
          <p className="text-muted">Review issues submitted by citizens in your ward and verify their authenticity.</p>
          {issues.length === 0 ? (
            <p className="text-muted">No unverified issues in your area.</p>
          ) : (
            issues.map(iss => (
              <div key={iss.id} className="card dashboard-card">
                <div className="task-row">
                  <div>
                    <h3 className="m-0 mb-1">{iss.title}</h3>
                    <p className="task-desc">{iss.description}</p>
                    <div className="task-tags-row">
                      <span className="task-tag category">{iss.category}</span>
                      <span className="task-tag">{iss.ward}</span>
                    </div>
                  </div>
                  <button className="button primary" onClick={() => verifyIssue(iss.id)} type="button">
                    <ShieldAlert size={16} className="mr-1" /> Verify Issue
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "announcements" && (
        <div className="dashboard-list">
          {announcements.length === 0 ? (
            <p className="text-muted">No announcements yet.</p>
          ) : (
            announcements.map(a => (
              <div key={a.id} className="card dashboard-card">
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <Megaphone size={20} style={{ color: "var(--blue)", marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <h3 className="m-0 mb-1">{a.title}</h3>
                    <p className="task-desc">{a.content}</p>
                    <span className="task-tag">{new Date(a.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "settings" && (
        <div className="card form-surface dashboard-settings-card">
          <form onSubmit={saveSettings} className="dashboard-settings-form">
            <div className="field">
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your Name" required />
            </div>
            <div className="field">
              <label htmlFor="ward">Assigned Ward</label>
              <input id="ward" type="text" value={ward} onChange={e => setWard(e.target.value)} placeholder="e.g. Ward 12" />
            </div>
            <button type="submit" className="button primary">Save Settings</button>
          </form>
        </div>
      )}
    </div>
  );
}
