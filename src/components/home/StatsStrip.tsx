"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface StatsProps {
  translations: {
    potholes: string;
    potholesVal: string;
    unemployment: string;
    unemploymentVal: string;
    darkSpots: string;
    darkSpotsVal: string;
    bedRatio: string;
    bedRatioVal: string;
  };
}

function AnimatedNumber({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayVal, setDisplayVal] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    // Extract numeric part
    const numMatch = value.replace(/[^0-9.]/g, "");
    const target = parseFloat(numMatch) || 0;
    const duration = 2000;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.floor(target * eased);
      setDisplayVal(current.toLocaleString());
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplayVal(value);
    };
    animate();
  }, [isInView, value]);

  return <span ref={ref}>{displayVal}{suffix}</span>;
}

export default function StatsStrip({ translations }: StatsProps) {
  const stats = [
    { label: translations.potholes, value: translations.potholesVal, color: "text-red" },
    { label: translations.unemployment, value: translations.unemploymentVal, color: "text-amber-500" },
    { label: translations.darkSpots, value: translations.darkSpotsVal, color: "text-blue-400" },
    { label: translations.bedRatio, value: translations.bedRatioVal, color: "text-emerald-400" },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center md:text-left"
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mb-2">{stat.label}</p>
              <p className={`font-hindi text-3xl sm:text-4xl font-black tracking-tighter ${stat.color}`}>
                <AnimatedNumber value={stat.value} />
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
