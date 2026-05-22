"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Camera, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getReportCount } from "@/actions";

interface Props {
  translations: {
    headline: string;
    desc: string;
    cta: string;
    statusActive: string;
    statusReports: string;
    statusReportsVal: string;
  };
}

export default function NagrikReportCTA({ translations }: Props) {
  const [reportCount, setReportCount] = useState<string>(translations.statusReportsVal);

  useEffect(() => {
    getReportCount().then((count) => {
      if (count > 0) {
        setReportCount(new Intl.NumberFormat('en-IN').format(count));
      }
    });
  }, []);

  return (
    <section className="w-full py-24 sm:py-32 bg-off-white relative overflow-hidden">
      {/* Abstract document texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white border border-black/10 rounded-[2rem] p-6 sm:p-12 md:p-16 lg:p-20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden relative">
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red/5 rounded-bl-full pointer-events-none"></div>
          <div className="absolute -left-12 -bottom-12 w-48 h-48 border border-black/5 rounded-full pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <div className="flex flex-col items-start relative z-10">
              <div className="flex items-center gap-2 mb-6 bg-red/10 text-red px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse"></span>
                {translations.statusActive}
              </div>
              
              <h2 className="font-hindi text-[clamp(3rem,6vw,5rem)] leading-[0.9] text-black font-semibold mb-6">
                {translations.headline}
              </h2>
              
              <p className="font-body text-black/60 text-lg sm:text-xl max-w-md leading-relaxed mb-10">
                {translations.desc}
              </p>

              <Link 
                href="/report"
                className="group flex items-center justify-center gap-3 bg-charcoal text-white font-body text-sm font-medium tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-black transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/10 w-full sm:w-auto"
              >
                <Camera size={18} strokeWidth={2} />
                {translations.cta}
                <ArrowRight size={18} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Simulated Live Feed UI */}
            <div className="relative z-10 hidden sm:block">
              <div className="bg-off-white rounded-2xl border border-black/5 p-6 relative">
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-white px-4 py-1 border border-black/10 rounded-full flex flex-col items-center shadow-sm">
                  <span className="font-mono text-[9px] text-black/40 tracking-[0.2em]">{translations.statusReports}</span>
                  <span className="font-mono text-lg text-black font-bold">{reportCount}</span>
                </div>

                <div className="space-y-4 pt-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15, duration: 0.5 }}
                      className="bg-white p-4 rounded-xl border border-black/5 flex items-start gap-4"
                    >
                      <div className="w-12 h-12 bg-black/5 rounded-lg shrink-0 flex items-center justify-center">
                        <Camera size={16} className="text-black/30" />
                      </div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-2 bg-black/10 rounded-full w-1/3"></div>
                        <div className="h-2 bg-black/5 rounded-full w-3/4"></div>
                        <div className="h-2 bg-black/5 rounded-full w-1/2"></div>
                      </div>
                      <span className="font-mono text-[9px] text-black/30 mt-1">
                        {i * 12}M AGO
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
