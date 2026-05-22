"use client";
import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";

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
        <main className="bg-off-white min-h-screen pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-20"
            >
              <h1 className="font-hindi text-5xl md:text-7xl font-bold text-black tracking-tight mb-4 uppercase">
                {t("title")}
              </h1>
              <p className="font-mono text-black/60 tracking-widest uppercase text-sm">
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
                  className="civic-card bg-white overflow-hidden group"
                >
                  <div className="aspect-[3/4] bg-black/5 relative grayscale group-hover:grayscale-0 transition-all duration-500">
                    <div className="absolute inset-0 flex items-center justify-center text-black/20 font-mono text-xs tracking-widest uppercase">
                      Portrait
                    </div>
                  </div>
                  <div className="p-6 border-t border-black/10">
                    <p className="font-mono text-xs text-red font-bold tracking-widest uppercase mb-1">
                      {t(leader.title as any)}
                    </p>
                    <h3 className="font-hindi text-2xl font-bold text-black">{leader.name}</h3>
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
