"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { loginMember } from "@/actions";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";
import TurnstileWidget from "@/components/ui/TurnstileWidget";

export default function LoginPage() {
  useLenis();
  const t = useTranslations("Login");
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      toast.error("Please complete the CAPTCHA");
      return;
    }
    setLoading(true);

    const fd = new FormData();
    fd.append("phone", phone);
    fd.append("password", password);
    fd.append("cf-turnstile-response", turnstileToken);

    const result = await loginMember(fd);

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
        <main className="bg-black min-h-screen pt-24 pb-20 flex items-center justify-center">
          <div className="w-full max-w-md px-4 sm:px-6">
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
                  {t("subtitle")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                    {t("phoneLabel")}
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red focus:bg-white/10 transition-colors font-mono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                    {t("passwordLabel")}
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red focus:bg-white/10 transition-colors font-mono"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
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
                  className="w-full bg-red text-white py-4 rounded-full font-mono font-bold hover:bg-red/90 transition-colors uppercase tracking-widest text-sm shadow-lg shadow-red/20 disabled:opacity-50"
                >
                  {loading ? "Authenticating..." : t("submit")}
                </button>
              </form>

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
