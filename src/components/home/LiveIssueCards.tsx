"use client";

import { motion } from "framer-motion";
import { MapPin, AlertTriangle, LightbulbOff, Droplets, Trash2, Waves, Building2, Heart, Shield, Zap, Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import { getLiveIssues } from "@/actions";

interface LiveIssueCardsProps {
  translations: {
    title: string;
    unresolved: string;
    safetyConcern: string;
    critical: string;
    pending: string;
    // We no longer need all the dummy translation strings here, but we'll leave them in the type 
    // to avoid breaking the parent component layout until we refactor the dictionary.
    issue1Location: string;
    issue1Title: string;
    issue1Days: string;
    issue2Location: string;
    issue2Title: string;
    issue2Days: string;
    issue3Location: string;
    issue3Title: string;
    issue3Days: string;
    issue4Location: string;
    issue4Title: string;
    issue4Days: string;
    issue5Location: string;
    issue5Title: string;
    issue5Days: string;
    issue6Location: string;
    issue6Title: string;
    issue6Days: string;
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
              case 'roads': return <Building2 size={20} className="text-charcoal" />;
              case 'water': return <Droplets size={20} className="text-charcoal" />;
              case 'sewage': return <Waves size={20} className="text-charcoal" />;
              case 'streetlights': return <LightbulbOff size={20} className="text-charcoal" />;
              case 'garbage': return <Trash2 size={20} className="text-charcoal" />;
              case 'healthcare': return <Heart size={20} className="text-charcoal" />;
              case 'safety': return <Shield size={20} className="text-charcoal" />;
              case 'publicInfra': return <Zap size={20} className="text-charcoal" />;
              default: return <AlertTriangle size={20} className="text-charcoal" />;
            }
          };

          const getDaysAgo = (dateString: string) => {
            const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays.toString();
          };

          const formattedRealIssues = data.map((report: any) => ({
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
      <section className="py-12 sm:py-16 bg-off-white overflow-hidden border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-black/20 border-t-red rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-off-white overflow-hidden border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div className="pulse-dot"></div>
          <h2 className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-black/60 uppercase">
            {translations.title}
          </h2>
        </div>
      </div>

      <div className="relative w-full overflow-x-hidden">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-off-white to-transparent z-10 pointer-events-none"></div>
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-off-white to-transparent z-10 pointer-events-none"></div>

        {displayIssues.length > 0 ? (
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: displayIssues.length > 3 ? 30 : 60, // Slower if fewer items
            }}
            className="flex gap-4 sm:gap-6 px-4 w-max"
          >
            {/* Duplicate array just to make the marquee loop cleanly */}
            {[...displayIssues, ...displayIssues, ...displayIssues, ...displayIssues].map((issue, i) => (
              <div
                key={`${issue.id}-${i}`}
                className={`w-72 sm:w-80 shrink-0 civic-card bg-white/70 hover:bg-white transition-colors duration-300 ${
                  issue.isCritical ? "issue-card-pulse" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-1.5 text-black/50">
                    <MapPin size={14} strokeWidth={2.5} />
                    <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                      {issue.location}
                    </span>
                  </div>
                  {issue.isCritical ? (
                    <span className="bg-red/10 text-red px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold">
                      {issue.tag}
                    </span>
                  ) : (
                    <span className="bg-black/5 text-black/60 px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider font-semibold">
                      {issue.tag}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-black/5 rounded-lg shrink-0">
                    {issue.icon}
                  </div>
                  <h3 className="font-body text-sm font-semibold text-black leading-snug">
                    {issue.title}
                  </h3>
                </div>

                <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-hindi font-semibold text-red">
                      {issue.days}
                    </span>
                    <span className="font-body text-[11px] text-black/50 uppercase tracking-wide">
                      {translations.unresolved}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-black/40">
            <Inbox size={48} className="mb-4 opacity-50" />
            <p className="font-body text-lg font-medium">No active issues reported</p>
            <p className="font-mono text-xs uppercase tracking-widest mt-2">All clear in your ward</p>
          </div>
        )}
      </div>
    </section>
  );
}
