"use client";
import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function LeadershipPage() {
  useLenis();
  const t = useTranslations("Leadership");

  const leaders = [
    { title: "president", name: "To Be Announced", img: "" },
    { title: "secretary", name: "To Be Announced", img: "" },
    { title: "treasurer", name: "To Be Announced", img: "" },
  ];

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-black min-h-screen pt-24 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-20"
            >
              <div className="flex items-center justify-center gap-2 mb-6 font-mono text-xs text-red uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-red"></span>
                CORE TEAM
              </div>
              <h1 className="font-hindi text-5xl md:text-7xl font-bold text-white tracking-tight mb-4 uppercase">
                {t("title")}
              </h1>
              <p className="font-mono text-white/60 tracking-widest uppercase text-sm">
                {t("subtitle")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {leaders.map((leader, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 hover:scale-105 transition-all duration-300"
                >
                  <div className="aspect-[3/4] bg-white/[0.03] relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users size={48} className="text-white/10" />
                    </div>
                  </div>
                  <div className="p-6 border-t border-white/10">
                    <p className="font-mono text-xs text-red font-bold tracking-widest uppercase mb-1">
                      {t(leader.title as any)}
                    </p>
                    <h3 className="font-hindi text-2xl font-bold text-white">{leader.name}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
