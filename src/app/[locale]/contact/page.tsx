"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, ArrowRight } from "lucide-react";

export default function ContactPage() {
  useLenis();
  const t = useTranslations("Contact");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy submit
    alert("Message sent. System is watching.");
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <div className="flex items-center gap-2 mb-6 font-mono text-xs text-red uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-red"></span>
                COMMUNICATIONS
              </div>
              <h1 className="font-hindi text-[clamp(3.5rem,8vw,6rem)] leading-[0.9] text-black font-semibold mb-6 tracking-tight">
                {t("title")}
              </h1>
              <p className="font-body text-xl sm:text-2xl text-black/60 max-w-2xl border-l-4 border-red pl-6 py-1">
                {t("subtitle")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              
              {/* HQ Info */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-10"
              >
                <p className="font-body text-lg text-black/70 mb-8 max-w-md">
                  {t("content")}
                </p>

                <div className="space-y-8">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center shrink-0 text-black">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-mono text-xs text-black/40 uppercase tracking-widest font-bold mb-2">{t("addressLabel")}</h4>
                      <p className="font-body text-black font-semibold leading-relaxed max-w-xs">{t("address")}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center shrink-0 text-black">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-mono text-xs text-black/40 uppercase tracking-widest font-bold mb-2">{t("emailLabel")}</h4>
                      <a href="mailto:hq@nagrikparty.in" className="font-body text-black font-semibold hover:text-red transition-colors">hq@nagrikparty.in</a>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center shrink-0 text-black">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-mono text-xs text-black/40 uppercase tracking-widest font-bold mb-2">{t("phoneLabel")}</h4>
                      <p className="font-body text-black font-semibold">+91 11 4XXX XXXX</p>
                    </div>
                  </div>
                </div>
                
                {/* Map Placeholder */}
                <div className="w-full h-48 bg-black/5 rounded-2xl border border-black/10 flex items-center justify-center mt-8">
                  <span className="font-mono text-xs text-black/30 tracking-widest uppercase">MAP_DATA_UNAVAILABLE</span>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="bg-white border border-black/10 rounded-2xl p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                  <h3 className="font-body text-2xl font-bold text-black mb-8">{t("formTitle")}</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="civic-label">{t("nameLabel")}</label>
                      <input type="text" required className="civic-input" placeholder={t("namePlaceholder")} />
                    </div>
                    <div className="space-y-2">
                      <label className="civic-label">{t("emailLabel")}</label>
                      <input type="email" required className="civic-input" placeholder="Enter your email address" />
                    </div>
                    <div className="space-y-2">
                      <label className="civic-label">MESSAGE</label>
                      <textarea required className="civic-textarea min-h-[160px]" placeholder={t("messagePlaceholder")}></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-charcoal text-white font-body text-sm font-medium tracking-widest uppercase px-6 py-4 rounded-xl hover:bg-black transition-all duration-300 shadow-xl shadow-black/20 flex justify-center items-center gap-2 group mt-4"
                    >
                      {t("submit")}
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </div>
              </motion.div>

            </div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
