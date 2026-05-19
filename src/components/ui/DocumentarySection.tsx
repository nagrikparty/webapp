"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface DocumentarySectionProps {
  headline: string;
  desc: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

export default function DocumentarySection({ headline, desc, imageSrc, imageAlt, reverse = false }: DocumentarySectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] bg-off-white py-24 sm:py-32 overflow-hidden flex items-center border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${reverse ? "" : ""}`}>
          
          {/* Content */}
          <div className={`flex flex-col ${reverse ? "order-2 lg:order-2" : "order-2 lg:order-1"}`}>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="font-hindi text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] text-black font-semibold mb-6"
            >
              {headline}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-english text-[clamp(1.125rem,2vw,1.5rem)] text-black/70 border-l-2 border-red pl-4 leading-relaxed"
            >
              {desc}
            </motion.p>
          </div>

          {/* Image */}
          <div className={`relative h-[50vh] lg:h-[70vh] w-full overflow-hidden border border-black/10 ${reverse ? "order-1 lg:order-1" : "order-1 lg:order-2"}`}>
            <motion.div 
              style={{ y: imageY }}
              className="absolute inset-[-10%] w-[120%] h-[120%]"
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-70 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-tr from-off-white/40 via-transparent to-transparent pointer-events-none"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
