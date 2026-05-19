"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import CinematicButton from "@/components/ui/CinematicButton";
import { CinematicInput, CinematicTextarea } from "@/components/ui/CinematicInput";
import { Upload } from "lucide-react";

export default function ReportPage() {
  useLenis();
  const t = useTranslations("ReportPage");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
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

                  <CinematicInput label={t("Form.wardLabel")} id="ward" placeholder={t("Form.wardPlaceholder")} required />
                  
                  <CinematicTextarea label={t("Form.issueLabel")} id="issue" rows={4} placeholder={t("Form.issuePlaceholder")} required />

                  <div className="flex flex-col space-y-2">
                    <label className="font-english text-sm font-medium text-black/70 tracking-wide uppercase">
                      {t("Form.photoLabel")}
                    </label>
                    <label className="flex items-center justify-center w-full h-32 border-2 border-black/10 border-dashed hover:border-red/50 hover:bg-black/5 transition-all cursor-pointer group">
                      <div className="flex flex-col items-center space-y-2 text-black/40 group-hover:text-black/75">
                        <Upload size={24} />
                        <span className="font-english text-sm uppercase tracking-wider">Select Image</span>
                      </div>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>

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
