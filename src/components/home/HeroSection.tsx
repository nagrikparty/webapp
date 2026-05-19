"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import CinematicButton from "../ui/CinematicButton";

interface HeroProps {
  translations: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
}

export default function HeroSection({ translations }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.8], [0.35, 0]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[100svh] w-full flex flex-col justify-end pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-off-white"
    >
      {/* Background Image with Parallax & Fade */}
      <motion.div 
        style={{ y: yBg, opacity: opacityBg, scale: scaleBg }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image
          src="/images/hero.png"
          alt="Rainy Delhi street"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-off-white via-off-white/50 to-transparent"></div>
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
      </motion.div>

      {/* Decorative Technical Grid Overlay */}
      <div className="absolute inset-0 z-0 flex justify-between pointer-events-none px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto opacity-[0.07]">
        <div className="w-px h-full bg-black"></div>
        <div className="w-px h-full bg-black hidden sm:block"></div>
        <div className="w-px h-full bg-black hidden md:block"></div>
        <div className="w-px h-full bg-black"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          className="max-w-4xl"
        >
          {/* Live Indicator / Tactical Coordinates */}
          <div className="flex items-center space-x-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red"></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-black/60">
              Delhi Metropolitan Area // Active Campaign
            </span>
          </div>

          <h1 className="font-hindi text-[clamp(4.2rem,16vw,9.5rem)] leading-[0.82] text-black font-semibold mb-6 tracking-wide drop-shadow-sm">
            {translations.headline}
          </h1>
          
          <p className="font-english text-[clamp(1.15rem,2.8vw,1.45rem)] text-black/85 max-w-2xl leading-relaxed mb-10 border-l-2 border-red pl-5">
            {translations.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <CinematicButton 
              href="/join" 
              text={translations.ctaPrimary} 
              variant="primary" 
              className="w-full sm:w-auto"
            />
            <CinematicButton 
              href="/report" 
              text={translations.ctaSecondary} 
              variant="secondary" 
              className="w-full sm:w-auto"
            />
          </div>
        </motion.div>
      </div>

      {/* Dynamic Scroll Indicator Line */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-45 pointer-events-none"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] mb-2 text-black/50">Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-black/80 to-transparent"></div>
      </motion.div>
    </section>
  );
}
