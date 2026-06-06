import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Map, AlertTriangle, FileText, Activity } from 'lucide-react';
import { GovernanceMetric } from '@/components/ecosystem/GovernanceMetric';
import { IssueTrackerCard } from '@/components/ecosystem/IssueTrackerCard';

export default async function WardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0A0A0A] font-sans selection:bg-[#0B2553] selection:text-white">
      {/* Brutalist Top Nav */}
      <nav className="border-b border-black/10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <ArrowLeft size={16} />
            <span className="font-bold tracking-tight text-sm">BACK TO ECOSYSTEM</span>
          </Link>
          <div className="font-mono text-xs uppercase font-semibold text-[#0B2553]">
            WARD {id} INTELLIGENCE
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* Header */}
        <header className="border-b-2 border-black/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold tracking-tighter mb-2">Ward {id}</h1>
            <p className="text-xl text-black/60">Governance Report & Issue Heatmap</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-[#A11212] text-white px-6 py-3 font-bold hover:bg-[#800f0f] transition-colors flex items-center gap-2">
              <AlertTriangle size={18} /> ESCALATE ISSUE
            </button>
            <Link href={`/representative/1`} className="bg-white border border-black/10 text-[#0A0A0A] px-6 py-3 font-bold hover:border-black transition-colors flex items-center gap-2">
              <Activity size={18} /> VIEW REPRESENTATIVE
            </Link>
          </div>
        </header>

        {/* Metrics Row */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GovernanceMetric label="Budget Utilized" value="₹12.4" unit="Cr" trend="down" trendValue="14% behind schedule" status="bad" />
          <GovernanceMetric label="Open Grievances" value="342" trend="down" trendValue="-12 from last week" status="good" />
          <GovernanceMetric label="Active Contractors" value="4" status="neutral" />
          <GovernanceMetric label="Avg. Resolution Time" value="14" unit="Days" trend="up" trendValue="+2 days slower" status="bad" />
        </section>

        {/* Map & Active Issues Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Issue Heatmap (Placeholder) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Map size={24} className="text-black/40" />
              Live Issue Heatmap
            </h2>
            <div className="w-full aspect-video bg-[#E0E0E0] border border-black/10 relative overflow-hidden flex items-center justify-center">
              {/* Subtle Grid overlay for "civic tech" map feel */}
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
              <div className="text-center z-10 p-6 bg-white/80 backdrop-blur-sm border border-black/10 rounded-lg shadow-sm">
                <Map size={48} className="mx-auto text-black/20 mb-4" />
                <h3 className="font-bold text-lg">Interactive Map Offline</h3>
                <p className="text-sm text-black/60 max-w-sm mx-auto">Mapbox integration required to view realtime geographical heatmaps of civic issues in Ward {id}.</p>
              </div>
              
              {/* Fake pins */}
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#A11212] rounded-full animate-ping"></div>
              <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#2E7D32] rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-[#A11212] rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Issue Feed */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText size={24} className="text-black/40" />
              Recent Escalations
            </h2>
            <div className="flex flex-col gap-4 h-[500px] overflow-y-auto pr-2">
              <IssueTrackerCard id="8492" category="INFRASTRUCTURE" title="Sector 4 Pothole" location="MG Road" daysOpen={14} status="escalated" />
              <IssueTrackerCard id="8493" category="WATER" title="No supply for 3 days" location="Gali No. 4" daysOpen={3} status="unresolved" />
              <IssueTrackerCard id="8490" category="SANITATION" title="Garbage dump overflowing" location="Near Metro" daysOpen={7} status="escalated" />
              <IssueTrackerCard id="8485" category="STREETLIGHTS" title="Pole 42A broken" location="Main Market" daysOpen={2} status="resolved" />
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}
