import React, { useState } from "react";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface AuthFlowProps {
  initialMode?: "email" | "login" | "signup";
}

export function AuthFlow({ initialMode = "email" }: AuthFlowProps) {
  const [mode, setMode] = useState<"email" | "login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("volunteer");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [hydrated, setHydrated] = useState(false);

  React.useEffect(() => {
    setHydrated(true);

    if (!supabase) return;

    // Check hash for invalid or expired OTP/link
    const hash = window.location.hash;
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const errorMsgParam = hashParams.get("error_description");
      if (errorMsgParam) {
        setErrorMsg(decodeURIComponent(errorMsgParam));
      } else if (hashParams.get("access_token") === "expired_token" || hash.includes("expired")) {
        setErrorMsg("Invalid or expired OTP/link");
      }
    }

    // Check search params for referrer and validate
    const searchParams = new URLSearchParams(window.location.search);
    const ref = searchParams.get("ref");
    if (ref) {
      const validateReferrer = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.id === ref) {
          setErrorMsg("You cannot refer yourself.");
          localStorage.removeItem("referrer_id");
          return;
        }

        const { data, error } = await supabase.from("profiles").select("id").eq("id", ref).maybeSingle();
        if (error || !data) {
          setErrorMsg("Invalid or malformed referrer link.");
          localStorage.removeItem("referrer_id");
        } else {
          localStorage.setItem("referrer_id", ref);
        }
      };
      validateReferrer();
    }

    // Subscribe to auth state changes
    let isSyncing = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && !isSyncing) {
        isSyncing = true;
        setLoading(true);
        setErrorMsg("");

        const loggedInUser = session.user;
        const storedReferrer = localStorage.getItem("referrer_id");
        if (loggedInUser && storedReferrer && loggedInUser.id === storedReferrer) {
          setErrorMsg("You cannot refer yourself.");
          setLoading(false);
          isSyncing = false;
          return;
        }

        try {
          const res = await fetch("/api/sync-profile", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${session.access_token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              referred_by: storedReferrer || undefined
            })
          });

          if (!res.ok) {
            const resData = await res.json();
            throw new Error(resData.error || "Failed to sync profile.");
          }

          const { role: syncedRole } = await res.json();
          window.location.href = `/dashboard/${syncedRole}`;
        } catch (err: any) {
          setErrorMsg(err.message || "An error occurred during profile sync.");
          setLoading(false);
          isSyncing = false;
        }
      }
    });

    // Check if there is an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !isSyncing) {
        isSyncing = true;
        setLoading(true);
        setErrorMsg("");

        const loggedInUser = session.user;
        const storedReferrer = localStorage.getItem("referrer_id");
        if (loggedInUser && storedReferrer && loggedInUser.id === storedReferrer) {
          setErrorMsg("You cannot refer yourself.");
          setLoading(false);
          isSyncing = false;
          return;
        }

        fetch("/api/sync-profile", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${session.access_token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            referred_by: storedReferrer || undefined
          })
        }).then(async (res) => {
          if (!res.ok) {
            const resData = await res.json();
            throw new Error(resData.error || "Failed to sync profile.");
          }
          const { role: syncedRole } = await res.json();
          window.location.href = `/dashboard/${syncedRole}`;
        }).catch((err: any) => {
          setErrorMsg(err.message || "An error occurred during profile sync.");
          setLoading(false);
          isSyncing = false;
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setErrorMsg("Authentication service is not configured.");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (mode === "email") {
        if (!normalizedEmail) {
          throw new Error("Email is required");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
          throw new Error("Invalid email format");
        }

        const { error } = await supabase.auth.signInWithOtp({
          email: normalizedEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`
          }
        });
        if (error) throw error;
        setSuccessMsg("Magic Link sent successfully! Please check your email.");
      } else {
        if (!normalizedEmail) {
          throw new Error("Email is required");
        }
        if (!password) {
          throw new Error("Password is required");
        }
        if (password.length < 6) {
          throw new Error("Password is too short");
        }
        if (mode === "signup" && role === "member" && password.length < 8) {
          throw new Error("Members require a stronger password");
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
          throw new Error("Invalid email format");
        }

        if (mode === "signup") {
          const res = await supabase.auth.signUp({ 
            email: normalizedEmail, 
            password,
            options: {
              data: { role }
            }
          });
          if (res.error) {
            throw res.error;
          }
          if (res.data?.user) {
            setSuccessMsg("Account created successfully. Redirecting...");
          }
        } else if (mode === "login") {
          const res = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
          if (res.error) {
             throw res.error;
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-flow-container">
      <div className="form-surface">
        <form action="javascript:void(0);" onSubmit={handleSubmit} className="auth-flow-form">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              data-testid="email-input"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@example.com" 
              disabled={loading || (mode !== "email" && initialMode === "email")}
              autoFocus
              required
            />
          </div>

          {(mode === "login" || mode === "signup") && (
            <div className="field">
              <label htmlFor="password">Password</label>
              <input 
                id="password"
                type="password" 
                data-testid="password-input"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                disabled={loading}
                required
                minLength={6}
              />
            </div>
          )}

          {mode === "signup" && (
            <div className="field">
              <label htmlFor="role">Role</label>
              <select 
                id="role"
                data-testid="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
                className="auth-flow-select"
              >
                <option value="volunteer">Volunteer</option>
                <option value="member">Member</option>
              </select>
            </div>
          )}

          {errorMsg && (
            <div data-testid="error-message" className="auth-message error">
              <AlertCircle size={14} />
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div data-testid="success-message" className="auth-message success">
              <CheckCircle size={14} />
              {successMsg}
            </div>
          )}

          <button data-testid="submit-button" className="button primary auth-submit" type="submit" disabled={!hydrated || loading}>
            {loading ? <Loader2 size={18} className="spin" /> : (
              mode === "email" ? "Continue" : (mode === "login" ? "Sign In" : "Sign Up")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
