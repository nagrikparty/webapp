

import React from 'react';
import { AlertTriangle, Clock, Target, FileText } from 'lucide-react';

export function InstagramGrievance() {
  return (
    <div className="w-full max-w-[400px] aspect-square bg-[#F5F1E8] text-[#0A0A0A] p-6 relative overflow-hidden flex flex-col font-sans border border-black/10">
      
      {/* Background Graphic/Texture */}
      <div className="absolute inset-0 opacity-5 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      {/* Brutalist Alert Header */}
      <div className="relative z-10 flex items-start gap-3 border-b-2 border-[#0A0A0A] pb-4 mb-4">
        <div className="bg-[#A11212] text-white p-2 flex items-center justify-center">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h2 className="text-[10px] font-mono font-bold tracking-widest text-[#A11212] uppercase mb-0.5">
            Public Grievance Escalation
          </h2>
          <div className="text-xl font-bold leading-none tracking-tight">
            Infrastructure Failure
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex flex-col gap-3">
        {/* The Issue */}
        <div className="bg-white border border-black/10 p-3 shadow-sm relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0A0A0A]"></div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-black/50 uppercase mb-1">
            <Target size={12} /> Location
          </div>
          <p className="font-bold text-lg leading-tight">MG Road Waterlogging, Sector 4</p>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-black/10 p-3 shadow-sm">
            <div className="flex items-center gap-2 text-[10px] font-mono text-black/50 uppercase mb-1">
              <Clock size={12} /> Unresolved For
            </div>
            <div className="text-xl font-bold text-[#A11212]">45 Days</div>
          </div>
          
          <div className="bg-white border border-black/10 p-3 shadow-sm">
            <div className="flex items-center gap-2 text-[10px] font-mono text-black/50 uppercase mb-1">
              <FileText size={12} /> Complaints
            </div>
            <div className="text-xl font-bold">1,204</div>
          </div>
        </div>

        {/* Action/Details */}
        <div className="mt-auto bg-[#0A0A0A] text-[#F5F1E8] p-4 text-sm font-medium leading-snug">
          "Despite multiple formal complaints to the local ward officer, no contractor has been assigned. Funds remain unutilized."
        </div>
      </main>

      {/* Footer System Strip */}
      <footer className="relative z-10 mt-4 flex justify-between items-end border-t border-black/20 pt-3">
        <div className="font-bold tracking-tight text-sm">NAGRIK PARTY</div>
        <div className="text-[8px] font-mono text-black/50 uppercase text-right leading-tight">
          Systems Over Spectacle.<br/>
          Ticket #4492-A
        </div>
      </footer>
    </div>
  );
}
