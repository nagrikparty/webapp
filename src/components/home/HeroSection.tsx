"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import CinematicButton from "../ui/CinematicButton";
import { ArrowRight } from "lucide-react";

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
  const [issueText, setIssueText] = useState("");
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.8], [0.7, 0]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] w-full flex flex-col justify-end pb-6 sm:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-off-white"
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
          className="object-cover object-center filter grayscale brightness-90 contrast-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-off-white via-off-white/50 to-transparent"></div>
        <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
      </motion.div>


      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.4,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1] as const,
          }}
          className="max-w-4xl"
        >
          {/* Main headline */}
          <h1 className="font-hindi text-[clamp(3.5rem,14vw,9rem)] leading-[0.82] text-black font-semibold mb-4 sm:mb-6 tracking-wide drop-shadow-sm">
            {translations.headline}
          </h1>

          {/* Subheadline */}
          <p className="font-body text-[clamp(0.95rem,2.5vw,1.3rem)] text-black/75 max-w-xl leading-relaxed mb-6 sm:mb-8 border-l-2 border-red pl-4 sm:pl-5">
            {translations.subheadline}
          </p>

          {/* Issue participation input — CRITICAL: Users participate immediately */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={issueText}
                  onChange={(e) => setIssueText(e.target.value)}
                  placeholder={translations.inputPlaceholder}
                  className="w-full bg-white/50 backdrop-blur-md border border-black/10 rounded-xl px-4 py-3.5 
                    font-body text-sm text-black placeholder:text-black/30
                    focus:outline-none focus:border-red/40 focus:ring-1 focus:ring-red/20
                    transition-all duration-300 shadow-sm"
                />
              </div>
              <Link
                href="/report"
                className="flex items-center justify-center gap-2 bg-red text-white font-body text-sm font-medium 
                  tracking-widest uppercase px-6 py-3.5 rounded-xl
                  hover:bg-red/90 transition-all duration-300 hover:-translate-y-0.5
                  shadow-lg shadow-red/20 whitespace-nowrap"
              >
                {translations.reportIt}
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </motion.div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2.5, duration: 1.2 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-6 bg-black/30"
        ></motion.div>
      </motion.div>
    </section>
  );
}
