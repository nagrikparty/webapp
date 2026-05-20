"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Users } from "lucide-react";

export default function JoinPage() {
  useLenis();
  const t = useTranslations("JoinPage");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const roles = [
    "wardCaptain", "womenSafety", "groundCampaign", "digitalTeam", 
    "mediaTeam", "healthcareVolunteer", "studentVolunteer", "legalTeam"
  ];

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-charcoal min-h-screen">
          
          {/* Hero Section */}
          <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl text-center mx-auto relative z-10"
            >
              <h1 className="font-hindi text-[clamp(4rem,10vw,7rem)] leading-[0.9] text-white font-semibold mb-6 tracking-tight drop-shadow-lg">
                {t("Hero.headline")}
              </h1>
              <p className="font-body text-xl sm:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed border-l-4 border-red/50 pl-6 py-1 text-left sm:text-center sm:border-l-0 sm:pl-0">
                {t("Hero.subheadline")}
              </p>
            </motion.div>
          </section>

          {/* Form Section */}
          <section className="px-4 sm:px-6 lg:px-8 pb-32 max-w-5xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-off-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden border border-white/10"
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6"
                    >
                      <CheckCircle size={40} className="text-green-600" />
                    </motion.div>
                    <h3 className="font-hindi text-4xl text-black font-medium mb-3">
                      {t("Form.success")}
                    </h3>
                    <p className="font-mono text-sm text-black/50 uppercase tracking-widest">
                      SYSTEM ACTIVATED
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-10"
                  >
                    <div className="border-b border-black/10 pb-6 mb-8 text-center sm:text-left">
                      <h2 className="font-body text-2xl font-bold tracking-tight mb-2 text-black">{t("Form.title")}</h2>
                      <p className="text-black/60 font-body text-sm max-w-xl">{t("Form.desc")}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="civic-label">{t("Form.nameLabel")}</label>
                        <input type="text" required className="civic-input" placeholder={t("Form.namePlaceholder")} />
                      </div>
                      <div className="space-y-2">
                        <label className="civic-label">{t("Form.phoneLabel")}</label>
                        <input type="tel" pattern="[0-9]{10}" required className="civic-input" placeholder={t("Form.phonePlaceholder")} />
                      </div>
                      <div className="space-y-2">
                        <label className="civic-label">{t("Form.emailLabel")}</label>
                        <input type="email" required className="civic-input" placeholder={t("Form.emailPlaceholder")} />
                      </div>
                      <div className="space-y-2">
                        <label className="civic-label">{t("Form.areaLabel")}</label>
                        <input type="text" required className="civic-input" placeholder={t("Form.areaPlaceholder")} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="civic-label">{t("Form.roleLabel")}</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {roles.map(role => (
                          <div 
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`civic-card cursor-pointer transition-all duration-300 p-4 border-2 ${
                              selectedRole === role 
                                ? 'border-red/50 bg-red/5 shadow-md shadow-red/5' 
                                : 'border-black/5 bg-white hover:border-black/20 hover:bg-black/5'
                            }`}
                          >
                            <h4 className={`font-body font-bold text-sm mb-1 ${selectedRole === role ? 'text-red' : 'text-black'}`}>
                              {t(`Form.roles.${role}`)}
                            </h4>
                            <p className="text-xs text-black/50 leading-relaxed font-body">
                              {t(`Form.roles.${role}Desc`)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="civic-label">{t("Form.whyLabel")}</label>
                      <textarea required className="civic-textarea min-h-[100px]" placeholder={t("Form.whyPlaceholder")}></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-charcoal text-white font-body text-sm font-medium tracking-widest uppercase px-6 py-5 rounded-xl hover:bg-black transition-all duration-300 shadow-xl shadow-black/20 flex justify-center items-center"
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        t("Form.submit")
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Movement Stats Bottom */}
            {!isSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 flex justify-center"
              >
                <div className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                  <Users size={16} className="text-white/40" />
                  <span className="font-mono text-xs text-white/60 tracking-widest uppercase">
                    42 WARD LEADERS ACTIVE
                  </span>
                  <span className="w-2 h-2 rounded-full bg-red animate-pulse"></span>
                </div>
              </motion.div>
            )}
          </section>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
