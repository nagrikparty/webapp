"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Megaphone, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-off-white pt-20">
      {/* Background Images */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
        style={{ backgroundImage: 'url(/images/concrete_light.png)', backgroundSize: 'cover' }}
      ></div>
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none object-cover mix-blend-multiply bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: 'url(/images/delhi_streets_faded.png)' }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-center py-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-hindi text-[5rem] sm:text-[7rem] lg:text-[9rem] leading-[0.85] font-black text-black tracking-tighter uppercase mb-6 drop-shadow-sm">
              काम दिखना <br/> 
              <span className="text-red">चाहिए।</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <p className="font-body text-xl sm:text-2xl text-black/70 max-w-2xl font-medium tracking-tight mb-10 leading-snug">
              Politics is not speeches. <br className="hidden sm:block" />
              Governance should be visible in daily life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link 
              href="/join" 
              className="group flex items-center justify-center gap-3 bg-black text-white px-8 py-4 font-mono uppercase tracking-widest font-bold text-sm transition-all hover:bg-black/80 hover:shadow-lg rounded-none"
            >
              Join Movement
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/report" 
              className="flex items-center justify-center gap-3 bg-red text-white px-8 py-4 font-mono uppercase tracking-widest font-bold text-sm transition-all hover:bg-red/90 hover:shadow-[0_4px_14px_rgba(255,43,43,0.3)] rounded-none"
            >
              <Megaphone size={16} />
              Report Local Issue
            </Link>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
