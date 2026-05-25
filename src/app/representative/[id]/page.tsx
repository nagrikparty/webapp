import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, FileText, Activity, ShieldCheck, MapPin } from 'lucide-react';
import { GovernanceMetric } from '@/components/ecosystem/GovernanceMetric';

export default function RepresentativePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0A0A0A] font-sans selection:bg-[#0B2553] selection:text-white">
      {/* Brutalist Top Nav */}
      <nav className="border-b border-black/10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <ArrowLeft size={16} />
            <span className="font-bold tracking-tight text-sm">BACK TO ECOSYSTEM</span>
          </Link>
          <div className="font-mono text-xs uppercase font-semibold text-[#2E7D32] flex items-center gap-1">
            <ShieldCheck size={14} />
            VERIFIED INDEPENDENT
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        
        {/* Profile Header (No hero banners, data only) */}
        <header className="border-b-2 border-black/10 pb-8 flex flex-col md:flex-row gap-8 items-start">
          {/* Brutalist Photo Box */}
          <div className="w-40 h-40 bg-black/10 border border-black/20 shrink-0 relative overflow-hidden grayscale contrast-125">
             <div className="absolute inset-0 flex items-center justify-center text-black/20 font-bold font-mono rotate-45 text-2xl">NO_PHOTO</div>
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-5xl font-bold tracking-tighter">Dr. Amit Sharma</h1>
              <span className="bg-[#0A0A0A] text-white px-3 py-1 text-xs font-mono uppercase font-bold tracking-widest">
                MLA
              </span>
            </div>
            
            <p className="text-xl text-black/70 mb-4 max-w-2xl leading-relaxed">
              Former Chief Medical Officer fighting for public healthcare infrastructure, transparent municipal budgets, and decentralized civic power.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-black/60 font-semibold uppercase">
              <div className="flex items-center gap-1"><MapPin size={14} /> Constituency: East Delhi</div>
              <div className="flex items-center gap-1"><CheckCircle2 size={14} className="text-[#2E7D32]"/> Criminal Record: Clean</div>
              <div className="flex items-center gap-1"><FileText size={14} /> Assets Declared</div>
            </div>
          </div>
        </header>

        {/* Accountability Scorecard */}
        <section>
          <div className="flex justify-between items-end border-b border-black/10 pb-4 mb-6">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Activity size={24} className="text-black/40" />
              Governance Scorecard
            </h2>
            <div className="font-mono text-xs uppercase text-black/50">Last updated: Today</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GovernanceMetric label="Assembly Attendance" value="94" unit="%" trend="neutral" status="good" />
            <GovernanceMetric label="Questions Asked" value="142" trend="up" trendValue="Top 10%" status="good" />
            <GovernanceMetric label="MLA Fund Utilized" value="82" unit="%" trend="up" trendValue="₹8.2Cr Deployed" status="neutral" />
          </div>
        </section>

        {/* Live Public Audit (The real work) */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight border-b border-black/10 pb-4 mb-6">Recent Public Work (Audit)</h2>
          
          <div className="space-y-4">
            <div className="bg-white border border-black/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-[#0A0A0A] transition-colors">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-black/50 uppercase mb-2">
                  <span className="bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-0.5 font-bold">COMPLETED</span>
                  <span>WARD 42</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Upgraded Primary Health Center</h3>
                <p className="text-black/60 text-sm max-w-xl">Deployed ₹45L from MLA funds to repair building structural issues and install a new X-Ray machine.</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold">Verification:</div>
                <div className="text-[#2E7D32] text-xs font-mono font-bold flex items-center justify-end gap-1"><CheckCircle2 size={12}/> AUDIT PASSED</div>
              </div>
            </div>

            <div className="bg-white border border-black/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-[#0A0A0A] transition-colors">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-black/50 uppercase mb-2">
                  <span className="bg-[#A11212]/10 text-[#A11212] px-2 py-0.5 font-bold">DELAYED (ESCALATED)</span>
                  <span>WARD 14</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Sector 4 Storm Water Drain</h3>
                <p className="text-black/60 text-sm max-w-xl">Contractor assigned but work halted. MLA has raised official grievance #8492 to municipal commissioner.</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold">Verification:</div>
                <div className="text-[#A11212] text-xs font-mono font-bold">PENDING RESOLUTION</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
