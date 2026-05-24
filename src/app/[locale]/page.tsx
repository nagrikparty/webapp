"use client";

import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import HeroSection from "@/components/home/HeroSection";
import LiveGovernance from "@/components/home/LiveGovernance";
import CivicInfrastructure from "@/components/home/CivicInfrastructure";
import ActionNetwork from "@/components/home/ActionNetwork";
import TransparencyStrip from "@/components/home/TransparencyStrip";
import { Link } from "@/i18n/routing";

export default function HomePage() {
  useLenis();

  return (
    <>
      <Navbar />

      <PageTransition>
        <main className="bg-off-white min-h-screen text-black">
          {/* ACT 1 — HERO */}
          <HeroSection />

          {/* ACT 2 — LIVE GOVERNANCE DASHBOARD */}
          <LiveGovernance />

          {/* ACT 3 — INFRASTRUCTURE PLAN */}
          <CivicInfrastructure />

          {/* ACT 4 — PEOPLE'S OPPOSITION */}
          <ActionNetwork />

          {/* ACT 5 — OPEN LEDGER */}
          <TransparencyStrip />

          {/* ACT 6 — FINAL CTA */}
          <section className="bg-off-white py-24 text-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-hindi text-4xl sm:text-6xl font-black text-black uppercase tracking-tighter mb-8">
                Democracy should work <br/>
                <span className="text-red">even after elections.</span>
              </h2>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link 
                  href="/join" 
                  className="w-full sm:w-auto bg-black text-white px-8 py-4 font-mono uppercase tracking-widest font-bold hover:bg-black/80 transition-colors"
                >
                  Become Volunteer
                </Link>
                <Link 
                  href="/report" 
                  className="w-full sm:w-auto bg-white border border-black text-black px-8 py-4 font-mono uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-colors"
                >
                  Start Ward Unit
                </Link>
              </div>
            </div>
          </section>
        </main>
      </PageTransition>

      <Footer />
    </>
  );
}
