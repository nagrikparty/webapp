import React from "react";

const STAGES = [
  { key: "DRAFT", label: "Draft" },
  { key: "SUBMITTED", label: "Submitted" },
  { key: "UNDER_REVIEW", label: "Review Me" },
  { key: "APPROVED", label: "Card Ready ✓" },
];

const ORDER: Record<string, number> = {
  NO_APPLICATION: -1,
  DRAFT: 0,
  DOCUMENTS_PENDING: 0,
  SUBMITTED: 1,
  UNDER_REVIEW: 2,
  NEEDS_CORRECTION: 1,
  APPROVED: 3,
  REJECTED: 1,
};

/** IRCTC/DTDC-style 4-step progress tracker for membership application. */
export function StatusTracker({ status }: { status: string }) {
  const current = ORDER[status] ?? -1;

  return (
    <div className="status-tracker" role="list" aria-label="Aapka application status">
      {STAGES.map((stage, i) => {
        const cls = i < current || status === "APPROVED" && i === 3
          ? "is-done"
          : i === current
            ? "is-current"
            : "";
        return (
          <div key={stage.key} className={`status-tracker-step ${cls}`} role="listitem" aria-current={i === current ? "step" : undefined}>
            <span className="status-tracker-label">{stage.label}</span>
          </div>
        );
      })}
    </div>
  );
}
