"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Users, Camera, Upload, ChevronRight, ChevronLeft } from "lucide-react";
import { submitMember, getStates, getVidhanSabhas, getWards } from "@/actions";
import { toast } from "sonner";

export default function JoinPage() {
  useLenis();
  const t = useTranslations("JoinPage");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profileFileName, setProfileFileName] = useState("");
  const [epicFile, setEpicFile] = useState<File | null>(null);
  const [epicFileName, setEpicFileName] = useState("");

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", dob: "", gender: "", guardian_name: "",
    address: "", state: "", vidhan_sabha: "", ward: "", pincode: "",
    is_registered_voter: "yes", is_indian_citizen: "yes", has_criminal_record: "no", criminal_record_details: "",
    is_other_party_member: "no", other_party_name: "",
    epic_number: "", social_media: "", referral_source: "", referral_code: "",
    password: "", declaration_agreed: false
  });

  const [dbStates, setDbStates] = useState<any[]>([]);
  const [vidhanSabhas, setVidhanSabhas] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoadingGeo, setIsLoadingGeo] = useState(true);

  // Fetch initial states
  useEffect(() => {
    async function loadStates() {
      try {
        const statesData = await getStates();
        setDbStates(statesData);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingGeo(false);
      }
    }
    loadStates();
  }, []);

  // Fetch Vidhan Sabhas when state changes
  useEffect(() => {
    async function loadVidhanSabhas() {
      if (formData.state) {
        const vsData = await getVidhanSabhas(formData.state);
        setVidhanSabhas(vsData);
      } else {
        setVidhanSabhas([]);
      }
      setFormData(prev => ({ ...prev, vidhan_sabha: "", ward: "" }));
      setWards([]);
    }
    loadVidhanSabhas();
  }, [formData.state]);

  // Fetch Wards when Vidhan Sabha changes
  useEffect(() => {
    async function loadWards() {
      if (formData.vidhan_sabha) {
        // Find the ID of the selected Vidhan Sabha name
        const selectedVs = vidhanSabhas.find(vs => vs.name === formData.vidhan_sabha);
        if (selectedVs) {
          const wData = await getWards(selectedVs.id);
          setWards(wData);
        }
      } else {
        setWards([]);
      }
      setFormData(prev => ({ ...prev, ward: "" }));
    }
    loadWards();
  }, [formData.vidhan_sabha, vidhanSabhas]);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileFile(e.target.files[0]);
      setProfileFileName(e.target.files[0].name);
    }
  };

  const handleEpicFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEpicFile(e.target.files[0]);
      setEpicFileName(e.target.files[0].name);
    }
  };

  const nextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.name || !formData.phone || !formData.dob || !formData.gender || !formData.guardian_name) {
        toast.warning("Please fill all required personal details.");
        return;
      }
    } else if (step === 2) {
      if (!formData.address || !formData.state || !formData.vidhan_sabha || !formData.pincode) {
        toast.warning("Please fill all required location details.");
        return;
      }
    }
    setStep(s => Math.min(s + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declaration_agreed) {
      toast.warning("Please agree to the declaration.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, typeof value === 'boolean' ? value.toString() : value);
      });
      fd.append("social_media", formData.social_media);
      fd.append("referral_source", formData.referral_source);
      fd.append("referral_code", formData.referral_code);
      fd.append("password", formData.password);
      fd.append("declaration_agreed", formData.declaration_agreed.toString());
      fd.append("skills", selectedSkills.join(","));
      
      if (profileFile) {
        fd.append("profile_photo", profileFile);
      }
      if (epicFile) {
        fd.append("epic_photo", epicFile);
      }
      
      const response = await submitMember(fd);
        
      if (!response.success) throw new Error(response.error || "Submission failed");
      
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Error submitting member form:", error);
      toast.error(error.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const skillsList = [
    "socialMedia", "groundCampaign", "legal", "healthcare", 
    "media", "dataTech", "youth", "womenSafety"
  ];

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-black min-h-screen">
          
          {/* Hero Section */}
          <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
          <section className="px-4 sm:px-6 lg:px-8 pb-32 max-w-4xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-white/10"
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
                    <h3 className="font-hindi text-4xl text-white font-medium mb-3">
                      {t("Form.success")}
                    </h3>
                    <p className="font-mono text-sm text-white/50 uppercase tracking-widest">
                      SYSTEM ACTIVATED
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="border-b border-black/10 pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between">
                      <div>
                        <h2 className="font-body text-2xl font-bold tracking-tight mb-2 text-white">{t("Form.title")}</h2>
                        <p className="text-white/60 font-body text-sm max-w-xl">{t("Form.desc")}</p>
                      </div>
                      <div className="mt-4 sm:mt-0 font-mono text-xs font-bold text-red tracking-widest">
                        STEP {step} / {totalSteps}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/5 h-1.5 rounded-full mb-10 overflow-hidden">
                      <div 
                        className="bg-red h-full transition-all duration-500 ease-out"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                      ></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      
                      {/* STEP 1: Personal Details */}
                      {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="civic-label">{t("Form.nameLabel")}</label>
                              <input type="text" required className="civic-input" placeholder={t("Form.namePlaceholder")} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                              <label className="civic-label">{t("Form.emailLabel")}</label>
                              <input type="email" required className="civic-input" placeholder={t("Form.emailPlaceholder")} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                              <label className="civic-label">{t("Form.phoneLabel")}</label>
                              <input type="tel" pattern="[0-9]{10}" required className="civic-input" placeholder={t("Form.phonePlaceholder")} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                              <label className="civic-label">{t("Form.dobLabel")}</label>
                              <input type="date" required className="civic-input" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="civic-label">{t("Form.genderLabel")}</label>
                              <div className="flex gap-4">
                                {['Male', 'Female', 'Other'].map(g => (
                                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={e => setFormData({...formData, gender: e.target.value})} className="accent-red" />
                                    <span className="font-body text-sm text-white/80">{t(`Form.gender${g}`)}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-3">
                              <label className="civic-label block">{t("Form.citizenshipLabel")}</label>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" name="citizenship" value="yes" checked={formData.is_indian_citizen === "yes"} onChange={e => setFormData({...formData, is_indian_citizen: e.target.value})} className="accent-red" />
                                  <span className="font-body text-sm text-white/80">{t("Form.yes")}</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" name="citizenship" value="no" checked={formData.is_indian_citizen === "no"} onChange={e => setFormData({...formData, is_indian_citizen: e.target.value})} className="accent-red" />
                                  <span className="font-body text-sm text-white/80">{t("Form.no")}</span>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="civic-label">{t("Form.guardianLabel")}</label>
                            <input type="text" required className="civic-input" placeholder={t("Form.guardianPlaceholder")} value={formData.guardian_name} onChange={e => setFormData({...formData, guardian_name: e.target.value})} />
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 2: Address & Geography */}
                      {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                          <div className="space-y-2">
                            <label className="civic-label">{t("Form.addressLabel")}</label>
                            <textarea required className="civic-textarea min-h-[80px]" placeholder={t("Form.addressPlaceholder")} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="civic-label">{t("Form.stateLabel")}</label>
                              <select required className="civic-select w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 font-body text-sm focus:outline-none focus:border-white/30 transition-colors" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}>
                                <option value="" disabled>{isLoadingGeo ? "Loading states..." : t("Form.statePlaceholder")}</option>
                                {dbStates.map(s => (
                                  <option key={s.id} value={s.id}>{s.name} {s.name_hi ? `(${s.name_hi})` : ""}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="civic-label">{t("Form.vidhanSabhaLabel")}</label>
                              <select required disabled={!formData.state || vidhanSabhas.length === 0} className="civic-select w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 font-body text-sm focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50" value={formData.vidhan_sabha} onChange={e => setFormData({...formData, vidhan_sabha: e.target.value})}>
                                <option value="" disabled>{t("Form.vidhanSabhaPlaceholder")}</option>
                                {vidhanSabhas.map(vs => (
                                  <option key={vs.id} value={vs.name}>{vs.name}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="civic-label">{t("Form.wardLabel")}</label>
                              {wards.length > 0 ? (
                                <select required className="civic-select w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 font-body text-sm focus:outline-none focus:border-white/30 transition-colors" value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})}>
                                  <option value="" disabled>Select Ward</option>
                                  {wards.map(w => (
                                    <option key={w.id} value={w.name}>{w.name}</option>
                                  ))}
                                </select>
                              ) : (
                                <input type="text" className="civic-input" placeholder={t("Form.wardPlaceholder")} value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})} disabled={!formData.vidhan_sabha} />
                              )}
                            </div>

                            <div className="space-y-2">
                              <label className="civic-label">{t("Form.pincodeLabel")}</label>
                              <input type="text" pattern="[0-9]{6}" required className="civic-input" placeholder={t("Form.pincodePlaceholder")} value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 3: Political Info */}
                      {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <label className="civic-label block">{t("Form.voterLabel")}</label>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" name="voter" value="yes" checked={formData.is_registered_voter === "yes"} onChange={e => setFormData({...formData, is_registered_voter: e.target.value})} className="accent-red" />
                                  <span className="font-body text-sm">{t("Form.yes")}</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" name="voter" value="no" checked={formData.is_registered_voter === "no"} onChange={e => setFormData({...formData, is_registered_voter: e.target.value})} className="accent-red" />
                                  <span className="font-body text-sm">{t("Form.no")}</span>
                                </label>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="civic-label">{t("Form.aadhaarLabel")}</label>
                              <input type="text" required className="civic-input uppercase font-mono" placeholder={t("Form.aadhaarPlaceholder")} value={formData.epic_number} onChange={e => setFormData({...formData, epic_number: e.target.value.toUpperCase()})} />
                            </div>
                          </div>

                          <div className="space-y-3 border-t border-white/5 pt-6">
                            <label className="civic-label block">{t("Form.criminalRecordLabel")}</label>
                            <div className="flex gap-4 mb-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="criminal" value="yes" checked={formData.has_criminal_record === "yes"} onChange={e => setFormData({...formData, has_criminal_record: e.target.value})} className="accent-red" />
                                <span className="font-body text-sm">{t("Form.yes")}</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="criminal" value="no" checked={formData.has_criminal_record === "no"} onChange={e => setFormData({...formData, has_criminal_record: e.target.value})} className="accent-red" />
                                <span className="font-body text-sm">{t("Form.no")}</span>
                              </label>
                            </div>
                            
                            {formData.has_criminal_record === "yes" && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                                <label className="civic-label">{t("Form.criminalRecordDetailsLabel")}</label>
                                <textarea required className="civic-textarea min-h-[80px]" placeholder={t("Form.criminalRecordDetailsPlaceholder")} value={formData.criminal_record_details} onChange={e => setFormData({...formData, criminal_record_details: e.target.value})}></textarea>
                              </motion.div>
                            )}
                          </div>

                          <div className="space-y-3 border-t border-white/5 pt-6">
                            <label className="civic-label block">CREATE SECURE PASSWORD</label>
                            <input type="password" required className="civic-input" placeholder="Enter a secure password for your dashboard" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} minLength={6} />
                          </div>

                          <div className="space-y-3 border-t border-white/5 pt-6">
                            <label className="civic-label block">{t("Form.partyMemberLabel")}</label>
                            <div className="flex gap-4 mb-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="otherParty" value="yes" checked={formData.is_other_party_member === "yes"} onChange={e => setFormData({...formData, is_other_party_member: e.target.value})} className="accent-red" />
                                <span className="font-body text-sm">{t("Form.yes")}</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="otherParty" value="no" checked={formData.is_other_party_member === "no"} onChange={e => setFormData({...formData, is_other_party_member: e.target.value})} className="accent-red" />
                                <span className="font-body text-sm">{t("Form.no")}</span>
                              </label>
                            </div>
                            
                            {formData.is_other_party_member === "yes" && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                                <label className="civic-label">{t("Form.otherPartyLabel")}</label>
                                <input type="text" className="civic-input" placeholder={t("Form.otherPartyPlaceholder")} value={formData.other_party_name} onChange={e => setFormData({...formData, other_party_name: e.target.value})} />
                              </motion.div>
                            )}
                          </div>
                          
                          <div className="space-y-2 border-t border-white/5 pt-6">
                            <label className="civic-label">{t("Form.socialMediaLabel")}</label>
                            <input type="text" className="civic-input" placeholder={t("Form.socialMediaPlaceholder")} value={formData.social_media} onChange={e => setFormData({...formData, social_media: e.target.value})} />
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 4: Skills, Photo & Submit */}
                      {step === 4 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                          
                          <div className="space-y-3">
                            <label className="civic-label">{t("Form.skillsLabel")}</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {skillsList.map(skill => (
                                <label key={skill} className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${selectedSkills.includes(skill) ? 'border-red/50 bg-red/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                                  <input type="checkbox" className="hidden" checked={selectedSkills.includes(skill)} onChange={() => toggleSkill(skill)} />
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${selectedSkills.includes(skill) ? 'bg-red border-red' : 'border-white/20'}`}>
                                    {selectedSkills.includes(skill) && <CheckCircle size={12} className="text-white" />}
                                  </div>
                                  <span className={`font-body text-sm ${selectedSkills.includes(skill) ? 'font-medium text-red' : 'text-white/80'}`}>
                                    {t(`Form.skills.${skill}`)}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="civic-label">{t("Form.photoLabel")}</label>
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  {profileFileName ? (
                                    <>
                                      <Camera className="w-8 h-8 mb-2 text-red" />
                                      <p className="mb-1 text-sm text-white font-semibold text-center px-4 truncate w-full">{profileFileName}</p>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-6 h-6 mb-2 text-white/40 group-hover:text-white/60 transition-colors" />
                                      <p className="mb-1 text-sm text-white/60 font-body text-center"><span className="font-semibold text-white">Click to upload</span><br/>{t("Form.photoDesc")}</p>
                                    </>
                                  )}
                                </div>
                                <input type="file" required className="hidden" accept="image/*" onChange={handleProfileFileChange} />
                              </label>
                            </div>

                            <div className="space-y-2">
                              <label className="civic-label">{t("Form.epicPhotoLabel")}</label>
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  {epicFileName ? (
                                    <>
                                      <Camera className="w-8 h-8 mb-2 text-red" />
                                      <p className="mb-1 text-sm text-white font-semibold text-center px-4 truncate w-full">{epicFileName}</p>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-6 h-6 mb-2 text-white/40 group-hover:text-white/60 transition-colors" />
                                      <p className="mb-1 text-sm text-white/60 font-body text-center"><span className="font-semibold text-white">Click to upload</span><br/>{t("Form.epicPhotoDesc")}</p>
                                    </>
                                  )}
                                </div>
                                <input type="file" required className="hidden" accept="image/*" onChange={handleEpicFileChange} />
                              </label>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="civic-label">{t("Form.referralSourceLabel")}</label>
                              <select className="civic-select w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 font-body text-sm focus:outline-none focus:border-white/30 transition-colors" value={formData.referral_source} onChange={e => setFormData({...formData, referral_source: e.target.value})}>
                                <option value="" disabled>{t("Form.referralSourcePlaceholder")}</option>
                                <option value="socialMedia">{t("Form.referralSources.socialMedia")}</option>
                                <option value="friend">{t("Form.referralSources.friend")}</option>
                                <option value="news">{t("Form.referralSources.news")}</option>
                                <option value="ground">{t("Form.referralSources.ground")}</option>
                                <option value="other">{t("Form.referralSources.other")}</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="civic-label">{t("Form.referralCodeLabel")}</label>
                              <input type="text" className="civic-input" placeholder={t("Form.referralCodePlaceholder")} value={formData.referral_code} onChange={e => setFormData({...formData, referral_code: e.target.value})} />
                            </div>
                          </div>

                          <div className="bg-red/5 border border-red/20 rounded-xl p-4 sm:p-6 mt-8">
                            <label className="flex items-start gap-3 cursor-pointer">
                              <div className="mt-1 flex-shrink-0">
                                <input 
                                  type="checkbox" 
                                  required
                                  className="w-5 h-5 accent-red cursor-pointer"
                                  checked={formData.declaration_agreed} 
                                  onChange={e => setFormData({...formData, declaration_agreed: e.target.checked})} 
                                />
                              </div>
                              <div>
                                <span className="font-body text-sm text-white/80 block leading-relaxed">
                                  <strong className="text-white mb-1 block uppercase tracking-widest text-xs font-mono">{t("Form.declarationLabel")}</strong>
                                  {t("Form.declarationText")}
                                </span>
                              </div>
                            </label>
                          </div>

                        </motion.div>
                      )}

                      {/* Navigation Buttons */}
                      <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-8">
                        {step > 1 ? (
                          <button
                            type="button"
                            onClick={prevStep}
                            className="flex items-center gap-2 px-6 py-3 font-body text-sm font-semibold text-white/60 hover:text-white transition-colors"
                          >
                            <ChevronLeft size={16} />
                            BACK
                          </button>
                        ) : <div></div>}
                        
                        {step < totalSteps ? (
                          <button
                            type="button"
                            onClick={nextStep}
                            className="flex items-center gap-2 bg-charcoal text-white font-body text-sm font-medium tracking-widest uppercase px-8 py-3.5 rounded-xl hover:bg-black transition-all duration-300 shadow-xl shadow-black/20"
                          >
                            NEXT
                            <ChevronRight size={16} />
                          </button>
                        ) : (
                          <button
                            type="submit"
                            disabled={isSubmitting || !formData.declaration_agreed}
                            className="flex items-center justify-center gap-2 bg-red text-white font-body text-sm font-medium tracking-widest uppercase px-10 py-4 rounded-xl hover:bg-red/90 transition-all duration-300 shadow-lg shadow-red/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                              t("Form.submit")
                            )}
                          </button>
                        )}
                      </div>
                    </form>
                  </motion.div>
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
                    THE SYSTEM IS WATCHING
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
