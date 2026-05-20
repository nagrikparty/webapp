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
        <main className="bg-off-white min-h-screen pt-24 sm:pt-32 pb-24">
          
          {/* Hero Section */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20 sm:mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <h1 className="font-hindi text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] text-black font-semibold mb-6 tracking-tight">
                {t("Hero.headline")}
              </h1>
              <p className="font-body text-xl sm:text-2xl text-black/70 max-w-2xl border-l-4 border-red pl-6 py-2 leading-relaxed">
                {t("Hero.subheadline")}
              </p>
            </motion.div>
          </section>

          {/* Infrastructure Grid */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
                    className="civic-card bg-white/40 backdrop-blur-md flex flex-col justify-between group hover:bg-white"
                  >
                    <div>
                      <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mb-6 text-black/80 group-hover:text-red transition-colors duration-300">
                        <Icon size={32} strokeWidth={1.5} />
                      </div>
                      
                      <h3 className="font-hindi text-4xl font-medium text-black mb-4 leading-tight pr-4">
                        {t(`items.${item.key}.title`)}
                      </h3>
                      
                      <p className="font-body text-black/60 leading-relaxed">
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
              className="mt-20 pt-16 border-t border-black/10 flex flex-col items-center text-center"
            >
              <h2 className="font-hindi text-4xl sm:text-5xl font-semibold mb-8">
                Build it with us.
              </h2>
              <Link 
                href="/join"
                className="group flex items-center justify-center gap-3 bg-red text-white font-body text-sm font-medium tracking-widest uppercase px-10 py-5 rounded-xl hover:bg-red/90 transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-red/20 w-full sm:w-auto"
              >
                Join Movement
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
