

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, MapPin, Eye, CheckCircle2 } from 'lucide-react';

type CardVariant = 'quote' | 'data' | 'issue';

interface SocialCardProps {
  variant?: CardVariant;
  customText?: string;
}

export function SocialCardMockup({ variant = 'quote', customText }: SocialCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="w-full max-w-sm aspect-square bg-[#F5F1E8] p-6 relative overflow-hidden border border-black/10 flex flex-col justify-between"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Film Grain Overlay */}
      <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none border-[0.5px] border-black/5 m-4"></div>
      <div className="absolute inset-x-0 top-1/3 h-[0.5px] bg-black/5 pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative z-10 flex justify-between items-start font-mono text-[10px] uppercase tracking-widest text-black/60">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#A11212] rounded-full animate-pulse"></span>
          NAGRIK_SYS_01
        </div>
        <div className="flex flex-col items-end">
          <span>{new Date().toISOString().split('T')[0]}</span>
          <span>WARD_42</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col justify-center my-4">
        {variant === 'quote' && (
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-[#0A0A0A] leading-tight tracking-tight"
          >
            {customText || "SYSTEMS OVER SPECTACLE."}
          </motion.h2>
        )}
        
        {variant === 'data' && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-black/50 uppercase tracking-widest">Public Accountability</h3>
            <div className="text-5xl font-bold text-[#0A0A0A]">
              84.2<span className="text-2xl text-[#A11212]">%</span>
            </div>
            <p className="text-sm text-[#0A0A0A] font-medium max-w-[200px]">
              {customText || "Funds allocated vs actual civic deployment in Ward 42."}
            </p>
          </div>
        )}

        {variant === 'issue' && (
          <div className="bg-white/60 backdrop-blur-md border border-black/10 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#A11212]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[#A11212] mb-2 font-mono text-xs font-bold">
                <AlertCircle size={14} />
                ACTIVE_GRIEVANCE
              </div>
              <p className="text-[#0A0A0A] font-medium text-sm leading-relaxed">
                {customText || "Pothole repair delayed by 45 days on MG Road. Contractor notified 3 times."}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-black/50 font-mono">
                <span className="flex items-center gap-1"><MapPin size={12} /> MG_ROAD</span>
                <span className="flex items-center gap-1 text-[#0A0A0A]"><Eye size={12} /> 1,204</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex justify-between items-end border-t border-black/10 pt-4">
        <div className="font-bold text-sm tracking-tight text-[#0A0A0A] flex items-center gap-1.5">
          <CheckCircle2 size={16} className="text-[#A11212]" />
          NAGRIK PARTY
        </div>
        <div className="text-[9px] font-mono text-black/40 text-right leading-tight uppercase">
          CITIZEN-FIRST<br/>
          CONSTITUTIONAL<br/>
          PLATFORM
        </div>
      </footer>
    </div>
  );
}
