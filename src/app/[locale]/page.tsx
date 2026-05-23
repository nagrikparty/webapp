"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import HeroSection from "@/components/home/HeroSection";

export default function HomePage() {
  useLenis(); // Initialize smooth scrolling
  const t = useTranslations("HomePage");

  return (
    <>
      <Navbar />

      <PageTransition>
        <main className="bg-black min-h-screen">
          <HeroSection translations={{
            headline: t("Hero.headline"),
            subheadline: t("Hero.subheadline"),
            ctaPrimary: t("Hero.ctaPrimary"),
            ctaSecondary: t("Hero.ctaSecondary"),
            inputPlaceholder: t("Hero.inputPlaceholder"),
            reportIt: t("Hero.reportIt")
          }} />
        </main>
      </PageTransition>

      <Footer />
    </>
  );
}
