"use client";
import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { FileBarChart, DownloadCloud } from "lucide-react";
import { useState } from "react";

export default function TransparencyPage() {
  useLenis();
  const t = useTranslations("Transparency");
  const [activeTab, setActiveTab] = useState("audits");

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen pt-32 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="font-hindi text-5xl md:text-7xl font-bold text-black tracking-tight mb-4 uppercase">
                {t("title")}
              </h1>
              <p className="font-mono text-black/60 tracking-widest uppercase text-sm border-l-2 border-red pl-4 inline-block">
                {t("subtitle")}
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              <button onClick={() => setActiveTab("audits")} className={`px-6 py-3 font-mono text-xs tracking-widest uppercase rounded-full transition-colors ${activeTab === 'audits' ? 'bg-black text-white' : 'bg-black/5 text-black/60 hover:bg-black/10'}`}>
                {t("auditsTab")}
              </button>
              <button onClick={() => setActiveTab("contributions")} className={`px-6 py-3 font-mono text-xs tracking-widest uppercase rounded-full transition-colors ${activeTab === 'contributions' ? 'bg-black text-white' : 'bg-black/5 text-black/60 hover:bg-black/10'}`}>
                {t("contributionsTab")}
              </button>
              <button onClick={() => setActiveTab("expenditure")} className={`px-6 py-3 font-mono text-xs tracking-widest uppercase rounded-full transition-colors ${activeTab === 'expenditure' ? 'bg-black text-white' : 'bg-black/5 text-black/60 hover:bg-black/10'}`}>
                {t("expenditureTab")}
              </button>
            </div>

            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="civic-card bg-white"
            >
              <div className="flex flex-col items-center justify-center py-20 text-center text-black/40 border-2 border-dashed border-black/10 rounded-xl">
                <FileBarChart size={48} className="mb-4 opacity-50" />
                <p className="font-mono text-sm uppercase tracking-widest">{t("noReports")}</p>
                <button className="mt-6 flex items-center gap-2 text-red font-mono text-xs tracking-widest uppercase hover:underline opacity-50 cursor-not-allowed">
                  <DownloadCloud size={16} /> {t("downloadReport")}
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
