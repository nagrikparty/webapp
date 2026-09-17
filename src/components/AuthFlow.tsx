import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Logo } from "./Logo";
import { BRAND } from "@/lib/brand";

export interface AuthFlowProps {
  initialMode?: "login" | "signup" | "forgot-password";
}

export function AuthFlow({ initialMode = "login" }: AuthFlowProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot-password">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function syncSession(session: import("@supabase/supabase-js").Session): Promise<void> {
    setLoading(true);
    setErrorMsg("");

    const storedReferrer = typeof window !== "undefined" ? localStorage.getItem("referrer_id") : null;

    try {
      const res = await fetch("/api/v1/sync-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referred_by: storedReferrer || undefined,
        }),
      });

      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || "Failed to sync profile.");
      }

      const body = (await res.json()) as { role: string };
      if (body.role === "ADMIN" || body.role === "SUPER_ADMIN" || body.role === "VERIFIER") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/member";
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during profile sync.";
      setErrorMsg(message);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!supabase) return;

    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const errorParam = hashParams.get("error_description");
      if (errorParam) {
        setErrorMsg(decodeURIComponent(errorParam));
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session) {
        await syncSession(session);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        syncSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement> | React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) {
      setErrorMsg("Authentication service is currently unavailable.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSuccessMsg("Password reset link has been sent to your email.");
      } else if (mode === "signup") {
        if (!password || password.length < 8) {
          throw new Error("Password must be at least 8 characters long.");
        }
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim() || undefined,
            },
          },
        });
        if (error) throw error;
        if (data.session) {
          await syncSession(data.session);
        } else {
          setSuccessMsg("Account created! Please check your email to confirm your registration.");
        }
      } else {
        // Login
        if (!password) {
          throw new Error("Password is required.");
        }
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (error) throw error;
        if (data.session) {
          await syncSession(data.session);
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card-wrapper" style={{ maxWidth: "460px", margin: "0 auto", padding: "12px 16px" }}>
      <div
        className="card auth-card"
        style={{
          background: "var(--paper-card)",
          borderRadius: "4px",
          padding: "32px 28px",
          boxShadow: "var(--shadow)",
          border: "1px solid var(--line-strong)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Logo width={160} />
          <div
            style={{
              display: "inline-block",
              marginTop: "12px",
              padding: "3px 8px",
              borderRadius: "2px",
              backgroundColor: "rgba(179, 74, 21, 0.08)",
              border: "1px solid rgba(179, 74, 21, 0.25)",
              color: "var(--saffron)",
              fontSize: "10.5px",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {BRAND.status.phaseLabel}
          </div>
          <h2 style={{ fontSize: "21px", fontFamily: "var(--font-serif)", fontWeight: 700, marginTop: "10px", marginBottom: "4px", color: "var(--ink)" }}>
            {mode === "login" && "Sign In to Your Account"}
            {mode === "signup" && "Create Supporter Account"}
            {mode === "forgot-password" && "Reset Your Password"}
          </h2>
          <div style={{ fontSize: "12.5px", color: "var(--muted)", fontWeight: 500, marginBottom: "8px" }}>
            {mode === "login" && "खाते में प्रवेश करें"}
            {mode === "signup" && "समर्थक खाता बनाएं"}
            {mode === "forgot-password" && "पासवर्ड रीसेट करें"}
          </div>
          <p style={{ fontSize: "13.5px", color: "var(--ink-body)", margin: 0, lineHeight: 1.45 }}>
            {mode === "login" && "Access your digital induction docket, membership card, and document vault."}
            {mode === "signup" && "Join as an enrolled citizen supporter to complete digital induction."}
            {mode === "forgot-password" && "Enter your registered email address to receive secure reset credentials."}
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "rgba(142, 38, 23, 0.06)",
              border: "1px solid rgba(142, 38, 23, 0.25)",
              borderRadius: "3px",
              color: "var(--red)",
              fontSize: "13px",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "rgba(29, 86, 53, 0.06)",
              border: "1px solid rgba(29, 86, 53, 0.25)",
              borderRadius: "3px",
              color: "var(--green)",
              fontSize: "13px",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--muted)", marginBottom: "6px" }}>
                Full Legal Name / पूरा नाम
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="As per official ID"
                required
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  borderRadius: "3px",
                  border: "1px solid var(--line-strong)",
                  fontSize: "14px",
                  background: "var(--paper)",
                  color: "var(--ink)",
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--muted)", marginBottom: "6px" }}>
              Email Address / ईमेल पता
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  borderRadius: "3px",
                  border: "1px solid var(--line-strong)",
                  fontSize: "14px",
                  background: "var(--paper)",
                  color: "var(--ink)",
                }}
              />
            </div>
          </div>

          {mode !== "forgot-password" && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "12.5px", fontWeight: 700, fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--muted)" }}>
                  Password / पासवर्ड
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot-password");
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--blue)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "At least 8 characters" : "Enter password"}
                required
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  borderRadius: "3px",
                  border: "1px solid var(--line-strong)",
                  fontSize: "14px",
                  background: "var(--paper)",
                  color: "var(--ink)",
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="button primary"
            style={{
              width: "100%",
              minHeight: "46px",
              padding: "12px",
              fontSize: "14.5px",
              fontWeight: 700,
              backgroundColor: "var(--ink)",
              color: "#ffffff",
              borderRadius: "3px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "var(--shadow)",
            }}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                {mode === "login" && "Sign In / प्रवेश करें"}
                {mode === "signup" && "Create Account / खाता बनाएं"}
                {mode === "forgot-password" && "Send Reset Link / रीसेट लिंक भेजें"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "var(--muted)" }}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--blue)",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign up / रजिस्टर करें
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--blue)",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign in / लॉगिन करें
              </button>
            </>
          )}
        </div>

        <div
          style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid var(--line)",
            fontSize: "11px",
            color: "var(--muted)",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontFamily: "var(--font-mono)",
          }}
        >
          <ShieldCheck size={14} style={{ color: "var(--green)" }} />
          <span>256-bit encrypted • Cryptographic verification</span>
        </div>
      </div>
    </div>
  );
}
