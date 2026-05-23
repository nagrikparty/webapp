"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight, Flame } from "lucide-react";

interface HeroProps {
  translations: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    inputPlaceholder: string;
    reportIt: string;
  };
}

export default function HeroSection({ translations }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.8], [0.8, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90svh] w-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-black pt-20"
    >
      {/* Dynamic Background */}
      <motion.div
        style={{ y: yBg, opacity: opacityBg }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image
          src="/images/hero.png" // User can swap this with AI generated gritty art
          alt="Movement Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter grayscale contrast-125 opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
        {/* Grain Overlay */}
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="w-full"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red/10 border border-red/20 text-red mb-8">
            <Flame size={16} className="animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase font-bold">The Revolution is Online</span>
          </div>

          {/* Main headline - Massive and Brutalist */}
          <h1 className="font-hindi text-[clamp(4rem,15vw,11rem)] leading-[0.8] text-white font-black mb-6 tracking-tighter uppercase drop-shadow-2xl">
            {translations.headline}
          </h1>

          {/* Subheadline */}
          <p className="font-mono text-[clamp(1rem,3vw,1.5rem)] text-white/70 max-w-2xl mx-auto leading-snug tracking-widest uppercase font-bold mb-12">
            {translations.subheadline}
          </p>

          {/* Primary High-Impact CTAs - The Bento Layout Foundation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-3xl mx-auto">
            <Link
              href="/join"
              className="w-full sm:w-auto group relative flex items-center justify-center gap-3 bg-white text-black px-8 py-5 rounded-2xl font-mono text-sm sm:text-base uppercase tracking-widest font-black overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-red translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Join Party</span>
              <ArrowRight className="relative z-10 group-hover:text-white transition-colors duration-300" size={20} />
            </Link>

            <Link
              href="/cadre"
              className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-black border-2 border-white/20 text-white px-8 py-5 rounded-2xl font-mono text-sm sm:text-base uppercase tracking-widest font-black hover:border-white transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>Volunteer</span>
            </Link>
            
            <Link
              href="/manifesto"
              className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-transparent text-white/60 px-6 py-5 font-mono text-sm sm:text-base uppercase tracking-widest font-bold hover:text-white transition-colors duration-300 underline underline-offset-8 decoration-white/20 hover:decoration-white"
            >
              <span>Mission</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Ticker */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-red text-white py-2 z-20 flex whitespace-nowrap border-y border-black">
        <motion.div
          animate={{ x: [0, -1035] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="flex items-center gap-8 font-mono text-xs font-black uppercase tracking-widest"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8">
              <span>REPORT NOW</span>
              <span>•</span>
              <span>NO MORE EMPTY PROMISES</span>
              <span>•</span>
              <span>DIGITAL CADRE</span>
              <span>•</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
