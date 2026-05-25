"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Scale, Landmark, ScrollText, ArrowUpRight } from 'lucide-react';

interface FlashcardProps {
  title: string;
  category: string;
  icon: React.ReactNode;
  content: string;
}

function ConstitutionalFlashcard({ title, category, icon, content }: FlashcardProps) {
  return (
    <div className="bg-white border border-black/10 hover:border-[#0A0A0A] transition-all p-6 relative overflow-hidden group cursor-pointer flex flex-col h-64">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-black/5 p-2 text-[#0A0A0A]">{icon}</div>
        <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-black/40">{category}</div>
      </div>
      <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-[#A11212] transition-colors">{title}</h3>
      <p className="text-sm text-black/60 font-medium line-clamp-3">{content}</p>
      
      <div className="mt-auto pt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight size={24} className="text-[#A11212]" />
      </div>
    </div>
  );
}

export default function EducationHubPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0A0A0A] font-sans selection:bg-[#A11212] selection:text-[#F5F1E8]">
      <nav className="border-b border-black/10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <ArrowLeft size={16} />
            <span className="font-bold tracking-tight text-sm uppercase">Return to Ecosystem</span>
          </Link>
          <div className="font-mono text-xs uppercase font-bold text-black/40">
            SYSTEM: CIVIC_EDUCATION
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        
        <header className="max-w-4xl border-b-4 border-[#0A0A0A] pb-8">
          <div className="inline-block bg-[#0A0A0A] text-white px-3 py-1 text-xs font-mono font-bold uppercase mb-4">
            Digital Democracy Tools
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
            Constitutional <br className="hidden md:block"/> Education Hub.
          </h1>
          <p className="text-xl text-black/70 font-medium leading-relaxed max-w-2xl">
            A decentralized movement requires an educated citizenry. Master your civic rights, learn how to audit your local municipality, and weaponize the constitution against corruption.
          </p>
        </header>

        <section>
          <div className="flex justify-between items-end mb-8 border-b border-black/10 pb-4">
            <h2 className="text-3xl font-bold">Know Your Rights</h2>
            <div className="font-mono text-xs text-black/40 uppercase">Module 01</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ConstitutionalFlashcard 
              icon={<ScrollText size={24}/>} 
              category="Transparency" 
              title="How to File a Bulletproof RTI" 
              content="The Right to Information Act is your strongest weapon. Learn the exact phrasing required to force municipal bodies to disclose road repair contracts."
            />
            <ConstitutionalFlashcard 
              icon={<Scale size={24}/>} 
              category="Civil Rights" 
              title="Police Encounter Rights" 
              content="Understand your fundamental rights when stopped, detained, or questioned by local authorities. What they can and cannot legally do."
            />
            <ConstitutionalFlashcard 
              icon={<Landmark size={24}/>} 
              category="Governance" 
              title="The 74th Amendment Act" 
              content="Why your city is broken. The 74th Amendment was supposed to give power to Ward Committees, but state governments refuse to implement it."
            />
            <ConstitutionalFlashcard 
              icon={<BookOpen size={24}/>} 
              category="Public Funds" 
              title="Reading a Municipal Budget" 
              content="How to trace the flow of money from your property taxes to the contractor hired to fix the drainage in your exact sector."
            />
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#0A0A0A] text-[#F5F1E8] p-12 flex flex-col justify-center">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Host a Digital Townhall</h2>
            <p className="text-white/60 mb-8 max-w-md">
              Skip the expensive political rallies. Nagrik Party provides the digital infrastructure for citizens to organize hyper-local public hearings with their elected representatives.
            </p>
            <button className="bg-white text-[#0A0A0A] w-max px-8 py-3 font-bold uppercase tracking-widest hover:bg-[#A11212] hover:text-white transition-colors">
              Request Platform Access
            </button>
          </div>
          
          <div className="bg-white border border-black/10 p-12">
            <h2 className="text-3xl font-bold tracking-tight mb-6 text-[#A11212]">Downloadable Assets</h2>
            <ul className="space-y-4">
              <li className="flex justify-between items-center pb-4 border-b border-black/10 hover:pl-2 transition-all cursor-pointer">
                <span className="font-bold">Constitutional Pocket Guide (Hindi/English)</span>
                <span className="font-mono text-xs text-black/40">PDF / 4MB</span>
              </li>
              <li className="flex justify-between items-center pb-4 border-b border-black/10 hover:pl-2 transition-all cursor-pointer">
                <span className="font-bold">Standard RTI Templates for Infrastructure</span>
                <span className="font-mono text-xs text-black/40">DOCX / 12KB</span>
              </li>
              <li className="flex justify-between items-center pb-4 hover:pl-2 transition-all cursor-pointer">
                <span className="font-bold">Ward Committee Formation Guide</span>
                <span className="font-mono text-xs text-black/40">PDF / 2MB</span>
              </li>
            </ul>
          </div>
        </section>

      </main>
    </div>
  );
}
