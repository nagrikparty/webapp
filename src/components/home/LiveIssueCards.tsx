"use client";

import { motion } from "framer-motion";
import { MapPin, AlertTriangle, LightbulbOff, Droplets, Trash2, Waves, Building2 } from "lucide-react";

interface LiveIssueCardsProps {
  translations: {
    title: string;
    unresolved: string;
    safetyConcern: string;
    critical: string;
    pending: string;
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
  const issues = [
    {
      id: 1,
      location: translations.issue1Location,
      title: translations.issue1Title,
      days: translations.issue1Days,
      icon: <Building2 size={20} className="text-charcoal" />,
      tag: translations.critical,
      isCritical: true,
    },
    {
      id: 2,
      location: translations.issue2Location,
      title: translations.issue2Title,
      days: translations.issue2Days,
      icon: <LightbulbOff size={20} className="text-charcoal" />,
      tag: translations.safetyConcern,
      isCritical: true,
    },
    {
      id: 3,
      location: translations.issue3Location,
      title: translations.issue3Title,
      days: translations.issue3Days,
      icon: <Droplets size={20} className="text-charcoal" />,
      tag: translations.pending,
      isCritical: false,
    },
    {
      id: 4,
      location: translations.issue4Location,
      title: translations.issue4Title,
      days: translations.issue4Days,
      icon: <Trash2 size={20} className="text-charcoal" />,
      tag: translations.pending,
      isCritical: false,
    },
    {
      id: 5,
      location: translations.issue5Location,
      title: translations.issue5Title,
      days: translations.issue5Days,
      icon: <Waves size={20} className="text-charcoal" />,
      tag: translations.critical,
      isCritical: true,
    },
    {
      id: 6,
      location: translations.issue6Location,
      title: translations.issue6Title,
      days: translations.issue6Days,
      icon: <AlertTriangle size={20} className="text-charcoal" />,
      tag: translations.pending,
      isCritical: false,
    },
  ];

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

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
          }}
          className="flex gap-4 sm:gap-6 px-4 w-max"
        >
          {/* Double the items for seamless infinite scroll */}
          {[...issues, ...issues].map((issue, i) => (
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
      </div>
    </section>
  );
}
