"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Terminal, Activity, AlertTriangle, Database, ShieldAlert, GitCommit } from 'lucide-react';
import { clsx } from 'clsx';

function TerminalWindow({ title, children, alert = false, className = '' }: { title: string, children: React.ReactNode, alert?: boolean, className?: string }) {
  return (
    <div className={clsx("border flex flex-col h-full bg-[#050505]", alert ? "border-[#A11212]" : "border-[#333333]", className)}>
      <div className={clsx("flex justify-between items-center px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest", alert ? "bg-[#A11212] text-white" : "bg-[#111111] text-[#666666] border-b border-[#333333]")}>
        <span>{title}</span>
        {alert && <span className="animate-pulse flex items-center gap-1"><AlertTriangle size={12}/> LIVE</span>}
      </div>
      <div className="p-3 flex-grow overflow-auto">
        {children}
      </div>
    </div>
  );
}

export default function GovernanceTerminalPage() {
  const [logLines, setLogLines] = useState([
    "[14:02:01] SYS: CONNECTED TO MUNICIPAL LEDGER NODE-42",
    "[14:02:05] AUDIT: PULLING CONTRACTOR REGISTRY DATA...",
    "[14:02:09] WARN: DISCREPANCY DETECTED IN WARD 14 FUND ALLOCATION"
  ]);

  // Simulate streaming logs
  useEffect(() => {
    const interval = setInterval(() => {
      const msgs = [
        "AUDIT: VERIFIED ROAD REPAIR IN WARD 7.",
        "SYS: NEW RTI FILED (REF-8492-B).",
        "WARN: CONTRACTOR 'APEX BUILDERS' FLAGGED FOR DELAY.",
        "DATA: MUNICIPAL BUDGET Q3 REPORT SYNCED.",
        "ALERT: GRIEVANCE SPIKE IN WARD 42 (WATER CONTAMINATION)."
      ];
      const newMsg = `[${new Date().toLocaleTimeString('en-US', { hour12: false })}] ${msgs[Math.floor(Math.random() * msgs.length)]}`;
      setLogLines(prev => [...prev.slice(-15), newMsg]);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-[#000000] text-[#00FF41] font-mono selection:bg-[#00FF41] selection:text-black overflow-hidden flex flex-col">
      
      {/* Top Nav / Status Bar */}
      <nav className="h-10 border-b border-[#333333] bg-[#0A0A0A] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[#666666] hover:text-[#00FF41] transition-colors flex items-center gap-2 text-xs font-bold uppercase">
            <ArrowLeft size={14} /> EXIT TERMINAL
          </Link>
          <div className="text-[#00FF41] text-xs font-bold flex items-center gap-2 border-l border-[#333333] pl-4">
            <Terminal size={14} /> NP_GOV_OS_v2.0.4
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-[#666666]">
           <span className="flex items-center gap-1"><Database size={12}/> DATA NODE: SYNCED</span>
           <span className="flex items-center gap-1 text-[#A11212]"><Activity size={12}/> ENCRYPTED CONNECTION</span>
        </div>
      </nav>

      <main className="flex-grow p-2 grid grid-cols-12 grid-rows-12 gap-2 h-[calc(100vh-2.5rem)]">
        
        {/* Left Col - Ledger Stream */}
        <TerminalWindow title="LIVE AUDIT STREAM" className="col-span-3 row-span-12">
           <div className="space-y-1 text-xs opacity-80">
              {logLines.map((line, i) => (
                <div key={i} className={clsx(
                  "break-all",
                  line.includes('WARN') && "text-[#FFB000]",
                  line.includes('ALERT') && "text-[#A11212] font-bold"
                )}>
                  {line}
                </div>
              ))}
              <div className="animate-pulse">_</div>
           </div>
        </TerminalWindow>

        {/* Mid Col Top - Budget Heatmap */}
        <TerminalWindow title="Municipal Budget Real-Time Allocation (Cr)" className="col-span-6 row-span-7">
           <div className="flex flex-col h-full justify-center space-y-4">
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span>INFRASTRUCTURE DEPLOYED</span>
                 <span>₹842 / ₹1,200</span>
               </div>
               <div className="h-2 w-full bg-[#111111]">
                 <div className="h-full bg-[#00FF41]" style={{width: '70%'}}></div>
               </div>
             </div>
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span>SANITATION (FLAGGED DEFICIT)</span>
                 <span className="text-[#A11212]">₹140 / ₹500</span>
               </div>
               <div className="h-2 w-full bg-[#111111]">
                 <div className="h-full bg-[#A11212]" style={{width: '28%'}}></div>
               </div>
             </div>
             <div>
               <div className="flex justify-between text-xs mb-1">
                 <span>PUBLIC HEALTH GRANTS</span>
                 <span>₹310 / ₹350</span>
               </div>
               <div className="h-2 w-full bg-[#111111]">
                 <div className="h-full bg-[#00FF41]" style={{width: '88%'}}></div>
               </div>
             </div>
           </div>
        </TerminalWindow>

        {/* Mid Col Bottom - Whistleblower Matrix */}
        <TerminalWindow title="Whistleblower Intake Node" alert className="col-span-6 row-span-5 text-[#FFB000]">
           <div className="flex items-start gap-4">
             <ShieldAlert size={48} className="text-[#A11212] shrink-0" />
             <div>
               <h3 className="text-sm font-bold text-[#A11212] mb-2">CRITICAL ESCALATION PROTOCOL</h3>
               <p className="text-xs text-[#FFB000]/80 mb-4 leading-relaxed">
                 This node is for verified public officers and contractors to submit anonymous evidence of municipal corruption, tender fixing, or infrastructure neglect. Traffic is encrypted.
               </p>
               <div className="flex gap-2">
                 <input type="text" placeholder="ENTER SECURE KEY" className="bg-[#111111] border border-[#333333] px-2 py-1 text-xs text-[#00FF41] outline-none focus:border-[#A11212] w-48" />
                 <button className="bg-[#A11212] text-white px-4 py-1 text-xs font-bold hover:bg-[#FF0000] transition-colors">DECRYPT UPLOAD</button>
               </div>
             </div>
           </div>
        </TerminalWindow>

        {/* Right Col - Contractor DB */}
        <TerminalWindow title="Contractor Transparency DB" className="col-span-3 row-span-12">
          <div className="space-y-4">
            <div className="border border-[#333333] p-2 hover:bg-[#111111] transition-colors cursor-pointer">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold">APEX BUILDERS LTD</span>
                <span className="text-[#A11212] font-bold">RATING: D</span>
              </div>
              <div className="text-[10px] text-[#666666] mb-2">Active Tenders: 14 | Open Grievances: 82</div>
              <div className="flex items-center gap-1 text-[10px] text-[#FFB000]">
                <GitCommit size={10}/> FLAG: 45 Days Past Deadline (Ward 14)
              </div>
            </div>

            <div className="border border-[#333333] p-2 hover:bg-[#111111] transition-colors cursor-pointer">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold">METRO CIVIL ENG</span>
                <span className="text-[#00FF41] font-bold">RATING: A</span>
              </div>
              <div className="text-[10px] text-[#666666] mb-2">Active Tenders: 4 | Open Grievances: 2</div>
              <div className="flex items-center gap-1 text-[10px] text-[#00FF41]">
                <GitCommit size={10}/> All projects currently verified.
              </div>
            </div>

             <div className="border border-[#333333] p-2 hover:bg-[#111111] transition-colors cursor-pointer">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold">V-SQUARE SANITATION</span>
                <span className="text-[#A11212] font-bold">RATING: F</span>
              </div>
              <div className="text-[10px] text-[#666666] mb-2">Active Tenders: 2 | Open Grievances: 140</div>
              <div className="flex items-center gap-1 text-[10px] text-[#A11212]">
                <GitCommit size={10}/> BLACKLIST PROCEEDING INITIATED
              </div>
            </div>
          </div>
        </TerminalWindow>

      </main>
    </div>
  );
}
