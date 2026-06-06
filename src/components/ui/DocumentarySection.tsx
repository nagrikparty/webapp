

import { useRef } from "react";
import { Image } from "@/lib/next-shims";
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

  const imageY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.15]);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] bg-black py-24 sm:py-32 overflow-hidden flex items-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Content */}
          <div className={`flex flex-col ${reverse ? "order-2 lg:order-2" : "order-2 lg:order-1"}`}>
            <motion.h2 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-hindi text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] text-white font-bold mb-6 uppercase"
            >
              {headline}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-english text-[clamp(1.125rem,2vw,1.5rem)] text-white/60 border-l-2 border-red pl-4 leading-relaxed font-light"
            >
              {desc}
            </motion.p>
          </div>

          {/* Image */}
          <div className={`relative h-[50vh] lg:h-[70vh] w-full overflow-hidden rounded-2xl border border-white/10 group ${reverse ? "order-1 lg:order-1" : "order-1 lg:order-2"}`}>
            <motion.div 
              style={{ y: imageY, scale: imageScale }}
              className="absolute inset-[-15%] w-[130%] h-[130%]"
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-80 grayscale group-hover:grayscale-0 transition-all duration-[1200ms] ease-out"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent pointer-events-none"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
