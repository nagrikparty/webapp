"use client";

import { motion } from "framer-motion";
import { Users, PhoneCall, Calendar, Flame } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ActionNetwork() {
  const t = useTranslations('HomePageV2.ActionNetwork');
  const steps = [
    {
      title: t('wardCaptains'),
      description: t('wardCaptainsDesc'),
      icon: Users,
    },
    {
      title: t('issueEscalation'),
      description: t('issueEscalationDesc'),
      icon: Flame,
    },
    {
      title: t('weeklyMeetings'),
      description: t('weeklyMeetingsDesc'),
      icon: Calendar,
    },
    {
      title: t('directAction'),
      description: t('directActionDesc'),
      icon: PhoneCall,
    }
  ];

  return (
    <section className="bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-hindi text-4xl sm:text-5xl font-bold uppercase tracking-tight mb-4 text-white">
                {t('title')}
              </h2>
              <p className="font-body text-lg text-white/70 mb-8 border-l-2 border-red pl-4">
                {t('subtitle')}
              </p>
            </motion.div>
          </div>

          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="border border-white/10 p-6 bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <Icon size={24} className="text-red mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-body text-xl font-bold mb-2">{step.title}</h3>
                    <p className="font-body text-white/60 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
