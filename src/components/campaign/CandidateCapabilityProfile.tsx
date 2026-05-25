"use client";

import React from 'react';
import { MapPin, Briefcase, FileText, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';

interface CandidateProfileProps {
  name: string;
  profession: string;
  ward: string;
  criminalRecord: 'clean' | 'pending' | 'convicted';
  manifestoStatus: 'published' | 'drafting';
  verifiedWorkCount: number;
}

export function CandidateCapabilityProfile({ name, profession, ward, criminalRecord, manifestoStatus, verifiedWorkCount }: CandidateProfileProps) {
  return (
    <div className="bg-white border-2 border-black/10 hover:border-[#0A0A0A] transition-colors p-6 relative overflow-hidden flex flex-col font-sans">
      {/* Brutalist Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#0A0A0A]"></div>
      
      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-[#0A0A0A] leading-tight mb-1">{name}</h3>
          <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-black/50">
            <Briefcase size={14} /> {profession}
          </div>
        </div>
        <div className="bg-black/5 px-3 py-1 font-mono text-xs uppercase font-bold tracking-widest text-[#0A0A0A] border border-black/10">
          Ward {ward}
        </div>
      </div>

      {/* Verification Data Grid */}
      <div className="grid grid-cols-2 gap-px bg-black/10 border border-black/10 mb-6">
        <div className="bg-white p-3 flex flex-col gap-1">
          <span className="text-[9px] font-mono uppercase text-black/50">Criminal Record</span>
          <div className={clsx(
            "text-xs font-bold uppercase flex items-center gap-1",
            criminalRecord === 'clean' ? 'text-[#2E7D32]' : 'text-[#A11212]'
          )}>
            {criminalRecord === 'clean' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            {criminalRecord}
          </div>
        </div>
        
        <div className="bg-white p-3 flex flex-col gap-1">
          <span className="text-[9px] font-mono uppercase text-black/50">Ward Manifesto</span>
          <div className={clsx(
            "text-xs font-bold uppercase flex items-center gap-1",
            manifestoStatus === 'published' ? 'text-[#0B2553]' : 'text-black/50'
          )}>
            <BookOpen size={14} />
            {manifestoStatus}
          </div>
        </div>
        
        <div className="col-span-2 bg-white p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-black/40" />
            <span className="text-sm font-bold">Verified Public Work Log</span>
          </div>
          <span className="font-mono text-lg font-bold">{verifiedWorkCount}</span>
        </div>
      </div>

      {/* Action Button */}
      <button className="mt-auto w-full bg-[#0A0A0A] text-[#F5F1E8] py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#A11212] transition-colors">
        View Audit Profile
      </button>
    </div>
  );
}
