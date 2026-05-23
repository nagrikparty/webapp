"use client";
import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { AlertTriangle, Search } from "lucide-react";

export default function CandidatesPage() {
  useLenis();
  const t = useTranslations("Candidates");

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-black min-h-screen pt-24 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 border-b border-white/10 pb-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red/20 rounded-xl border border-red/30">
                  <AlertTriangle size={32} className="text-red" />
                </div>
                <h1 className="font-hindi text-4xl md:text-6xl font-bold text-white uppercase tracking-tight">
                  {t("title")}
                </h1>
              </div>
              <p className="font-mono text-white/60 tracking-widest uppercase text-sm mb-6">
                {t("subtitle")}
              </p>
              <div className="bg-red/10 border border-red/20 p-4 rounded-xl">
                <p className="font-body text-red text-sm leading-relaxed">
                  {t("disclaimer")}
                </p>
              </div>
            </motion.div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center bg-white/[0.02]">
                <Search size={18} className="text-white/40 mr-3" />
                <input 
                  type="text" 
                  placeholder="Search constituency or candidate..." 
                  className="bg-transparent border-none focus:outline-none text-white font-mono text-sm w-full placeholder:text-white/30"
                  disabled
                />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 font-mono text-xs uppercase tracking-widest text-white/40">
                      <th className="p-4">{t("name")}</th>
                      <th className="p-4">{t("constituency")}</th>
                      <th className="p-4">{t("charges")}</th>
                      <th className="p-4">{t("justification")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-white/30 font-mono text-sm uppercase tracking-widest">
                        {t("noCandidates")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
