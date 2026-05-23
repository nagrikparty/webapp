"use client";

import { motion } from "framer-motion";

interface CinematicSectionProps {
  headline: string;
  desc: string;
  align?: "left" | "right" | "center";
  borderAccent?: boolean;
}

export default function CinematicSection({ headline, desc, align = "left", borderAccent = true }: CinematicSectionProps) {
  const alignClass = {
    left: "text-left items-start",
    right: "text-right items-end",
    center: "text-center items-center"
  };

  return (
    <section className="relative min-h-[70vh] flex flex-col justify-center py-20 bg-black">
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col ${alignClass[align]}`}>
        <motion.h2 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-hindi text-[clamp(2.5rem,6vw,4.5rem)] leading-tight text-white font-bold mb-6 uppercase"
        >
          {headline}
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={`${borderAccent && align === "left" ? "border-l-4 border-red pl-6" : ""} ${borderAccent && align === "right" ? "border-r-4 border-red pr-6" : ""} ${borderAccent && align === "center" ? "border-b-2 border-red pb-4" : ""}`}
        >
          <p className="font-english text-[clamp(1.125rem,2vw,1.5rem)] text-white/60 leading-relaxed max-w-2xl font-light">
            {desc}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
