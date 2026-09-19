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

    if (typeof document !== "undefined") {
      // Domain-wide cookie so the session works on nagrik.party AND
      // administration.nagrik.party (dedicated admin host).
      document.cookie = `sb-access-token=${encodeURIComponent(session.access_token)}; path=/; domain=.nagrik.party; max-age=86400; Secure; SameSite=Lax`;
    }

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
      const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const redirectUrl = urlParams?.get("redirect");

      if (redirectUrl && redirectUrl.startsWith("/") && !redirectUrl.startsWith("//")) {
        window.location.href = redirectUrl;
      } else if (body.role === "ADMIN" || body.role === "SUPER_ADMIN" || body.role === "VERIFIER") {
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
    <div className="auth-card-wrapper" style={{ maxWidth: "460px", margin: "0 auto", padding: "8px 12px" }}>
      <div
        className="card auth-card"
        style={{
          background: "var(--paper-card)",
          borderRadius: "4px",
          padding: "clamp(20px, 4vw, 32px)",
          boxShadow: "var(--shadow)",
          border: "1px solid var(--line-strong)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>
            {mode === "login" && "Sign In to Your Account"}
            {mode === "signup" && "Create Supporter Account"}
            {mode === "forgot-password" && "Reset Your Password"}
          </h2>
          <p style={{ fontSize: "13.5px", color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>
            {mode === "login" && "Access your digital induction docket, membership card, and document vault."}
            {mode === "signup" && "Join as an enrolled citizen supporter to complete digital induction."}
            {mode === "forgot-password" && "Enter your registered email address to receive secure reset credentials."}
          </p>

          <div
            style={{
              marginTop: "14px",
              padding: "10px 12px",
              background: "rgba(245, 130, 32, 0.06)",
              border: "1px solid rgba(245, 130, 32, 0.2)",
              borderRadius: "3px",
              fontSize: "12px",
              lineHeight: 1.45,
              color: "var(--ink-body)",
              textAlign: "left",
            }}
          >
            <strong>Account ≠ Party Membership:</strong> Creating an account registers your authenticated profile. Official party membership requires completing the 10-step induction, submitting identity evidence, and receiving verification approval.
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "rgba(220, 38, 38, 0.06)",
              border: "1px solid rgba(220, 38, 38, 0.25)",
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
              backgroundColor: "rgba(4, 106, 56, 0.06)",
              border: "1px solid rgba(4, 106, 56, 0.25)",
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
                Full Legal Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="As per official ID"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "4px",
                  border: "1px solid var(--line-strong)",
                  fontSize: "16px",
                  background: "var(--paper)",
                  color: "var(--ink)",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--muted)", marginBottom: "6px" }}>
              Email Address
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
                  padding: "12px 14px",
                  borderRadius: "4px",
                  border: "1px solid var(--line-strong)",
                  fontSize: "16px",
                  background: "var(--paper)",
                  color: "var(--ink)",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {mode !== "forgot-password" && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "12.5px", fontWeight: 700, fontFamily: "var(--font-mono)", textTransform: "uppercase", color: "var(--muted)" }}>
                  Password
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
                      fontSize: "12.5px",
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
                  padding: "12px 14px",
                  borderRadius: "4px",
                  border: "1px solid var(--line-strong)",
                  fontSize: "16px",
                  background: "var(--paper)",
                  color: "var(--ink)",
                  boxSizing: "border-box",
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
              minHeight: "48px",
              padding: "12px",
              fontSize: "15px",
              fontWeight: 700,
              backgroundColor: "var(--ink)",
              color: "#ffffff",
              borderRadius: "4px",
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
                {mode === "login" && "Sign In"}
                {mode === "signup" && "Create Account"}
                {mode === "forgot-password" && "Send Reset Link"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: "22px", textAlign: "center", fontSize: "13.5px", color: "var(--muted)" }}>
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
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign up
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
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign in
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
          <span>256-bit encrypted · Cryptographic verification</span>
        </div>
      </div>
    </div>
  );
}
