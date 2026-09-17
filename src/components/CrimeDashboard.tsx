import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

interface CrimeStat {
  crime_type: string;
  count: number;
}

export function CrimeDashboard() {
  const [stats, setStats] = useState<CrimeStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/v1/crimes');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setStats(data);
        }
      }
    } catch {
      // Network error — stats unavailable
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className="crime-dashboard-skeleton" />;
  }

  // Ensure default crimes exist even if 0
  const defaultCrimes = ['Rape', 'Murder', 'Kidnapping', 'Robbery', 'Extortion'];
  const displayStats = defaultCrimes.map(type => {
    const found = stats.find(s => s.crime_type === type);
    return { crime_type: type, count: found ? found.count : 0 };
  });

  return (
    <div className="crime-dashboard-card" style={{ background: "var(--paper-card)", border: "1px solid var(--line-strong)", borderRadius: "4px", padding: "24px", boxShadow: "var(--shadow)" }}>
      {/* Official printed border */}
      <div style={{ height: "3px", background: "var(--red)", width: "100%", marginBottom: "18px", borderRadius: "2px 2px 0 0" }} />
      
      {/* Header section */}
      <div className="crime-dashboard-header" style={{ marginBottom: "20px" }}>
        <div className="crime-dashboard-header-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div className="flex align-center gap-2" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldAlert size={24} color="var(--red)" />
            <h3 className="crime-dashboard-title" style={{ margin: 0, fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
              Verified Crime Tracker
            </h3>
          </div>
          <div className="badge-citation" style={{ border: "1px solid rgba(142, 38, 23, 0.3)", background: "rgba(142, 38, 23, 0.06)", color: "var(--red)" }}>
            <Clock size={12} />
            <span>100% Verified Citations</span>
          </div>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="crime-dashboard-grid">
        {displayStats.map((stat, idx) => {
          const isCritical = idx < 2;

          return (
            <a href={`/crimes/${stat.crime_type.toLowerCase()}`} key={stat.crime_type} className={`crime-stat-card ${isCritical ? 'critical' : ''}`}>
              <div className="crime-stat-label">
                {stat.crime_type}
              </div>
              <div className="flex align-center gap-1">
                <span className="crime-stat-count">
                  {stat.count}
                </span>
                {stat.count > 0 && (
                  <TrendingUp size={16} className="crime-stat-icon" />
                )}
              </div>
              <div className="crime-stat-help">Click to verify</div>
            </a>
          );
        })}
      </div>
      
      {/* Footer text & Action */}
      <div className="crime-dashboard-footer" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <AlertTriangle size={14} color="#ff4d4d" />
          <span>100% verified Delhi NCR data. Every count is directly linked to an official news citation.</span>
        </div>
        <a href="/crime" style={{ color: "#dc2626", fontWeight: 700, textDecoration: "none", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
          View Full Crime Tracker Archive &rarr;
        </a>
      </div>
    </div>
  );
}

