"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import ScrollTransition from "@/components/ui/ScrollTransition";
import CinematicSection from "@/components/ui/CinematicSection";

export default function MissionPage() {
  useLenis();
  const t = useTranslations("MissionPage");

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen pt-32">
          
          {/* Hero Section */}
          <section className="relative min-h-[60vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 film-grain opacity-30"></div>
            <div className="max-w-5xl mx-auto relative z-10 text-center">
              <h1 className="font-hindi text-[clamp(3.5rem,8vw,6rem)] leading-none text-black font-bold mb-8">
                {t("Hero.headline")}
              </h1>
              <p className="font-english text-[clamp(1.25rem,3vw,1.75rem)] text-red font-semibold max-w-3xl mx-auto italic">
                {t("Hero.subheadline")}
              </p>
            </div>
          </section>

          {/* Body Sections */}
          <CinematicSection 
            headline={t("Failure.headline")} 
            desc={t("Failure.desc")} 
            align="left" 
          />
          
          <CinematicSection 
            headline={t("CitizenFirst.headline")} 
            desc={t("CitizenFirst.desc")} 
            align="right" 
          />
          
          <CinematicSection 
            headline={t("Dignity.headline")} 
            desc={t("Dignity.desc")} 
            align="left" 
          />
          
          <CinematicSection 
            headline={t("Healthcare.headline")} 
            desc={t("Healthcare.desc")} 
            align="right" 
          />
          
          <CinematicSection 
            headline={t("WomenSafety.headline")} 
            desc={t("WomenSafety.desc")} 
            align="left" 
          />
          
          <CinematicSection 
            headline={t("Accountability.headline")} 
            desc={t("Accountability.desc")} 
            align="center" 
          />
          
          <CinematicSection 
            headline={t("Youth.headline")} 
            desc={t("Youth.desc")} 
            align="center" 
            borderAccent={false}
          />

        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
