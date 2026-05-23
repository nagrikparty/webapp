"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { 
  ShieldAlert, 
  Construction, 
  Droplets, 
  Waves, 
  HeartPulse, 
  Home, 
  Pill, 
  Briefcase, 
  Trash2, 
  Zap,
  ArrowRight
} from "lucide-react";
import LiveReportsFeed from "@/components/issues/LiveReportsFeed";

export default function IssuesPage() {
  useLenis();
  const t = useTranslations("IssuesPage");

  const categories = [
    { key: "womenSafety", icon: ShieldAlert },
    { key: "roads", icon: Construction },
    { key: "water", icon: Droplets },
    { key: "sewage", icon: Waves },
    { key: "healthcare", icon: HeartPulse },
    { key: "homelessness", icon: Home },
    { key: "addiction", icon: Pill },
    { key: "youthUnemployment", icon: Briefcase },
    { key: "garbage", icon: Trash2 },
    { key: "publicInfra", icon: Zap },
  ];

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen pt-24 sm:pt-32 pb-24">
          
          {/* Hero Section */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20 sm:mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <h1 className="font-hindi text-[clamp(4rem,10vw,8rem)] leading-[0.85] text-black font-semibold mb-6 tracking-tight">
                {t("Hero.headline")}
              </h1>
              <p className="font-body text-xl sm:text-2xl text-black/70 max-w-2xl border-l-4 border-red pl-6 py-2 leading-relaxed">
                {t("Hero.subheadline")}
              </p>
            </motion.div>
          </section>

          {/* Issues Grid */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={cat.key}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                    className="civic-card bg-white/70 hover:bg-white flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center mb-6 text-black/60 group-hover:text-red transition-colors duration-300">
                        <Icon size={28} strokeWidth={1.5} />
                      </div>
                      
                      <h3 className="font-hindi text-3xl font-medium text-black mb-3">
                        {t(`categories.${cat.key}.title`)}
                      </h3>
                      
                      <p className="font-body text-black/60 mb-8 leading-relaxed">
                        {t(`categories.${cat.key}.desc`)}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-black/5 flex flex-col gap-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[10px] text-black/40 uppercase tracking-widest">
                          STATUS
                        </span>
                        <span className="font-mono text-sm text-red font-semibold">
                          {t(`categories.${cat.key}.stat`)}
                        </span>
                      </div>
                      
                      <Link 
                        href="/report" 
                        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-black/50 hover:text-red font-bold transition-colors w-fit"
                      >
                        {t(`categories.${cat.key}.cta`)}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Live Reports Feed */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-24">
            <LiveReportsFeed />
          </section>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
