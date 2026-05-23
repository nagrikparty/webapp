"use client";
import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { MapPin, Mail, Megaphone } from "lucide-react";

export default function ContactPage() {
  useLenis();
  const t = useTranslations("Contact");

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-black min-h-screen pt-24 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16 pt-8"
            >
              <h1 className="font-hindi text-5xl md:text-7xl font-bold text-white tracking-tight mb-4 uppercase">
                {t("title")}
              </h1>
              <p className="font-mono text-white/60 tracking-widest uppercase text-sm border-b border-red pb-4 inline-block">
                {t("subtitle")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:border-red/30 transition-all duration-300 group">
                <div className="w-14 h-14 bg-red/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red/20 transition-colors">
                  <MapPin size={28} className="text-red" />
                </div>
                <h3 className="font-mono text-xs text-white/60 tracking-widest uppercase mb-2">{t("addressTitle")}</h3>
                <p className="font-body text-white text-lg whitespace-pre-line">{t("addressText")}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:border-red/30 transition-all duration-300 group">
                <div className="w-14 h-14 bg-red/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red/20 transition-colors">
                  <Mail size={28} className="text-red" />
                </div>
                <h3 className="font-mono text-xs text-white/60 tracking-widest uppercase mb-2">{t("grievanceTitle")}</h3>
                <p className="font-body text-white text-lg whitespace-pre-line">{t("grievanceText")}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:border-red/30 transition-all duration-300 group">
                <div className="w-14 h-14 bg-red/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red/20 transition-colors">
                  <Megaphone size={28} className="text-red" />
                </div>
                <h3 className="font-mono text-xs text-white/60 tracking-widest uppercase mb-2">{t("mediaTitle")}</h3>
                <p className="font-body text-white text-lg whitespace-pre-line">{t("mediaText")}</p>
              </motion.div>
            </div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
