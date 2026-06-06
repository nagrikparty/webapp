"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function TransparencyStrip() {
  const t = useTranslations('HomePageV2.TransparencyStrip');
  const trackers = [
    { label: t('principle1'), value: t('principle1Value'), detail: t('principle1Detail') },
    { label: t('principle2'), value: t('principle2Value'), detail: t('principle2Detail') },
    { label: t('principle3'), value: t('principle3Value'), detail: t('principle3Detail') },
    { label: t('principle4'), value: t('principle4Value'), detail: t('principle4Detail') },
  ];

  return (
    <section className="bg-white dark:bg-[#111111] py-24 border-y border-black/10 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-hindi text-4xl sm:text-5xl font-bold text-black dark:text-[#F7F7F5] uppercase tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="font-mono text-sm tracking-widest text-black/50 dark:text-white/50 uppercase">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trackers.map((tracker, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 border border-black dark:border-white/10 bg-white dark:bg-[#0A0A0A] text-black dark:text-[#F7F7F5] hover:bg-black dark:hover:bg-[#1A1A1A] hover:text-white dark:hover:text-[#F7F7F5] transition-colors group text-left flex flex-col"
            >
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60 mb-6 pb-4 border-b border-black/10 dark:border-white/10 group-hover:border-white/20">
                {tracker.label}
              </h3>
              <p className="font-body text-2xl font-black mb-4 leading-tight">{tracker.value}</p>
              <p className="font-body text-sm opacity-80 leading-relaxed mt-auto">{tracker.detail}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/manifesto" className="inline-block font-mono text-sm font-bold uppercase tracking-widest text-black dark:text-[#F7F7F5] hover:bg-black dark:hover:bg-[#F7F7F5] hover:text-white dark:hover:text-[#0A0A0A] border border-black dark:border-[#F7F7F5] px-8 py-4 transition-colors">
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
