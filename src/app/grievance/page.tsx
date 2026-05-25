"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, UploadCloud, AlertTriangle, ShieldAlert, Cpu } from 'lucide-react';
import { IssueTrackerCard } from '@/components/ecosystem/IssueTrackerCard';

export default function GrievanceSystemPage() {
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAIAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0A0A0A] font-sans selection:bg-[#A11212] selection:text-white">
      <nav className="border-b border-black/10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <ArrowLeft size={16} />
            <span className="font-bold tracking-tight text-sm uppercase">Return to Ecosystem</span>
          </Link>
          <div className="font-mono text-xs uppercase font-bold text-[#A11212] flex items-center gap-2">
            <span className="w-2 h-2 bg-[#A11212] rounded-full animate-pulse"></span>
            SYSTEM: PUBLIC_GRIEVANCE
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12 border-b-4 border-[#0A0A0A] pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-5xl font-bold tracking-tighter leading-tight mb-2">
              Public Grievance <br/> Escalation System.
            </h1>
            <p className="text-xl text-black/60 max-w-2xl font-medium">
              Log infrastructure failures. Track resolution. Hold contractors accountable.
            </p>
          </div>
          <div className="bg-[#A11212] text-white p-4 font-mono text-xs uppercase tracking-widest text-right">
            <div>Average Resolution Time</div>
            <div className="text-2xl font-bold font-sans tracking-tight">14 Days</div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Form Side */}
          <div>
            <div className="bg-white border border-black/10 p-8 shadow-sm relative overflow-hidden">
               {/* Grid background */}
              <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className="relative z-10 flex items-center gap-2 text-2xl font-bold mb-6 pb-4 border-b border-black/10">
                <ShieldAlert size={28} className="text-[#A11212]" />
                Log New Issue
              </div>

              {step === 1 && (
                <div className="space-y-6 relative z-10">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-black/50 mb-2 flex items-center gap-1"><MapPin size={14}/> Precise Location</label>
                    <input type="text" placeholder="e.g. Sector 4, Opposite Metro Pillar 42" className="w-full border-2 border-black/10 p-3 bg-transparent outline-none focus:border-[#0A0A0A] transition-colors font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-black/50 mb-2">Describe the Infrastructure Failure</label>
                    <textarea rows={4} placeholder="Clear, factual description of the issue..." className="w-full border-2 border-black/10 p-3 bg-transparent outline-none focus:border-[#0A0A0A] transition-colors"></textarea>
                  </div>
                  <button onClick={() => setStep(2)} className="w-full bg-[#0A0A0A] text-white py-4 font-bold uppercase tracking-widest hover:bg-[#A11212] transition-colors">
                    Next: Upload Evidence
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 relative z-10">
                  <div className="border-2 border-dashed border-black/20 p-12 text-center hover:bg-black/5 transition-colors cursor-pointer flex flex-col items-center">
                    <UploadCloud size={48} className="text-black/20 mb-4" />
                    <p className="text-sm font-bold text-black/60 mb-1">Upload Photographic Evidence</p>
                    <p className="text-xs text-black/40 font-mono">JPG/PNG. Must include metadata.</p>
                  </div>
                  
                  {analyzing ? (
                     <div className="bg-[#0B2553]/10 text-[#0B2553] p-4 flex items-center gap-3 font-mono text-sm font-bold animate-pulse">
                       <Cpu size={20} /> AI CATEGORIZING ISSUE...
                     </div>
                  ) : (
                    <div className="flex gap-4">
                      <button onClick={() => setStep(1)} className="w-1/3 border-2 border-black/10 text-[#0A0A0A] py-4 font-bold uppercase tracking-widest hover:bg-black/5 transition-colors">
                        Back
                      </button>
                      <button onClick={handleAIAnalyze} className="w-2/3 bg-[#0A0A0A] text-white py-4 font-bold uppercase tracking-widest hover:bg-[#0B2553] transition-colors flex items-center justify-center gap-2">
                        <Cpu size={18} /> Analyze & Submit
                      </button>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 relative z-10">
                   <div className="bg-[#2E7D32]/10 text-[#2E7D32] p-4 font-mono text-sm font-bold border border-[#2E7D32]/20 mb-6">
                     SYSTEM: ISSUE LOGGED SUCCESSFULLY
                   </div>

                   <div className="space-y-2">
                     <div className="flex justify-between text-sm border-b border-black/10 pb-2">
                       <span className="font-bold text-black/50">Tracking ID</span>
                       <span className="font-mono font-bold">NP-8493-A</span>
                     </div>
                     <div className="flex justify-between text-sm border-b border-black/10 pb-2">
                       <span className="font-bold text-black/50">AI Category</span>
                       <span className="font-mono font-bold text-[#A11212]">CRITICAL INFRASTRUCTURE (ROADS)</span>
                     </div>
                     <div className="flex justify-between text-sm pb-2">
                       <span className="font-bold text-black/50">Assigned Node</span>
                       <span className="font-mono font-bold">Ward 42 Citizen Auditor Team</span>
                     </div>
                   </div>

                   <button onClick={() => setStep(1)} className="w-full bg-[#0A0A0A] text-white py-4 font-bold uppercase tracking-widest hover:bg-[#2E7D32] transition-colors mt-4">
                    Log Another Issue
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Public Ledger Side */}
          <div>
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Public Grievance Ledger</h2>
              <div className="font-mono text-xs text-black/50 flex items-center gap-1"><AlertTriangle size={14}/> LIVE FEED</div>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
              <IssueTrackerCard id="8492" category="INFRASTRUCTURE" title="Massive Pothole causing accidents" location="Ward 42, Sector 4" daysOpen={14} status="escalated" />
              <IssueTrackerCard id="8491" category="SANITATION" title="Drainage Blockage near Metro" location="Ward 42, Market" daysOpen={2} status="resolved" />
              <IssueTrackerCard id="8488" category="WATER" title="Water contamination reported" location="Ward 14, Phase 2" daysOpen={1} status="unresolved" />
              <IssueTrackerCard id="8485" category="STREETLIGHTS" title="Entire street dark for 3 days" location="Ward 7, Main Road" daysOpen={3} status="unresolved" />
              <IssueTrackerCard id="8480" category="INFRASTRUCTURE" title="Broken pavement" location="Ward 42, Park" daysOpen={5} status="resolved" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
