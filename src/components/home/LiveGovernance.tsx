"use client";

import { motion } from "framer-motion";
import { FileText, Users, Building, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LiveGovernance() {
  const t = useTranslations('HomePageV2.LiveGovernance');
  const blocks = [
    {
      id: 1,
      title: t('wardAssemblies'),
      description: t('wardAssembliesDesc'),
      icon: Users,
    },
    {
      id: 2,
      title: t('openLedgers'),
      description: t('openLedgersDesc'),
      icon: FileText,
    },
    {
      id: 3,
      title: t('accountableReps'),
      description: t('accountableRepsDesc'),
      icon: Building,
    },
    {
      id: 4,
      title: t('citizenGrievance'),
      description: t('citizenGrievanceDesc'),
      icon: Shield,
    }
  ];

  return (
    <section className="bg-white dark:bg-[#111111] py-24 border-t border-black/10 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-black/10 dark:border-white/10 pb-6">
          <div>
            <h2 className="font-hindi text-4xl sm:text-5xl font-bold text-black dark:text-[#F7F7F5] uppercase tracking-tight mb-2">
              {t('title')}
            </h2>
            <p className="font-mono text-sm tracking-widest text-black/50 dark:text-white/50 uppercase">
              {t('subtitle')}
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <span className="font-mono text-xs uppercase tracking-widest font-bold text-black dark:text-[#F7F7F5] border border-black dark:border-[#F7F7F5] px-4 py-2">
              {t('badge')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blocks.map((block, index) => {
            const Icon = block.icon;
            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-black dark:border-white/10 p-8 bg-off-white dark:bg-[#0A0A0A] text-black dark:text-[#F7F7F5] hover:bg-black dark:hover:bg-[#1A1A1A] hover:text-white dark:hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-black dark:bg-white text-white dark:text-black group-hover:bg-white dark:group-hover:bg-[#0A0A0A] group-hover:text-black dark:group-hover:text-white transition-colors">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-body text-2xl font-bold uppercase tracking-tight">{block.title}</h3>
                </div>
                <p className="font-body text-lg opacity-80 leading-relaxed">
                  {block.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
