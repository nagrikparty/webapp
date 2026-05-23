"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import HeroSection from "@/components/home/HeroSection";
import BentoGrid from "@/components/home/BentoGrid";
import StatsStrip from "@/components/home/StatsStrip";
import JoinCTA from "@/components/home/JoinCTA";

export default function HomePage() {
  useLenis();
  const t = useTranslations("HomePage");

  return (
    <>
      <Navbar />

      <PageTransition>
        <main className="bg-black min-h-screen">
          {/* ACT 1 — IMPACT */}
          <HeroSection translations={{
            headline: t("Hero.headline"),
            subheadline: t("Hero.subheadline"),
            ctaPrimary: t("Hero.ctaPrimary"),
            ctaSecondary: t("Hero.ctaSecondary"),
            inputPlaceholder: t("Hero.inputPlaceholder"),
            reportIt: t("Hero.reportIt")
          }} />

          {/* ACT 2 — REALITY CHECK */}
          <StatsStrip translations={{
            potholes: t("IndiaBreaking.potholes"),
            potholesVal: t("IndiaBreaking.potholesVal"),
            unemployment: t("SystemFailure.unemployment"),
            unemploymentVal: t("SystemFailure.unemploymentVal"),
            darkSpots: t("WomenSafety.darkSpots"),
            darkSpotsVal: t("WomenSafety.darkSpotsVal"),
            bedRatio: t("Healthcare.bedRatio"),
            bedRatioVal: t("Healthcare.bedRatioVal"),
          }} />

          {/* ACT 3 — MISSION */}
          <BentoGrid translations={{
            missionHeadline: t("Mission.headline"),
            hospital: t("Mission.hospital"),
            hospitalDesc: t("Mission.hospitalDesc"),
            clinic: t("Mission.clinic"),
            clinicDesc: t("Mission.clinicDesc"),
            shelter: t("Mission.shelter"),
            shelterDesc: t("Mission.shelterDesc"),
            oldAge: t("Mission.oldAge"),
            oldAgeDesc: t("Mission.oldAgeDesc"),
          }} />

          {/* ACT 4 — JOIN */}
          <JoinCTA translations={{
            headline: t("Join.headline"),
            desc: t("Join.desc"),
            cta: t("Join.cta"),
            groundOps: t("Join.groundOps"),
            groundOpsVal: t("Join.groundOpsVal"),
            leaders: t("Join.leaders"),
            leadersVal: t("Join.leadersVal"),
            meetDay: t("Join.meetDay"),
            meetDayVal: t("Join.meetDayVal"),
          }} />
        </main>
      </PageTransition>

      <Footer />
    </>
  );
}
