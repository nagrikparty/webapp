"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { getPressReleases } from "@/actions";
import { useEffect, useState } from "react";

interface PressRelease {
  id: string;
  title: string;
  ref_code: string;
  published_at: string;
  content: string;
}

const fallbackPR: PressRelease[] = [
  { id: '1', title: 'Nagrik Party Announces Ward-Level Healthcare Audits Across South Delhi', ref_code: 'PR-2026-05-18A', published_at: '2026-05-18', content: '' },
  { id: '2', title: 'Founder Arsalan Azad Submits Memorandum on Pothole Fatalities to LG Office', ref_code: 'PR-2026-05-12C', published_at: '2026-05-12', content: '' },
  { id: '3', title: 'Public Release: The State of Women\'s Safety Infrastructure in Okhla Phase II', ref_code: 'PR-2026-04-30B', published_at: '2026-04-30', content: '' },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function MediaPage() {
  useLenis();
  const t = useTranslations("Media");
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPressReleases()
      .then((data) => {
        if (data && data.length > 0) {
          setPressReleases(data as PressRelease[]);
        } else {
          setPressReleases(fallbackPR);
        }
      })
      .catch(() => {
        setPressReleases(fallbackPR);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-black min-h-screen pt-24 pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h1 className="font-hindi text-[clamp(3.5rem,8vw,6rem)] leading-[0.9] text-white font-bold mb-6 tracking-tight uppercase">
                {t("title")}
              </h1>
              <p className="font-body text-xl sm:text-2xl text-white/60 max-w-2xl border-l-4 border-red pl-6 py-1">
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
                <h2 className="font-body text-2xl font-bold mb-8 text-white">Official Press Releases</h2>
                <div className="space-y-6">
                  {loading ? (
                    [1, 2, 3].map((i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 animate-pulse">
                        <div className="flex justify-between items-start mb-4">
                          <div className="h-4 bg-white/10 rounded w-24" />
                          <div className="h-3 bg-white/10 rounded w-28" />
                        </div>
                        <div className="h-6 bg-white/10 rounded w-3/4 mb-3" />
                        <div className="h-4 bg-white/10 rounded w-1/2" />
                      </div>
                    ))
                  ) : (
                    pressReleases.map((pr, i) => (
                      <motion.div
                        key={pr.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 group hover:border-white/20 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="font-mono text-xs text-red font-semibold">
                            {formatDate(pr.published_at)}
                          </span>
                          <span className="font-mono text-[10px] text-white/30 tracking-widest">
                            {pr.ref_code}
                          </span>
                        </div>
                        <h3 className="font-body text-xl font-semibold text-white mb-6 group-hover:text-red transition-colors">
                          {pr.title}
                        </h3>
                        <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-white/40 font-bold">
                          <FileText size={14} />
                          {pr.ref_code}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Sidebar Assets & Contact */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:col-span-4 space-y-8"
              >
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                  <h3 className="font-body text-lg font-bold mb-4 text-white">Media Contact</h3>
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
                      <span className="text-white">+91 11 4000 0000</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                  <h3 className="font-body text-lg font-bold text-white mb-2">Press Kit</h3>
                  <p className="font-body text-sm text-white/50 mb-6">High-resolution logos, brand guidelines, and official photos.</p>

                  <a
                    href="/press-kit.zip"
                    download
                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-white font-body font-medium text-sm"
                  >
                    <span className="flex items-center gap-3">
                      <Download size={18} className="text-red" />
                      Download Brand Assets
                    </span>
                    <span className="font-mono text-[10px] text-white/40">ZIP</span>
                  </a>
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
