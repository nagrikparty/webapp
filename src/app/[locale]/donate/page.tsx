"use client";

import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { submitDonation } from "@/actions";
import { useState } from "react";
import { Smartphone, Building2, MapPin, ArrowRight, Check, Copy } from "lucide-react";
import { toast } from "sonner";

export default function DonatePage() {
  useLenis();
  const t = useTranslations("Donate");

  const [form, setForm] = useState({ donor_name: "", amount: "", purpose: "General Fund", transaction_ref: "" });
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.donor_name || !form.amount || !form.transaction_ref) return;
    setSubmitting(true);
    try {
      const result = await submitDonation({
        donor_name: form.donor_name,
        amount: parseInt(form.amount, 10),
        purpose: form.purpose,
        transaction_ref: form.transaction_ref,
        turnstileToken: "dummy-token-for-now", // Will be implemented correctly with Turnstile
      });
      if (result.success) {
        toast.success(t("success") || "Donation submitted successfully!");
        setForm({ donor_name: "", amount: "", purpose: "General Fund", transaction_ref: "" });
      } else {
        toast.error("Failed to submit donation.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyUPI = () => {
    navigator.clipboard.writeText("donate@nagrikparty.in");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const purposeKeys = ["general", "ward", "healthcare", "campaign"] as const;

  const inputClasses = "w-full bg-white border border-black/10 rounded-xl px-4 py-3.5 font-body text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-red/50 focus:ring-1 focus:ring-red/20 transition-all duration-300";
  const labelClasses = "block font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 mb-2";

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen text-black pt-24 pb-24">
          {/* Hero */}
          <section className="pt-8 pb-20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                 style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-2 mb-6 font-mono text-xs text-red uppercase tracking-widest font-bold">
                  <span className="w-2 h-2 rounded-full bg-red animate-pulse"></span>
                  {t("heroTag")}
                </div>
                <h1 className="font-hindi text-[clamp(3.5rem,8vw,6rem)] leading-[0.9] text-black font-semibold mb-6 tracking-tight uppercase">
                  {t("title")}
                </h1>
                <p className="font-body text-xl sm:text-2xl text-black/60 leading-relaxed max-w-2xl">
                  {t("content")}
                </p>
              </motion.div>
            </div>
          </section>

          {/* Donation Methods */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {/* UPI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="bg-white border border-black/10 p-6 rounded-2xl text-center hover:bg-black/10 transition-colors"
              >
                <div className="w-12 h-12 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone size={22} className="text-red" />
                </div>
                <h3 className="font-body text-lg font-bold text-black mb-1">{t("upiTitle")}</h3>
                <p className="font-body text-sm text-black/50 mb-4">{t("upiDesc")}</p>
                <div className="bg-white border border-black/10 rounded-xl p-3 flex items-center justify-between gap-2">
                  <code className="font-mono text-sm text-black font-semibold truncate">donate@nagrikparty.in</code>
                  <button onClick={copyUPI} className="shrink-0 text-black/40 hover:text-red transition-colors">
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>
              </motion.div>

              {/* Bank */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-white border border-black/10 p-6 rounded-2xl text-center hover:bg-black/10 transition-colors"
              >
                <div className="w-12 h-12 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 size={22} className="text-red" />
                </div>
                <h3 className="font-body text-lg font-bold text-black mb-1">{t("bankTitle")}</h3>
                <p className="font-body text-sm text-black/50 mb-4">{t("bankDesc")}</p>
                <div className="text-left font-mono text-xs text-black/60 leading-relaxed bg-white border border-black/10 p-4 rounded-xl">
                  {t("bankContactDetails") || "Please email donate@nagrikparty.in for NEFT/RTGS account details. We will provide our official SBI current account information."}
                </div>
              </motion.div>

              {/* In-Person */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white border border-black/10 p-6 rounded-2xl text-center hover:bg-black/10 transition-colors"
              >
                <div className="w-12 h-12 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={22} className="text-red" />
                </div>
                <h3 className="font-body text-lg font-bold text-black mb-1">{t("inPersonTitle")}</h3>
                <p className="font-body text-sm text-black/50 mb-4">{t("inPersonDesc")}</p>
                <p className="font-mono text-xs text-black/60 leading-relaxed">
                  B-80, Street 8, Ghaffar Manzil, Jamia Nagar, Okhla, New Delhi – 110025
                </p>
              </motion.div>
            </div>

            {/* Donation Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white backdrop-blur-md border border-black/10 rounded-3xl p-6 sm:p-8 mb-12"
            >
              <h2 className="font-body text-2xl font-bold text-black mb-8">{t("formTitle")}</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>{t("donorLabel")}</label>
                    <input
                      type="text"
                      className={inputClasses}
                      placeholder={t("donorPlaceholder")}
                      value={form.donor_name}
                      onChange={(e) => setForm({ ...form, donor_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>{t("amountLabel")}</label>
                    <input
                      type="number"
                      className={inputClasses}
                      placeholder={t("amountPlaceholder")}
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>{t("purposeLabel")}</label>
                    <select
                      className={`${inputClasses} appearance-none cursor-pointer`}
                      value={form.purpose}
                      onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                    >
                      {purposeKeys.map((key) => (
                        <option key={key} value={t(`purposes.${key}`)} className="bg-off-white text-black">
                          {t(`purposes.${key}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClasses}>{t("refLabel")}</label>
                    <input
                      type="text"
                      className={inputClasses}
                      placeholder={t("refPlaceholder")}
                      value={form.transaction_ref}
                      onChange={(e) => setForm({ ...form, transaction_ref: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-red text-black font-mono text-sm font-bold tracking-widest uppercase py-4 rounded-full hover:bg-red/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red/20"
                >
                  {submitting ? "..." : t("submit")}
                </button>
              </form>
            </motion.div>

            {/* View Ledger CTA */}
            <div className="text-center">
              <Link
                href="/transparency"
                className="group inline-flex items-center gap-3 font-mono text-sm text-black/50 hover:text-red transition-colors tracking-widest uppercase font-bold"
              >
                {t("viewLedger")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
