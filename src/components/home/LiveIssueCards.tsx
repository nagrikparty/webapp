"use client";

import { MapPin, LightbulbOff, Droplets, Trash2, Waves, Building2, Heart, Shield, Zap, Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import { getLiveIssues } from "@/actions";

interface LiveIssueCardsProps {
  translations: {
    title: string;
    unresolved: string;
    safetyConcern: string;
    critical: string;
    pending: string;
    [key: string]: string; // Fallback for other translation keys
  };
}

export default function LiveIssueCards({ translations }: LiveIssueCardsProps) {
  const [displayIssues, setDisplayIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await getLiveIssues();
        
        if (data && data.length > 0) {
          const mapCategoryToIcon = (category: string) => {
            switch (category) {
              case 'roads': return <Building2 size={24} className="text-black" />;
              case 'water': return <Droplets size={24} className="text-black" />;
              case 'sewage': return <Waves size={24} className="text-black" />;
              case 'streetlights': return <LightbulbOff size={24} className="text-black" />;
              case 'garbage': return <Trash2 size={24} className="text-black" />;
              case 'healthcare': return <Heart size={24} className="text-black" />;
              case 'safety': return <Shield size={24} className="text-black" />;
              case 'publicInfra': return <Zap size={24} className="text-black" />;
              default: return <Inbox size={24} className="text-black" />;
            }
          };

          const getDaysAgo = (dateString: string) => {
            const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays.toString();
          };

          const formattedRealIssues = data.slice(0, 8).map((report: any) => ({
            id: report.id,
            location: report.ward,
            title: report.category.charAt(0).toUpperCase() + report.category.slice(1) + " Issue",
            days: getDaysAgo(report.created_at),
            icon: mapCategoryToIcon(report.category),
            tag: report.severity === 'critical' || report.severity === 'high' ? translations.critical : translations.pending,
            isCritical: report.severity === 'critical' || report.severity === 'high',
          }));

          setDisplayIssues(formattedRealIssues);
        } else {
          setDisplayIssues([]);
        }
      } catch (error) {
        console.error("Failed to fetch live issues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [translations]);

  if (loading) {
    return (
      <section className="py-16 bg-off-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center font-mono text-sm uppercase tracking-widest text-black/50">
          Loading Public Log...
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-black/10 pb-4 flex flex-col md:flex-row justify-between items-end">
          <div>
            <h2 className="font-hindi text-3xl sm:text-4xl font-bold text-black uppercase tracking-tight">
              Public Grievance Log
            </h2>
            <p className="font-mono text-sm tracking-widest text-black/50 uppercase mt-2">
              Documented structural failures awaiting resolution
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest border border-black px-3 py-1.5 bg-black text-white">
              Official Record
            </span>
          </div>
        </div>

        {displayIssues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayIssues.map((issue) => (
              <div
                key={issue.id}
                className="border border-black p-6 bg-off-white flex flex-col hover:bg-black hover:text-white transition-colors group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-1.5 text-black group-hover:text-white transition-colors">
                    <MapPin size={16} strokeWidth={2} />
                    <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
                      {issue.location}
                    </span>
                  </div>
                  {issue.isCritical && (
                    <span className="text-red font-mono text-[10px] uppercase tracking-wider font-bold border border-red px-2 py-1">
                      Urgent Action
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-4 mb-8">
                  <div className="shrink-0 text-black group-hover:text-white transition-colors">
                    {issue.icon}
                  </div>
                  <h3 className="font-body text-lg font-bold leading-tight">
                    {issue.title}
                  </h3>
                </div>

                <div className="mt-auto pt-4 border-t border-black/10 group-hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black font-hindi">
                      {issue.days}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest leading-tight opacity-70">
                      Days<br/>Unresolved
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-black p-8 bg-off-white text-center">
            <p className="font-mono text-sm uppercase tracking-widest text-black/50">No structural failures reported recently.</p>
          </div>
        )}
      </div>
    </section>
  );
}
