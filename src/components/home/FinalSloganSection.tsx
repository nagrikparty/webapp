"use client";

import { motion } from "framer-motion";

interface Props {
  translations: {
    part1: string;
    part2: string;
  };
}

export default function FinalSloganSection({ translations }: Props) {
  return (
    <section className="w-full py-32 sm:py-48 bg-off-white flex items-center justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-2 sm:gap-4"
        >
          <h2 className="font-hindi text-[clamp(3.5rem,8vw,7rem)] leading-none text-black/20 font-bold tracking-tight">
            {translations.part1}
          </h2>
          <h2 className="font-hindi text-[clamp(4rem,10vw,9rem)] leading-none text-black font-bold tracking-tight drop-shadow-sm">
            {translations.part2}
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
