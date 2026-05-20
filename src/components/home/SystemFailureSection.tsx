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

          <div className="grid grid-cols-2 gap-8 sm:gap-16 pt-8 border-t border-black/10">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] text-black/40 tracking-[0.2em]">{translations.unemployment}</span>
              <span className="font-mono text-3xl sm:text-5xl text-black font-medium">{translations.unemploymentVal}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] text-black/40 tracking-[0.2em]">{translations.stat}</span>
              <span className="font-mono text-3xl sm:text-5xl text-red font-medium">{translations.statVal}</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
