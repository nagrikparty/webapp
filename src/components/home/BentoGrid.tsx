"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowRight, Megaphone, HeartPulse, Shield, Construction, Users } from "lucide-react";

interface BentoProps {
  translations: {
    missionHeadline: string;
    hospital: string;
    hospitalDesc: string;
    clinic: string;
    clinicDesc: string;
    shelter: string;
    shelterDesc: string;
    oldAge: string;
    oldAgeDesc: string;
  };
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function BentoGrid({ translations }: BentoProps) {
  const missions = [
    { icon: <HeartPulse size={28} />, title: translations.hospital, desc: translations.hospitalDesc, color: "from-red/20 to-transparent" },
    { icon: <Construction size={28} />, title: translations.clinic, desc: translations.clinicDesc, color: "from-amber-500/20 to-transparent" },
    { icon: <Shield size={28} />, title: translations.shelter, desc: translations.shelterDesc, color: "from-blue-500/20 to-transparent" },
    { icon: <Users size={28} />, title: translations.oldAge, desc: translations.oldAgeDesc, color: "from-emerald-500/20 to-transparent" },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative">
      {/* Section Header */}
      <div className="max-w-5xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-4 border-b border-red/20 pb-2 w-max">
            <span className="font-mono text-xs text-red uppercase tracking-widest font-bold">OUR MISSION</span>
          </div>
          <h2 className="font-hindi text-[clamp(2.5rem,6vw,5rem)] leading-[0.85] text-white font-black tracking-tighter uppercase mb-4">
            {translations.missionHeadline}
          </h2>
        </motion.div>
      </div>

      {/* Bento Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.map((mission, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 overflow-hidden hover:border-white/20 transition-all duration-500 hover:scale-[1.02]"
          >
            <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${mission.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className="relative z-10">
              <div className="text-red mb-4">{mission.icon}</div>
              <h3 className="font-hindi text-2xl font-bold text-white uppercase tracking-tight mb-2">
                {mission.title}
              </h3>
              <p className="font-body text-sm text-white/50 leading-relaxed">
                {mission.desc}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Full-width Report CTA Card */}
        <motion.div
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={cardVariants}
          className="md:col-span-2"
        >
          <Link
            href="/report"
            className="group flex items-center justify-between bg-red/10 border border-red/20 rounded-2xl p-8 hover:bg-red/20 transition-all duration-500"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red/20 rounded-xl">
                <Megaphone className="text-red" size={28} />
              </div>
              <div>
                <h3 className="font-hindi text-2xl font-bold text-white uppercase tracking-tight">
                  Kya toot gaya hai?
                </h3>
                <p className="font-mono text-xs text-white/50 uppercase tracking-widest">
                  Report what is broken around you
                </p>
              </div>
            </div>
            <ArrowRight className="text-red group-hover:translate-x-2 transition-transform duration-300" size={24} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
