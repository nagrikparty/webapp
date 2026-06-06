"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function DifferentSection() {
  const t = useTranslations('HomePageV2.Different');
  
  const cards = [
    {
      id: 1,
      title: t('card1Title'),
      desc: t('card1Desc'),
    },
    {
      id: 2,
      title: t('card2Title'),
      desc: t('card2Desc'),
    },
    {
      id: 3,
      title: t('card3Title'),
      desc: t('card3Desc'),
    }
  ];

  return (
    <section className="bg-white dark:bg-[#111111] py-32 border-t-8 border-black dark:border-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="font-hindi text-5xl sm:text-7xl font-black text-black dark:text-[#F7F7F5] uppercase tracking-tighter mb-4">
            {t('title')}
          </h2>
          <div className="w-24 h-2 bg-red"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group border-4 border-black dark:border-[#F7F7F5] p-10 bg-off-white dark:bg-[#0A0A0A] hover:bg-black hover:text-white dark:hover:bg-[#F7F7F5] dark:hover:text-black transition-all duration-300 flex flex-col justify-between min-h-[320px]"
            >
              <div>
                <span className="font-mono text-5xl font-black text-black/20 dark:text-white/20 group-hover:text-white/20 dark:group-hover:text-black/20 mb-6 block">
                  0{card.id}
                </span>
                <h3 className="font-body text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4 leading-none">
                  {card.title}
                </h3>
              </div>
              <p className="font-mono text-sm uppercase tracking-widest font-bold text-red group-hover:text-white dark:group-hover:text-black mt-8">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
