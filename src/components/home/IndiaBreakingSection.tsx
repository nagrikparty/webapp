"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface Props {
  translations: {
    title: string;
    desc: string;
    potholes: string;
    potholesVal: string;
    budget: string;
    budgetVal: string;
    status: string;
    statusVal: string;
  };
}

export default function IndiaBreakingSection({ translations }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  
  return (
    <section 
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-off-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Aspect Ratio Container for Widescreen Cinematic Feel */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[21/9] rounded-[2rem] overflow-hidden group">
          
          <motion.div 
            style={{ y: y1 }}
            className="absolute inset-0 -top-[20%] h-[140%] w-full"
          >
            <Image
              src="/images/roads.png"
              alt="Broken roads"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover object-center filter grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-1000 ease-out"
            />
          </motion.div>
          
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-1000"></div>

          {/* Content overlay */}
          <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              
              <div className="md:col-span-8">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="font-hindi text-[clamp(2.5rem,6vw,5.5rem)] leading-none text-white font-semibold mb-4 drop-shadow-lg"
                >
                  {translations.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="font-body text-white/80 text-lg sm:text-xl max-w-lg tracking-wide border-l-2 border-red pl-4"
                >
                  {translations.desc}
                </motion.p>
              </div>

              {/* Civic Telemetry Micro-grid */}
              <div className="md:col-span-4 hidden sm:grid grid-cols-2 gap-x-4 gap-y-6 bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] text-white/40 tracking-[0.2em]">{translations.potholes}</span>
                  <span className="font-mono text-xl text-white font-medium">{translations.potholesVal}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] text-white/40 tracking-[0.2em]">{translations.budget}</span>
                  <span className="font-mono text-xl text-white font-medium">{translations.budgetVal}</span>
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <span className="font-mono text-[9px] text-white/40 tracking-[0.2em]">{translations.status}</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red animate-pulse"></span>
                    <span className="font-mono text-sm text-red tracking-widest">{translations.statusVal}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
