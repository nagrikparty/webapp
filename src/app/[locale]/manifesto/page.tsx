"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";

export default function ManifestoPage() {
  useLenis();
  const t = useTranslations("Manifesto");

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen pt-32 pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="border-b-2 border-black pb-12 mb-12"
            >
              <div className="flex items-center gap-2 mb-6 font-mono text-xs text-red uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-red"></span>
                OFFICIAL DOCUMENT
              </div>
              <h1 className="font-hindi text-[clamp(3.5rem,8vw,6rem)] leading-[0.9] text-black font-semibold mb-6 tracking-tight">
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
              className="prose prose-lg max-w-none prose-p:font-body prose-headings:font-hindi prose-headings:font-semibold"
            >
              <p className="text-xl leading-relaxed text-black/80 font-medium mb-12">
                {t("content")}
              </p>

              {/* Coming Soon Section for Detailed Policies */}
              <div className="mt-16 border-2 border-dashed border-black/20 rounded-2xl p-8 sm:p-12 text-center opacity-70">
                <h3 className="font-hindi text-3xl mb-4 text-black">Policy Frameworks in Draft</h3>
                <p className="font-mono text-sm text-black/50 uppercase tracking-widest mb-6">
                  PUBLIC CONSULTATION PHASE
                </p>
                <div className="space-y-4 max-w-md mx-auto text-left">
                  <div className="bg-black/5 p-4 rounded-xl flex justify-between items-center">
                    <span className="font-body font-semibold">Ward-Level Healthcare Architecture</span>
                    <span className="font-mono text-[10px] bg-black/10 px-2 py-1 rounded">DRAFTING</span>
                  </div>
                  <div className="bg-black/5 p-4 rounded-xl flex justify-between items-center">
                    <span className="font-body font-semibold">Local Infrastructure Audit Process</span>
                    <span className="font-mono text-[10px] bg-black/10 px-2 py-1 rounded">DRAFTING</span>
                  </div>
                  <div className="bg-black/5 p-4 rounded-xl flex justify-between items-center">
                    <span className="font-body font-semibold">Women Safety Protocol & Urban Planning</span>
                    <span className="font-mono text-[10px] bg-black/10 px-2 py-1 rounded">DRAFTING</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
