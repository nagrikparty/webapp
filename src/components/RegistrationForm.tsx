import React, { useState } from "react";
import { CheckCircle2, Upload, Loader2, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { lokSabhaToVidhanSabha, delhiConstituenciesAndWards } from "@/lib/delhi_data";

export function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    parent: "",
    dob: "",
    address: "",
    lok_sabha: "",
    vidhan_sabha: "",
    ward: "",
    voter_id: "",
    declaration_agreed: false
  });
  
  const [idFile, setIdFile] = useState<File | null>(null);

  const assemblies = formData.lok_sabha ? lokSabhaToVidhanSabha[formData.lok_sabha as keyof typeof lokSabhaToVidhanSabha] || [] : [];
  const wards = formData.vidhan_sabha ? delhiConstituenciesAndWards[formData.vidhan_sabha as keyof typeof delhiConstituenciesAndWards] || [] : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setIdFile(file);
  };

  const nextStep = () => setStep(s => Math.min(3, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }
    
    if (!idFile) {
      setError("Please upload your identity document.");
      return;
    }

    setSubmitting(true);
    setError("");

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value.toString());
    });
    payload.append("file", idFile);

    try {
      const res = await fetch("/api/v1/register-member", {
        method: "POST",
        body: payload
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Submission failed");
      } else {
        setSaved(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  if (saved) {
    return (
      <div className="form-surface notice" style={{ textAlign: "center", padding: "40px 20px" }}>
        <CheckCircle2 size={48} style={{ color: "var(--green)", margin: "0 auto 16px" }} />
        <h3>Application Received</h3>
        <p>Your membership application is pending verification.</p>
      </div>
    );
  }

  return (
    <form className="form-surface" onSubmit={submit}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", fontSize: "14px", fontWeight: "bold" }}>
        <span style={{ color: step >= 1 ? "var(--ink)" : "var(--line)" }}>1. Personal</span>
        <span style={{ color: step >= 2 ? "var(--ink)" : "var(--line)" }}>2. Address</span>
        <span style={{ color: step >= 3 ? "var(--ink)" : "var(--line)" }}>3. ID & Declarations</span>
      </div>

      <div className="form-grid">
        {step === 1 && (
          <>
            <div className="field">
              <label>Full legal name</label>
              <input name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="field">
              <label>Email address</label>
              <input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="field">
              <label>Parent / spouse name</label>
              <input name="parent" value={formData.parent} onChange={handleInputChange} required />
            </div>
            <div className="field">
              <label>Date of birth</label>
              <input name="dob" type="date" value={formData.dob} onChange={handleInputChange} required />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="field full">
              <label>Residential address</label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} required />
            </div>
            <div className="field">
              <label>Lok Sabha (Parliament)</label>
              <select name="lok_sabha" required value={formData.lok_sabha} onChange={(e) => { handleInputChange(e); setFormData(f => ({...f, vidhan_sabha: "", ward: ""})) }}>
                <option value="">Select Lok Sabha</option>
                {Object.keys(lokSabhaToVidhanSabha).sort().map((ls) => (
                  <option key={ls} value={ls}>{ls}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Vidhan Sabha (Assembly)</label>
              <select name="vidhan_sabha" required disabled={!formData.lok_sabha} value={formData.vidhan_sabha} onChange={(e) => { handleInputChange(e); setFormData(f => ({...f, ward: ""})) }}>
                <option value="">Select Assembly</option>
                {assemblies.map((ac) => (
                  <option key={ac} value={ac}>{ac}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Ward</label>
              <select name="ward" required disabled={!formData.vidhan_sabha} value={formData.ward} onChange={handleInputChange}>
                <option value="">Select Ward</option>
                {wards.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="field full">
              <label>EPIC / Voter ID Number</label>
              <input name="voter_id" value={formData.voter_id} onChange={handleInputChange} required />
            </div>
            <div className="field full" style={{ background: "rgba(0,0,0,0.02)", padding: "16px", borderRadius: "8px", border: "1px dashed var(--line)" }}>
              <label>Upload Identity Document (Aadhaar or Voter ID)</label>
              <input type="file" accept="image/*,.pdf" required onChange={handleFileChange} />
            </div>
            
            <label className="checkbox-row field full">
              <input name="declaration_agreed" checked={formData.declaration_agreed} onChange={handleInputChange} required type="checkbox" />
              <span>I confirm I am an Indian citizen (18+), not a member of another ECI-registered party, and accept the Party Constitution.</span>
            </label>

            {error && (
              <div className="field full" style={{ color: "var(--red)", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}
          </>
        )}
      </div>

      <div className="form-submit-group" style={{ marginTop: "24px", display: "flex", justifyContent: "space-between" }}>
        {step > 1 ? (
          <button type="button" className="button" onClick={prevStep} disabled={submitting}>
            <ChevronLeft size={17} /> Back
          </button>
        ) : <div />}
        
        {step < 3 ? (
          <button type="button" className="button primary" onClick={() => {
            const form = document.querySelector<HTMLFormElement>("form");
            if (form?.checkValidity()) nextStep();
            else form?.reportValidity();
          }}>
            Next <ChevronRight size={17} />
          </button>
        ) : (
          <button type="submit" className="button primary" disabled={submitting}>
            {submitting ? <Loader2 className="spin" size={17} /> : <Upload size={17} />}
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        )}
      </div>
    </form>
  );
}
