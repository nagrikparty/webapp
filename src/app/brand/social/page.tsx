import React from 'react';
import Image from 'next/image';
import { ColorPalette } from '@/components/brand/ColorPalette';
import { SocialCardMockup } from '@/components/brand/SocialCardMockup';
import { InstagramScorecard } from '@/components/brand/InstagramScorecard';
import { InstagramGrievance } from '@/components/brand/InstagramGrievance';
import { ImageExportWrapper } from '@/components/brand/ImageExportWrapper';

export const metadata = {
  title: 'Social Identity Kit | Nagrik Party',
  description: 'Bold, modern political movement social media identity for Nagrik Party.',
};

export default function SocialBrandPage() {
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#0A0A0A] font-sans selection:bg-[#A11212] selection:text-white">
      {/* Header */}
      <header className="border-b border-black/10 bg-white/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#A11212] rounded-full animate-pulse"></span>
            <h1 className="font-bold tracking-tight text-xl">Nagrik Party Brand Kit</h1>
          </div>
          <div className="font-mono text-xs text-black/50 uppercase">
            Systems Over Spectacle.
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-24">
        
        {/* Intro Section */}
        <section className="max-w-3xl">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            Citizen-First <br/> Constitutional Governance.
          </h2>
          <p className="text-xl text-black/70 leading-relaxed font-medium">
            This is not a traditional political party. Avoid clichés. No smiling netas. No folded hands. 
            Our identity is rooted in <strong className="text-[#0A0A0A]">technical brutalism, urban realism, and data transparency</strong>. 
            It feels like a modern civic-tech startup meets investigative media.
          </p>
        </section>

        {/* Color Palette Section */}
        <section className="space-y-6">
          <div className="border-b border-black/10 pb-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-black/50">01 / Colors</h3>
            <h2 className="text-3xl font-bold mt-2">Core Palette</h2>
          </div>
          <ColorPalette />
        </section>

        {/* Component Showcase */}
        <section className="space-y-6">
          <div className="border-b border-black/10 pb-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-black/50">02 / Components</h3>
            <h2 className="text-3xl font-bold mt-2">Social Card Mockups</h2>
            <p className="text-black/60 mt-2">Interactive, code-driven UI components for generating social graphics.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
            <SocialCardMockup variant="quote" />
            <SocialCardMockup variant="data" />
            <SocialCardMockup variant="issue" />
          </div>
        </section>

        {/* Instagram Templates Section */}
        <section className="space-y-6">
          <div className="border-b border-black/10 pb-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-black/50">02.5 / Instagram Media System</h3>
            <h2 className="text-3xl font-bold mt-2">Civic Accountability Templates</h2>
            <p className="text-black/60 mt-2">Specialized UI mockups for 4:5 and 1:1 Instagram proportions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 place-items-center bg-black/5 p-8 rounded-3xl border border-black/10">
            <div className="flex flex-col items-center gap-4">
              <ImageExportWrapper filename="nagrik-scorecard">
                <InstagramScorecard />
              </ImageExportWrapper>
              <p className="text-sm font-mono text-black/50 uppercase">Public Audit Format (4:5)</p>
            </div>
            <div className="flex flex-col items-center gap-4">
               <ImageExportWrapper filename="nagrik-grievance">
                <InstagramGrievance />
               </ImageExportWrapper>
              <p className="text-sm font-mono text-black/50 uppercase">Issue Escalation Format (1:1)</p>
            </div>
          </div>
        </section>

        {/* Conceptual Mockups (AI Generated) */}
        <section className="space-y-6">
          <div className="border-b border-black/10 pb-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-black/50">03 / Moodboard</h3>
            <h2 className="text-3xl font-bold mt-2">Cinematic Realism</h2>
            <p className="text-black/60 mt-2">AI-generated visual concepts establishing the tone and layout principles.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="aspect-[4/5] relative bg-black/5 border border-black/10 rounded-2xl overflow-hidden group">
                <Image 
                  src="/mockups/nagrik_dashboard_ui.png" 
                  alt="Dashboard UI Mockup"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div>
                <h4 className="font-bold">Civic-Tech Dashboard</h4>
                <p className="text-sm text-black/60">Data transparency and Ward-level accountability.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="aspect-[4/5] relative bg-black/5 border border-black/10 rounded-2xl overflow-hidden group">
                <Image 
                  src="/mockups/nagrik_typography_poster.png" 
                  alt="Typography Poster"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div>
                <h4 className="font-bold">Systems Over Spectacle</h4>
                <p className="text-sm text-black/60">Minimalist, editorial-style political messaging.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="aspect-[4/5] relative bg-black/5 border border-black/10 rounded-2xl overflow-hidden group">
                <Image 
                  src="/mockups/nagrik_urban_realism.png" 
                  alt="Urban Realism"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div>
                <h4 className="font-bold">Urban India Realism</h4>
                <p className="text-sm text-black/60">Documentary aesthetic with UI overlays.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-black/10 bg-[#0A0A0A] text-[#F5F1E8] py-12">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">NAGRIK PARTY</h2>
            <p className="text-white/50 text-sm max-w-sm">
              A constitutional platform for accountable independent public representatives.
            </p>
          </div>
          <div className="font-mono text-[10px] text-white/30 uppercase text-right">
            System Design v1.0<br/>
            {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}
