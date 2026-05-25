import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Activity, ShieldAlert, BarChart3, Users, Building2 } from 'lucide-react';
import { GovernanceMetric } from '@/components/ecosystem/GovernanceMetric';
import { IssueTrackerCard } from '@/components/ecosystem/IssueTrackerCard';

export const metadata = {
  title: 'Nagrik Party | Civic Operating System',
  description: 'A constitutional governance platform supporting accountable independent public representatives.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0A0A0A] font-sans">
      {/* Brutalist Top Nav */}
      <nav className="border-b border-black/10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-[#0A0A0A] rounded-sm"></div>
            <span className="font-bold tracking-tight text-lg">NAGRIK PARTY</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase font-semibold">
            <Link href="/ward/42" className="hover:text-[#A11212] transition-colors">Ward Data</Link>
            <Link href="/representative/1" className="hover:text-[#A11212] transition-colors">Accountability</Link>
            <Link href="/transparency" className="hover:text-[#A11212] transition-colors">Transparency</Link>
            <Link href="/grievance" className="bg-[#0A0A0A] text-[#F5F1E8] px-4 py-2 hover:bg-[#A11212] transition-colors">Report Issue</Link>
          </div>
        </div>
      </nav>

      {/* Live Audit Strip */}
      <div className="bg-[#0A0A0A] text-white/80 py-2 overflow-hidden border-y border-white/10 font-mono text-[10px] uppercase tracking-widest whitespace-nowrap">
        <div className="animate-[slide_30s_linear_infinite] inline-block">
          <span className="mx-4 text-[#A11212]">● NEW GRIEVANCE: WARD 42 DRAINAGE</span>
          <span className="mx-4 text-[#2E7D32]">● RESOLVED: MG ROAD POTHOLES (3 DAYS)</span>
          <span className="mx-4">● RTI FILED: MUNICIPAL BUDGET 2026</span>
          <span className="mx-4 text-[#A11212]">● ESCALATED: WARD 14 STREETLIGHTS (45 DAYS OPEN)</span>
          <span className="mx-4 text-[#2E7D32]">● RESOLVED: WARD 7 WATER SUPPLY (1 DAY)</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        
        {/* Hero Section */}
        <section className="max-w-5xl">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
            Democracy should function like <br className="hidden md:block"/>
            <span className="text-[#A11212]">accountable public infrastructure.</span>
          </h1>
          <p className="text-xl md:text-2xl text-black/70 font-medium max-w-3xl leading-relaxed">
            Nagrik Party is a constitutional governance platform supporting accountable independent public representatives. No personality cults. No ticket mafias. Just civic intelligence and measurable public work.
          </p>
        </section>

        {/* High-Level Ecosystem Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GovernanceMetric 
            label="Active Public Grievances" 
            value="14,204" 
            trend="up" 
            trendValue="+12% this week"
            status="bad"
          />
          <GovernanceMetric 
            label="Issues Resolved (30d)" 
            value="8,492" 
            trend="up" 
            trendValue="Faster than average"
            status="good"
          />
          <GovernanceMetric 
            label="Verified Independents" 
            value="142" 
            trend="neutral"
            trendValue="Across 4 states"
          />
          <GovernanceMetric 
            label="Public Audits Running" 
            value="24" 
            trend="up"
            trendValue="Live right now"
            status="neutral"
          />
        </section>

        {/* The Civic OS Grid (Bento Box) */}
        <section>
          <div className="flex justify-between items-end border-b-2 border-black/10 pb-4 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Civic Operating System</h2>
            <Link href="#" className="font-mono text-xs uppercase font-bold flex items-center gap-1 hover:text-[#A11212]">
              Explore Full Ecosystem <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Feature 1: Issue Reporting */}
            <div className="md:col-span-2 bg-white border border-black/10 p-8 flex flex-col justify-between group hover:border-[#0A0A0A] transition-colors relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
              <div className="relative z-10 max-w-sm mb-12">
                <ShieldAlert size={32} className="text-[#A11212] mb-6" />
                <h3 className="text-2xl font-bold mb-3">Public Grievance System</h3>
                <p className="text-black/60 font-medium">Report ward-level infrastructure failures. Track escalation workflows and hold contractors publicly accountable.</p>
              </div>
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <IssueTrackerCard 
                  id="8492" category="INFRASTRUCTURE" title="MG Road Massive Pothole" 
                  location="Ward 42, Sector 4" daysOpen={14} status="escalated" 
                />
                <IssueTrackerCard 
                  id="8491" category="SANITATION" title="Drainage Blockage" 
                  location="Ward 42, Market" daysOpen={2} status="resolved" 
                />
              </div>
            </div>

            {/* Feature 2: Accountability Tracker */}
            <Link href="/representative/1" className="bg-[#0A0A0A] text-[#F5F1E8] border border-black/10 p-8 flex flex-col justify-between group hover:bg-[#111] transition-colors">
              <div>
                <BarChart3 size={32} className="text-white/50 mb-6 group-hover:text-white transition-colors" />
                <h3 className="text-2xl font-bold mb-3">Representative Accountability</h3>
                <p className="text-white/60 font-medium">View attendance records, fund utilization, and governance scorecards for all elected representatives.</p>
              </div>
              <div className="mt-12 flex justify-end">
                <ArrowUpRight size={32} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>

            {/* Feature 3: Candidate Network */}
            <div className="bg-white border border-black/10 p-8 hover:border-[#0A0A0A] transition-colors">
              <Users size={32} className="text-black/40 mb-6" />
              <h3 className="text-xl font-bold mb-2">Independent Network</h3>
              <p className="text-black/60 text-sm">Supporting verified independent candidates, activists, and RTI workers.</p>
            </div>

            {/* Feature 4: Local Governance */}
            <Link href="/ward/42" className="md:col-span-2 bg-white border border-black/10 p-8 hover:border-[#0A0A0A] transition-colors flex items-center justify-between group">
              <div className="max-w-md">
                <Building2 size={32} className="text-[#0B2553] mb-6" />
                <h3 className="text-2xl font-bold mb-2">Ward-Level Intelligence</h3>
                <p className="text-black/60">View detailed reports, maps, and issue heatmaps for your specific ward.</p>
              </div>
              <ArrowUpRight size={48} className="text-black/20 group-hover:text-[#0A0A0A] transition-colors" />
            </Link>

          </div>
        </section>

        {/* Concept Images Showcase */}
        <section className="space-y-6 pt-12 border-t-2 border-black/10">
           <div className="flex justify-between items-end pb-4">
            <h2 className="text-3xl font-bold tracking-tight">System Concept Mockups</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-black/10 p-2 bg-white rounded-xl shadow-sm">
              <div className="aspect-[16/10] relative rounded-lg overflow-hidden">
                <Image src="/mockups/civic_os_homepage.png" alt="Civic OS Concept" fill className="object-cover" />
              </div>
            </div>
            <div className="border border-black/10 p-2 bg-white rounded-xl shadow-sm">
              <div className="aspect-[16/10] relative rounded-lg overflow-hidden">
                <Image src="/mockups/ward_dashboard.png" alt="Ward Dashboard Concept" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-[#0A0A0A] text-white py-16 mt-24 border-t-4 border-[#A11212]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="w-4 h-4 bg-[#A11212] rounded-sm mb-6"></div>
            <h3 className="text-2xl font-bold mb-4">NAGRIK PARTY</h3>
            <p className="text-white/50 max-w-sm">India's first governance-native political operating system built for the digital age.</p>
          </div>
          <div>
            <h4 className="font-mono text-[10px] uppercase text-white/40 tracking-widest mb-4">Ecosystem</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/ward/42" className="hover:text-white">Governance Dashboard</Link></li>
              <li><Link href="/grievance" className="hover:text-white">Public Grievance System</Link></li>
              <li><Link href="/representative/1" className="hover:text-white">Accountability Tracker</Link></li>
              <li><Link href="/brand/social" className="hover:text-white">Brand & Media Kit</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10px] uppercase text-white/40 tracking-widest mb-4">Transparency</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/transparency" className="hover:text-white">Public Audit Reports</Link></li>
              <li><Link href="/education" className="hover:text-white">Constitutional Literacy</Link></li>
              <li><Link href="/campaign/onboarding" className="hover:text-white">Candidate Onboarding</Link></li>
              <li><Link href="/campaign/volunteer" className="hover:text-white">Volunteer Hub</Link></li>
            </ul>
          </div>
        </div>
      </footer>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
