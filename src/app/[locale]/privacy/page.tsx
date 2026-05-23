"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  useLenis();
  const t = useTranslations("Privacy");

  const sections = ["collection", "usage", "sharing", "security", "rights"];

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-black min-h-screen pt-24 pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="border-b border-white/10 pb-12 mb-12"
            >
              <div className="flex items-center gap-2 mb-6 font-mono text-xs text-white/50 uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-white/50"></span>
                LEGAL DOCUMENT
              </div>
              <h1 className="font-hindi text-[clamp(3.5rem,8vw,6rem)] leading-[0.9] text-white font-bold mb-6 tracking-tight uppercase">
                {t("title")}
              </h1>
              <p className="font-body text-xl sm:text-2xl text-white/60 leading-relaxed border-l-4 border-red pl-6">
                {t("subtitle")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-12"
            >
              <p className="text-xl leading-relaxed text-white/70 font-medium mb-12 font-body bg-red/10 p-6 rounded-2xl border border-red/20">
                {t("content")}
              </p>

              {sections.map((key, index) => (
                <div key={key} className="border-l-2 border-white/10 pl-6 sm:pl-8 py-2">
                  <span className="font-mono text-xs text-white/40 tracking-widest font-bold block mb-3">SECTION {index + 1}</span>
                  <h3 className="font-body text-2xl font-bold text-white mb-4">
                    {t(`sections.${key}.title`)}
                  </h3>
                  <p className="font-body text-white/60 leading-relaxed text-lg">
                    {t(`sections.${key}.content`)}
                  </p>
                </div>
              ))}
              
              <div className="mt-20 pt-8 border-t border-white/10 font-mono text-xs text-white/50 uppercase tracking-widest">
                {t("lastUpdated")}
              </div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
