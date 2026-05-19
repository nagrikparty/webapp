"use client";

import { motion } from "framer-motion";
import { Building2, Stethoscope, Home, Activity } from "lucide-react";

interface MissionProps {
  translations: {
    headline: string;
    hospital: string;
    clinic: string;
    shelter: string;
    oldAge: string;
  };
}

export default function InfrastructureMissionSection({ translations }: MissionProps) {
  const items = [
    { icon: Building2, label: translations.hospital, num: "01", category: "District Level" },
    { icon: Stethoscope, label: translations.clinic, num: "02", category: "Ward Level" },
    { icon: Home, label: translations.shelter, num: "03", category: "Community Level" },
    { icon: Activity, label: translations.oldAge, num: "04", category: "Support Level" },
  ];

  return (
    <section className="relative min-h-screen bg-stone-200/30 py-24 sm:py-32 flex items-center border-t border-b border-black/10">
      <div className="absolute inset-0 film-grain opacity-25 pointer-events-none"></div>
      
      {/* Decorative Technical Grid Overlay */}
      <div className="absolute inset-0 z-0 flex justify-between pointer-events-none px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto opacity-[0.04]">
        <div className="w-px h-full bg-black"></div>
        <div className="w-px h-full bg-black hidden sm:block"></div>
        <div className="w-px h-full bg-black hidden md:block"></div>
        <div className="w-px h-full bg-black"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Viewfinder Corners for section */}
        <div className="absolute -top-4 -left-4 w-4 h-4 border-t-2 border-l-2 border-black/25 pointer-events-none"></div>
        <div className="absolute -top-4 -right-4 w-4 h-4 border-t-2 border-r-2 border-black/25 pointer-events-none"></div>

        <div className="text-center mb-24">
          {/* Section Indicator */}
          <div className="flex items-center justify-center space-x-2 mb-4 pointer-events-none select-none">
            <span className="font-mono text-xs text-red uppercase tracking-[0.3em]">
              Act 05 // Reconstruction Manifest
            </span>
          </div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-hindi text-[clamp(2.6rem,7vw,4.6rem)] leading-none text-black font-semibold tracking-wide"
          >
            {translations.headline}
          </motion.h2>
          <div className="w-24 h-1 bg-red mx-auto mt-6"></div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/40 backdrop-blur-md border border-black/10 p-8 sm:p-10 flex flex-col justify-between rounded-3xl group hover:bg-white hover:border-black/25 transition-all duration-500 shadow-sm relative overflow-hidden"
              >
                {/* Micro corner lines inside cards */}
                <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-black/10 group-hover:border-black/30 transition-colors pointer-events-none"></div>
                <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-black/10 group-hover:border-black/30 transition-colors pointer-events-none"></div>

                {/* Index tag */}
                <span className="absolute top-6 right-6 font-mono text-sm text-black/20 group-hover:text-red transition-colors duration-300 font-medium">
                  {item.num}
                </span>

                <div>
                  <div className="w-14 h-14 rounded-2xl border border-black/10 flex items-center justify-center mb-10 group-hover:border-red group-hover:bg-red/5 transition-all duration-500">
                    <Icon className="text-black/60 group-hover:text-red transition-colors duration-500" size={26} />
                  </div>

                  <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 mb-2">
                    {item.category}
                  </span>
                  
                  <h3 className="font-hindi text-2xl font-semibold leading-tight text-black/95">
                    {item.label}
                  </h3>
                </div>

                <div className="w-full h-px bg-black/5 mt-8 group-hover:bg-red/20 transition-colors duration-500"></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
