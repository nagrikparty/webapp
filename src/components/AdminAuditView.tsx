import React, { useEffect, useState } from "react";
import { RefreshCw, Clock, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AuditEntry {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, unknown>;
  ip_address: string;
  created_at: string;
}

export function AdminAuditView() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadLogs() {
    setLoading(true);
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs((data as unknown as AuditEntry[]) || []);
    } catch (err) {
      console.error("Error loading audit logs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    return (
      !q ||
      l.action?.toLowerCase().includes(q) ||
      l.entity_type?.toLowerCase().includes(q) ||
      l.entity_id?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: "grid", gap: "24px" }}>
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
        <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
          <Search size={16} style={{ position: "absolute", left: "14px", top: "14px", color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search action / गतिविधियाँ खोजें (e.g. SUBMISSION_EXPORT_GENERATED, MEMBER_APPROVED)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 40px",
              minHeight: "44px",
              borderRadius: "3px",
              border: "1px solid var(--line)",
              fontSize: "13px",
              background: "var(--paper)",
            }}
          />
        </div>

        <button
          type="button"
          onClick={loadLogs}
          className="button"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", minHeight: "44px", borderRadius: "3px" }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          borderRadius: "4px",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow)",
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
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, fontFamily: "var(--font-serif)" }}>
            Immutable Audit Trail ({filtered.length}) / अपरिवर्तनीय ऑडिट ट्रेल
          </h3>
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>
            Rule 18: Every verification decision & export generation is cryptographically auditable
          </span>
        </div>

        {loading ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted)" }}>
            <RefreshCw className="animate-spin" size={28} style={{ margin: "0 auto 12px" }} />
            <div>Loading audit records...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted)" }}>
            <Clock size={36} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <div>No audit log events recorded yet. / कोई ऑडिट रिकॉर्ड अभी नहीं मिला।</div>
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--paper-subtle)", borderBottom: "1px solid var(--line)", textAlign: "left" }}>
                  <th style={{ padding: "12px 18px" }}>Timestamp</th>
                  <th style={{ padding: "12px 18px" }}>Action</th>
                  <th style={{ padding: "12px 18px" }}>Entity</th>
                  <th style={{ padding: "12px 18px" }}>Entity ID</th>
                  <th style={{ padding: "12px 18px" }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "12px 18px", color: "var(--muted)", whiteSpace: "nowrap", fontFamily: "monospace", fontSize: "12px" }}>
                      {new Date(log.created_at).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td style={{ padding: "12px 18px" }}>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "2px",
                          background: "var(--paper-subtle)",
                          border: "1px solid var(--line)",
                          color: "var(--ink)",
                          fontWeight: 700,
                          fontSize: "11px",
                          fontFamily: "monospace",
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: "12px 18px", color: "var(--muted)" }}>{log.entity_type}</td>
                    <td style={{ padding: "12px 18px", fontFamily: "monospace", fontSize: "12px" }}>
                      {log.entity_id || "-"}
                    </td>
                    <td style={{ padding: "12px 18px", fontSize: "12px", color: "var(--muted)", fontFamily: "monospace" }}>
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
