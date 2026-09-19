import React, { useState, useEffect } from "react";
import {
  Users,
  CheckSquare,
  Megaphone,
  Plus,
  Trash2,
  RefreshCw,
  Send,
  MapPin,
  Mail,
  UserCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

async function getSessionToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

interface VolunteerApplication {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  lok_sabha?: string;
  vidhan_sabha?: string;
  ward?: string;
  skills?: string;
  availability?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  ward?: string;
  status: "open" | "assigned" | "completed";
  assigned_to?: string;
  created_at: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  target_audience: "all" | "members" | "volunteers";
  created_at: string;
}

export function AdminOperationsHub() {
  const [activeTab, setActiveTab] = useState<"volunteers" | "tasks" | "announcements">("volunteers");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "tasks" || tabParam === "announcements" || tabParam === "volunteers") {
      setActiveTab(tabParam);
    }
  }, []);

  function switchTab(tab: "volunteers" | "tasks" | "announcements") {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  }

  // --- VOLUNTEERS TAB STATE ---
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [volunteersLoading, setVolunteersLoading] = useState(false);
  const [volStatusFilter, setVolStatusFilter] = useState("all");
  const [volMsg, setVolMsg] = useState("");

  async function fetchVolunteers() {
    setVolunteersLoading(true);
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const url = volStatusFilter === "all"
        ? "/api/v1/admin/volunteers"
        : `/api/v1/admin/volunteers?status=${volStatusFilter}`;
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        setVolunteers(data);
      }
    } catch {
      // error
    } finally {
      setVolunteersLoading(false);
    }
  }

  async function handleVolunteerAction(id: string, status: "approved" | "rejected") {
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/admin/volunteers", {
        method: "POST",
        headers,
        body: JSON.stringify({ applicationId: id, status }),
      });

      if (res.ok) {
        setVolMsg(`Volunteer application marked ${status}.`);
        setTimeout(() => setVolMsg(""), 3000);
        fetchVolunteers();
      }
    } catch {
      // error
    }
  }

  // --- TASKS TAB STATE ---
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskWard, setTaskWard] = useState("");
  const [taskMsg, setTaskMsg] = useState("");

  async function fetchTasks() {
    setTasksLoading(true);
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/admin/tasks", { headers });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch {
      // error
    } finally {
      setTasksLoading(false);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/admin/tasks", {
        method: "POST",
        headers,
        body: JSON.stringify({ title: taskTitle, description: taskDesc, ward: taskWard }),
      });

      if (res.ok) {
        setTaskTitle("");
        setTaskDesc("");
        setTaskWard("");
        setTaskMsg("Volunteer field task created successfully.");
        setTimeout(() => setTaskMsg(""), 3500);
        fetchTasks();
      }
    } catch {
      // error
    }
  }

  async function handleDeleteTask(id: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/v1/admin/tasks?id=${id}`, { method: "DELETE", headers });
      if (res.ok) fetchTasks();
    } catch {
      // error
    }
  }

  // --- ANNOUNCEMENTS TAB STATE ---
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annTarget, setAnnTarget] = useState<"all" | "members" | "volunteers">("all");
  const [annMsg, setAnnMsg] = useState("");

  async function fetchAnnouncements() {
    setAnnouncementsLoading(true);
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/admin/announcements", { headers });
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch {
      // error
    } finally {
      setAnnouncementsLoading(false);
    }
  }

  async function handleCreateAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/v1/admin/announcements", {
        method: "POST",
        headers,
        body: JSON.stringify({ title: annTitle, content: annContent, target_audience: annTarget }),
      });

      if (res.ok) {
        setAnnTitle("");
        setAnnContent("");
        setAnnMsg("Announcement broadcasted successfully.");
        setTimeout(() => setAnnMsg(""), 3500);
        fetchAnnouncements();
      }
    } catch {
      // error
    }
  }

  async function handleDeleteAnnouncement(id: string) {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const token = await getSessionToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/v1/admin/announcements?id=${id}`, { method: "DELETE", headers });
      if (res.ok) fetchAnnouncements();
    } catch {
      // error
    }
  }

  useEffect(() => {
    if (activeTab === "volunteers") fetchVolunteers();
    if (activeTab === "tasks") fetchTasks();
    if (activeTab === "announcements") fetchAnnouncements();
  }, [activeTab, volStatusFilter]);

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {/* Sub-tab Navigation */}
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
          onClick={() => switchTab("volunteers")}
          className="button"
          style={{
            background: activeTab === "volunteers" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "volunteers" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "volunteers" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <Users size={16} />
          Volunteer Intake & Roster ({volunteers.length})
        </button>

        <button
          type="button"
          onClick={() => switchTab("tasks")}
          className="button"
          style={{
            background: activeTab === "tasks" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "tasks" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "tasks" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <CheckSquare size={16} />
          Field Tasks Manager ({tasks.length})
        </button>

        <button
          type="button"
          onClick={() => switchTab("announcements")}
          className="button"
          style={{
            background: activeTab === "announcements" ? "var(--ink)" : "var(--paper-card)",
            color: activeTab === "announcements" ? "#fff" : "var(--ink)",
            borderColor: activeTab === "announcements" ? "var(--ink)" : "var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          <Megaphone size={16} />
          Broadcast Announcements ({announcements.length})
        </button>
      </div>

      {/* --- TAB 1: VOLUNTEERS --- */}
      {activeTab === "volunteers" && (
        <div style={{ display: "grid", gap: "20px" }}>
          {volMsg && (
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
              {volMsg}
            </div>
          )}

          {/* Filter Bar */}
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                Filter By Status:
              </span>
              <select
                value={volStatusFilter}
                onChange={(e) => setVolStatusFilter(e.target.value)}
                style={{ padding: "8px 12px", minHeight: "38px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <button
              type="button"
              onClick={fetchVolunteers}
              className="button"
              style={{ fontSize: "12px", padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <RefreshCw size={13} /> Refresh Roster
            </button>
          </div>

          {/* Volunteers List */}
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
              Volunteer Applicants ({volunteers.length})
            </h4>

            {volunteersLoading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>Loading volunteer records...</div>
            ) : volunteers.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>No volunteer applications found.</div>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {volunteers.map((vol) => (
                  <div
                    key={vol.id}
                    style={{
                      padding: "16px 18px",
                      borderRadius: "3px",
                      border: "1px solid var(--line)",
                      background: "var(--paper)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "16px",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "260px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)" }}>{vol.full_name}</span>
                        <span
                          style={{
                            fontSize: "10.5px",
                            fontFamily: "var(--font-mono)",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "2px",
                            textTransform: "uppercase",
                            background:
                              vol.status === "approved"
                                ? "rgba(29, 86, 53, 0.1)"
                                : vol.status === "rejected"
                                ? "rgba(220, 38, 38, 0.1)"
                                : "rgba(179, 74, 21, 0.1)",
                            color:
                              vol.status === "approved"
                                ? "var(--green)"
                                : vol.status === "rejected"
                                ? "var(--red)"
                                : "var(--saffron)",
                          }}
                        >
                          {vol.status}
                        </span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12.5px", color: "var(--muted)", flexWrap: "wrap", marginTop: "4px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Mail size={12} /> {vol.email}
                        </span>
                        {vol.phone && <span>· Phone: {vol.phone}</span>}
                        {vol.ward && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <MapPin size={12} /> Ward: {vol.ward}
                          </span>
                        )}
                        {vol.vidhan_sabha && <span>· AC: {vol.vidhan_sabha}</span>}
                      </div>

                      {vol.skills && (
                        <div style={{ fontSize: "12px", color: "var(--ink)", marginTop: "6px" }}>
                          <strong>Skills & Focus:</strong> {vol.skills}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {vol.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() => handleVolunteerAction(vol.id, "approved")}
                          className="button primary"
                          style={{ fontSize: "12px", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <UserCheck size={13} /> Approve Volunteer
                        </button>
                      )}
                      {vol.status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => handleVolunteerAction(vol.id, "rejected")}
                          className="button"
                          style={{ fontSize: "12px", padding: "6px 12px", color: "var(--red)" }}
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: FIELD TASKS --- */}
      {activeTab === "tasks" && (
        <div style={{ display: "grid", gap: "20px" }}>
          {taskMsg && (
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
              {taskMsg}
            </div>
          )}

          {/* Create Task Card */}
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
              Create Volunteer Field Task
            </h4>
            <form
              onSubmit={handleCreateTask}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
                alignItems: "end",
              }}
            >
              <div style={{ minWidth: "260px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Distribute voter awareness pamphlets"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Delhi Ward / Area Scope
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ward 188 (Zakir Nagar)"
                  value={taskWard}
                  onChange={(e) => setTaskWard(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Task Description & Brief
                </label>
                <textarea
                  rows={2}
                  placeholder="Detailed instructions for volunteers on the ground..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="button primary"
                  style={{ minHeight: "40px", padding: "8px 16px", borderRadius: "3px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700 }}
                >
                  <Plus size={15} /> Create Field Task
                </button>
              </div>
            </form>
          </div>

          {/* Tasks List */}
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
                Active Field Tasks ({tasks.length})
              </h4>
              <button
                type="button"
                onClick={fetchTasks}
                className="button"
                style={{ fontSize: "12px", padding: "6px 12px" }}
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            {tasksLoading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>Loading field tasks...</div>
            ) : tasks.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>No tasks currently active.</div>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      padding: "14px 18px",
                      borderRadius: "3px",
                      border: "1px solid var(--line)",
                      background: "var(--paper)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "14px",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "240px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--ink)" }}>{task.title}</span>
                        <span
                          style={{
                            fontSize: "10.5px",
                            fontFamily: "var(--font-mono)",
                            padding: "2px 6px",
                            borderRadius: "2px",
                            background: "var(--paper-card)",
                            border: "1px solid var(--line)",
                            textTransform: "uppercase",
                          }}
                        >
                          {task.status}
                        </span>
                        {task.ward && (
                          <span style={{ fontSize: "11px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                            · Ward: {task.ward}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0 }}>{task.description}</p>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(task.id)}
                        style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", padding: "4px" }}
                        title="Delete task"
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

      {/* --- TAB 3: ANNOUNCEMENTS --- */}
      {activeTab === "announcements" && (
        <div style={{ display: "grid", gap: "20px" }}>
          {annMsg && (
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
              {annMsg}
            </div>
          )}

          {/* Create Announcement Form */}
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
              Broadcast Platform Announcement
            </h4>
            <form
              onSubmit={handleCreateAnnouncement}
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "end" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    Announcement Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Schedule for Phase 1 General Body Meeting"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                    Target Audience
                  </label>
                  <select
                    value={annTarget}
                    onChange={(e) => setAnnTarget(e.target.value as "all" | "members" | "volunteers")}
                    style={{ padding: "8px 12px", minHeight: "40px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                  >
                    <option value="all">Everyone (Public & All)</option>
                    <option value="members">Verified Members Only</option>
                    <option value="volunteers">Active Volunteers Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
                  Announcement Message Content
                </label>
                <textarea
                  rows={3}
                  placeholder="Official announcement text..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "3px", border: "1px solid var(--line)", background: "var(--paper)", fontSize: "13px" }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="button primary"
                  style={{ minHeight: "40px", padding: "8px 18px", borderRadius: "3px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700 }}
                >
                  <Send size={14} /> Broadcast Announcement
                </button>
              </div>
            </form>
          </div>

          {/* Announcements List */}
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
                Broadcast History ({announcements.length})
              </h4>
              <button
                type="button"
                onClick={fetchAnnouncements}
                className="button"
                style={{ fontSize: "12px", padding: "6px 12px" }}
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            {announcementsLoading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>Loading announcements...</div>
            ) : announcements.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--muted)" }}>No broadcasts recorded.</div>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    style={{
                      padding: "16px 18px",
                      borderRadius: "3px",
                      border: "1px solid var(--line)",
                      background: "var(--paper)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "14px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--ink)" }}>{ann.title}</span>
                        <span
                          style={{
                            fontSize: "10.5px",
                            fontFamily: "var(--font-mono)",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "2px",
                            background: "rgba(179, 74, 21, 0.08)",
                            color: "var(--saffron)",
                            textTransform: "uppercase",
                            border: "1px solid var(--line)",
                          }}
                        >
                          Target: {ann.target_audience}
                        </span>
                      </div>
                      <p style={{ fontSize: "13px", color: "var(--ink)", margin: 0, lineHeight: 1.5 }}>
                        {ann.content}
                      </p>
                      <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "6px" }}>
                        Published on {new Date(ann.created_at).toLocaleDateString("en-IN")}
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", padding: "4px" }}
                        title="Delete announcement"
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
    </div>
  );
}
