"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle, Camera, AlertTriangle } from "lucide-react";
import { submitReport } from "@/actions";
import { toast } from "sonner";

export default function ReportPage() {
  useLenis();
  const t = useTranslations("ReportPage");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [formData, setFormData] = useState({ name: "", phone: "", ward: "", category: "", description: "" });
  const [refId, setRefId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeverity) {
      toast.warning("Please select a severity level.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("phone", formData.phone);
      fd.append("ward", formData.ward);
      fd.append("category", formData.category);
      fd.append("severity", selectedSeverity);
      fd.append("description", formData.description);
      
      if (file) {
        fd.append("file", file);
      }
      
      const response = await submitReport(fd);
        
      if (!response.success) {
        throw new Error(response.error || "Submission failed");
      }
      
      if (response.id) {
        // Just take the first 8 chars of the UUID for a short ref ID
        setRefId("NGRK-" + response.id.substring(0, 8).toUpperCase());
      }
      
      setIsSuccess(true);
      setFormData({ name: "", phone: "", ward: "", category: "", description: "" });
      setSelectedSeverity("");
      setFile(null);
      setFileName("");
    } catch (error: any) {
      console.error("Error submitting report:", error);
      toast.error(error.message || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const severityLevels = [
    { id: "low", label: t("Form.severityLow") },
    { id: "medium", label: t("Form.severityMedium") },
    { id: "high", label: t("Form.severityHigh") },
    { id: "critical", label: t("Form.severityCritical") },
  ];

  const categories = [
    "roads", "water", "sewage", "streetlights", "garbage", "healthcare", "safety", "publicInfra", "other"
  ];

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 font-body text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red/50 focus:ring-1 focus:ring-red/20 transition-all duration-300";
  const labelClasses = "block font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2";

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-black min-h-screen pt-24 sm:pt-32 pb-24">
          
          {/* Hero Section */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl text-center mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-6 bg-red/10 text-red px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest font-semibold w-fit mx-auto">
                <span className="w-2 h-2 rounded-full bg-red animate-pulse"></span>
                LIVE CIVIC AUDIT
              </div>
              <h1 className="font-hindi text-[clamp(4rem,10vw,7rem)] leading-[0.9] text-white font-semibold mb-6 tracking-tight uppercase">
                {t("Hero.headline")}
              </h1>
              <p className="font-body text-xl sm:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                {t("Hero.subheadline")}
              </p>
            </motion.div>
          </section>

          {/* Form Section */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden"
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
                      <CheckCircle size={40} className="text-green-400" />
                    </motion.div>
                    <h3 className="font-hindi text-4xl text-white font-medium mb-3">
                      {t("Form.success")}
                    </h3>
                    <p className="font-mono text-sm text-white/50 uppercase tracking-widest">
                      REF ID: {refId || `NGRK-${Math.floor(Math.random() * 90000) + 10000}`}
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-8"
                  >
                    <div className="border-b border-white/10 pb-6 mb-8">
                      <h2 className="font-body text-2xl font-bold tracking-tight mb-2 text-white">{t("Form.title")}</h2>
                      <p className="text-white/60 font-body text-sm">{t("Form.desc")}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className={labelClasses}>{t("Form.nameLabel")}</label>
                        <input type="text" required className={inputClasses} placeholder={t("Form.namePlaceholder")} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClasses}>{t("Form.phoneLabel")}</label>
                        <input type="tel" pattern="[0-9]{10}" required className={inputClasses} placeholder={t("Form.phonePlaceholder")} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={labelClasses}>{t("Form.wardLabel")}</label>
                      <input type="text" required className={inputClasses} placeholder={t("Form.wardPlaceholder")} value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className={labelClasses}>{t("Form.categoryLabel")}</label>
                        <select required className={`${inputClasses} appearance-none cursor-pointer`} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                          <option value="" disabled className="bg-black text-white/50">{t("Form.categoryPlaceholder")}</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat} className="bg-black text-white">{t(`Form.categories.${cat}`)}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className={labelClasses}>{t("Form.severityLabel")}</label>
                        <div className="flex flex-wrap gap-2">
                          {severityLevels.map(level => (
                            <button
                              key={level.id}
                              type="button"
                              onClick={() => setSelectedSeverity(level.id)}
                              className={`px-3 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest font-semibold transition-all border
                                ${selectedSeverity === level.id 
                                  ? 'bg-red/10 border-red text-red shadow-sm' 
                                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'}`}
                            >
                              {level.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={labelClasses}>{t("Form.issueLabel")}</label>
                      <textarea required className={`${inputClasses} min-h-[120px] resize-none`} placeholder={t("Form.issuePlaceholder")} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className={labelClasses}>{t("Form.photoLabel")}</label>
                      <label className="flex flex-col items-center justify-center w-full h-40 border border-white/10 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {fileName ? (
                            <>
                              <Camera className="w-8 h-8 mb-3 text-red" />
                              <p className="mb-2 text-sm text-white font-semibold">{fileName}</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-3 text-white/40 group-hover:text-white/60 transition-colors" />
                              <p className="mb-2 text-sm text-white/60"><span className="font-semibold text-white">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-white/40">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                            </>
                          )}
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-red text-white font-mono text-sm font-bold tracking-widest uppercase px-6 py-4 rounded-full hover:bg-red/90 transition-all duration-300 shadow-lg shadow-red/20 flex justify-center items-center"
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

            {/* Report CTA instead of empty state */}
            {!isSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 text-center"
              >
                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                  <AlertTriangle size={20} className="text-red" />
                  <p className="font-mono text-xs text-white/50 uppercase tracking-widest">
                    {t("Form.emptyState")}
                  </p>
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
