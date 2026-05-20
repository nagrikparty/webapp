"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";

// Home Sections
import HeroSection from "@/components/home/HeroSection";
import LiveIssueCards from "@/components/home/LiveIssueCards";
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
      <Navbar />

      <PageTransition>
        <main className="bg-off-white min-h-screen">
          {/* ACT 1 — COLLAPSE */}
          <HeroSection translations={{
            headline: t("Hero.headline"),
            subheadline: t("Hero.subheadline"),
            ctaPrimary: t("Hero.ctaPrimary"),
            ctaSecondary: t("Hero.ctaSecondary"),
            inputPlaceholder: t("Hero.inputPlaceholder"),
            reportIt: t("Hero.reportIt")
          }} />

          <LiveIssueCards translations={{
            title: t("LiveIssues.title"),
            unresolved: t("LiveIssues.unresolved"),
            safetyConcern: t("LiveIssues.safetyConcern"),
            critical: t("LiveIssues.critical"),
            pending: t("LiveIssues.pending"),
            issue1Location: t("LiveIssues.issue1Location"),
            issue1Title: t("LiveIssues.issue1Title"),
            issue1Days: t("LiveIssues.issue1Days"),
            issue2Location: t("LiveIssues.issue2Location"),
            issue2Title: t("LiveIssues.issue2Title"),
            issue2Days: t("LiveIssues.issue2Days"),
            issue3Location: t("LiveIssues.issue3Location"),
            issue3Title: t("LiveIssues.issue3Title"),
            issue3Days: t("LiveIssues.issue3Days"),
            issue4Location: t("LiveIssues.issue4Location"),
            issue4Title: t("LiveIssues.issue4Title"),
            issue4Days: t("LiveIssues.issue4Days"),
            issue5Location: t("LiveIssues.issue5Location"),
            issue5Title: t("LiveIssues.issue5Title"),
            issue5Days: t("LiveIssues.issue5Days"),
            issue6Location: t("LiveIssues.issue6Location"),
            issue6Title: t("LiveIssues.issue6Title"),
            issue6Days: t("LiveIssues.issue6Days")
          }} />

          <ScrollTransition text={t("IndiaBreaking.transition")} />
          
          <IndiaBreakingSection translations={{
            title: t("IndiaBreaking.title"),
            desc: t("IndiaBreaking.desc"),
            potholes: t("IndiaBreaking.potholes"),
            potholesVal: t("IndiaBreaking.potholesVal"),
            budget: t("IndiaBreaking.budget"),
            budgetVal: t("IndiaBreaking.budgetVal"),
            status: t("IndiaBreaking.status"),
            statusVal: t("IndiaBreaking.statusVal")
          }} />

          <ScrollTransition text={t("WomenSafety.transition")} />

          <WomenSafetySection translations={{
            headline: t("WomenSafety.headline"),
            desc: t("WomenSafety.desc"),
            darkSpots: t("WomenSafety.darkSpots"),
            darkSpotsVal: t("WomenSafety.darkSpotsVal"),
            cctv: t("WomenSafety.cctv"),
            cctvVal: t("WomenSafety.cctvVal"),
            response: t("WomenSafety.response"),
            responseVal: t("WomenSafety.responseVal")
          }} />

          <ScrollTransition text={t("Healthcare.transition")} />

          <HealthcareSection translations={{
            headline: t("Healthcare.headline"),
            desc: t("Healthcare.desc"),
            bedRatio: t("Healthcare.bedRatio"),
            bedRatioVal: t("Healthcare.bedRatioVal"),
            wait: t("Healthcare.wait"),
            waitVal: t("Healthcare.waitVal"),
            staff: t("Healthcare.staff"),
            staffVal: t("Healthcare.staffVal")
          }} />

          {/* ACT 2 — RECOGNITION */}
          <ScrollTransition text={t("SystemFailure.transition")} />

          <SystemFailureSection translations={{
            headline: t("SystemFailure.headline"),
            desc: t("SystemFailure.desc"),
            unemployment: t("SystemFailure.unemployment"),
            unemploymentVal: t("SystemFailure.unemploymentVal"),
            stat: t("SystemFailure.stat"),
            statVal: t("SystemFailure.statVal")
          }} />

          {/* ACT 3 — PARTICIPATION */}
          <InfrastructureMissionSection translations={{
            headline: t("Mission.headline"),
            hospital: t("Mission.hospital"),
            hospitalDesc: t("Mission.hospitalDesc"),
            clinic: t("Mission.clinic"),
            clinicDesc: t("Mission.clinicDesc"),
            shelter: t("Mission.shelter"),
            shelterDesc: t("Mission.shelterDesc"),
            oldAge: t("Mission.oldAge"),
            oldAgeDesc: t("Mission.oldAgeDesc")
          }} />

          <ScrollTransition text={t("NagrikReport.transition")} />

          <NagrikReportCTA translations={{
            headline: t("NagrikReport.headline"),
            desc: t("NagrikReport.desc"),
            cta: t("NagrikReport.cta"),
            statusActive: t("NagrikReport.statusActive"),
            statusReports: t("NagrikReport.statusReports"),
            statusReportsVal: t("NagrikReport.statusReportsVal")
          }} />

          {/* ACT 4 — MOVEMENT */}
          <JoinMovementCTA translations={{
            headline: t("Join.headline"),
            desc: t("Join.desc"),
            cta: t("Join.cta"),
            groundOps: t("Join.groundOps"),
            groundOpsVal: t("Join.groundOpsVal"),
            leaders: t("Join.leaders"),
            leadersVal: t("Join.leadersVal"),
            meetDay: t("Join.meetDay"),
            meetDayVal: t("Join.meetDayVal")
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
