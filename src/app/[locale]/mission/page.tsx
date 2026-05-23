"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import ScrollTransition from "@/components/ui/ScrollTransition";
import CinematicSection from "@/components/ui/CinematicSection";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function MissionPage() {
  useLenis();
  const t = useTranslations("MissionPage");

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-black min-h-screen pt-24">
          
          {/* Hero Section */}
          <section className="relative min-h-[60vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 film-grain opacity-20"></div>
            <div className="max-w-5xl mx-auto relative z-10 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-hindi text-[clamp(3.5rem,8vw,6rem)] leading-none text-white font-bold mb-8 uppercase tracking-tight"
              >
                {t("Hero.headline")}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-english text-[clamp(1.25rem,3vw,1.75rem)] text-red font-semibold max-w-3xl mx-auto italic"
              >
                {t("Hero.subheadline")}
              </motion.p>
            </div>
          </section>

          {/* Body Sections */}
          <CinematicSection 
            headline={t("Failure.headline")} 
            desc={t("Failure.desc")} 
            align="left" 
          />
          
          <CinematicSection 
            headline={t("CitizenFirst.headline")} 
            desc={t("CitizenFirst.desc")} 
            align="right" 
          />
          
          <CinematicSection 
            headline={t("Dignity.headline")} 
            desc={t("Dignity.desc")} 
            align="left" 
          />
          
          <CinematicSection 
            headline={t("Healthcare.headline")} 
            desc={t("Healthcare.desc")} 
            align="right" 
          />
          
          <CinematicSection 
            headline={t("WomenSafety.headline")} 
            desc={t("WomenSafety.desc")} 
            align="left" 
          />
          
          <CinematicSection 
            headline={t("Accountability.headline")} 
            desc={t("Accountability.desc")} 
            align="center" 
          />
          
          <CinematicSection 
            headline={t("Youth.headline")} 
            desc={t("Youth.desc")} 
            align="center" 
            borderAccent={false}
          />

          {/* Closing CTA */}
          <section className="relative py-32 text-center px-4 sm:px-6 border-t border-white/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <p className="font-mono text-white/40 text-xs tracking-widest uppercase mb-6">
                The Movement Starts With You
              </p>
              <Link 
                href="/join"
                className="inline-flex items-center gap-3 bg-red text-white rounded-full font-mono uppercase tracking-widest font-bold px-10 py-4 text-sm hover:scale-105 transition-transform shadow-lg shadow-red/20"
              >
                Join Nagrik Party
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </section>

        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
