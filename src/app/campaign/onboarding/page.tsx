"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckSquare, ShieldCheck, FileText, ChevronRight } from 'lucide-react';

export default function CandidateOnboardingPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0A0A0A] font-sans selection:bg-[#0A0A0A] selection:text-[#F5F1E8]">
      {/* Brutalist Top Nav */}
      <nav className="border-b border-black/10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <ArrowLeft size={16} />
            <span className="font-bold tracking-tight text-sm uppercase">Return to Ecosystem</span>
          </Link>
          <div className="font-mono text-xs uppercase font-bold text-black/40">
            System: Candidate_Intake_v1
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12 border-b-4 border-[#0A0A0A] pb-8">
          <div className="inline-block bg-[#0A0A0A] text-white px-3 py-1 text-xs font-mono font-bold uppercase mb-4">
            Phase 1: Verification
          </div>
          <h1 className="text-5xl font-bold tracking-tighter leading-tight mb-4">
            Independent Candidate <br/> Onboarding Portal.
          </h1>
          <p className="text-lg text-black/60 font-medium">
            Nagrik Party does not sell tickets. We provide civic infrastructure to capable, verified independent leaders. Prove your capability to proceed.
          </p>
        </header>

        {/* Progress Tracker */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-2 flex-1 ${step >= i ? 'bg-[#0A0A0A]' : 'bg-black/10'}`}></div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white border border-black/10 p-8 shadow-sm relative">
          
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ShieldCheck size={24} className="text-[#0B2553]" />
                Constitutional Literacy Check
              </h2>
              <p className="text-sm text-black/60 border-l-2 border-[#0B2553] pl-3">
                Traditional politicians rely on emotional manipulation. Our network requires a fundamental understanding of municipal law and civic rights.
              </p>

              <div className="space-y-4 mt-6">
                <div className="p-4 border border-black/10 hover:border-black/30 transition-colors bg-black/5 cursor-pointer">
                  <p className="font-bold mb-2">1. Under the 74th Constitutional Amendment Act, which of the following is a core responsibility of the Urban Local Body (ULB)?</p>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2"><input type="radio" name="q1" className="accent-[#0A0A0A]" /> Foreign Policy</label>
                    <label className="flex items-center gap-2"><input type="radio" name="q1" className="accent-[#0A0A0A]" /> Income Tax Collection</label>
                    <label className="flex items-center gap-2"><input type="radio" name="q1" className="accent-[#0A0A0A]" /> Public Health & Sanitation</label>
                  </div>
                </div>

                <div className="p-4 border border-black/10 hover:border-black/30 transition-colors bg-black/5 cursor-pointer">
                  <p className="font-bold mb-2">2. What is the primary function of a Ward Committee?</p>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2"><input type="radio" name="q2" className="accent-[#0A0A0A]" /> To elect the Chief Minister</label>
                    <label className="flex items-center gap-2"><input type="radio" name="q2" className="accent-[#0A0A0A]" /> To decentralize municipal governance and ensure local citizen participation</label>
                    <label className="flex items-center gap-2"><input type="radio" name="q2" className="accent-[#0A0A0A]" /> To manage state police forces</label>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="mt-6 w-full bg-[#0A0A0A] text-white py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#A11212] transition-colors"
              >
                Verify & Continue <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText size={24} className="text-[#0B2553]" />
                Public Service Record
              </h2>
              <p className="text-sm text-black/60 border-l-2 border-[#0B2553] pl-3">
                Upload verified proof of your civic engagement. This can include filed RTIs, organized public audits, legal PILs, or community organization records.
              </p>

              <div className="space-y-4 mt-6">
                 <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-black/50 mb-1">Primary Profession</label>
                  <select className="w-full border-2 border-black/10 p-3 bg-transparent outline-none focus:border-[#0A0A0A] transition-colors">
                    <option>RTI Activist</option>
                    <option>Lawyer</option>
                    <option>Educator</option>
                    <option>Medical Professional</option>
                    <option>Social Worker</option>
                    <option>Other / Independent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-black/50 mb-1">Upload Work Evidence (PDF/Links)</label>
                  <div className="border-2 border-dashed border-black/20 p-8 text-center hover:bg-black/5 transition-colors cursor-pointer">
                    <p className="text-sm font-bold text-black/60">Drag and drop verified documents here.</p>
                    <p className="text-xs text-black/40 mt-1">Max 10MB per file.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                 <button 
                  onClick={() => setStep(1)}
                  className="w-1/3 border-2 border-black/10 text-[#0A0A0A] py-4 font-bold uppercase tracking-widest hover:bg-black/5 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-[#0A0A0A] text-white py-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#A11212] transition-colors"
                >
                  Submit for Public Review <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12 space-y-4">
              <CheckSquare size={64} className="mx-auto text-[#2E7D32] mb-4" />
              <h2 className="text-3xl font-bold tracking-tight">Application Logged</h2>
              <p className="text-black/60 max-w-sm mx-auto">
                Your data has been submitted to the Nagrik Verification Node. Once background checks are complete, your profile will be published for public ward-level review.
              </p>
              <div className="font-mono text-xs text-black/40 uppercase mt-8 border-t border-black/10 pt-4">
                Reference ID: NP-CAND-8492
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
