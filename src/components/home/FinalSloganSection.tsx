"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface SloganProps {
  translations: {
    part1: string;
    part2: string;
  };
}

export default function FinalSloganSection({ translations }: SloganProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const opacity1 = useTransform(scrollYProgress, [0.3, 0.5, 0.7, 0.8], [0, 1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.75, 0.9], [0, 1]);
  const scale2 = useTransform(scrollYProgress, [0.75, 1], [0.93, 1]);

  return (
    <section ref={containerRef} className="h-[200vh] bg-off-white relative border-t border-black/10">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 film-grain opacity-55 pointer-events-none"></div>
        
        {/* Decorative Technical Grid Overlay */}
        <div className="absolute inset-0 z-0 flex justify-between pointer-events-none px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto opacity-[0.04]">
          <div className="w-px h-full bg-black"></div>
          <div className="w-px h-full bg-black hidden sm:block"></div>
          <div className="w-px h-full bg-black hidden md:block"></div>
          <div className="w-px h-full bg-black"></div>
        </div>

        {/* Dynamic ambient glow behind the final slogan */}
        <motion.div 
          style={{ opacity: opacity2 }}
          className="absolute w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-red/5 blur-[100px] pointer-events-none"
        />

        {/* Part 1 */}
        <motion.h2 
          style={{ opacity: opacity1 }}
          className="absolute font-hindi text-[clamp(4.2rem,11vw,8.5rem)] text-black/30 font-bold tracking-wide text-center px-4"
        >
          {translations.part1}
        </motion.h2>

        {/* Part 2 - Emphasized */}
        <motion.h2 
          style={{ opacity: opacity2, scale: scale2 }}
          className="absolute font-hindi text-[clamp(5.2rem,15vw,11.5rem)] text-red font-bold tracking-tight drop-shadow-sm text-center px-4 select-none"
        >
          {translations.part2}
        </motion.h2>

        {/* Footer Technical coordinate coordinates */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-[9px] font-mono tracking-[0.25em] text-black/45 pointer-events-none select-none uppercase">
          <span>Campaign Core v1.0</span>
          <span>Delhi Municipal Registry</span>
        </div>
      </div>
    </section>
  );
}
