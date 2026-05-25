"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, Download, FileText, PieChart, TrendingDown } from 'lucide-react';
import { GovernanceMetric } from '@/components/ecosystem/GovernanceMetric';

export default function TransparencyPortalPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0A0A0A] font-sans selection:bg-[#0B2553] selection:text-[#F5F1E8]">
      <nav className="border-b border-black/10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <ArrowLeft size={16} />
            <span className="font-bold tracking-tight text-sm uppercase">Return to Ecosystem</span>
          </Link>
          <div className="font-mono text-xs uppercase font-bold text-[#0B2553] flex items-center gap-1">
            <Database size={14} /> PUBLIC_DATA_NODE
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        <header className="border-b-4 border-[#0A0A0A] pb-8">
          <h1 className="text-6xl font-bold tracking-tighter leading-tight mb-4">
            Transparency Portal.
          </h1>
          <p className="text-xl text-black/60 max-w-3xl leading-relaxed">
            Every rupee of public money tracked. Download raw municipal budgets, view infrastructure timelines, and verify independent candidate asset declarations.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GovernanceMetric label="Total Municipal Budget (2026)" value="₹12,400" unit="Cr" trend="up" trendValue="+8% YoY" status="neutral" />
          <GovernanceMetric label="Public Funds Tracked" value="₹4,210" unit="Cr" trend="neutral" trendValue="34% Coverage" />
          <GovernanceMetric label="Unaccounted Deficit" value="₹842" unit="Cr" trend="down" trendValue="Flagged by RTI" status="bad" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Budget Breakdown */}
          <div className="bg-white border border-black/10 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8 border-b border-black/10 pb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2"><PieChart size={24} className="text-[#0B2553]"/> Budget Allocation (Q1)</h2>
              <button className="text-[#0B2553] hover:text-[#0A0A0A] transition-colors"><Download size={20}/></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>Infrastructure & Roads</span>
                  <span className="font-mono">42%</span>
                </div>
                <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden">
                  <div className="bg-[#0B2553] h-full" style={{width: '42%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>Public Health</span>
                  <span className="font-mono">28%</span>
                </div>
                <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden">
                  <div className="bg-[#2E7D32] h-full" style={{width: '28%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>Sanitation & Waste</span>
                  <span className="font-mono">18%</span>
                </div>
                <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden">
                  <div className="bg-[#0A0A0A] h-full" style={{width: '18%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span className="flex items-center gap-1">Unaccounted / Lost <TrendingDown size={14} className="text-[#A11212]"/></span>
                  <span className="font-mono text-[#A11212]">12%</span>
                </div>
                <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden">
                  <div className="bg-[#A11212] h-full" style={{width: '12%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Open Data Directory */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <Database size={24} className="text-black/40"/>
              Open Data Directory
            </h2>
            
            <div className="bg-white border border-black/10 p-4 flex justify-between items-center group hover:border-[#0A0A0A] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="bg-black/5 p-2"><FileText size={20} className="text-black/60"/></div>
                <div>
                  <h4 className="font-bold">Ward 42 Road Repair Contracts (2025-26)</h4>
                  <p className="text-xs text-black/50 font-mono">CSV • 2.4 MB • Updated 2 days ago</p>
                </div>
              </div>
              <Download size={20} className="text-black/20 group-hover:text-[#0A0A0A] transition-colors"/>
            </div>

             <div className="bg-white border border-black/10 p-4 flex justify-between items-center group hover:border-[#0A0A0A] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="bg-black/5 p-2"><FileText size={20} className="text-black/60"/></div>
                <div>
                  <h4 className="font-bold">MLA Fund Utilization Report (City-wide)</h4>
                  <p className="text-xs text-black/50 font-mono">JSON • 1.1 MB • Updated 1 week ago</p>
                </div>
              </div>
              <Download size={20} className="text-black/20 group-hover:text-[#0A0A0A] transition-colors"/>
            </div>

            <div className="bg-[#0A0A0A] text-white p-6 mt-6">
              <h3 className="font-bold text-lg mb-2">Are you a journalist or researcher?</h3>
              <p className="text-sm text-white/60 mb-4">Request specific municipal datasets through our legal RTI team. We process requests within 14 days.</p>
              <button className="bg-white text-[#0A0A0A] px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#A11212] hover:text-white transition-colors">
                Submit Data Request
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
