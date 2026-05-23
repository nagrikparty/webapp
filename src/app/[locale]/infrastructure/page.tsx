"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { 
  Building2, 
  Stethoscope, 
  Heart, 
  Activity, 
  Home, 
  BookOpen,
  ArrowRight
} from "lucide-react";

export default function InfrastructurePage() {
  useLenis();
  const t = useTranslations("InfrastructurePage");

  const items = [
    { key: "hospital", icon: Building2 },
    { key: "clinic", icon: Stethoscope },
    { key: "oldAge", icon: Heart },
    { key: "rehab", icon: Activity },
    { key: "shelter", icon: Home },
    { key: "library", icon: BookOpen },
  ];

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-black min-h-screen pt-24 sm:pt-32 pb-24">
          
          {/* Hero Section */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-20 sm:mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-2 mb-6 font-mono text-xs text-red uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-red"></span>
                INFRASTRUCTURE
              </div>
              <h1 className="font-hindi text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] text-white font-bold mb-6 tracking-tight uppercase">
                {t("Hero.headline")}
              </h1>
              <p className="font-body text-xl sm:text-2xl text-white/60 max-w-2xl border-l-4 border-red pl-6 py-2 leading-relaxed">
                {t("Hero.subheadline")}
              </p>
            </motion.div>
          </section>

          {/* Infrastructure Grid */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between group hover:border-white/20 hover:scale-105 transition-all duration-300"
                  >
                    <div>
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 text-white/60 group-hover:text-red transition-colors duration-300">
                        <Icon size={32} strokeWidth={1.5} />
                      </div>
                      
                      <h3 className="font-hindi text-4xl font-bold text-white mb-4 leading-tight pr-4 uppercase">
                        {t(`items.${item.key}.title`)}
                      </h3>
                      
                      <p className="font-body text-white/60 leading-relaxed">
                        {t(`items.${item.key}.desc`)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-20 pt-16 border-t border-white/10 flex flex-col items-center text-center"
            >
              <h2 className="font-hindi text-4xl sm:text-5xl font-bold text-white mb-8 uppercase">
                {t("ctaHeadline")}
              </h2>
              <Link 
                href="/join"
                className="group flex items-center justify-center gap-3 bg-red text-white font-mono text-sm font-bold tracking-widest uppercase px-10 py-5 rounded-full hover:bg-red/90 transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-red/20 w-full sm:w-auto"
              >
                {t("ctaButton")}
                <ArrowRight size={18} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </section>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
