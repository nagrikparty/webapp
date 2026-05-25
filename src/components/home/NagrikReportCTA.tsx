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
              <div className="flex items-center gap-2 mb-6 bg-black text-white px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold">
                Official Submission
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

            {/* Civic Action Statement */}
            <div className="relative z-10 hidden lg:block border-l-4 border-black pl-8">
              <span className="font-mono text-[10px] text-black/60 tracking-[0.2em] uppercase block mb-4">Accountability Mechanism</span>
              <p className="font-body text-xl font-bold leading-relaxed">
                By submitting a documented failure, you mandate an official response from local authorities. This platform serves as a public ledger, preventing issues from being hidden or ignored by bureaucracy.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
