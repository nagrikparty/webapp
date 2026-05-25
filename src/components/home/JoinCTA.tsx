"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowRight, Zap } from "lucide-react";

interface JoinCTAProps {
  translations: {
    headline: string;
    desc: string;
    cta: string;
    groundOps: string;
    groundOpsVal: string;
    leaders: string;
    leadersVal: string;
    meetDay: string;
    meetDayVal: string;
  };
}

export default function JoinCTA({ translations }: JoinCTAProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 mb-8">
            <Zap size={14} className="text-yellow-500" />
            <span className="font-mono text-[10px] tracking-widest uppercase font-bold">Citizen-Run Movement</span>
          </div>

          <h2 className="font-hindi text-[clamp(2.5rem,8vw,6rem)] leading-[0.85] text-white font-black tracking-tighter uppercase mb-6">
            {translations.headline}
          </h2>

          <p className="font-body text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-12">
            {translations.desc}
          </p>

          {/* Action Statement */}
          <div className="flex justify-center mb-12">
            <div className="border border-white/20 px-8 py-4 bg-white/5 backdrop-blur-sm max-w-lg">
              <span className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase block mb-2">CIVIC MANDATE</span>
              <p className="font-body text-white font-medium">Join local neighborhood units to enforce transparency and execute ground-level actions.</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/join"
              className="group relative flex items-center justify-center gap-3 bg-white text-black px-8 py-5 rounded-full font-mono text-sm uppercase tracking-widest font-black overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-red translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">{translations.cta}</span>
              <ArrowRight className="relative z-10 group-hover:text-white transition-colors duration-300" size={18} />
            </Link>

            <Link
              href="/cadre"
              className="flex items-center gap-3 border-2 border-white/20 text-white px-8 py-5 rounded-full font-mono text-sm uppercase tracking-widest font-black hover:border-red hover:text-red transition-all duration-300"
            >
              <Zap size={16} className="text-yellow-500" />
              Join Digital Cadre
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
