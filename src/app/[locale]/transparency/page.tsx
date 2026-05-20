"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";

export default function TransparencyPage() {
  useLenis();
  const t = useTranslations("Transparency");

  const donations = [
    { date: "2026-05-20", amount: "₹ 500", purpose: "General Fund", status: "VERIFIED" },
    { date: "2026-05-19", amount: "₹ 2,000", purpose: "Ward 73 Posters", status: "VERIFIED" },
    { date: "2026-05-18", amount: "₹ 150", purpose: "General Fund", status: "VERIFIED" },
    { date: "2026-05-18", amount: "₹ 5,000", purpose: "Healthcare Audit", status: "VERIFIED" },
    { date: "2026-05-17", amount: "₹ 1,000", purpose: "General Fund", status: "VERIFIED" },
  ];

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen pt-32 pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="border-b-2 border-black pb-12 mb-12"
            >
              <div className="flex items-center gap-2 mb-6 font-mono text-xs text-red uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-red"></span>
                PUBLIC LEDGER
              </div>
              <h1 className="font-hindi text-[clamp(3.5rem,8vw,6rem)] leading-[0.9] text-black font-semibold mb-6 tracking-tight">
                {t("title")}
              </h1>
              <p className="font-body text-xl sm:text-2xl text-black/60 leading-relaxed border-l-4 border-red pl-6">
                {t("subtitle")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-xl leading-relaxed text-black/80 font-medium mb-12 font-body max-w-2xl">
                {t("content")}
              </p>

              {/* Donation Log */}
              <div className="civic-card bg-white border border-black/10 overflow-hidden">
                <div className="bg-black/5 px-6 py-4 border-b border-black/10 flex justify-between items-center">
                  <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-black/70">Recent Contributions</h3>
                  <span className="font-mono text-xs text-red font-semibold animate-pulse">LIVE FEED</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-sm">
                    <thead>
                      <tr className="bg-white/50 text-black/40 border-b border-black/5">
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Purpose</th>
                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {donations.map((d, i) => (
                        <tr key={i} className="hover:bg-black/[0.02] transition-colors">
                          <td className="px-6 py-4 text-black/60">{d.date}</td>
                          <td className="px-6 py-4 font-semibold text-black">{d.amount}</td>
                          <td className="px-6 py-4 text-black/80 font-body">{d.purpose}</td>
                          <td className="px-6 py-4">
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold tracking-widest">
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-black/[0.02] px-6 py-4 border-t border-black/5 text-center">
                  <span className="font-mono text-[11px] text-black/40 tracking-widest uppercase">
                    Displaying last 5 transactions. Full ledger sync in progress.
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
