"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { HeartPulse, Construction, ShieldCheck } from "lucide-react";

export default function ManifestoPage() {
  useLenis();
  const t = useTranslations("Manifesto");

  const policyKeys = ["healthcare", "infrastructure", "womenSafety"] as const;

  const policyIcons: Record<string, React.ReactNode> = {
    healthcare: <HeartPulse size={28} className="text-red" />,
    infrastructure: <Construction size={28} className="text-red" />,
    womenSafety: <ShieldCheck size={28} className="text-red" />,
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen text-black pt-24 pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="border-b border-black/10 pb-12 mb-12"
            >
              <div className="flex items-center gap-2 mb-6 font-mono text-xs text-red uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-red animate-pulse"></span>
                {t("officialDoc")}
              </div>
              <h1 className="font-hindi text-[clamp(3.5rem,8vw,6rem)] leading-[0.9] text-black font-semibold mb-6 tracking-tight uppercase">
                {t("title")}
              </h1>
              <p className="font-body text-xl sm:text-2xl text-black/60 leading-relaxed border-l-4 border-red pl-6">
                {t("subtitle")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-xl leading-relaxed text-black/80 font-medium mb-16 font-body">
                {t("content")}
              </p>

              {/* Policy Cards */}
              <div className="mb-8">
                <h3 className="font-hindi text-3xl sm:text-4xl text-black font-semibold mb-2 uppercase tracking-tight">
                  {t("policyTitle")}
                </h3>
                <p className="font-mono text-xs text-black/40 uppercase tracking-widest mb-8">
                  {t("policyPhase")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {policyKeys.map((key, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className="bg-white border border-black/10 rounded-2xl p-6 hover:bg-black/10 hover:border-red/30 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-red/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red/20 transition-colors">
                      {policyIcons[key]}
                    </div>
                    <h4 className="font-body text-lg font-bold text-black mb-2">
                      {t(`policies.${key}.title`)}
                    </h4>
                    <span className="inline-block font-mono text-[10px] bg-red/10 text-red px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                      {t(`policies.${key}.status`)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
