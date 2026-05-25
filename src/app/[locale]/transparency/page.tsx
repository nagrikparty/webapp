"use client";
import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { FileBarChart, DownloadCloud, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { getDonations } from "@/actions";
import dynamic from 'next/dynamic';

const DonationsChart = dynamic(() => import('@/components/ui/DonationsChart'), {
  loading: () => <div className="h-64 flex items-center justify-center bg-white rounded-xl"><div className="w-6 h-6 border-2 border-black/20 border-t-red rounded-full animate-spin"></div></div>,
  ssr: false
});

export default function TransparencyPage() {
  useLenis();
  const t = useTranslations("Transparency");
  const [activeTab, setActiveTab] = useState("audits");
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      if (activeTab === "contributions") {
        const data = await getDonations();
        setDonations(data);
      }
    }
    load();
  }, [activeTab]);

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen text-black pt-24 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16 pt-8"
            >
              <h1 className="font-hindi text-5xl md:text-7xl font-bold text-black tracking-tight mb-4 uppercase">
                {t("title")}
              </h1>
              <p className="font-mono text-black/60 tracking-widest uppercase text-sm border-l-2 border-red pl-4 inline-block">
                {t("subtitle")}
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              <button onClick={() => setActiveTab("audits")} className={`px-6 py-3 font-mono text-xs tracking-widest uppercase rounded-full transition-colors ${activeTab === 'audits' ? 'bg-red text-black font-bold' : 'bg-white text-black/60 hover:bg-black/10 border border-black/10'}`}>
                {t("auditsTab")}
              </button>
              <button onClick={() => setActiveTab("contributions")} className={`px-6 py-3 font-mono text-xs tracking-widest uppercase rounded-full transition-colors ${activeTab === 'contributions' ? 'bg-red text-black font-bold' : 'bg-white text-black/60 hover:bg-black/10 border border-black/10'}`}>
                {t("contributionsTab")}
              </button>
              <button onClick={() => setActiveTab("expenditure")} className={`px-6 py-3 font-mono text-xs tracking-widest uppercase rounded-full transition-colors ${activeTab === 'expenditure' ? 'bg-red text-black font-bold' : 'bg-white text-black/60 hover:bg-black/10 border border-black/10'}`}>
                {t("expenditureTab")}
              </button>
            </div>

            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-black/10 rounded-2xl"
            >
              {activeTab === "contributions" ? (
                <div className="py-8 px-4 sm:px-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="text-red" size={24} />
                    <h2 className="font-mono text-xl font-bold text-black uppercase tracking-widest">
                      Live Contributions
                    </h2>
                  </div>
                  <DonationsChart data={donations} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-black/40 m-4">
                  <FileBarChart size={48} className="mb-4 opacity-50" />
                  <p className="font-mono text-sm uppercase tracking-widest">{t("noReports")}</p>
                  <button className="mt-6 flex items-center gap-2 bg-red/10 border border-red/30 rounded-full px-6 py-3 text-red font-mono text-xs tracking-widest uppercase hover:bg-red/20 transition-colors">
                    <DownloadCloud size={16} /> {t("downloadReport")}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
