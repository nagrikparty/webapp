"use client";

import { motion } from "framer-motion";
import CinematicButton from "../ui/CinematicButton";

interface JoinProps {
  translations: {
    headline: string;
    cta: string;
  };
}

export default function JoinMovementCTA({ translations }: JoinProps) {
  return (
    <section className="relative py-24 sm:py-32 bg-off-white overflow-hidden">
      <div className="absolute inset-0 film-grain opacity-20 pointer-events-none"></div>
      
      {/* Decorative Technical Grid Overlay */}
      <div className="absolute inset-0 z-0 flex justify-between pointer-events-none px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto opacity-[0.04]">
        <div className="w-px h-full bg-black"></div>
        <div className="w-px h-full bg-black hidden sm:block"></div>
        <div className="w-px h-full bg-black hidden md:block"></div>
        <div className="w-px h-full bg-black"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-stone-950 border border-white/10 p-12 sm:p-20 rounded-[2.5rem] relative overflow-hidden shadow-2xl flex flex-col items-center text-center"
        >
          {/* Subtle glowing red coordinate indicator at the top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-red to-transparent"></div>

          {/* Viewfinder Corners inside the dark card */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20 pointer-events-none"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20 pointer-events-none"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>

          {/* Index tag */}
          <div className="flex items-center justify-center space-x-2 mb-8 pointer-events-none select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-red animate-pulse"></span>
            <span className="font-mono text-xs text-white/60 uppercase tracking-[0.3em]">
              Mobilization Protocols // Ward Operations
            </span>
          </div>

          <h2 className="font-hindi text-[clamp(2.5rem,6.5vw,4.2rem)] leading-[0.9] text-white font-semibold mb-12 max-w-3xl tracking-wide">
            {translations.headline}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
            {/* Using a custom variant or layout classes for a clean button on dark background */}
            <CinematicButton 
              href="/join" 
              text={translations.cta} 
              variant="primary" 
              className="w-full sm:w-auto shadow-lg hover:shadow-red/20"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
