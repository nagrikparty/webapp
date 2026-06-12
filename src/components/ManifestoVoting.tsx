import { ArrowUp, Loader2, AlertCircle, ListChecks } from "lucide-react";
import { useEffect, useState } from "react";
import type { ManifestoItem } from "@/lib/queries";
import { fetchManifestoItems, voteForManifestoItem } from "@/lib/queries";

type LoadState = "loading" | "ready" | "error" | "empty";

export function ManifestoVoting() {
  const [items, setItems] = useState<ManifestoItem[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [voted, setVoted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    fetchManifestoItems()
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setState(data.length === 0 ? "empty" : "ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => { cancelled = true; };
  }, []);

  async function upvote(item: ManifestoItem) {
    if (voted[item.id]) return;
    setVoted((current) => ({ ...current, [item.id]: true }));
    setItems((current) =>
      current
        .map((i) => (i.id === item.id ? { ...i, vote_count: i.vote_count + 1 } : i))
        .sort((a, b) => b.vote_count - a.vote_count),
    );
    await voteForManifestoItem(item.id);
  }

  if (state === "loading") {
    return (
      <div className="list-panel list-panel-state">
        <Loader2 size={28} className="spin" />
        <p className="list-panel-msg">
          <span className="lang-en">Loading manifesto priorities…</span>
          <span className="lang-hi">घोषणापत्र प्राथमिकताएं लोड हो रही हैं…</span>
        </p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="list-panel list-panel-state">
        <AlertCircle size={28} className="icon-danger" />
        <p className="list-panel-msg">
          <span className="lang-en">Could not load manifesto items. Please try again later.</span>
          <span className="lang-hi">घोषणापत्र आइटम लोड नहीं हो सके। कृपया बाद में पुनः प्रयास करें।</span>
        </p>
        <button className="button" onClick={() => window.location.reload()} type="button">
          <span className="lang-en">Retry</span>
          <span className="lang-hi">पुनः प्रयास</span>
        </button>
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className="list-panel list-panel-state">
        <ListChecks size={28} className="icon-muted" />
        <p className="list-panel-msg">
          <span className="lang-en">No manifesto priorities yet. Priorities will appear here as the party programme is built.</span>
          <span className="lang-hi">अभी कोई घोषणापत्र प्राथमिकता नहीं है। पार्टी कार्यक्रम बनने पर यहां दिखाई देंगी।</span>
        </p>
      </div>
    );
  }

  return (
    <div className="list-panel" aria-label="Manifesto priority voting">
      {items.slice(0, 10).map((item, index) => (
        <div className="rank-row" key={item.id}>
          <div className="rank-num">{index + 1}</div>
          <div>
            <strong>
              <span className="lang-en">{item.title}</span>
              <span className="lang-hi">{item.title_hi}</span>
            </strong>
            <div className="tag-group">
              {item.lok_sabha && <span className="tag">{item.lok_sabha}</span>}
              {item.vidhan_sabha && <span className="tag green">{item.vidhan_sabha}</span>}
              {item.ward && <span className="tag blue">{item.ward}</span>}
              <span className="tag">{item.category}</span>
            </div>
          </div>
          <button
            className="button"
            disabled={Boolean(voted[item.id])}
            onClick={() => upvote(item)}
            type="button"
          >
            <ArrowUp size={16} />
            {item.vote_count.toLocaleString("en-IN")}
          </button>
        </div>
      ))}
    </div>
  );
}
