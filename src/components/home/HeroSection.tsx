"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function HeroSection() {
  const t = useTranslations('HomePageV2.HeroSection');

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-off-white dark:bg-[#0A0A0A] pt-20 transition-colors duration-300">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col lg:flex-row items-center py-20 gap-12 lg:gap-8">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-hindi text-[4rem] sm:text-[6rem] lg:text-[8rem] leading-[0.85] font-black text-black dark:text-[#F7F7F5] tracking-tighter uppercase mb-8 drop-shadow-sm">
              {t('headline')}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-10 font-body"
          >
            <p className="text-xl sm:text-2xl text-black dark:text-white font-bold tracking-tight mb-2">
              {t('subheadline1')}
            </p>
            <p className="text-xl sm:text-2xl text-red font-bold tracking-tight mb-6">
              {t('subheadline2')}
            </p>
            <p className="text-lg text-black/70 dark:text-white/70 max-w-xl font-medium tracking-tight mb-6 leading-relaxed">
              {t('points')}
            </p>
            <p className="text-lg text-black dark:text-white font-bold tracking-tight max-w-xl">
              {t('closing')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <Link 
              href="/report" 
              className="flex items-center justify-center bg-black dark:bg-[#F7F7F5] text-white dark:text-[#0A0A0A] px-8 py-4 font-mono uppercase tracking-widest font-bold text-sm transition-all hover:bg-black/80 dark:hover:bg-white/80 rounded-none"
            >
              [ {t('reportButton')} ]
            </Link>
            
            <Link 
              href="/join" 
              className="flex items-center justify-center border-2 border-black dark:border-[#F7F7F5] text-black dark:text-[#F7F7F5] px-8 py-4 font-mono uppercase tracking-widest font-bold text-sm transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-none"
            >
              [ {t('volunteerButton')} ]
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <p className="font-mono text-xs uppercase tracking-widest text-black/50 dark:text-white/50 font-bold">
              {t('trustText')}
            </p>
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[40%] flex justify-center lg:justify-end order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full max-w-[400px] aspect-[3/4] lg:aspect-auto lg:h-[70vh] bg-black/5 dark:bg-white/5"
          >
            <div className="absolute inset-0 grayscale contrast-125 brightness-90 dark:brightness-110 mix-blend-multiply dark:mix-blend-lighten">
              <Image 
                src="/images/founder.jpg" 
                alt="Founder" 
                fill 
                className="object-cover object-top"
                priority
              />
            </div>
            {/* Brutalist accents */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-4 border-l-4 border-red pointer-events-none"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t-4 border-r-4 border-black dark:border-white pointer-events-none"></div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
