import { CheckCircle2, Mail, Upload, Loader2, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { lokSabhaToVidhanSabha, delhiConstituenciesAndWards } from "@/lib/delhi_data";

function Result({ saved }: { saved: boolean }) {
  if (!saved) return null;
  return (
    <div className="notice" role="status">
      <CheckCircle2 size={17} style={{ display: "inline", verticalAlign: "-3px" }} />{" "}
      <span className="lang-en">Received. This is saved as an application, not automatic approval.</span>
      <span className="lang-hi">मिल गया। यह आवेदन के रूप में सेव हुआ है, स्वतः स्वीकृति नहीं।</span>
    </div>
  );
}

function getReferrerId(): string | null {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref && /^[0-9a-f-]{36}$/i.test(ref)) return ref;
  return null;
}

export function VolunteerForm() {
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lokSabha, setLokSabha] = useState("");
  const [vidhanSabha, setVidhanSabha] = useState("");
  const assemblies = lokSabha ? lokSabhaToVidhanSabha[lokSabha] : [];
  const wards = vidhanSabha ? delhiConstituenciesAndWards[vidhanSabha] : [];

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    const form = new FormData(event.currentTarget);

    try {
      const body: Record<string, unknown> = {
        type: "volunteer",
        full_name: form.get("name"),
        email: form.get("email"),
        lok_sabha: form.get("lok_sabha"),
        vidhan_sabha: form.get("vidhan_sabha"),
        ward: form.get("ward"),
        skills: form.get("skills"),
        availability: form.get("availability"),
      };

      const referrerId = getReferrerId();
      if (referrerId) {
        if (supabase) {
          const { data: refProfile } = await supabase.from("profiles").select("id").eq("id", referrerId).maybeSingle();
          if (refProfile) body.referred_by = referrerId;
        }
      }

      const res = await fetch("/api/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSaved(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  if (saved) {
    return (
      <div className="form-surface">
        <Result saved={saved} />
      </div>
    );
  }

  return (
    <form className="form-surface" onSubmit={submit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="vol-name">Name</label>
          <input id="vol-name" name="name" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="vol-email">Email signup</label>
          <input id="vol-email" name="email" required type="email" autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="vol-loksabha">Lok Sabha (Parliament)</label>
          <select id="vol-loksabha" name="lok_sabha" required value={lokSabha} onChange={(e) => { setLokSabha(e.target.value); setVidhanSabha(""); }}>
            <option value="">Select Lok Sabha</option>
            {Object.keys(lokSabhaToVidhanSabha).sort().map((ls) => (
              <option key={ls} value={ls}>{ls}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="vol-vidhansabha">Vidhan Sabha (Assembly)</label>
          <select id="vol-vidhansabha" name="vidhan_sabha" required disabled={!lokSabha} value={vidhanSabha} onChange={(e) => setVidhanSabha(e.target.value)}>
            <option value="">Select Assembly</option>
            {assemblies.map((ac) => (
              <option key={ac} value={ac}>{ac}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="vol-ward">Ward</label>
          <select id="vol-ward" name="ward" required disabled={!vidhanSabha}>
            <option value="">Select Ward</option>
            {wards.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="vol-availability">Availability</label>
          <select id="vol-availability" name="availability">
            <option>Weekends</option>
            <option>Weekday evenings</option>
            <option>Field visits</option>
            <option>Remote digital work</option>
          </select>
        </div>
        <div className="field full">
          <label htmlFor="vol-skills">How can you help?</label>
          <textarea id="vol-skills" name="skills" placeholder="Issue verification, translation, social media, legal research, data entry..." />
        </div>
        <label className="checkbox-row field full" htmlFor="vol-disclaimer">
          <input id="vol-disclaimer" required type="checkbox" />
          <span>I understand this is a volunteer/supporter application and not legal party membership.</span>
        </label>
      </div>
      <div className="form-submit-group">
        {errorMsg && (
          <p style={{ color: "var(--red)", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
            <AlertCircle size={14} /> {errorMsg}
          </p>
        )}
        <button className="button green" type="submit" disabled={submitting}>
          {submitting ? <Loader2 className="spin" size={17} /> : <Mail size={17} />}
          {submitting ? "Submitting..." : "Join volunteer list"}
        </button>
      </div>
    </form>
  );
}

export function MembershipForm() {
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [lokSabha, setLokSabha] = useState("");
  const [vidhanSabha, setVidhanSabha] = useState("");
  const assemblies = lokSabha ? lokSabhaToVidhanSabha[lokSabha] : [];
  const wards = vidhanSabha ? delhiConstituenciesAndWards[vidhanSabha] : [];

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    const form = new FormData(event.currentTarget);
    form.append("declaration_agreed", "true");

    const referrerId = getReferrerId();
    if (referrerId) form.append("referred_by", referrerId);

    try {
      const res = await fetch("/api/v1/register-member", {
        method: "POST",
        body: form
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register");
      setSaved(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to register");
    } finally {
      setSubmitting(false);
    }
  }

  if (saved) {
    return (
      <div className="form-surface">
        <Result saved={saved} />
      </div>
    );
  }

  return (
    <form className="form-surface" onSubmit={submit}>
      <div className="step-indicator" style={{ marginBottom: "20px", fontSize: "14px", fontWeight: 600 }}>
        Step {step} of 3: {step === 1 ? "Personal Details" : step === 2 ? "Location Details" : "Document & Declarations"}
      </div>

      <div className="form-grid" style={{ display: step === 1 ? "grid" : "none" }}>
        <div className="field">
          <label htmlFor="mem-name">Full legal name</label>
          <input id="mem-name" name="name" required={step === 1} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="mem-email">Email signup</label>
          <input id="mem-email" name="email" required={step === 1} type="email" autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="mem-parent">Parent / spouse name</label>
          <input id="mem-parent" name="parent" required={step === 1} />
        </div>
        <div className="field">
          <label htmlFor="mem-dob">Date of birth</label>
          <input id="mem-dob" name="dob" required={step === 1} type="date" autoComplete="bday" />
        </div>
        <div className="field">
          <label htmlFor="mem-voterid">EPIC / voter ID reference</label>
          <input id="mem-voterid" name="voter_id" required={step === 1} />
        </div>
      </div>

      <div className="form-grid" style={{ display: step === 2 ? "grid" : "none" }}>
        <div className="field">
          <label htmlFor="mem-loksabha">Lok Sabha (Parliament)</label>
          <select id="mem-loksabha" name="lok_sabha" required={step === 2} value={lokSabha} onChange={(e) => { setLokSabha(e.target.value); setVidhanSabha(""); }}>
            <option value="">Select Lok Sabha</option>
            {Object.keys(lokSabhaToVidhanSabha).sort().map((ls) => (
              <option key={ls} value={ls}>{ls}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="mem-vidhansabha">Vidhan Sabha (Assembly)</label>
          <select id="mem-vidhansabha" name="vidhan_sabha" required={step === 2} disabled={!lokSabha} value={vidhanSabha} onChange={(e) => setVidhanSabha(e.target.value)}>
            <option value="">Select Assembly</option>
            {assemblies.map((ac) => (
              <option key={ac} value={ac}>{ac}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="mem-ward">Ward</label>
          <select id="mem-ward" name="ward" required={step === 2} disabled={!vidhanSabha}>
            <option value="">Select Ward</option>
            {wards.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
        <div className="field full">
          <label htmlFor="mem-address">Residential address</label>
          <textarea id="mem-address" name="address" required={step === 2} autoComplete="street-address" />
        </div>
      </div>

      <div className="form-grid" style={{ display: step === 3 ? "grid" : "none" }}>
        <div className="field full" style={{ background: "rgba(0,0,0,0.02)", padding: "16px", borderRadius: "8px", border: "1px dashed var(--line)" }}>
          <label htmlFor="mem-file" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            Upload Identity Document (Aadhaar or Voter ID)
          </label>
          <input id="mem-file" type="file" name="file" accept="image/*,.pdf" required={step === 3} />
        </div>

        <label className="checkbox-row field full" htmlFor="mem-citizen">
          <input id="mem-citizen" required={step === 3} type="checkbox" />
          <span>I am an Indian citizen, 18 years or older, and a registered elector.</span>
        </label>
        <label className="checkbox-row field full" htmlFor="mem-notmember">
          <input id="mem-notmember" required={step === 3} type="checkbox" />
          <span>I am not currently a member of another ECI-registered political party.</span>
        </label>
        <label className="checkbox-row field full" htmlFor="mem-accept">
          <input id="mem-accept" required={step === 3} type="checkbox" />
          <span>I accept the proposed Party Constitution, Rulebook, Code of Ethics and verification process.</span>
        </label>
      </div>

      {errorMsg && (
        <p style={{ color: "var(--red)", fontSize: "13px", marginTop: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
          <AlertCircle size={14} /> {errorMsg}
        </p>
      )}

      <div className="form-submit-group" style={{ marginTop: "24px" }}>
        {step > 1 && (
          <button type="button" className="button secondary" onClick={() => setStep(s => s - 1)} disabled={submitting}>
            Back
          </button>
        )}
        {step < 3 ? (
          <button type="button" className="button primary" onClick={() => {
            const form = document.querySelector('form.form-surface') as HTMLFormElement;
            if (form && form.checkValidity()) {
              setStep(s => s + 1);
            } else {
              form?.reportValidity();
            }
          }}>
            Next Step
          </button>
        ) : (
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="spin" size={17} /> : <Upload size={17} />}
            {submitting ? "Submitting..." : "Submit membership application"}
          </button>
        )}
      </div>
    </form>
  );
}
