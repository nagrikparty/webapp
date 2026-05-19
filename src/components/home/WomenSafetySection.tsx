"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface WomenSafetyProps {
  translations: {
    headline: string;
    desc: string;
  };
}

export default function WomenSafetySection({ translations }: WomenSafetyProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const opacityVal = useTransform(scrollYProgress, [0, 0.5, 1], [0.18, 0.28, 0.18]);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] bg-off-white py-24 sm:py-32 overflow-hidden flex items-center border-b border-black/10">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.div style={{ y: imageY, opacity: opacityVal, height: "115%" }} className="relative w-full h-full">
          <Image
            src="/images/safety.png"
            alt="Women safety on Delhi streets"
            fill
            sizes="100vw"
            className="object-cover object-right sm:object-center grayscale brightness-105"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-off-white via-off-white/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-off-white via-transparent to-off-white"></div>
      </div>

      {/* Decorative Technical Grid Overlay */}
      <div className="absolute inset-0 z-0 flex justify-between pointer-events-none px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto opacity-[0.05]">
        <div className="w-px h-full bg-black"></div>
        <div className="w-px h-full bg-black hidden sm:block"></div>
        <div className="w-px h-full bg-black hidden md:block"></div>
        <div className="w-px h-full bg-black"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col bg-white/40 backdrop-blur-md border border-black/10 p-8 sm:p-12 rounded-3xl shadow-sm relative overflow-hidden"
          >
            {/* Viewfinder Corners inside the card */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-black/20 pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-black/20 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-black/20 pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-black/20 pointer-events-none"></div>

            {/* Index tag */}
            <div className="flex items-center space-x-2 mb-6 pointer-events-none select-none">
              <span className="font-mono text-xs text-red uppercase tracking-[0.3em]">
                Act 02 // Street-Level Security
              </span>
              <span className="text-black/35 font-mono text-xs">//</span>
              <span className="font-mono text-[10px] text-black/50 tracking-wider">DE.SE-04</span>
            </div>

            <h2 className="font-hindi text-[clamp(2.5rem,6.5vw,4.2rem)] leading-[0.88] text-black font-semibold mb-6 tracking-wide">
              {translations.headline}
            </h2>
            
            <p className="font-english text-[clamp(1.15rem,2.2vw,1.45rem)] text-black/75 border-l-2 border-red pl-5 leading-relaxed font-light">
              {translations.desc}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
