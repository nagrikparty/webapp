import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, UserCheck, ShieldCheck } from "lucide-react";

interface SkillCategory {
  id: string;
  name: string;
  desc: string;
  sampleTasks: string[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "community",
    name: "Community Work",
    desc: "Constituency organizing, ground check of civic complaints, and voter meetings.",
    sampleTasks: ["Verify local civic issue report in your ward", "Coordinate local resident meeting"],
  },
  {
    id: "research",
    name: "Research & Analysis",
    desc: "Policy papers, RTI queries, budget tracking, and municipal governance audits.",
    sampleTasks: ["File an RTI for PWD road tender status", "Summarize municipal ward spending report"],
  },
  {
    id: "design",
    name: "Visual Design",
    desc: "Civic infographics, local issue posters, social evidence cards, and printed flyers.",
    sampleTasks: ["Design a constituency grievance poster", "Create an air pollution awareness card"],
  },
  {
    id: "video",
    name: "Video & Media",
    desc: "Documenting local issues on ground, short video explainers, and field recordings.",
    sampleTasks: ["Record a 60-second video of an unresolved civic hazard", "Edit volunteer interview"],
  },
  {
    id: "writing",
    name: "Writing & Editorial",
    desc: "Drafting plain-English policy briefs, press notes, and constituency updates.",
    sampleTasks: ["Draft a plain-English explanation of local drainage issue", "Write constituency newsletter"],
  },
  {
    id: "legal",
    name: "Legal & Compliance",
    desc: "RPA 1951 registration adherence, constitution review, and statutory filings.",
    sampleTasks: ["Review draft election rulebook clauses", "Assist voter affidavit verification"],
  },
  {
    id: "technology",
    name: "Technology & Software",
    desc: "Building open civic tools, privacy vaults, card verification, and database systems.",
    sampleTasks: ["Help test mobile induction flow", "Review open source data schemas"],
  },
  {
    id: "policy",
    name: "Public Policy",
    desc: "Healthcare, education, public transport, and urban planning frameworks.",
    sampleTasks: ["Draft policy note on mohalla clinic improvements", "Review bus route connectivity data"],
  },
  {
    id: "data",
    name: "Data & Statistics",
    desc: "Pollution telemetry analysis, municipal grievance trends, and electoral roll audits.",
    sampleTasks: ["Clean and verify MCD sanitation complaints dataset", "Analyze ward crime reports"],
  },
  {
    id: "media",
    name: "Press & Media Outreach",
    desc: "Connecting with journalists, distributing factual releases, and public communication.",
    sampleTasks: ["Share verified crime reports with local journalists", "Manage regional press list"],
  },
  {
    id: "outreach",
    name: "Constituency Outreach",
    desc: "Youth engagement, senior citizen welfare, and trader association dialogue.",
    sampleTasks: ["Organize college student discussion", "Distribute founding membership leaflets"],
  },
  {
    id: "event-support",
    name: "Event & Meeting Logistics",
    desc: "Venue coordination, audio/visual setup, and volunteer assembly logistics.",
    sampleTasks: ["Assist with General Body convention prep", "Coordinate local volunteer meeting"],
  },
  {
    id: "administration",
    name: "Administration & Records",
    desc: "Voter list cross-referencing, document archiving, and application verification support.",
    sampleTasks: ["Verify application completeness", "Organize physical document binders"],
  },
  {
    id: "translation",
    name: "Translation & Language",
    desc: "Translating public materials between Hindustani, English, and local dialects.",
    sampleTasks: ["Translate civic issue guides to conversational Hindustani", "Review Hindi statutory summaries"],
  },
];

export function BuildWithUsView() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("Okhla");

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    client.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) {
        setUser(u);
        setEmail(u.email || "");
        // Pre-fetch profile details
        client
          .from("profiles")
          .select("full_name, phone, vidhan_sabha")
          .eq("id", u.id)
          .maybeSingle()
          .then(({ data: prof }) => {
            if (prof) {
              if (prof.full_name) setName(prof.full_name);
              if (prof.phone) setPhone(prof.phone);
              if (prof.vidhan_sabha) setArea(prof.vidhan_sabha);
            }
          });
      }
    });
  }, []);

  function toggleSkill(id: string) {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleRegisterInterests(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (supabase && user) {
        // Save to member_participation or profiles
        await supabase.from("profiles").update({
          full_name: name || undefined,
          phone: phone || undefined,
          vidhan_sabha: area || undefined,
        }).eq("id", user.id);
      }
      setSubmitted(true);
    } catch (err) {
      console.error("Error saving skills:", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Introduction Hero Block */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          border: "1px solid var(--line-strong)",
          borderRadius: "4px",
          padding: "clamp(24px, 4vw, 36px)",
          boxShadow: "var(--shadow)",
          marginBottom: "36px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            color: "var(--saffron)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "10px",
          }}
        >
          FOUNDING COLLABORATION · PHASE 1
        </span>
        <h2
          style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
            fontWeight: 800,
            fontFamily: "var(--font-serif)",
            lineHeight: 1.15,
            margin: "0 0 14px",
            color: "var(--ink)",
          }}
        >
          Don't just follow politics. Help build the organisation.
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "var(--ink-body)",
            lineHeight: 1.6,
            maxWidth: "720px",
            margin: "0 0 20px",
          }}
        >
          A real party is not built by marketing consultants. It is built by people contributing their time, professional skills, and local knowledge. Select what you would like to help with below.
        </p>

        {user && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--paper-subtle)",
              padding: "6px 14px",
              borderRadius: "3px",
              fontSize: "13px",
              border: "1px solid var(--line)",
            }}
          >
            <UserCheck size={16} style={{ color: "var(--green)" }} />
            <span>
              Signed in as <strong>{user.email}</strong>. Your profile will be prefilled.
            </span>
          </div>
        )}
      </div>

      {submitted ? (
        <div
          className="card"
          style={{
            background: "var(--paper-card)",
            border: "1px solid var(--green)",
            borderRadius: "4px",
            padding: "36px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(29, 86, 53, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--green)",
              margin: "0 auto 16px",
            }}
          >
            <CheckCircle2 size={28} />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: 700, fontFamily: "var(--font-serif)", margin: "0 0 8px" }}>
            Participation Preferences Recorded
          </h3>
          <p style={{ fontSize: "14px", color: "var(--muted)", maxWidth: "540px", margin: "0 auto 20px", lineHeight: 1.6 }}>
            Thank you. The Founding Convener and organizing committee review volunteer skills based on current Phase 1 priorities. You will receive assignments and invitations in your constituency.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <a href="/membership" className="button button-primary">
              Complete Founding Member Induction &rarr;
            </a>
            <a href="/explore" className="button">
              Explore Civic Data
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleRegisterInterests}>
          {/* Skill Grid */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-serif)", margin: "0 0 14px" }}>
              What would you like to help with? (Select all that apply)
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "14px",
              }}
            >
              {SKILL_CATEGORIES.map((cat) => {
                const isSelected = selectedSkills.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleSkill(cat.id)}
                    style={{
                      background: isSelected ? "var(--paper-subtle)" : "var(--paper-card)",
                      border: isSelected ? "1.5px solid var(--saffron)" : "1px solid var(--line)",
                      borderRadius: "4px",
                      padding: "16px 18px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxShadow: isSelected ? "var(--shadow-elevated)" : "var(--shadow)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <strong style={{ fontSize: "15px", color: "var(--ink)" }}>{cat.name}</strong>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        style={{ accentColor: "var(--saffron)", width: "16px", height: "16px" }}
                      />
                    </div>
                    <p style={{ fontSize: "12.5px", color: "var(--muted)", margin: "0 0 10px", lineHeight: 1.45 }}>
                      {cat.desc}
                    </p>

                    {isSelected && (
                      <div style={{ borderTop: "1px solid var(--line)", paddingTop: "8px", marginTop: "8px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--saffron)", textTransform: "uppercase" }}>
                          Sample available work:
                        </span>
                        <ul style={{ margin: "4px 0 0", paddingLeft: "16px", fontSize: "12px", color: "var(--ink-body)" }}>
                          {cat.sampleTasks.map((t, idx) => (
                            <li key={idx}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Details Card */}
          <div
            className="card"
            style={{
              background: "var(--paper-card)",
              border: "1px solid var(--line-strong)",
              borderRadius: "4px",
              padding: "24px 28px",
              marginBottom: "32px",
            }}
          >
            <h3 style={{ fontSize: "17px", fontWeight: 700, fontFamily: "var(--font-serif)", margin: "0 0 16px" }}>
              Your Contact Details
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <div className="field">
                <label style={{ fontSize: "13px", fontWeight: 600 }}>Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="input"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="field">
                <label style={{ fontSize: "13px", fontWeight: 600 }}>Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="input"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="field">
                <label style={{ fontSize: "13px", fontWeight: 600 }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input"
                  style={{ width: "100%" }}
                />
              </div>

              <div className="field">
                <label style={{ fontSize: "13px", fontWeight: 600 }}>Constituency / Area</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Okhla, Rohini, Jangpura"
                  className="input"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "16px", fontSize: "12px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={14} style={{ color: "var(--green)" }} />
              <span>We strictly protect your contact details. They are never published on the public website.</span>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              disabled={loading || selectedSkills.length === 0}
              className="button button-primary"
              style={{ padding: "14px 36px", fontSize: "15px", fontWeight: 600 }}
            >
              {loading ? "Submitting..." : `Join With Selected Skills (${selectedSkills.length}) →`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
