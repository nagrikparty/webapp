"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import ScrollTransition from "@/components/ui/ScrollTransition";
import DocumentarySection from "@/components/ui/DocumentarySection";
import CinematicSection from "@/components/ui/CinematicSection";

export default function AboutPage() {
  useLenis();
  const t = useTranslations("AboutPage");

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen">
          
          {/* Documentary Intro */}
          <section className="relative h-[80vh] flex flex-col justify-end pb-24 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 film-grain opacity-30"></div>
            <div className="max-w-6xl mx-auto w-full relative z-10">
              <h1 className="font-hindi text-[clamp(3.5rem,8vw,6rem)] leading-none text-black font-bold mb-6">
                {t("Intro.headline")}
              </h1>
              <p className="font-english text-[clamp(1.25rem,3vw,1.75rem)] text-black/70 max-w-2xl border-l-4 border-red pl-6">
                {t("Intro.desc")}
              </p>
            </div>
          </section>

          {/* Documentary Scroll */}
          <DocumentarySection 
            headline={t("Journey.headline")} 
            desc={t("Journey.desc")} 
            imageSrc="/images/about_streets.png"
            imageAlt="Delhi street at night with political posters"
            reverse={false}
          />
          
          <DocumentarySection 
            headline={t("Grassroots.headline")} 
            desc={t("Grassroots.desc")} 
            imageSrc="/images/about_grassroots.png"
            imageAlt="Grassroots citizens fixing street"
            reverse={true}
          />

          {/* Philosophy / Creation */}
          <ScrollTransition text={t("Creation.headline")} />
          
          <CinematicSection 
            headline={t("Creation.headline")} 
            desc={t("Creation.desc")} 
            align="center"
          />
          
          <CinematicSection 
            headline={t("Vision.headline")} 
            desc={t("Vision.desc")} 
            align="center"
            borderAccent={false}
          />

          {/* Outro */}
          <section className="relative py-40 bg-off-white text-center px-4 sm:px-6">
            <h2 className="font-hindi text-[clamp(3rem,6vw,5rem)] text-black/90 font-bold mb-8 drop-shadow-sm max-w-4xl mx-auto leading-tight">
              {t("Outro.headline")}
            </h2>
            <p className="font-english text-xl text-red font-semibold tracking-wide">
              {t("Outro.desc")}
            </p>
          </section>

        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
