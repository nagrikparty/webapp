import React, { useEffect, useState } from "react";
import type { ProgressSummary } from "@/lib/progress-service";

interface FoundingProgressBarProps {
  initialData?: ProgressSummary;
}

export function FoundingProgressBar({ initialData }: FoundingProgressBarProps) {
  const [data, setData] = useState<ProgressSummary | null>(initialData || null);

  useEffect(() => {
    let isMounted = true;
    async function loadProgress() {
      try {
        const res = await fetch("/api/v1/formation-progress");
        if (res.ok) {
          const json = await res.json();
          if (isMounted) setData(json);
        }
      } catch {
        // Keep initial or fallback state
      }
    }

    if (!data) {
      loadProgress();
    }
    return () => {
      isMounted = false;
    };
  }, [data]);

  const percentage = data ? data.percentage : 24;
  const phaseLabel = data ? data.phaseLabel : "PHASE 1 · FORMATION PHASE";
  const phaseName = data ? data.currentPhaseName : "Building the foundation";

  return (
    <aside className="founding-progress-banner" aria-label="Formation Progress">
      <div className="container founding-progress-container">
        <div className="founding-progress-meta">
          <span className="founding-progress-badge">{phaseLabel}</span>
          <span className="founding-progress-phase">
            Current phase: <strong>{phaseName}</strong>
          </span>
        </div>

        <div className="founding-progress-action-wrap">
          <div className="founding-progress-stat">
            <span className="founding-progress-label">FOUNDING PROGRESS</span>
            <span className="founding-progress-val">{percentage}%</span>
          </div>

          <div
            className="founding-progress-bar-track"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Formation progress: ${percentage}%`}
          >
            <div
              className="founding-progress-bar-fill"
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>

          <a href="/formation-progress" className="founding-progress-link">
            Track Roadmap &rarr;
          </a>
        </div>
      </div>
    </aside>
  );
}
