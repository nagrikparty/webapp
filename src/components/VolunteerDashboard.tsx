import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle, ShieldAlert, User, MapPin } from "lucide-react";

export function VolunteerDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [tab, setTab] = useState<"tasks" | "issues" | "settings">("tasks");

  // Settings form
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

    // Load Profile
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

    // Load Tasks (open tasks or tasks assigned to me)
    const { data: tasksData } = await supabase
      .from("volunteer_tasks")
      .select("*")
      .or(`status.eq.open,assigned_to.eq.${user.id}`)
      .order("created_at", { ascending: false });
    if (tasksData) setTasks(tasksData);

    // Load Issues to verify (submitted issues)
    let issueQuery = supabase.from("issues").select("*").eq("status", "submitted").order("created_at", { ascending: false });
    if (profileData?.ward) {
      issueQuery = issueQuery.eq("ward", profileData.ward);
    }
    const { data: issuesData } = await issueQuery;
    if (issuesData) setIssues(issuesData);

    setLoading(false);
  }

  async function claimTask(taskId: string) {
    if (!profile || !supabase) return;
    await supabase.from("volunteer_tasks").update({ status: "assigned", assigned_to: profile.id }).eq("id", taskId);
    loadDashboard();
  }

  async function completeTask(taskId: string) {
    if (!supabase) return;
    await supabase.from("volunteer_tasks").update({ status: "completed" }).eq("id", taskId);
    loadDashboard();
  }

  async function verifyIssue(issueId: string) {
    if (!supabase) return;
    await supabase.from("issues").update({ status: "verified" }).eq("id", issueId);
    loadDashboard();
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !supabase) return;
    await supabase.from("profiles").update({ full_name: fullName, ward }).eq("id", profile.id);
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
