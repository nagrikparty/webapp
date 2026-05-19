"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/layout/LoadingScreen";
import CockroachEasterEgg from "@/components/effects/CockroachEasterEgg";
import PageTransition from "@/components/effects/PageTransition";

// Home Sections
import HeroSection from "@/components/home/HeroSection";
import ScrollTransition from "@/components/ui/ScrollTransition";
import IndiaBreakingSection from "@/components/home/IndiaBreakingSection";
import WomenSafetySection from "@/components/home/WomenSafetySection";
import HealthcareSection from "@/components/home/HealthcareSection";
import SystemFailureSection from "@/components/home/SystemFailureSection";
import InfrastructureMissionSection from "@/components/home/InfrastructureMissionSection";
import NagrikReportCTA from "@/components/home/NagrikReportCTA";
import JoinMovementCTA from "@/components/home/JoinMovementCTA";
import FinalSloganSection from "@/components/home/FinalSloganSection";

export default function HomePage() {
  useLenis(); // Initialize smooth scrolling
  const t = useTranslations("HomePage");

  return (
    <>
      <LoadingScreen />
      <CockroachEasterEgg />
      <Navbar />

      <PageTransition>
        <main className="bg-off-white min-h-screen">
          {/* ACT 1 — COLLAPSE */}
          <HeroSection translations={{
            headline: t("Hero.headline"),
            subheadline: t("Hero.subheadline"),
            ctaPrimary: t("Hero.ctaPrimary"),
            ctaSecondary: t("Hero.ctaSecondary")
          }} />

          <ScrollTransition text={t("IndiaBreaking.transition")} />
          
          <IndiaBreakingSection translations={{
            title: t("IndiaBreaking.title"),
            desc: t("IndiaBreaking.desc")
          }} />

          <ScrollTransition text={t("WomenSafety.transition")} />

          <WomenSafetySection translations={{
            headline: t("WomenSafety.headline"),
            desc: t("WomenSafety.desc")
          }} />

          <ScrollTransition text={t("Healthcare.transition")} />

          <HealthcareSection translations={{
            headline: t("Healthcare.headline"),
            desc: t("Healthcare.desc")
          }} />

          {/* ACT 2 — RECOGNITION */}
          <ScrollTransition text={t("SystemFailure.transition")} />

          <SystemFailureSection translations={{
            headline: t("SystemFailure.headline"),
            desc: t("SystemFailure.desc")
          }} />

          {/* ACT 3 — PARTICIPATION */}
          <InfrastructureMissionSection translations={{
            headline: t("Mission.headline"),
            hospital: t("Mission.hospital"),
            clinic: t("Mission.clinic"),
            shelter: t("Mission.shelter"),
            oldAge: t("Mission.oldAge")
          }} />

          <ScrollTransition text={t("NagrikReport.transition")} />

          <NagrikReportCTA translations={{
            headline: t("NagrikReport.headline"),
            cta: t("NagrikReport.cta")
          }} />

          {/* ACT 4 — MOVEMENT */}
          <JoinMovementCTA translations={{
            headline: t("Join.headline"),
            cta: t("Join.cta")
          }} />

          <FinalSloganSection translations={{
            part1: t("Slogan.part1"),
            part2: t("Slogan.part2")
          }} />
        </main>
      </PageTransition>

      <Footer />
    </>
  );
}
