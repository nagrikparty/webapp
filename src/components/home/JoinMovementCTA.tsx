"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import { getVolunteerCount } from "@/actions";

interface Props {
  translations: {
    headline: string;
    desc: string;
    cta: string;
    groundOps: string;
    groundOpsVal: string;
    leaders: string;
    leadersVal: string;
    meetDay: string;
    meetDayVal: string;
  };
}

export default function JoinMovementCTA({ translations }: Props) {
  const [leaderCount, setLeaderCount] = useState<string>(translations.leadersVal);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getVolunteerCount().then((count) => {
      if (count > 0) {
        setLeaderCount(count.toString());
      }
    });
  }, []);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={containerRef} className="w-full relative overflow-hidden bg-charcoal">
      {/* Background Image with overlay */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Image
          src="/images/rally.png"
          alt="People organizing"
          fill
          sizes="100vw"
          className="object-cover object-center filter grayscale opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-charcoal/80"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-48 relative z-10 flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl flex flex-col items-center"
        >
          <div className="mb-6 p-3 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
            <Users size={24} className="text-white/60" />
          </div>

          <h2 className="font-hindi text-[clamp(3.5rem,8vw,6.5rem)] leading-[0.85] text-white font-semibold mb-6 drop-shadow-md">
            {translations.headline}
          </h2>
          
          <p className="font-body text-white/70 text-lg sm:text-xl max-w-xl leading-relaxed mb-10">
            {translations.desc}
          </p>

          <Link 
            href="/join"
            className="group flex items-center justify-center gap-3 bg-red text-white font-body text-sm font-medium tracking-widest uppercase px-10 py-5 rounded-xl hover:bg-red/90 transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-red/20 w-full sm:w-auto mb-16"
          >
            {translations.cta}
            <ArrowRight size={18} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Action Statement */}
          <div className="w-full pt-8 border-t border-white/10 flex justify-center">
            <div className="border border-white/20 px-8 py-4 bg-white/5 backdrop-blur-sm max-w-lg">
              <span className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase block mb-2">OPERATIONAL STATUS</span>
              <p className="font-body text-white font-medium">Over {leaderCount} volunteers are actively enforcing accountability across the city.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
