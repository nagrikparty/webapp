"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { CinematicInput, CinematicTextarea } from "@/components/ui/CinematicInput";

export default function JoinPage() {
  useLenis();
  const t = useTranslations("JoinPage");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen pt-32 pb-24">
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-16 text-center">
              <h1 className="font-hindi text-[clamp(3.5rem,8vw,5.5rem)] leading-none text-black font-bold mb-4">
                {t("Hero.headline")}
              </h1>
              <p className="font-english text-[clamp(1.125rem,2vw,1.5rem)] text-black/60">
                {t("Hero.subheadline")}
              </p>
            </div>

            {/* Form Container */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white border border-black/10 p-6 sm:p-12 relative overflow-hidden shadow-sm"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red"></div>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="mb-8">
                    <h2 className="font-hindi text-3xl text-black font-semibold mb-2">{t("Form.title")}</h2>
                    <p className="font-english text-black/50 text-sm">{t("Form.desc")}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <CinematicInput label={t("Form.nameLabel")} id="name" placeholder={t("Form.namePlaceholder")} required />
                    <CinematicInput label={t("Form.phoneLabel")} id="phone" type="tel" placeholder={t("Form.phonePlaceholder")} required />
                  </div>

                  <div className="flex flex-col space-y-4">
                    <label className="font-english text-sm font-medium text-black/70 tracking-wide uppercase">
                      {t("Form.roleLabel")}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-center space-x-3 bg-stone-50 border border-black/15 p-4 cursor-pointer hover:border-black/30 transition-colors">
                        <input type="radio" name="role" value="volunteer" className="w-4 h-4 text-red bg-white border-black/30 focus:ring-red focus:ring-2" defaultChecked />
                        <span className="font-english text-black/80">{t("Form.roleVolunteer")}</span>
                      </label>
                      <label className="flex items-center space-x-3 bg-stone-50 border border-red/35 p-4 cursor-pointer hover:border-red transition-colors">
                        <input type="radio" name="role" value="captain" className="w-4 h-4 text-red bg-white border-black/30 focus:ring-red focus:ring-2" />
                        <span className="font-english text-black font-medium">{t("Form.roleCaptain")}</span>
                      </label>
                    </div>
                  </div>
                  
                  <CinematicTextarea label={t("Form.whyLabel")} id="why" rows={4} placeholder={t("Form.whyPlaceholder")} required />

                  <div className="pt-6">
                    <button type="submit" className="w-full inline-flex items-center justify-center px-8 py-4 font-english font-medium tracking-widest uppercase text-sm transition-all duration-300 bg-red text-white hover:bg-red/90 shadow-md hover:shadow-lg border border-red/50">
                      {t("Form.submit")}
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 text-center flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full border border-red flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-hindi text-4xl text-black font-semibold mb-4">काम दिखना चाहिए</h3>
                  <p className="font-english text-black/70">{t("Form.success")}</p>
                </motion.div>
              )}
            </motion.div>

          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
