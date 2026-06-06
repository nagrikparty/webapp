

import { useState, useEffect } from "react";
import { getLiveIssues } from "@/actions";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";

export default function LiveReportsFeed() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 6;

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const offset = (page - 1) * limit;
        const data = await getLiveIssues(limit, offset);
        
        if (data && data.length > 0) {
          setIssues(data);
          if (data.length < limit) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        } else {
          setIssues([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch live issues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [page]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="pulse-dot"></div>
        <h2 className="font-mono text-sm font-semibold tracking-widest text-black/60 dark:text-white/60 uppercase">
          Live Reports Stream
        </h2>
      </div>

      {loading && issues.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-black/20 dark:border-white/20 border-t-red rounded-full animate-spin"></div>
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-12 text-black/50 dark:text-white/50 font-mono text-sm uppercase tracking-widest border border-dashed border-black/10 dark:border-white/10 rounded-xl">
          No reports found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="civic-card bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-1.5 text-black/50 dark:text-white/50">
                      <MapPin size={14} />
                      <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                        {issue.ward || "Unknown"}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold ${issue.severity === 'critical' ? 'bg-red/10 text-red' : 'bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60'}`}>
                      {issue.severity}
                    </span>
                  </div>
                  
                  <h3 className="font-body text-lg font-semibold text-black dark:text-white mb-2 leading-snug">
                    {issue.category.charAt(0).toUpperCase() + issue.category.slice(1)} Issue
                  </h3>
                  
                  <p className="font-body text-sm text-black/60 dark:text-white/60 mb-6 line-clamp-3">
                    {issue.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/5">
                  <span className="font-mono text-[10px] text-black/40 dark:text-white/40 uppercase tracking-widest">
                    Reported on {new Date(issue.created_at).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="p-3 rounded-full bg-black/5 dark:bg-white/5 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="font-mono text-sm font-semibold text-black/60 dark:text-white/60">
              Page {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore || loading}
              className="p-3 rounded-full bg-black/5 dark:bg-white/5 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
