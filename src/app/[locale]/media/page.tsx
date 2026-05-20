"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function MediaPage() {
  useLenis();
  const t = useTranslations("Media");

  const pressReleases = [
    { date: "May 18, 2026", title: "Nagrik Party Announces Ward-Level Healthcare Audits Across South Delhi", ref: "PR-2026-05-18A" },
    { date: "May 12, 2026", title: "Founder Arsalan Azad Submits Memorandum on Pothole Fatalities to LG Office", ref: "PR-2026-05-12C" },
    { date: "April 30, 2026", title: "Public Release: The State of Women's Safety Infrastructure in Okhla Phase II", ref: "PR-2026-04-30B" },
  ];

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen pt-32 pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <div className="flex items-center gap-2 mb-6 font-mono text-xs text-red uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-red"></span>
                PRESS ROOM
              </div>
              <h1 className="font-hindi text-[clamp(3.5rem,8vw,6rem)] leading-[0.9] text-black font-semibold mb-6 tracking-tight">
                {t("title")}
              </h1>
              <p className="font-body text-xl sm:text-2xl text-black/60 max-w-2xl border-l-4 border-red pl-6 py-1">
                {t("subtitle")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
              {/* Press Releases */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-8"
              >
                <h2 className="font-body text-2xl font-bold mb-8 text-black">Official Press Releases</h2>
                <div className="space-y-6">
                  {pressReleases.map((pr, i) => (
                    <div key={i} className="civic-card bg-white p-6 sm:p-8 group hover:border-black/30 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <span className="font-mono text-xs text-red font-semibold">{pr.date}</span>
                        <span className="font-mono text-[10px] text-black/30 tracking-widest">{pr.ref}</span>
                      </div>
                      <h3 className="font-body text-xl font-semibold text-black mb-6 group-hover:text-red transition-colors">
                        {pr.title}
                      </h3>
                      <Link href="#" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-black/50 font-bold hover:text-black">
                        READ FULL RELEASE <ExternalLink size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Sidebar Assets & Contact */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:col-span-4 space-y-8"
              >
                <div className="bg-black p-8 rounded-2xl text-white">
                  <h3 className="font-body text-lg font-bold mb-4">Media Contact</h3>
                  <p className="font-body text-white/60 mb-6 text-sm leading-relaxed">
                    {t("content")}
                  </p>
                  <div className="space-y-4 font-mono text-sm">
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase tracking-widest mb-1">EMAIL</span>
                      <a href="mailto:press@nagrikparty.in" className="text-white hover:text-red transition-colors">press@nagrikparty.in</a>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase tracking-widest mb-1">PHONE</span>
                      <span className="text-white">+91 11 4XXX XXXX</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-black/10 p-8 rounded-2xl">
                  <h3 className="font-body text-lg font-bold text-black mb-2">Press Kit</h3>
                  <p className="font-body text-sm text-black/50 mb-6">High-resolution logos, brand guidelines, and official photos.</p>
                  
                  <button className="w-full flex items-center justify-between p-4 bg-black/5 hover:bg-black/10 rounded-xl transition-colors text-black font-body font-medium text-sm">
                    <span className="flex items-center gap-3">
                      <Download size={18} className="text-red" />
                      Download Brand Assets
                    </span>
                    <span className="font-mono text-[10px] text-black/40">12.4 MB</span>
                  </button>
                </div>
              </motion.div>
            </div>
            
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
