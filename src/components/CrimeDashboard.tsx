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
      const res = await fetch('/api/crimes');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
      
      // Also silently trigger a sync in the background so it updates every 24h naturally
      // A proper implementation would use Vercel Cron, but this ensures fresh data locally
      fetch('/api/crimes', { method: 'POST' }).catch(() => {});
    } catch (e) {
      console.error(e);
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
    <div className="crime-dashboard-card">
      {/* Top red glowing bar */}
      <div className="crime-dashboard-glow" />
      
      {/* Header section */}
      <div className="crime-dashboard-header">
        <div className="crime-dashboard-header-inner">
          <div className="flex align-center gap-2">
            <ShieldAlert size={28} color="#ff4444" />
            <h3 className="crime-dashboard-title">
              Verified Crime Tracker
            </h3>
          </div>
          <div className="crime-dashboard-badge">
            <Clock size={14} />
            <span>100% Real Citations</span>
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
      
      {/* Footer text */}
      <div className="crime-dashboard-footer">
        <AlertTriangle size={14} color="#ff4d4d" />
        <span>100% verified Delhi NCR data. Every count is directly linked to an official news article.</span>
      </div>
    </div>
  );
}

