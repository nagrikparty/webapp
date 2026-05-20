"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface Props {
  translations: {
    headline: string;
    desc: string;
    darkSpots: string;
    darkSpotsVal: string;
    cctv: string;
    cctvVal: string;
    response: string;
    responseVal: string;
  };
}

export default function WomenSafetySection({ translations }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  
  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[120svh] bg-black overflow-hidden flex items-center"
    >
      <motion.div 
        style={{ scale, y, opacity }}
        className="absolute inset-0 z-0 pointer-events-none origin-bottom"
      >
        <Image
          src="/images/safety.png"
          alt="Dark empty street"
          fill
          sizes="100vw"
          className="object-cover object-bottom filter grayscale contrast-150 brightness-[0.4]"
        />
        {/* Soft gradient edges to blend into the off-white sections before/after */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-off-white to-transparent opacity-80"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-off-white to-transparent opacity-80"></div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="font-hindi text-[clamp(3.5rem,8vw,7rem)] leading-[0.85] text-white font-semibold mb-6 drop-shadow-2xl"
          >
            {translations.headline}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-white/70 text-lg sm:text-xl max-w-lg tracking-wide border-l-2 border-red pl-5 mb-12"
          >
            {translations.desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-xl"
          >
            <div className="flex flex-col gap-1.5 border-t border-white/20 pt-4">
              <span className="font-mono text-[10px] text-white/40 tracking-[0.2em]">{translations.darkSpots}</span>
              <span className="font-mono text-xl text-red font-medium">{translations.darkSpotsVal}</span>
            </div>
            <div className="flex flex-col gap-1.5 border-t border-white/20 pt-4">
              <span className="font-mono text-[10px] text-white/40 tracking-[0.2em]">{translations.cctv}</span>
              <span className="font-mono text-xl text-white font-medium">{translations.cctvVal}</span>
            </div>
            <div className="flex flex-col gap-1.5 border-t border-white/20 pt-4 col-span-2 sm:col-span-1">
              <span className="font-mono text-[10px] text-white/40 tracking-[0.2em]">{translations.response}</span>
              <span className="font-mono text-xl text-white font-medium">{translations.responseVal}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
