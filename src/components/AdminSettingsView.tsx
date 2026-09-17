import React, { useState, useEffect } from "react";
import {
  Settings, Save, Shield, Clock, AlertTriangle,
  CheckCircle, Database,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/brand";

interface OrgSetting {
  key: string;
  value: string;
  description: string;
}

export function AdminSettingsView() {
  const [settings, setSettings] = useState<OrgSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("organization_settings")
        .select("*")
        .order("key");

      if (error) throw error;

      if (data && data.length > 0) {
        setSettings(data as OrgSetting[]);
      } else {
        // Show default formation-phase settings
        setSettings([
          { key: "organization_phase", value: "formation", description: "Current organizational phase (formation | registered_party)" },
          { key: "registration_open", value: "true", description: "Whether new membership applications are accepted" },
          { key: "ocr_provider", value: "gemini-flash", description: "OCR/Document extraction provider" },
          { key: "max_upload_size_mb", value: "5", description: "Maximum document upload size in megabytes" },
          { key: "card_auto_issue", value: "false", description: "Automatically issue membership cards upon approval" },
        ]);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  }

  async function saveSetting(key: string, value: string) {
    if (!supabase) return;
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabase
        .from("organization_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

      if (error) throw error;
      setSuccessMsg(`Setting "${key}" updated successfully.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save setting.");
    } finally {
      setSaving(false);
    }
  }

  function updateLocalSetting(key: string, value: string) {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
        <Clock size={24} style={{ marginBottom: "8px" }} />
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Success/Error Messages */}
      {successMsg && (
        <div style={{ padding: "12px 16px", backgroundColor: "#f6ffed", border: "1px solid #b7eb8f", borderRadius: "8px", color: "#389e0d", fontSize: "13px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div style={{ padding: "12px 16px", backgroundColor: "#fff2f0", border: "1px solid #ffccc7", borderRadius: "8px", color: "#cf1322", fontSize: "13px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertTriangle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Phase Status Card */}
      <div
        className="card"
        style={{
          padding: "24px 28px",
          backgroundColor: "var(--paper-card)",
          borderRadius: "4px",
          border: `1px solid var(--line)`,
          borderLeft: `4px solid var(--saffron)`,
          boxShadow: "var(--shadow)",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <Shield size={20} style={{ color: BRAND.colors.saffron }} />
          <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, fontFamily: "var(--font-serif)" }}>
            Organisation Phase / संगठन का चरण
          </h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "2px",
              border: "1px dashed var(--saffron)",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              backgroundColor: "rgba(245, 130, 32, 0.08)",
              color: BRAND.colors.saffron,
            }}
          >
            {BRAND.status.phaseLabel}
          </span>
          <span style={{ fontSize: "13px", color: "var(--muted)" }}>
            {BRAND.status.phaseDescription}
          </span>
        </div>
        <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "12px", marginBottom: 0, lineHeight: 1.5 }}>
          {BRAND.status.disclaimer}
        </p>
      </div>

      {/* Settings Grid */}
      <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-serif)" }}>
        <Settings size={18} />
        System Configuration / प्रणाली विन्यास
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {settings.map((setting) => (
          <div
            key={setting.key}
            className="card"
            style={{
              padding: "16px 20px",
              backgroundColor: "var(--paper-card)",
              borderRadius: "4px",
              border: "1px solid var(--line)",
              boxShadow: "var(--shadow)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: "200px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "2px", fontFamily: "monospace" }}>
                {setting.key}
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)" }}>{setting.description}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {setting.key === "organization_phase" ? (
                <select
                  value={setting.value}
                  onChange={(e) => updateLocalSetting(setting.key, e.target.value)}
                  style={{ padding: "8px 12px", minHeight: "44px", borderRadius: "3px", border: "1px solid var(--line)", fontSize: "13px", backgroundColor: "var(--paper)" }}
                >
                  <option value="formation">Formation</option>
                  <option value="registered_party">Registered Party</option>
                </select>
              ) : setting.value === "true" || setting.value === "false" ? (
                <select
                  value={setting.value}
                  onChange={(e) => updateLocalSetting(setting.key, e.target.value)}
                  style={{ padding: "8px 12px", minHeight: "44px", borderRadius: "3px", border: "1px solid var(--line)", fontSize: "13px", backgroundColor: "var(--paper)" }}
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={setting.value}
                  onChange={(e) => updateLocalSetting(setting.key, e.target.value)}
                  style={{ padding: "8px 12px", minHeight: "44px", borderRadius: "3px", border: "1px solid var(--line)", fontSize: "13px", width: "200px", backgroundColor: "var(--paper)" }}
                />
              )}
              <button
                onClick={() => saveSetting(setting.key, setting.value)}
                disabled={saving}
                className="button primary"
                style={{
                  padding: "8px 16px",
                  minHeight: "44px",
                  borderRadius: "3px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                <Save size={13} />
                Save
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* System Info */}
      <div className="card" style={{ marginTop: "32px", padding: "20px 24px", backgroundColor: "var(--paper-subtle)", borderRadius: "4px", border: "1px solid var(--line)", boxShadow: "var(--shadow)" }}>
        <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-serif)" }}>
          <Database size={16} style={{ color: "var(--muted)" }} />
          System Information / प्रणाली विवरण
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", fontSize: "13px" }}>
          <div>
            <span style={{ color: "var(--muted)" }}>Platform: </span>
            <span style={{ fontWeight: 600 }}>Astro SSR + Cloudflare Workers</span>
          </div>
          <div>
            <span style={{ color: "var(--muted)" }}>Database: </span>
            <span style={{ fontWeight: 600 }}>Supabase PostgreSQL</span>
          </div>
          <div>
            <span style={{ color: "var(--muted)" }}>Auth: </span>
            <span style={{ fontWeight: 600 }}>Supabase Auth + RLS</span>
          </div>
          <div>
            <span style={{ color: "var(--muted)" }}>Storage: </span>
            <span style={{ fontWeight: 600 }}>Private Supabase Storage</span>
          </div>
          <div>
            <span style={{ color: "var(--muted)" }}>Domain: </span>
            <span style={{ fontWeight: 600 }}>nagrik.party</span>
          </div>
          <div>
            <span style={{ color: "var(--muted)" }}>Founder: </span>
            <span style={{ fontWeight: 600 }}>{BRAND.founder.publicName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
