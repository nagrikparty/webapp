

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollTransitionProps {
  text: string;
}

export default function ScrollTransition({ text }: ScrollTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);

  return (
    <div 
      ref={containerRef}
      className="relative h-[60svh] w-full bg-black flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 film-grain opacity-20"></div>
      
      <motion.div 
        style={{ y, opacity }}
        className="max-w-4xl mx-auto px-6 text-center"
      >
        <h2 className="font-english text-[clamp(1.5rem,4vw,3rem)] font-light italic text-white/70 tracking-wide">
          &ldquo;{text}&rdquo;
        </h2>
      </motion.div>
    </div>
  );
}
