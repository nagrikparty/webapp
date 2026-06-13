import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Users, FileText, CheckCircle, Trash2, Megaphone, UserCheck, UserX } from "lucide-react";
import type { Profile, Task, Announcement, Issue, MembershipApplication, Proposer } from "@/lib/types";

const API_BASE = "/api/v1/admin";

async function apiPost(path: string, body: unknown) {
  const sessionRes = await supabase.auth.getSession();
  const token = sessionRes.data.session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

async function apiDelete(path: string, params: Record<string, string>) {
  const sessionRes = await supabase.auth.getSession();
  const token = sessionRes.data.session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}${path}?${qs}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

async function apiGet(path: string, params?: Record<string, string>) {
  const sessionRes = await supabase.auth.getSession();
  const token = sessionRes.data.session?.access_token;
  if (!token) throw new Error("Not authenticated");

  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`${API_BASE}${path}${qs}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

interface VolunteerApplication {
  id: string;
  full_name: string;
  email: string;
  lok_sabha?: string;
  vidhan_sabha?: string;
  ward?: string;
  skills?: string;
  availability?: string;
  status?: string;
  created_at: string;
}

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tab, setTab] = useState<"users" | "volunteers" | "tasks" | "announcements" | "issues" | "verifications" | "proposers">("users");

  const [profilesList, setProfilesList] = useState<Profile[]>([]);
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>([]);
  const [issuesList, setIssuesList] = useState<Issue[]>([]);
  const [verificationsList, setVerificationsList] = useState<MembershipApplication[]>([]);
  const [proposersList, setProposersList] = useState<Proposer[]>([]);
  const [volunteerApps, setVolunteerApps] = useState<VolunteerApplication[]>([]);

  const [proposerName, setProposerName] = useState("");
  const [proposerEpic, setProposerEpic] = useState("");
  const [proposerWard, setProposerWard] = useState("");
  const [proposerVS, setProposerVS] = useState("");
  const [proposerContact, setProposerContact] = useState("");
  const [proposerAddress, setProposerAddress] = useState("");
  const [proposerUploading, setProposerUploading] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskWard, setNewTaskWard] = useState("");

  const [newAnnounceTitle, setNewAnnounceTitle] = useState("");
  const [newAnnounceContent, setNewAnnounceContent] = useState("");
  const [newAnnounceTarget, setNewAnnounceTarget] = useState("all");

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    setLoading(true);
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/auth"; return; }

    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (profileData) {
      if (profileData.role !== "admin") { window.location.href = "/dashboard/" + profileData.role; return; }
      setProfile(profileData);
    }

    await fetchTabData(tab);
    setLoading(false);
  }

  useEffect(() => { fetchTabData(tab); }, [tab]);

  async function fetchTabData(currentTab: string) {
    if (currentTab === "users") {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (data) setProfilesList(data);
    } else if (currentTab === "volunteers") {
      try {
        const data = await apiGet("/volunteers");
        setVolunteerApps(data);
      } catch { setVolunteerApps([]); }
    } else if (currentTab === "tasks") {
      const { data } = await supabase.from("volunteer_tasks").select("*, profiles(full_name)").order("created_at", { ascending: false });
      if (data) setTasksList(data);
    } else if (currentTab === "announcements") {
      const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
      if (data) setAnnouncementsList(data);
    } else if (currentTab === "issues") {
      const { data } = await supabase.from("issues").select("*").order("created_at", { ascending: false });
      if (data) setIssuesList(data);
    } else if (currentTab === "verifications") {
      const { data } = await supabase.from("membership_applications").select("*").eq("status", "pending").order("created_at", { ascending: false });
      if (data) setVerificationsList(data);
    } else if (currentTab === "proposers") {
      const { data } = await supabase.from("proposers").select("*").order("created_at", { ascending: false });
      if (data) setProposersList(data);
    }
  }

  async function changeRole(userId: string, newRole: string) {
    try { await apiPost("/change-role", { userId, newRole }); } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to change role");
    }
    fetchTabData("users");
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiPost("/tasks", { title: newTaskTitle, description: newTaskDesc, ward: newTaskWard || null });
      setNewTaskTitle(""); setNewTaskDesc(""); setNewTaskWard("");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to create task");
    }
    fetchTabData("tasks");
  }

  async function deleteTask(id: string) {
    try { await apiDelete("/tasks", { id }); } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete task");
    }
    fetchTabData("tasks");
  }

  async function createAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiPost("/announcements", { title: newAnnounceTitle, content: newAnnounceContent, target_audience: newAnnounceTarget });
      setNewAnnounceTitle(""); setNewAnnounceContent("");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to create announcement");
    }
    fetchTabData("announcements");
  }

  async function deleteAnnouncement(id: string) {
    try { await apiDelete("/announcements", { id }); } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete announcement");
    }
    fetchTabData("announcements");
  }

  async function resolveIssue(id: string) {
    try { await apiPost("/issues", { id }); } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to resolve issue");
    }
    fetchTabData("issues");
  }

  async function deleteIssue(id: string) {
    try { await apiDelete("/issues", { id }); } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to delete issue");
    }
    fetchTabData("issues");
  }

  async function inductMember(app: MembershipApplication) {
    try { await apiPost("/members", { applicationId: app.id, action: "induct" }); } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to induct member");
    }
    fetchTabData("verifications");
  }

  async function rejectMember(id: string) {
    try { await apiPost("/members", { applicationId: id, action: "reject" }); } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to reject member");
    }
    fetchTabData("verifications");
  }

  async function createProposer(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiPost("/proposers", {
        full_name: proposerName, epic_number: proposerEpic, ward: proposerWard,
        vidhan_sabha: proposerVS, contact_number: proposerContact, address: proposerAddress
      });
      setProposerName(""); setProposerEpic(""); setProposerWard(""); setProposerVS(""); setProposerContact(""); setProposerAddress("");
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to create proposer");
    }
    fetchTabData("proposers");
  }

  async function handleProposerPDF(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProposerUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/v1/vision/parse-proposer", { method: "POST", body: formData });
      const data = await res.json();
      if (data && !data.error) {
        if (data.full_name) setProposerName(data.full_name);
        if (data.epic_number) setProposerEpic(data.epic_number);
        if (data.ward) setProposerWard(data.ward);
        if (data.vidhan_sabha) setProposerVS(data.vidhan_sabha);
        if (data.contact_number) setProposerContact(data.contact_number);
        if (data.address) setProposerAddress(data.address);
      } else {
        alert("Could not parse PDF: " + data.error);
      }
    } catch {
      alert("Error parsing PDF.");
    } finally {
      setProposerUploading(false);
    }
  }

  async function updateVolunteerStatus(applicationId: string, status: string) {
    try { await apiPost("/volunteers", { applicationId, status }); } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed to update");
    }
    fetchTabData("volunteers");
  }

  if (loading) {
    return (
      <div className="dashboard-loader">
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  return (
    <div data-testid="admin-dashboard-content" className="dashboard-content-grid">
      <div className="card feature dashboard-welcome-card admin-welcome">
        <h2 className="dashboard-welcome-title">Administrator Console</h2>
        <p className="dashboard-welcome-subtitle">Manage users, dispatch tasks, and publish official announcements.</p>
      </div>

      <div className="dashboard-tabs">
        <button data-testid="admin-settings-link" className={`button ${tab === "users" ? "primary" : ""}`} onClick={() => setTab("users")} type="button">User Directory</button>
        <button className={`button ${tab === "volunteers" ? "primary" : ""}`} onClick={() => setTab("volunteers")} type="button">Volunteer Apps</button>
        <button className={`button ${tab === "verifications" ? "primary" : ""}`} onClick={() => setTab("verifications")} type="button">Verifications</button>
        <button className={`button ${tab === "proposers" ? "primary" : ""}`} onClick={() => setTab("proposers")} type="button">Proposers</button>
        <button className={`button ${tab === "tasks" ? "primary" : ""}`} onClick={() => setTab("tasks")} type="button">Task Dispatcher</button>
        <button className={`button ${tab === "announcements" ? "primary" : ""}`} onClick={() => setTab("announcements")} type="button">Announcements</button>
        <button className={`button ${tab === "issues" ? "primary" : ""}`} onClick={() => setTab("issues")} type="button">Issues</button>
      </div>

      {tab === "users" && (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Ward</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {profilesList.map(p => (
                <tr key={p.id}>
                  <td>{p.email}</td>
                  <td>{p.full_name || "-"}</td>
                  <td>{p.ward || "-"}</td>
                  <td>
                    <select
                      value={p.role}
                      onChange={e => changeRole(p.id, e.target.value)}
                      className="admin-role-select"
                    >
                      <option value="volunteer">Volunteer</option>
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "volunteers" && (
        <div className="dashboard-list">
          {volunteerApps.length === 0 && <p style={{ color: "var(--muted)" }}>No volunteer applications found.</p>}
          {volunteerApps.map(app => (
            <div key={app.id} className="card dashboard-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
              <div>
                <h4 className="m-0 mb-1">{app.full_name}</h4>
                <div className="task-desc m-0" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                  <strong>Email:</strong> {app.email}<br />
                  <strong>Ward:</strong> {app.ward || "-"} ({app.vidhan_sabha || "-"})<br />
                  <strong>Availability:</strong> {app.availability || "-"}<br />
                  <strong>Skills:</strong> {app.skills || "-"}<br />
                  <strong>Status:</strong> <span style={{ color: app.status === "approved" ? "var(--green)" : app.status === "rejected" ? "var(--red)" : "var(--yellow)" }}>{app.status || "pending"}</span>
                </div>
              </div>
              <div className="flex gap-2" style={{ flexDirection: "column" }}>
                {(!app.status || app.status === "pending") && (
                  <>
                    <button className="button primary" onClick={() => updateVolunteerStatus(app.id, "approved")} type="button"><UserCheck size={16} /> Approve</button>
                    <button className="button btn-danger" onClick={() => updateVolunteerStatus(app.id, "rejected")} type="button"><UserX size={16} /> Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "tasks" && (
        <div className="dashboard-content-grid">
          <div className="card form-surface admin-form-card">
            <h3 className="m-0 mb-3">Create New Task</h3>
            <form onSubmit={createTask} className="admin-form">
              <input type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Task Title" required />
              <textarea value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} placeholder="Description" required rows={3} />
              <input type="text" value={newTaskWard} onChange={e => setNewTaskWard(e.target.value)} placeholder="Target Ward (Optional)" />
              <button type="submit" className="button primary btn-start">Dispatch Task</button>
            </form>
          </div>

          <div className="dashboard-list">
            {tasksList.map(t => (
              <div key={t.id} className="card dashboard-card task-row align-center">
                <div>
                  <h4 className="m-0 mb-1">{t.title}</h4>
                  <span className="task-meta">Status: {t.status} | Ward: {t.ward || "All"} | Assignee: {t.profiles?.full_name || "None"}</span>
                </div>
                <button className="button btn-danger" onClick={() => deleteTask(t.id)} type="button"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "announcements" && (
        <div className="dashboard-content-grid">
          <div className="card form-surface admin-form-card">
            <h3 className="m-0 mb-3">Post Announcement</h3>
            <form onSubmit={createAnnouncement} className="admin-form">
              <input type="text" value={newAnnounceTitle} onChange={e => setNewAnnounceTitle(e.target.value)} placeholder="Headline" required />
              <textarea value={newAnnounceContent} onChange={e => setNewAnnounceContent(e.target.value)} placeholder="Message Content" required rows={4} />
              <select value={newAnnounceTarget} onChange={e => setNewAnnounceTarget(e.target.value)}>
                <option value="all">Everyone</option>
                <option value="members">Verified Members Only</option>
                <option value="volunteers">Volunteers Only</option>
              </select>
              <button type="submit" className="button primary btn-start">Publish Announcement</button>
            </form>
          </div>

          <div className="dashboard-list">
            {announcementsList.map(a => (
              <div key={a.id} className="card dashboard-card task-row">
                <div>
                  <h4 className="m-0 mb-1">{a.title}</h4>
                  <p className="task-desc">{a.content}</p>
                  <span className="task-tag">Audience: {a.target_audience}</span>
                </div>
                <button className="button btn-danger" onClick={() => deleteAnnouncement(a.id)} type="button"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "issues" && (
        <div className="dashboard-list">
          {issuesList.map(iss => (
            <div key={iss.id} className="card dashboard-card task-row align-center">
              <div>
                <h4 className="m-0 mb-1">{iss.title}</h4>
                <p className="task-desc m-0">{iss.description}</p>
                <div className="task-tags-row mt-2">
                  <span className="task-tag">Status: {iss.status}</span>
                  <span className="task-tag">Ward: {iss.ward}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {iss.status !== "resolved" && (
                  <button className="button primary" onClick={() => resolveIssue(iss.id)} type="button"><CheckCircle size={16} /> Resolve</button>
                )}
                <button className="button btn-danger" onClick={() => deleteIssue(iss.id)} type="button"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "verifications" && (
        <div className="dashboard-list">
          {verificationsList.length === 0 && <p style={{ color: "var(--muted)" }}>No pending membership verifications.</p>}
          {verificationsList.map(app => (
            <div key={app.id} className="card dashboard-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
              <div>
                <h4 className="m-0 mb-1" style={{ fontSize: "18px" }}>{app.full_name}</h4>
                <div className="task-desc m-0" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                  <strong>Email:</strong> {app.email}<br />
                  <strong>DOB:</strong> {app.date_of_birth}<br />
                  <strong>Ward:</strong> {app.ward} ({app.vidhan_sabha})<br />
                  <strong>Voter ID:</strong> {app.voter_id}<br />
                  {app.identity_doc_url && (
                    <a href={app.identity_doc_url.startsWith('http') ? app.identity_doc_url : `${import.meta.env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/${app.identity_doc_url}`} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "8px", color: "var(--blue)", textDecoration: "underline" }}>View Identity Document</a>
                  )}
                </div>
                {app.vision_validation_status && (
                  <div style={{ marginTop: "12px", fontSize: "12px", background: app.vision_validation_status === "passed" ? "rgba(52, 199, 89, 0.1)" : "rgba(255,59,48,0.1)", padding: "8px", borderRadius: "6px", color: app.vision_validation_status === "passed" ? "var(--green)" : "var(--red)" }}>
                    <strong>Vision API:</strong> {app.vision_validation_status.toUpperCase()}
                    <pre style={{ margin: "4px 0 0", fontSize: "10px", whiteSpace: "pre-wrap", color: "var(--ink)" }}>{app.vision_extracted_text}</pre>
                  </div>
                )}
              </div>
              <div className="flex gap-2" style={{ flexDirection: "column" }}>
                <button className="button primary" onClick={() => inductMember(app)} type="button">Induct Member</button>
                <button className="button btn-danger" onClick={() => rejectMember(app.id)} type="button">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "proposers" && (
        <div className="dashboard-content-grid">
          <div className="card form-surface admin-form-card" style={{ background: "#f8f9fa", border: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 className="m-0">Add Proposer Manually</h3>
              <div>
                <label className="button secondary" style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  {proposerUploading ? <Loader2 className="spin" size={16} /> : <FileText size={16} />}
                  {proposerUploading ? "Parsing PDF..." : "Upload Scanned PDF"}
                  <input type="file" accept="application/pdf,image/*" style={{ display: "none" }} onChange={handleProposerPDF} disabled={proposerUploading} />
                </label>
              </div>
            </div>

            <form onSubmit={createProposer} className="admin-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <input type="text" value={proposerName} onChange={e => setProposerName(e.target.value)} placeholder="Full Name" required />
                <input type="text" value={proposerEpic} onChange={e => setProposerEpic(e.target.value)} placeholder="EPIC / Voter ID" required />
                <input type="text" value={proposerWard} onChange={e => setProposerWard(e.target.value)} placeholder="Ward" />
                <input type="text" value={proposerVS} onChange={e => setProposerVS(e.target.value)} placeholder="Vidhan Sabha" />
                <input type="text" value={proposerContact} onChange={e => setProposerContact(e.target.value)} placeholder="Contact Number" />
              </div>
              <textarea value={proposerAddress} onChange={e => setProposerAddress(e.target.value)} placeholder="Full Address" rows={2} style={{ width: "100%", marginTop: "12px" }} />
              <button type="submit" className="button primary btn-start" style={{ marginTop: "12px" }}>Save Proposer to Database</button>
            </form>
          </div>

          <div className="table-responsive" style={{ marginTop: "24px" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>EPIC Number</th>
                  <th>Ward</th>
                  <th>Vidhan Sabha</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {proposersList.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "var(--muted)" }}>No proposers found.</td></tr>
                )}
                {proposersList.map(p => (
                  <tr key={p.id}>
                    <td>{p.full_name}</td>
                    <td>{p.epic_number}</td>
                    <td>{p.ward || "-"}</td>
                    <td>{p.vidhan_sabha || "-"}</td>
                    <td>{p.contact_number || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
