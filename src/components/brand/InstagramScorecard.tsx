

import React from 'react';
import { Activity, Map, ArrowUpRight, TrendingDown } from 'lucide-react';

export function InstagramScorecard() {
  return (
    <div className="w-full max-w-[400px] aspect-[4/5] bg-[#0A0A0A] text-[#F5F1E8] p-8 relative overflow-hidden flex flex-col font-sans border border-white/10">
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* Top Metadata */}
      <header className="relative z-10 flex justify-between items-center border-b border-white/20 pb-4 mb-6">
        <div className="font-mono text-xs text-white/50 flex items-center gap-2 tracking-widest uppercase">
          <Activity size={14} className="text-[#A11212]" />
          PUBLIC_AUDIT_01
        </div>
        <div className="font-mono text-[10px] text-white/40 border border-white/20 px-2 py-1 rounded">
          Q2_2026
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col">
        <h2 className="text-4xl font-bold leading-none tracking-tighter mb-2">
          Ward 42 <br/> Infrastructure
        </h2>
        <p className="text-sm text-white/60 mb-8 font-medium">
          Quarterly accountability tracker for allocated civic funds vs actual deployment.
        </p>

        {/* Data Bento Box */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="text-[10px] font-mono text-white/50 uppercase mb-1">Allocated</div>
            <div className="text-2xl font-bold">₹12.4<span className="text-sm text-white/50">Cr</span></div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="text-[10px] font-mono text-white/50 uppercase mb-1">Deployed</div>
            <div className="text-2xl font-bold text-[#A11212]">₹3.1<span className="text-sm text-white/50">Cr</span></div>
          </div>
        </div>

        {/* Progress Bar Area */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex-grow flex flex-col justify-center">
          <div className="flex justify-between items-end mb-3">
            <span className="text-sm font-bold">Completion Status</span>
            <span className="text-2xl font-bold font-mono">25%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-[#A11212] w-1/4"></div>
          </div>
          <div className="flex items-start gap-2 text-xs text-white/60">
            <TrendingDown size={14} className="text-[#A11212] flex-shrink-0 mt-0.5" />
            <p>Deployment is 42% behind the proposed public schedule. 6 major roads remain unattended.</p>
          </div>
        </div>
      </main>

      {/* Footer Logo */}
      <footer className="relative z-10 mt-6 pt-6 border-t border-white/20 flex justify-between items-center">
        <div className="text-lg font-bold tracking-tight">NAGRIK PARTY</div>
        <div className="flex items-center gap-1 text-[9px] font-mono text-white/40 uppercase">
          <Map size={10} /> Track Governance
          <ArrowUpRight size={10} />
        </div>
      </footer>
    </div>
  );
}
