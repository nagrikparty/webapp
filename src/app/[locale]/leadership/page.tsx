"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function LeadershipPage() {
  useLenis();
  const t = useTranslations("Leadership");

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-charcoal min-h-screen pt-32 pb-24 relative overflow-hidden">

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 mb-6 font-mono text-xs text-red uppercase tracking-widest font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <Users size={14} className="text-red" />
                CITIZEN STRUCTURE
              </div>
              <h1 className="font-hindi text-[clamp(4rem,10vw,7rem)] leading-[0.9] text-white font-semibold mb-6 tracking-tight drop-shadow-md">
                {t("title")}
              </h1>
              <p className="font-body text-xl sm:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                {t("content")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16"
            >
              {/* Leader Placeholder Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="civic-card bg-off-white border border-white/10 hover:border-red/50 transition-colors p-6 group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-black/10 rounded-full shrink-0 relative overflow-hidden">
                        {/* Placeholder silhouette */}
                        <div className="absolute inset-x-0 bottom-0 top-3 bg-black/20 rounded-t-full"></div>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-black/20 rounded-full"></div>
                      </div>
                      <span className="bg-red/10 text-red px-2 py-1 rounded font-mono text-[9px] uppercase tracking-widest font-bold">ACTIVE</span>
                    </div>
                    
                    <h3 className="font-body text-xl font-bold text-black mb-1">Ward Captain {i}</h3>
                    <p className="font-mono text-xs text-black/50 tracking-widest mb-4">WARD {70 + i}, SOUTH DELHI</p>
                    
                    <div className="flex gap-2 text-black/40 group-hover:text-black/80 transition-colors">
                      <div className="flex-1 h-1 bg-black/10 rounded-full overflow-hidden">
                        <div className="h-full bg-red w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-16 text-center">
                <Link 
                  href="/join"
                  className="inline-flex items-center justify-center gap-3 bg-red text-white font-body text-sm font-medium tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-red/90 transition-all duration-300 shadow-xl shadow-red/20"
                >
                  Become a Ward Captain
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
