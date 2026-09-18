import { AlertCircle, Loader2, Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import type { PublicIssue } from "@/lib/queries";
import { fetchPublicIssues } from "@/lib/queries";

type LoadState = "loading" | "ready" | "error" | "empty";

const statusStyle: Record<string, string> = {
  submitted: "",
  verified: "green",
  "complaint filed": "green",
  escalated: "red",
  unresolved: "red",
  "added to area manifesto": "green",
  resolved: "green",
};

export function IssuesList() {
  const [issues, setIssues] = useState<PublicIssue[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;
    fetchPublicIssues()
      .then((data) => {
        if (cancelled) return;
        setIssues(data);
        setState(data.length === 0 ? "empty" : "ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => { cancelled = true; };
  }, []);

  if (state === "loading") {
    return (
      <div className="list-panel list-panel-state">
        <Loader2 size={28} className="spin" />
        <p className="list-panel-msg">Loading reported issues...</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="list-panel list-panel-state">
        <AlertCircle size={28} className="icon-danger" />
        <p className="list-panel-msg">Could not load issues. Please try again later.</p>
        <button className="button" onClick={() => window.location.reload()} type="button">
          Retry
        </button>
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className="list-panel list-panel-state">
        <Inbox size={28} className="icon-muted" />
        <p className="list-panel-msg">No issues reported yet. Use the form above to report the first civic issue in your area.</p>
      </div>
    );
  }

  return (
    <div className="list-panel" aria-label="Reported civic issues">
      {issues.map((issue) => (
        <div className="issue-row" key={issue.id}>
          <div className="rank-num category">
            {issue.category.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <strong>{issue.title}</strong>
            <div className="issue-meta">
              {issue.lok_sabha ? `${issue.lok_sabha} · ` : ""}{issue.vidhan_sabha} · {issue.ward} · {issue.category}
            </div>
          </div>
          <span className={`tag ${statusStyle[issue.status.toLowerCase()] ?? ""}`}>
            {issue.status}
          </span>
        </div>
      ))}
    </div>
  );
}
