"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";

export default function ConstitutionPage() {
  useLenis();
  const t = useTranslations("Constitution");

  const articles = [
    { num: "01", title: "Supremacy of the Citizen", desc: "No party leader, including the founder, holds authority greater than the collective will of the registered ward volunteers." },
    { num: "02", title: "Financial Total Transparency", desc: "Every contribution to the movement, regardless of size, must be logged in the public ledger within 48 hours of receipt." },
    { num: "03", title: "Decentralized Leadership", desc: "Ward Captains are the primary executive authority in their respective localities. The central headquarters acts only in a coordinating capacity." },
    { num: "04", title: "Zero Tolerance for Violence", desc: "The movement is strictly non-violent. Any member engaging in physical intimidation or violence will be immediately expelled and reported to authorities." },
    { num: "05", title: "Electoral Candidacy", desc: "Candidates for public office must have a documented history of at least two years of civic organizing within the ward they seek to represent." }
  ];

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen pt-32 pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 border-b border-black/10 pb-16"
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 border-4 border-black flex items-center justify-center rounded-sm">
                  <span className="font-hindi text-3xl font-bold text-black">N</span>
                </div>
              </div>
              <h1 className="font-hindi text-[clamp(3rem,8vw,5rem)] leading-[0.9] text-black font-semibold mb-6 tracking-tight uppercase">
                {t("title")}
              </h1>
              <p className="font-body text-xl text-black/60">
                {t("subtitle")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-lg leading-relaxed text-black/80 font-medium mb-16 font-body text-center max-w-2xl mx-auto">
                {t("content")}
              </p>

              <div className="space-y-12">
                {articles.map((article, i) => (
                  <motion.div 
                    key={article.num}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex gap-6 sm:gap-8 group"
                  >
                    <div className="shrink-0 font-mono text-3xl sm:text-4xl text-black/20 font-light group-hover:text-red transition-colors">
                      {article.num}
                    </div>
                    <div>
                      <h3 className="font-body text-xl font-bold text-black mb-3">{article.title}</h3>
                      <p className="font-body text-black/70 leading-relaxed">{article.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-20 pt-8 border-t-2 border-black border-dashed flex justify-between items-center font-mono text-[10px] text-black/40 uppercase tracking-widest">
                <span>DRAFT v1.0.4</span>
                <span>RATIFIED: PENDING</span>
              </div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
