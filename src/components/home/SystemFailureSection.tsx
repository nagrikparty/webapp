"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface Props {
  translations: {
    headline: string;
    desc: string;
    unemployment: string;
    unemploymentVal: string;
    stat: string;
    statVal: string;
  };
}

export default function SystemFailureSection({ translations }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  
  return (
    <section 
      ref={containerRef}
      className="relative w-full py-32 sm:py-48 bg-off-white overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 filter blur-sm">
        <Image
          src="/images/youth.png"
          alt="Youth frustration"
          fill
          sizes="100vw"
          className="object-cover object-center grayscale"
        />
        <div className="absolute inset-0 bg-off-white/50"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full text-center">
        
        <motion.div style={{ y: y1 }} className="mb-12">
          <h2 className="font-hindi text-[clamp(4.5rem,12vw,8.5rem)] leading-[0.8] text-black font-bold tracking-wide drop-shadow-sm">
            {translations.headline}
          </h2>
        </motion.div>

        <motion.div 
          style={{ y: y2 }}
          className="flex flex-col items-center"
        >
          <p className="font-body text-black/70 text-lg sm:text-xl max-w-2xl tracking-wide leading-relaxed mb-16">
            {translations.desc}
          </p>

          <div className="pt-8 border-t border-black/10 text-center w-full max-w-md mx-auto">
            <span className="font-mono text-[10px] text-black/60 tracking-[0.2em] uppercase block mb-3">Structural Notice</span>
            <span className="font-mono text-xl sm:text-2xl text-black font-medium uppercase leading-tight">The current governance model has collapsed. Action is required.</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
