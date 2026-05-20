"use client";

import { motion, Variants } from "framer-motion";
import { Building2, Stethoscope, Home, Activity } from "lucide-react";

interface Props {
  translations: {
    headline: string;
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

export default function InfrastructureMissionSection({ translations }: Props) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const items = [
    {
      title: translations.hospital,
      desc: translations.hospitalDesc,
      icon: <Building2 strokeWidth={1.5} size={32} className="text-black/80 group-hover:text-red transition-colors" />
    },
    {
      title: translations.clinic,
      desc: translations.clinicDesc,
      icon: <Stethoscope strokeWidth={1.5} size={32} className="text-black/80 group-hover:text-red transition-colors" />
    },
    {
      title: translations.shelter,
      desc: translations.shelterDesc,
      icon: <Home strokeWidth={1.5} size={32} className="text-black/80 group-hover:text-red transition-colors" />
    },
    {
      title: translations.oldAge,
      desc: translations.oldAgeDesc,
      icon: <Activity strokeWidth={1.5} size={32} className="text-black/80 group-hover:text-red transition-colors" />
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 max-w-2xl">
          <h2 className="font-hindi text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-black font-semibold tracking-wide">
            {translations.headline}
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {items.map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="group relative bg-white/45 backdrop-blur-md border border-black/10 rounded-[2rem] p-8 flex flex-col justify-between min-h-[320px] transition-all duration-500 hover:bg-white hover:border-black/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="font-hindi text-3xl font-medium text-black leading-tight mb-3 pr-4">
                  {item.title}
                </h3>
              </div>

              <div className="relative z-10 pt-6 border-t border-black/5">
                <p className="font-body text-sm text-black/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
