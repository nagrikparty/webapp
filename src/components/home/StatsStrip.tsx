"use client";

import { motion } from "framer-motion";

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
    [key: string]: string; // Fallback
  };
}

export default function StatsStrip({ translations }: StatsProps) {
  const stats = [
    { label: translations.potholes, value: "Action Needed", color: "text-black" },
    { label: translations.unemployment, value: "Priority Focus", color: "text-black" },
    { label: translations.darkSpots, value: "Audit Pending", color: "text-black" },
    { label: translations.bedRatio, value: "Critical Review", color: "text-black" },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-y border-black/10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center md:text-left border-l-4 border-black pl-4"
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-black/50 mb-2">{stat.label}</p>
              <p className={`font-hindi text-xl sm:text-2xl font-black tracking-tight uppercase ${stat.color}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
