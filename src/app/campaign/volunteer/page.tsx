"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckSquare, ShieldCheck, FileText, ChevronRight, Target, Users, MapPin } from 'lucide-react';
import { clsx } from 'clsx';

interface TaskProps {
  id: string;
  title: string;
  type: 'Audit' | 'Outreach' | 'Digital';
  ward: string;
  urgency: 'high' | 'normal';
}

function VolunteerTask({ id, title, type, ward, urgency }: TaskProps) {
  return (
    <div className="bg-white border border-black/10 p-4 hover:border-[#0A0A0A] transition-colors flex justify-between items-center group cursor-pointer">
      <div>
        <div className="flex items-center gap-2 mb-1">
           <span className={clsx(
             "text-[10px] font-mono uppercase font-bold px-2 py-0.5",
             type === 'Audit' ? 'bg-[#0B2553]/10 text-[#0B2553]' : 
             type === 'Outreach' ? 'bg-[#2E7D32]/10 text-[#2E7D32]' : 
             'bg-black/5 text-black/60'
           )}>
             {type}
           </span>
           {urgency === 'high' && <span className="text-[10px] font-mono uppercase font-bold text-[#A11212]">URGENT</span>}
        </div>
        <h4 className="font-bold text-lg leading-tight group-hover:text-[#A11212] transition-colors">{title}</h4>
        <div className="text-xs text-black/50 font-mono mt-1 flex items-center gap-1">
          <MapPin size={12}/> Ward {ward} | TSK-{id}
        </div>
      </div>
      <ChevronRight size={20} className="text-black/20 group-hover:text-[#0A0A0A] transition-colors" />
    </div>
  );
}

export default function VolunteerOperationsPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0A0A0A] font-sans selection:bg-[#0A0A0A] selection:text-[#F5F1E8]">
      {/* Brutalist Top Nav */}
      <nav className="border-b border-black/10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <ArrowLeft size={16} />
            <span className="font-bold tracking-tight text-sm uppercase">Return to Ecosystem</span>
          </Link>
          <div className="font-mono text-xs uppercase font-bold text-black/40">
            Node: Ward_42_Operations
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        <header className="mb-12 border-b-2 border-black/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-5xl font-bold tracking-tighter leading-tight mb-2">
              Civic Action Hub.
            </h1>
            <p className="text-xl text-black/60 max-w-2xl">
              Volunteer operations. No rallies. No pamphlet drops. We organize hyper-local civic audits, constitutional education, and digital accountability tracking.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-black/5 px-4 py-2 text-center">
              <div className="text-2xl font-bold font-mono">142</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-black/50">Active Auditors</div>
            </div>
            <div className="bg-[#2E7D32]/10 px-4 py-2 text-center">
              <div className="text-2xl font-bold font-mono text-[#2E7D32]">84</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#2E7D32]">Tasks Completed</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Task Feed */}
          <div className="lg:col-span-2 space-y-4">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Target size={24} className="text-[#A11212]" />
                Open Operations
              </h2>
              <div className="font-mono text-xs text-black/50">FILTER: WARD 42</div>
            </div>

            <div className="space-y-3">
              <VolunteerTask id="1042" title="Verify Pothole Repair Status on MG Road" type="Audit" ward="42" urgency="high" />
              <VolunteerTask id="1043" title="Distribute RTI Filing Guide to Sector 4 RWA" type="Outreach" ward="42" urgency="normal" />
              <VolunteerTask id="1044" title="Map unresolved drainage issues near Metro Station" type="Audit" ward="42" urgency="high" />
              <VolunteerTask id="1045" title="Amplify Ward 42 delayed fund utilization scorecard" type="Digital" ward="42" urgency="normal" />
              <VolunteerTask id="1046" title="Attend Municipal Budget Hearing (Digital Townhall)" type="Outreach" ward="All" urgency="high" />
            </div>
          </div>

          {/* Sidebar / Leaderboard */}
          <div className="space-y-8">
            
            <div className="bg-white border border-black/10 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Users size={18} className="text-black/40"/>
                Your Civic Rank
              </h3>
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-black/10">
                <div className="w-12 h-12 bg-[#0A0A0A] text-white flex items-center justify-center font-bold font-mono text-lg">
                  L2
                </div>
                <div>
                  <div className="font-bold">Citizen Auditor</div>
                  <div className="text-xs text-black/50 font-mono">14 Tasks Completed</div>
                </div>
              </div>
              <button className="w-full text-xs font-bold uppercase tracking-widest bg-black/5 py-2 hover:bg-black/10 transition-colors">
                View Full Network Log
              </button>
            </div>

            <div className="bg-[#0A0A0A] text-white p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-20">
                <ShieldCheck size={64} />
               </div>
               <h3 className="font-bold text-lg mb-2 relative z-10">Constitutional Bootcamps</h3>
               <p className="text-sm text-white/60 mb-6 relative z-10">Next session: "How to read a municipal budget and track allocated funds."</p>
               <button className="bg-white text-[#0A0A0A] w-full py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#A11212] hover:text-white transition-colors relative z-10">
                 Register (Virtual)
               </button>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
