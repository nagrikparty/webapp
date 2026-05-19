"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface SystemFailureProps {
  translations: {
    headline: string;
    desc: string;
  };
}

export default function SystemFailureSection({ translations }: SystemFailureProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-20, 30]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] bg-off-white py-24 sm:py-32 overflow-hidden flex items-center justify-center border-b border-black/10">
      {/* Background ambient image with parallax */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.div style={{ y: bgY, height: "115%", opacity: 0.12 }} className="relative w-full h-full">
          <Image
            src="/images/youth.png"
            alt="Youth frustration"
            fill
            className="object-cover grayscale blur-[2px]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-off-white/85"></div>
      </div>

      {/* Decorative Technical Grid Overlay */}
      <div className="absolute inset-0 z-0 flex justify-between pointer-events-none px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto opacity-[0.06]">
        <div className="w-px h-full bg-black"></div>
        <div className="w-px h-full bg-black hidden sm:block"></div>
        <div className="w-px h-full bg-black hidden md:block"></div>
        <div className="w-px h-full bg-black"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/40 backdrop-blur-md border border-black/10 p-8 sm:p-16 rounded-3xl shadow-sm max-w-4xl w-full text-center relative overflow-hidden"
        >
          {/* Viewfinder Corners inside the card */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-black/20 pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-black/20 pointer-events-none"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-black/20 pointer-events-none"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-black/20 pointer-events-none"></div>

          {/* Index tag / Pulse telemetry */}
          <div className="flex items-center justify-center space-x-2 mb-8 pointer-events-none select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-red animate-pulse"></span>
            <span className="font-mono text-xs text-red uppercase tracking-[0.3em]">
              Act 04 // Systemic Inertia
            </span>
            <span className="text-black/35 font-mono text-xs">//</span>
            <span className="font-mono text-[10px] text-black/50 tracking-wider">SYSTEM COLLAPSE</span>
          </div>

          <motion.div 
            style={{ y: y1 }}
            className="relative mb-8"
          >
            <h2 className="font-hindi text-[clamp(3.8rem,10vw,7.5rem)] leading-[0.82] text-black font-bold tracking-wide">
              {translations.headline}
            </h2>
          </motion.div>
          
          <motion.div
            style={{ y: y2 }}
          >
            <p className="font-english text-[clamp(1.2rem,2.5vw,1.6rem)] text-black/80 max-w-2xl mx-auto border-t border-b border-black/10 py-6 leading-relaxed font-light">
              {translations.desc}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
