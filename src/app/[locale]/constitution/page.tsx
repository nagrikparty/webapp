"use client";
import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { Download, FileText, CheckCircle } from "lucide-react";

export default function ConstitutionPage() {
  useLenis();
  const t = useTranslations("Constitution");

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-black min-h-screen pt-24 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16 border-b border-white/10 pb-10"
            >
              <div className="inline-flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-full mb-6">
                <FileText size={40} className="text-white" />
              </div>
              <h1 className="font-hindi text-5xl md:text-7xl font-bold text-white tracking-tight mb-4 uppercase">
                {t("title")}
              </h1>
              <p className="font-mono text-white/60 tracking-widest uppercase text-sm mb-8">
                {t("subtitle")}
              </p>
              
              <button className="inline-flex items-center gap-2 bg-red text-white px-8 py-4 rounded-full font-mono font-bold hover:bg-red/90 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-red/20 uppercase tracking-widest text-sm">
                <Download size={18} />
                {t("downloadPdf")}
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 space-y-12"
            >
              <div className="space-y-4">
                <h2 className="font-hindi text-2xl font-bold text-white border-l-4 border-red pl-4">{t("article1")}</h2>
                <p className="font-body text-white/60 leading-relaxed text-lg">{t("article1Text")}</p>
              </div>

              <div className="space-y-4">
                <h2 className="font-hindi text-2xl font-bold text-white border-l-4 border-red pl-4">{t("article2")}</h2>
                <p className="font-body text-white/60 leading-relaxed text-lg">{t("article2Text")}</p>
              </div>

              <div className="space-y-4">
                <h2 className="font-hindi text-2xl font-bold text-white border-l-4 border-red pl-4">{t("article3")}</h2>
                <p className="font-body text-white/60 leading-relaxed text-lg">{t("article3Text")}</p>
              </div>
              
              <div className="pt-8 border-t border-white/10 flex items-center justify-center gap-2 text-white/40">
                <CheckCircle size={16} />
                <span className="font-mono text-xs uppercase tracking-widest">ECI Compliant Document</span>
              </div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
