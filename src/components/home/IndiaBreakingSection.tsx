"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface IndiaBreakingProps {
  translations: {
    title: string;
    desc: string;
  };
}

export default function IndiaBreakingSection({ translations }: IndiaBreakingProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.2]);

  return (
    <section ref={containerRef} className="relative min-h-screen bg-off-white py-24 sm:py-32 overflow-hidden flex items-center border-b border-black/10">
      {/* Decorative background grid line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-black/[0.05] hidden lg:block pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Content Column */}
          <div className="flex flex-col order-2 lg:order-1 max-w-xl">
            {/* Index tag */}
            <div className="font-mono text-xs text-red uppercase tracking-[0.3em] mb-4">
              Act 01 // National Crisis
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-hindi text-[clamp(3rem,6vw,4.8rem)] leading-[0.88] text-black font-semibold mb-6 tracking-wide"
            >
              {translations.title}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-english text-[clamp(1.2rem,2.5vw,1.8rem)] text-black/75 border-l-2 border-red pl-5 leading-relaxed font-light"
            >
              {translations.desc}
            </motion.p>
          </div>

          {/* Documentary Image Column */}
          <div className="relative h-[45vh] sm:h-[55vh] lg:h-[70vh] w-full overflow-hidden rounded-2xl order-1 lg:order-2 border border-black/15 shadow-sm group">
            <motion.div 
              style={{ y: imageY, scale: imageScale }}
              className="absolute inset-[-15%] w-[130%] h-[130%] pointer-events-none"
            >
              <Image
                src="/images/roads.png"
                alt="Broken infrastructure in Delhi"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-75 grayscale group-hover:grayscale-0 transition-all duration-[1000ms] ease-out"
              />
            </motion.div>
            
            {/* Viewfinder corner lines to make it look like surveillance footage */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-black/35 pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-black/35 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-black/35 pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-black/35 pointer-events-none"></div>

            {/* Tactical Live Rec Overlay */}
            <div className="absolute top-5 left-5 flex items-center space-x-2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-mono tracking-widest text-white uppercase pointer-events-none select-none">
              <span className="h-1.5 w-1.5 rounded-full bg-red animate-pulse"></span>
              <span>SURVEILLANCE CAM // DE.RO-01</span>
            </div>

            {/* Geographic Coordinates Overlay */}
            <div className="absolute bottom-5 right-5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[9px] font-mono tracking-[0.2em] text-white/90 pointer-events-none select-none">
              LAT: 28.5921° N // LON: 77.2912° E
            </div>
            
            {/* Subtle Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-off-white/30 to-transparent pointer-events-none"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
