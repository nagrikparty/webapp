"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface Props {
  translations: {
    headline: string;
    desc: string;
    bedRatio: string;
    bedRatioVal: string;
    wait: string;
    waitVal: string;
    staff: string;
    staffVal: string;
  };
}

export default function HealthcareSection({ translations }: Props) {
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
        
        {/* Aspect Ratio Container (mirrors IndiaBreakingSection for rhythm) */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[21/9] rounded-[2rem] overflow-hidden group">
          
          <motion.div 
            style={{ y: y1 }}
            className="absolute inset-0 -top-[20%] h-[140%] w-full"
          >
            <Image
              src="/images/hospital.png"
              alt="Overcrowded public hospital"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover object-center filter grayscale contrast-125 brightness-[0.85] group-hover:grayscale-0 transition-all duration-1000 ease-out"
            />
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-1000"></div>

          <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              
              <div className="md:col-span-8 flex flex-col items-start text-left">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="font-hindi text-[clamp(2.5rem,6vw,5.5rem)] leading-none text-white font-semibold mb-4 drop-shadow-lg"
                >
                  {translations.headline}
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
                  <span className="font-mono text-[9px] text-white/40 tracking-[0.2em]">{translations.bedRatio}</span>
                  <span className="font-mono text-xl text-white font-medium">{translations.bedRatioVal}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[9px] text-white/40 tracking-[0.2em]">{translations.wait}</span>
                  <span className="font-mono text-xl text-white font-medium">{translations.waitVal}</span>
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <span className="font-mono text-[9px] text-white/40 tracking-[0.2em]">{translations.staff}</span>
                  <span className="font-mono text-xl text-red font-medium">{translations.staffVal}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
