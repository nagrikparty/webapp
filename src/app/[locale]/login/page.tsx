"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { sendLoginOtp, verifyLoginOtp } from "@/actions";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";
import TurnstileWidget from "@/components/ui/TurnstileWidget";
import { ArrowRight, Smartphone, KeyRound } from "lucide-react";

export default function LoginPage() {
  useLenis();
  const t = useTranslations("Login");
  const router = useRouter();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      toast.error("Please complete the CAPTCHA");
      return;
    }
    
    if (phone.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    
    setLoading(true);

    const fd = new FormData();
    fd.append("phone", phone);
    fd.append("cf-turnstile-response", turnstileToken);

    const result = await sendLoginOtp(fd);

    if (result.success) {
      toast.success("OTP sent to your mobile number.");
      setStep("otp");
    } else {
      toast.error(result.error || "Failed to send OTP");
    }
    
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid OTP");
      return;
    }

    setLoading(true);

    const fd = new FormData();
    fd.append("phone", phone);
    fd.append("token", otp);

    const result = await verifyLoginOtp(fd);

    if (result.success) {
      toast.success("Successfully logged in.");
      router.push("/dashboard");
    } else {
      toast.error(result.error || "Authentication failed");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-black min-h-screen pt-24 pb-20 flex items-center justify-center relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="w-full max-w-md px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl"
            >
              <div className="text-center mb-8 border-b border-white/10 pb-6">
                <h1 className="font-hindi text-4xl font-bold text-white tracking-tight mb-2 uppercase">
                  {t("title")}
                </h1>
                <p className="font-mono text-white/50 tracking-widest uppercase text-xs">
                  {step === "phone" ? t("subtitle") : "ENTER OTP SENT TO YOUR MOBILE"}
                </p>
              </div>

              {step === "phone" ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/60 flex items-center gap-2">
                      <Smartphone size={14} className="text-red" />
                      {t("phoneLabel")}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-mono">+91</span>
                      <input
                        type="tel"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-red focus:bg-white/10 transition-colors font-mono tracking-widest"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="XXXXXXXXXX"
                      />
                    </div>
                  </div>

                  <TurnstileWidget 
                    onSuccess={(token) => setTurnstileToken(token)} 
                    onError={() => {
                      toast.error("CAPTCHA verification failed. Please try again.");
                      setTurnstileToken("");
                    }} 
                  />

                  <button
                    type="submit"
                    disabled={loading || !turnstileToken}
                    className="group w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-full font-mono font-bold hover:bg-white/90 transition-all duration-300 uppercase tracking-widest text-sm shadow-lg shadow-white/10 disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                    {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/60 flex items-center gap-2">
                      <KeyRound size={14} className="text-red" />
                      ENTER ONE-TIME PASSWORD
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red focus:bg-white/10 transition-colors font-mono tracking-[0.5em] text-center text-xl"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full bg-red text-white py-4 rounded-full font-mono font-bold hover:bg-red/90 transition-colors uppercase tracking-widest text-sm shadow-lg shadow-red/20 disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify & Login"}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    disabled={loading}
                    className="w-full text-white/40 hover:text-white transition-colors font-mono text-xs tracking-widest uppercase mt-4 block text-center"
                  >
                    Change Mobile Number
                  </button>
                </form>
              )}

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="font-body text-white/50 text-sm">
                  {t("joinText")}{" "}
                  <Link href="/join" className="text-white hover:text-red transition-colors underline decoration-white/30 underline-offset-4">
                    {t("joinLink")}
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
