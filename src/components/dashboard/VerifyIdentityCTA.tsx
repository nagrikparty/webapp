"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, ShieldCheck, Loader2, UserCheck } from "lucide-react";
import { createVerificationSession, checkVerificationStatus } from "@/actions/didit";

interface VerifyIdentityCTAProps {
  isVerified: boolean;
  hasSession: boolean;
  translations: {
    verified: string;
    verifyIdentity: string;
    verifying: string;
    verificationFailed: string;
    tryAgain: string;
    pendingStatus: string;
  };
}

export default function VerifyIdentityCTA({ isVerified, hasSession, translations }: VerifyIdentityCTAProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"verified" | "unverified" | "pending" | "failed">(
    isVerified ? "verified" : hasSession ? "pending" : "unverified"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have a pending session, check its status
    if (status === "pending") {
      const checkStatus = async () => {
        const res = await checkVerificationStatus();
        if (res.success) {
          if (res.isVerified) {
            setStatus("verified");
          } else if (res.declined) {
            setStatus("failed");
          }
        }
      };
      
      checkStatus();
      const interval = setInterval(checkStatus, 5000); // Poll every 5s while pending
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleVerifyClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await createVerificationSession();
      if (res.success && res.url) {
        window.location.href = res.url;
      } else {
        setError(res.error || translations.verificationFailed);
        setLoading(false);
      }
    } catch (err) {
      setError(translations.verificationFailed);
      setLoading(false);
    }
  };

  if (status === "verified") {
    return (
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-black/40 mb-2">Status</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <ShieldCheck size={18} />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">{translations.verified}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-black/40 mb-2">Identity Verification</p>
      
      {status === "pending" ? (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg">
          <Loader2 size={18} className="animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">{translations.pendingStatus}</span>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-2">
          <button
            onClick={handleVerifyClick}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red hover:bg-red/90 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <UserCheck size={18} />}
            <span className="font-mono text-xs uppercase tracking-widest font-bold">
              {status === "failed" ? translations.tryAgain : translations.verifyIdentity}
            </span>
          </button>
          {error && <p className="text-xs text-red font-medium max-w-xs">{error}</p>}
        </div>
      )}
    </div>
  );
}
