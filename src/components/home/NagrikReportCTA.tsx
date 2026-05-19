"use client";

import { motion } from "framer-motion";
import CinematicButton from "../ui/CinematicButton";

interface CTAProps {
  translations: {
    headline: string;
    cta: string;
  };
}

export default function NagrikReportCTA({ translations }: CTAProps) {
  return (
    <section className="relative py-32 bg-off-white border-t border-black/10 overflow-hidden">
      <div className="absolute inset-0 film-grain opacity-20 pointer-events-none"></div>
      
      {/* Decorative Technical Grid Overlay */}
      <div className="absolute inset-0 z-0 flex justify-between pointer-events-none px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto opacity-[0.04]">
        <div className="w-px h-full bg-black"></div>
        <div className="w-px h-full bg-black hidden sm:block"></div>
        <div className="w-px h-full bg-black hidden md:block"></div>
        <div className="w-px h-full bg-black"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/40 backdrop-blur-md border border-black/10 p-12 sm:p-20 rounded-[2.5rem] relative overflow-hidden shadow-sm flex flex-col items-center"
        >
          {/* Viewfinder Corners inside the card */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-black/20 pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-black/20 pointer-events-none"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-black/20 pointer-events-none"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-black/20 pointer-events-none"></div>

          {/* Index tag */}
          <div className="flex items-center justify-center space-x-2 mb-8 pointer-events-none select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-red animate-pulse"></span>
            <span className="font-mono text-xs text-red uppercase tracking-[0.3em]">
              Civic Interface // Direct Registry
            </span>
          </div>

          <h2 className="font-hindi text-[clamp(2.8rem,7vw,5.2rem)] text-black font-semibold mb-10 leading-[0.9] tracking-wide max-w-3xl">
            {translations.headline}
          </h2>
          
          <CinematicButton 
            href="/report" 
            text={translations.cta} 
            variant="primary" 
            className="w-full sm:w-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
