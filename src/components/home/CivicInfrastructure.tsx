"use client";

import { motion } from "framer-motion";
import { Building2, Activity, ShieldCheck, BookOpen, Droplet } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CivicInfrastructure() {
  const t = useTranslations('HomePageV2.CivicInfrastructure');
  const infraItems = [
    {
      title: t('wardClinics'),
      description: t('wardClinicsDesc'),
      icon: Activity,
    },
    {
      title: t('hospitals'),
      description: t('hospitalsDesc'),
      icon: Building2,
    },
    {
      title: t('womenSafety'),
      description: t('womenSafetyDesc'),
      icon: ShieldCheck,
    },
    {
      title: t('libraries'),
      description: t('librariesDesc'),
      icon: BookOpen,
    },
    {
      title: t('water'),
      description: t('waterDesc'),
      icon: Droplet,
    }
  ];

  return (
    <section className="bg-off-white dark:bg-[#0A0A0A] py-24 border-t border-black/10 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <h2 className="font-hindi text-4xl sm:text-5xl font-bold text-black dark:text-[#F7F7F5] uppercase tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="font-body text-xl text-black/70 dark:text-white/70">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {infraItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-black dark:bg-[#F7F7F5] flex items-center justify-center text-white dark:text-[#0A0A0A]">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="font-body text-xl font-bold text-black dark:text-[#F7F7F5] mb-2">{item.title}</h3>
                  <p className="font-body text-black/70 dark:text-white/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
