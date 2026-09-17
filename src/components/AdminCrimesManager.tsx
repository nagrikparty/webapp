import React, { useState, useEffect } from 'react';
import { Trash2, Plus, ExternalLink, ShieldCheck } from 'lucide-react';

interface CrimeRow {
  id: string;
  crime_type: string;
  title: string;
  source_url: string;
  incident_date: string;
}

export function AdminCrimesManager() {
  const [crimes, setCrimes] = useState<CrimeRow[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [type, setType] = useState('Rape');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchCrimes = async () => {
    try {
      const types = ['Rape', 'Murder', 'Kidnapping', 'Robbery', 'Extortion'];
      let allCrimes: CrimeRow[] = [];
      
      for (const cat of types) {
        const res = await fetch(`/api/v1/crimes?type=${cat}`);
        if (res.ok) {
          const data = await res.json();
          allCrimes = [...allCrimes, ...data];
        }
      }
      
      // Sort all newest first
      allCrimes.sort((a, b) => new Date(b.incident_date).getTime() - new Date(a.incident_date).getTime());
      setCrimes(allCrimes);
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrimes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this citation?')) return;
    try {
      const res = await fetch(`/api/v1/crimes?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchCrimes();
    } catch {
      // Network error
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url || !date) return alert('Fill all fields');
    
    try {
      const res = await fetch('/api/v1/crimes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crime_type: type,
          title,
          source_url: url,
          incident_date: date
        })
      });
      if (res.ok) {
        setTitle('');
        setUrl('');
        fetchCrimes();
      } else {
        alert('Failed to add');
      }
    } catch {
      // Network error
    }
  };

  return (
    <div style={{ display: "grid", gap: "24px" }}>
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          padding: "24px 28px",
          borderRadius: "4px",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ShieldCheck size={26} style={{ color: "var(--green)" }} />
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0, fontFamily: "var(--font-serif)" }}>
              Verified Crime Citations Manager
            </h2>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
              प्रमाणित अपराध उद्धरण प्रबंधन • Real-time legal citations linked to the Verified Crime Tracker
            </span>
          </div>
        </div>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: "monospace",
            color: "var(--muted)",
            background: "var(--paper-subtle)",
            padding: "4px 8px",
            borderRadius: "2px",
            border: "1px solid var(--line)",
          }}
        >
          {crimes.length} Citations Recorded
        </span>
      </div>

      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          padding: "24px",
          borderRadius: "4px",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 16px", fontFamily: "var(--font-serif)" }}>
          Add New Verified Citation / नया सत्यापित उद्धरण जोड़ें
        </h3>
        <form
          onSubmit={handleAdd}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            alignItems: "end",
          }}
        >
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
              Category / श्रेणी
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                minHeight: "44px",
                borderRadius: "3px",
                border: "1px solid var(--line)",
                background: "var(--paper)",
                fontSize: "13px",
              }}
            >
              <option value="Rape">Rape</option>
              <option value="Murder">Murder</option>
              <option value="Kidnapping">Kidnapping</option>
              <option value="Robbery">Robbery</option>
              <option value="Extortion">Extortion</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
              News Article Headline / शीर्षक
            </label>
            <input
              type="text"
              placeholder="Verified incident headline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                minHeight: "44px",
                borderRadius: "3px",
                border: "1px solid var(--line)",
                background: "var(--paper)",
                fontSize: "13px",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
              Source URL / स्रोत लिंक
            </label>
            <input
              type="url"
              placeholder="https://thehindu.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                minHeight: "44px",
                borderRadius: "3px",
                border: "1px solid var(--line)",
                background: "var(--paper)",
                fontSize: "13px",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>
              Incident Date / घटना की तारीख
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                minHeight: "44px",
                borderRadius: "3px",
                border: "1px solid var(--line)",
                background: "var(--paper)",
                fontSize: "13px",
              }}
            />
          </div>

          <div>
            <button
              type="submit"
              className="button primary"
              style={{
                width: "100%",
                minHeight: "44px",
                borderRadius: "3px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontWeight: 700,
              }}
            >
              <Plus size={16} /> Add Record
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)", textAlign: "center", padding: "40px" }}>Loading citations...</p>
      ) : (
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
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "var(--paper-subtle)", borderBottom: "1px solid var(--line)", textAlign: "left" }}>
                  <th style={{ padding: "12px 18px" }}>Type / श्रेणी</th>
                  <th style={{ padding: "12px 18px" }}>Headline / समाचार</th>
                  <th style={{ padding: "12px 18px" }}>Date / दिनांक</th>
                  <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {crimes.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "12px 18px" }}>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "2px",
                          background: "var(--paper-subtle)",
                          border: "1px solid var(--line)",
                          fontWeight: 700,
                          fontSize: "11px",
                        }}
                      >
                        {c.crime_type}
                      </span>
                    </td>
                    <td style={{ padding: "12px 18px" }}>
                      <a
                        href={c.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--ink)",
                          textDecoration: "underline",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontWeight: 500,
                        }}
                      >
                        {c.title} <ExternalLink size={12} style={{ color: "var(--muted)" }} />
                      </a>
                    </td>
                    <td style={{ padding: "12px 18px", color: "var(--muted)", fontFamily: "monospace", fontSize: "12px" }}>
                      {new Date(c.incident_date).toLocaleDateString("en-IN")}
                    </td>
                    <td style={{ padding: "12px 18px", textAlign: "right" }}>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="button"
                        title="Delete record"
                        type="button"
                        style={{
                          padding: "6px 10px",
                          minHeight: "36px",
                          borderRadius: "3px",
                          color: "var(--red)",
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {crimes.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: "32px", textAlign: "center", color: "var(--muted)" }}>
                      No verified records found. Run sync or add manually. / कोई प्रमाणित रिकॉर्ड नहीं मिला।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
