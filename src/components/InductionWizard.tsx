import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Upload,
  Loader2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Check,
  Stamp,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { delhiConstituenciesAndWards } from "@/lib/delhi_data";
import { BRAND } from "@/lib/brand";

import {
  CONSTITUTIONAL_DECLARATION_V1,
  DATA_CONSENT_V1,
  MEMBERSHIP_CATEGORIES,
  PARTICIPATION_AREAS,
  IDENTITY_PROOF_TYPES,
} from "@/lib/declarations";

export function InductionWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedApp, setSubmittedApp] = useState<{ id: string; number: string } | null>(null);

  const [personalDetails, setPersonalDetails] = useState({
    full_legal_name: "",
    parent_or_guardian_name: "",
    date_of_birth: "",
    gender: "Male",
    occupation: "",
    phone: "",
    email: "",
    address_line1: "",
    address_line2: "",
    state: "Delhi",
    district: "South East",
    vidhan_sabha: "Okhla",
    ward: "Zakir Nagar",
    pincode: "110025",
  });

  const [electoralDetails, setElectoralDetails] = useState({
    identity_proof_type: "Voter ID (EPIC)",
    epic_number: "",
    vidhan_sabha: "Okhla",
    part_number: "",
    serial_number: "",
    polling_station: "",
    identity_document_id: "",
  });

  const [uploadedDoc, setUploadedDoc] = useState<{
    id: string;
    filename: string;
    sha256: string;
    extractedFields?: Record<string, string>;
  } | null>(null);

  const [membershipCategory, setMembershipCategory] = useState("Primary Member");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [declarationAgreed, setDeclarationAgreed] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [typedSignature, setTypedSignature] = useState("");

  const vidhanSabhas = Object.keys(delhiConstituenciesAndWards);
  const availableWards =
    delhiConstituenciesAndWards[
      personalDetails.vidhan_sabha as keyof typeof delhiConstituenciesAndWards
    ] || [];

  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSavedMsg, setDraftSavedMsg] = useState("");
  const [correctionNotes, setCorrectionNotes] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserData() {
      if (!supabase) return;
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setNeedsAuth(true);
        setLoading(false);
        return;
      }

      setPersonalDetails((prev) => ({
        ...prev,
        email: session.user.email || "",
      }));

      // Check if user already has an existing application
      const token = session.access_token;
      const res = await fetch("/api/v1/member/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.application) {
          const app = data.application;
          if (app.status === "APPROVED" || app.status === "SUBMITTED" || app.status === "UNDER_REVIEW") {
            setSubmittedApp({
              id: app.id,
              number: app.application_number,
            });
          } else {
            // DRAFT or NEEDS_CORRECTION
            if (app.status === "NEEDS_CORRECTION") {
              setCorrectionNotes(app.correction_notes);
            }
            if (app.membership_category) {
              setMembershipCategory(app.membership_category);
            }
            const addr = Array.isArray(app.member_addresses) ? app.member_addresses[0] : app.member_addresses;
            if (addr) {
              setPersonalDetails((prev) => ({
                ...prev,
                full_legal_name: addr.full_legal_name || prev.full_legal_name,
                parent_or_guardian_name: addr.parent_or_guardian_name || prev.parent_or_guardian_name,
                date_of_birth: addr.date_of_birth || prev.date_of_birth,
                gender: addr.gender || prev.gender,
                occupation: addr.occupation || prev.occupation,
                phone: addr.phone || prev.phone,
                email: addr.email || prev.email,
                address_line1: addr.address_line1 || prev.address_line1,
                address_line2: addr.address_line2 || prev.address_line2,
                state: addr.state || prev.state,
                district: addr.district || prev.district,
                vidhan_sabha: addr.vidhan_sabha || prev.vidhan_sabha,
                ward: addr.ward || prev.ward,
                pincode: addr.pincode || prev.pincode,
              }));
            }
            const elec = Array.isArray(app.electoral_details) ? app.electoral_details[0] : app.electoral_details;
            if (elec) {
              setElectoralDetails((prev) => ({
                ...prev,
                identity_proof_type: elec.identity_proof_type || prev.identity_proof_type,
                epic_number: elec.epic_number || prev.epic_number,
                vidhan_sabha: elec.vidhan_sabha || prev.vidhan_sabha,
                part_number: elec.part_number || prev.part_number,
                serial_number: elec.serial_number || prev.serial_number,
                polling_station: elec.polling_station || prev.polling_station,
              }));
            }
            const part = Array.isArray(app.member_participation) ? app.member_participation[0] : app.member_participation;
            if (part && Array.isArray(part.interest_areas)) {
              setSelectedInterests(part.interest_areas);
            }
            const docs = Array.isArray(app.documents) ? app.documents : [];
            if (docs.length > 0) {
              const lastDoc = docs[docs.length - 1];
              setUploadedDoc({
                id: lastDoc.id,
                filename: lastDoc.original_filename,
                sha256: lastDoc.sha256_hash,
              });
            }
            const decl = Array.isArray(app.membership_declarations) ? app.membership_declarations[0] : app.membership_declarations;
            if (decl) {
              setDeclarationAgreed(decl.accepts_constitution !== false);
            }
            const cons = Array.isArray(app.membership_consents) ? app.membership_consents[0] : app.membership_consents;
            if (cons) {
              setConsentAgreed(true);
            }
            const sig = Array.isArray(app.signatures) ? app.signatures[0] : app.signatures;
            if (sig && sig.typed_name) {
              setTypedSignature(sig.typed_name);
            }
            // Step resumption
            if (!addr?.full_legal_name) setStep(2);
            else if (!docs.length) setStep(3);
            else if (!decl) setStep(6);
            else setStep(8);
          }
        }
      }
      setLoading(false);
    }
    loadUserData();
  }, []);

  async function saveDraft(silent = false) {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    if (!silent) setSavingDraft(true);
    setDraftSavedMsg("");

    try {
      const payload = {
        action: "draft",
        membershipCategory,
        personalDetails,
        electoralDetails,
        participation: {
          interest_areas: selectedInterests,
        },
        declaration: {
          declaration_text: CONSTITUTIONAL_DECLARATION_V1.text,
          declaration_version: CONSTITUTIONAL_DECLARATION_V1.version,
          bears_true_faith: declarationAgreed,
          upholds_sovereignty: declarationAgreed,
          accepts_constitution: declarationAgreed,
          no_other_party_membership: declarationAgreed,
          no_prohibited_conduct: declarationAgreed,
        },
        consent: {
          consent_text: DATA_CONSENT_V1.text,
          consent_version: DATA_CONSENT_V1.version,
        },
        signature: {
          signature_type: "TYPED_CONFIRMATION",
          typed_name: typedSignature.trim(),
          document_id: uploadedDoc?.id || null,
        },
      };

      const res = await fetch("/api/v1/member/induction", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (!silent) {
          setDraftSavedMsg("Progress saved securely to Supabase draft.");
          setTimeout(() => setDraftSavedMsg(""), 4000);
        }
      }
    } catch {
      // ignore silent error
    } finally {
      if (!silent) setSavingDraft(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabase) {
      setError("Service unavailable");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", "identity_proof");

    try {
      const res = await fetch("/api/v1/documents/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadedDoc({
        id: data.document.id,
        filename: data.document.original_filename,
        sha256: data.document.sha256_hash,
        extractedFields: data.document.extracted_fields,
      });

      setElectoralDetails((prev) => ({
        ...prev,
        identity_document_id: data.document.id,
        epic_number: data.document.extracted_fields?.id_number || prev.epic_number,
      }));

      if (data.document.extracted_fields?.full_name && !personalDetails.full_legal_name) {
        setPersonalDetails((prev) => ({
          ...prev,
          full_legal_name: data.document.extracted_fields.full_name,
        }));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Document upload failed");
    } finally {
      setLoading(false);
    }
  }

  function toggleInterest(area: string) {
    setSelectedInterests((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  async function handleFinalSubmit() {
    if (!declarationAgreed) {
      setError("You must agree to the Constitutional Declaration.");
      return;
    }
    if (!consentAgreed) {
      setError("You must agree to the Data Consent terms.");
      return;
    }
    if (!typedSignature.trim()) {
      setError("Please provide your typed signature.");
      return;
    }

    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        action: "submit",
        membershipCategory,
        personalDetails,
        electoralDetails,
        participation: {
          interest_areas: selectedInterests,
        },
        declaration: {
          declaration_text: CONSTITUTIONAL_DECLARATION_V1.text,
          declaration_version: CONSTITUTIONAL_DECLARATION_V1.version,
          bears_true_faith: true,
          upholds_sovereignty: true,
          accepts_constitution: true,
          no_other_party_membership: true,
          no_prohibited_conduct: true,
        },
        consent: {
          consent_text: DATA_CONSENT_V1.text,
          consent_version: DATA_CONSENT_V1.version,
        },
        signature: {
          signature_type: "TYPED_CONFIRMATION",
          typed_name: typedSignature.trim(),
          document_id: uploadedDoc?.id || null,
        },
      };

      const res = await fetch("/api/v1/member/induction", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setSubmittedApp({
        id: data.application_id,
        number: data.application_number,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit induction.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading && !uploadedDoc) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <Loader2 className="animate-spin" size={32} style={{ margin: "0 auto 16px" }} />
        <p>Loading your membership profile...</p>
      </div>
    );
  }

  if (needsAuth) {
    return (
      <div
        className="card"
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "48px 32px",
          textAlign: "center",
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid var(--line)",
          boxShadow: "0 12px 36px rgba(0,0,0,0.06)",
        }}
      >
        <ShieldCheck size={56} style={{ color: BRAND.colors.saffron, margin: "0 auto 16px" }} />
        <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>Sign In to Start Digital Induction</h2>
        <p style={{ color: "var(--muted)", fontSize: "14px", maxWidth: "480px", margin: "0 auto 24px" }}>
          To apply for founding membership under Phase 1, please log in with your registered account.
        </p>
        <a href="/login" className="button button-primary" style={{ padding: "10px 24px" }}>
          Log In / Sign Up
        </a>
      </div>
    );
  }

  if (submittedApp) {
    return (
      <div
        className="card"
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "48px 32px",
          textAlign: "center",
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid var(--line)",
          boxShadow: "0 12px 36px rgba(0,0,0,0.06)",
        }}
      >
        <CheckCircle2 size={56} style={{ color: BRAND.colors.green, margin: "0 auto 16px" }} />
        <div
          style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: "100px",
            backgroundColor: "rgba(0, 135, 62, 0.1)",
            color: BRAND.colors.green,
            fontWeight: 700,
            fontSize: "12px",
            marginBottom: "12px",
          }}
        >
          APPLICATION SUBMITTED
        </div>
        <h2 style={{ fontSize: "26px", fontWeight: 800, margin: "0 0 8px" }}>
          Digital Induction Complete
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "15px", maxWidth: "500px", margin: "0 auto 24px" }}>
          Your membership application has been safely received and queued for organizational verification.
        </p>

        <div
          style={{
            background: "var(--paper)",
            padding: "20px",
            borderRadius: "12px",
            maxWidth: "400px",
            margin: "0 auto 24px",
            textAlign: "left",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
            Application Reference Number
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--ink)", marginTop: "4px" }}>
            {submittedApp.number}
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "8px" }}>
            Status: <strong>Under Verification</strong>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <a href="/member" className="button primary">
            Go to Member Dashboard
          </a>
          <a href="/member/status" className="button">
            View Live Status
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px" }}>
      {/* Progress Bar Header */}
      <div
        style={{
          background: "var(--paper-card)",
          padding: "18px 22px",
          borderRadius: "4px",
          border: "1px solid var(--line-strong)",
          marginBottom: "20px",
          boxShadow: "var(--shadow)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--saffron)", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
            Step {step} of 10
          </span>
          <span style={{ fontSize: "12.5px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            {step === 1 && "Account Confirmation"}
            {step === 2 && "Personal Details"}
            {step === 3 && "Identity & Electoral Proof"}
            {step === 4 && "Membership Category"}
            {step === 5 && "Participation Areas"}
            {step === 6 && "Constitutional Declaration"}
            {step === 7 && "Data Consent Framework"}
            {step === 8 && "Application Review"}
            {step === 9 && "Digital Signature"}
            {step === 10 && "Submission Confirmation"}
          </span>
        </div>
        <div style={{ height: "4px", background: "var(--paper-subtle)", borderRadius: "2px", overflow: "hidden", border: "1px solid var(--line)" }}>
          <div
            style={{
              height: "100%",
              width: `${(step / 10) * 100}%`,
              background: `var(--ink)`,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {correctionNotes && (
        <div
          style={{
            padding: "14px 18px",
            backgroundColor: "rgba(245, 130, 32, 0.08)",
            border: "1px solid rgba(245, 130, 32, 0.35)",
            borderRadius: "4px",
            color: "var(--ink)",
            fontSize: "13.5px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "var(--saffron)", marginBottom: "4px" }}>
            <AlertCircle size={16} />
            <span>Verification Desk Action Required (Needs Correction)</span>
          </div>
          <div style={{ fontSize: "13px", color: "var(--ink)", lineHeight: 1.5 }}>
            {correctionNotes}
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "rgba(142, 38, 23, 0.08)",
            border: "1px solid rgba(142, 38, 23, 0.25)",
            borderRadius: "3px",
            color: "var(--red)",
            fontSize: "13.5px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Step Container */}
      <div
        className="card"
        style={{
          background: "var(--paper-card)",
          borderRadius: "4px",
          padding: "28px 24px",
          border: "1px solid var(--line-strong)",
          boxShadow: "var(--shadow)",
        }}
      >
        {/* STEP 1: Account */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px" }}>
              Step 1: Account Confirmation
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px" }}>
              Your authenticated account will be anchored to this membership record.
            </p>
            <div style={{ background: "var(--paper)", padding: "16px", borderRadius: "10px", marginBottom: "24px" }}>
              <div style={{ fontSize: "12px", color: "var(--muted)", textTransform: "uppercase" }}>Registered Email</div>
              <div style={{ fontSize: "16px", fontWeight: 700, marginTop: "4px" }}>{personalDetails.email}</div>
            </div>
            <div className="notice" style={{ marginBottom: "24px" }}>
              <strong>Notice:</strong> An account alone does not constitute party membership. Completion of this 10-step induction, document upload, and verifier approval are required for membership issuance.
            </div>
          </div>
        )}

        {/* STEP 2: Personal Details */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px" }}>
              Step 2: Personal Details
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px" }}>
              Required for internal membership roll records in compliance with organisational standards.
            </p>
            <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  value={personalDetails.full_legal_name}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, full_legal_name: e.target.value })}
                  placeholder="As per official documents"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Father / Mother / Guardian Name *
                </label>
                <input
                  type="text"
                  value={personalDetails.parent_or_guardian_name}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, parent_or_guardian_name: e.target.value })}
                  placeholder="Guardian's name"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={personalDetails.date_of_birth}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, date_of_birth: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Gender *
                </label>
                <select
                  value={personalDetails.gender}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Non-binary</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  value={personalDetails.phone}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Occupation
                </label>
                <input
                  type="text"
                  value={personalDetails.occupation}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, occupation: e.target.value })}
                  placeholder="e.g. Professional, Social Worker, Student"
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Residential Address *
                </label>
                <input
                  type="text"
                  value={personalDetails.address_line1}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, address_line1: e.target.value })}
                  placeholder="House number, Street, Locality"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Vidhan Sabha Constituency *
                </label>
                <select
                  value={personalDetails.vidhan_sabha}
                  onChange={(e) =>
                    setPersonalDetails({
                      ...personalDetails,
                      vidhan_sabha: e.target.value,
                      ward: delhiConstituenciesAndWards[e.target.value as keyof typeof delhiConstituenciesAndWards]?.[0] || "",
                    })
                  }
                >
                  {vidhanSabhas.map((vs) => (
                    <option key={vs} value={vs}>
                      {vs}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  Ward / Area
                </label>
                <select
                  value={personalDetails.ward || ""}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, ward: e.target.value })}
                >
                  {availableWards.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  PIN Code *
                </label>
                <input
                  type="text"
                  value={personalDetails.pincode}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, pincode: e.target.value })}
                  placeholder="6-digit PIN code"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                  State
                </label>
                <input type="text" value={personalDetails.state} disabled style={{ background: "var(--paper)" }} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Identity & Electoral Details */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px" }}>
              Step 3: Identity & Electoral Details
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px" }}>
              Upload your proof of identity. Documents are encrypted and stored in private storage buckets.
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Identity Proof Type *
              </label>
              <select
                value={electoralDetails.identity_proof_type}
                onChange={(e) => setElectoralDetails({ ...electoralDetails, identity_proof_type: e.target.value })}
              >
                {IDENTITY_PROOF_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Document / ID Number *
              </label>
              <input
                type="text"
                value={electoralDetails.epic_number || ""}
                onChange={(e) => setElectoralDetails({ ...electoralDetails, epic_number: e.target.value })}
                placeholder="e.g. EPIC / ID / Document Number"
                required
              />
              <span style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px", display: "block" }}>
                Enter the identification number corresponding to your uploaded document.
              </span>
            </div>

            <div
              style={{
                border: "2px dashed var(--line)",
                padding: "24px",
                borderRadius: "12px",
                textAlign: "center",
                background: "var(--paper)",
                marginBottom: "20px",
              }}
            >
              <Upload size={32} style={{ color: "var(--muted)", margin: "0 auto 8px" }} />
              <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>
                {uploadedDoc ? uploadedDoc.filename : "Select Identity Document to Upload"}
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "12px" }}>
                JPEG, PNG, WEBP, or PDF (Max 5MB)
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="doc-file-input"
              />
              <label htmlFor="doc-file-input" className="button" style={{ cursor: "pointer", display: "inline-block" }}>
                {uploadedDoc ? "Replace Document" : "Choose File"}
              </label>
            </div>

            {uploadedDoc && (
              <div
                style={{
                  background: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  padding: "16px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  color: "#389e0d",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
                  <ShieldCheck size={18} />
                  <span>Document securely uploaded & SHA-256 hashed</span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "11px", marginTop: "6px", color: "#52c41a" }}>
                  SHA-256: {uploadedDoc.sha256}
                </div>
                {uploadedDoc.extractedFields && Object.keys(uploadedDoc.extractedFields).length > 0 && (
                  <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px dashed #b7eb8f" }}>
                    <strong>Extracted Data:</strong>
                    {uploadedDoc.extractedFields.full_name && <div>Name: {uploadedDoc.extractedFields.full_name}</div>}
                    {uploadedDoc.extractedFields.id_number && <div>ID: {uploadedDoc.extractedFields.id_number}</div>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Membership Category */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px" }}>
              Step 4: Membership Category
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px" }}>
              Select the category in which you are seeking to participate.
            </p>
            <div style={{ display: "grid", gap: "12px" }}>
              {MEMBERSHIP_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setMembershipCategory(cat.id)}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border: membershipCategory === cat.id ? `2px solid ${BRAND.colors.saffron}` : "1px solid var(--line)",
                    background: membershipCategory === cat.id ? "rgba(245, 130, 32, 0.04)" : "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px" }}>{cat.id}</div>
                    <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>{cat.desc}</div>
                  </div>
                  {membershipCategory === cat.id && <CheckCircle2 size={20} color={BRAND.colors.saffron} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Participation Areas */}
        {step === 5 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px" }}>
              Step 5: Areas of Participation
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px" }}>
              Select domains where you would like to actively contribute or volunteer.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {PARTICIPATION_AREAS.map((area) => {
                const isSelected = selectedInterests.includes(area);
                return (
                  <div
                    key={area}
                    onClick={() => toggleInterest(area)}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "8px",
                      border: isSelected ? `1px solid ${BRAND.colors.green}` : "1px solid var(--line)",
                      background: isSelected ? "rgba(0, 135, 62, 0.05)" : "#fff",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "4px",
                        border: isSelected ? `1px solid ${BRAND.colors.green}` : "1px solid var(--line)",
                        background: isSelected ? BRAND.colors.green : "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected && <Check size={12} color="#fff" />}
                    </div>
                    <span>{area}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Constitutional Declaration */}
        {step === 6 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 800, margin: 0 }}>
                Step 6: Constitutional Declaration
              </h3>
              <span style={{ fontSize: "12px", background: "var(--paper-subtle)", border: "1px solid var(--line)", padding: "2px 8px", borderRadius: "4px", fontFamily: "var(--font-mono)" }}>
                v{CONSTITUTIONAL_DECLARATION_V1.version}
              </span>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "16px" }}>
              {CONSTITUTIONAL_DECLARATION_V1.title} ({CONSTITUTIONAL_DECLARATION_V1.titleHi})
            </p>

            <div
              style={{
                background: "var(--paper)",
                padding: "20px",
                borderRadius: "8px",
                maxHeight: "260px",
                overflowY: "auto",
                fontSize: "13px",
                lineHeight: 1.6,
                marginBottom: "20px",
                border: "1px solid var(--line)",
                whiteSpace: "pre-line",
              }}
            >
              {CONSTITUTIONAL_DECLARATION_V1.text}
            </div>

            <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={declarationAgreed}
                onChange={(e) => setDeclarationAgreed(e.target.checked)}
                style={{ marginTop: "3px" }}
              />
              <span style={{ fontSize: "14px", fontWeight: 600 }}>
                I have read, understood, and solemnly accept the Constitutional Declaration (v{CONSTITUTIONAL_DECLARATION_V1.version}) in its entirety.
              </span>
            </label>
          </div>
        )}

        {/* STEP 7: Data Consent */}
        {step === 7 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 800, margin: 0 }}>
                Step 7: Data Consent Framework
              </h3>
              <span style={{ fontSize: "12px", background: "var(--paper-subtle)", border: "1px solid var(--line)", padding: "2px 8px", borderRadius: "4px", fontFamily: "var(--font-mono)" }}>
                v{DATA_CONSENT_V1.version}
              </span>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "16px" }}>
              {DATA_CONSENT_V1.title} ({DATA_CONSENT_V1.titleHi})
            </p>

            <div
              style={{
                background: "var(--paper)",
                padding: "20px",
                borderRadius: "8px",
                maxHeight: "260px",
                overflowY: "auto",
                fontSize: "13px",
                lineHeight: 1.6,
                marginBottom: "20px",
                border: "1px solid var(--line)",
                whiteSpace: "pre-line",
              }}
            >
              {DATA_CONSENT_V1.text}
            </div>

            <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                style={{ marginTop: "3px" }}
              />
              <span style={{ fontSize: "14px", fontWeight: 600 }}>
                I voluntarily give my informed consent under the Statutory Data Consent Framework (v{DATA_CONSENT_V1.version}).
              </span>
            </label>
          </div>
        )}

        {/* STEP 8: Applicant Confirmation & Review */}
        {step === 8 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px" }}>
              Step 8: Application Review
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px" }}>
              Review all details before digital signing and submission.
            </p>

            <div style={{ display: "grid", gap: "12px", fontSize: "14px" }}>
              <div style={{ padding: "12px", background: "var(--paper)", borderRadius: "8px" }}>
                <strong>Legal Name:</strong> {personalDetails.full_legal_name || "Not provided"}
              </div>
              <div style={{ padding: "12px", background: "var(--paper)", borderRadius: "8px" }}>
                <strong>Guardian / Parent:</strong> {personalDetails.parent_or_guardian_name || "Not provided"}
              </div>
              <div style={{ padding: "12px", background: "var(--paper)", borderRadius: "8px" }}>
                <strong>DOB & Gender:</strong> {personalDetails.date_of_birth} • {personalDetails.gender}
              </div>
              <div style={{ padding: "12px", background: "var(--paper)", borderRadius: "8px" }}>
                <strong>Constituency & Ward:</strong> {personalDetails.vidhan_sabha} • {personalDetails.ward}
              </div>
              <div style={{ padding: "12px", background: "var(--paper)", borderRadius: "8px" }}>
                <strong>Category:</strong> {membershipCategory}
              </div>
              <div style={{ padding: "12px", background: "var(--paper)", borderRadius: "8px" }}>
                <strong>Document Uploaded:</strong> {uploadedDoc ? uploadedDoc.filename : "No document uploaded"}
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: Signature */}
        {step === 9 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px" }}>
              Step 9: Digital Confirmation Signature
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px" }}>
              Enter your full legal name as your confirmation signature for this submission.
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Typed Legal Confirmation *
              </label>
              <input
                type="text"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                placeholder="Type your full legal name"
                required
                style={{ fontSize: "16px", padding: "12px" }}
              />
            </div>

            <div className="notice">
              <strong>Notice:</strong> This typed confirmation records your submission timestamp, user ID, and IP address for internal audit traceability. It is verified by the organisation prior to membership admission.
            </div>
          </div>
        )}

        {/* STEP 10: Submission Readiness */}
        {step === 10 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px" }}>
              Step 10: Submit Application
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "20px" }}>
              Your application is complete and ready for submission to the verification desk.
            </p>

            <div
              style={{
                background: "var(--paper)",
                padding: "24px",
                borderRadius: "12px",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              <Stamp size={40} style={{ color: BRAND.colors.saffron, margin: "0 auto 12px" }} />
              <div style={{ fontSize: "16px", fontWeight: 700 }}>Ready to Submit</div>
              <p style={{ color: "var(--muted)", fontSize: "13px", maxWidth: "420px", margin: "8px auto 0" }}>
                Once submitted, you will receive an Application Reference Number to track your verification status.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "32px", paddingTop: "20px", borderTop: "1px solid var(--line)" }}>
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="button"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : <div />}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {step < 10 && (
              <button
                type="button"
                onClick={() => saveDraft(false)}
                disabled={savingDraft}
                className="button"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px" }}
                title="Save application progress as draft"
              >
                {savingDraft ? <Loader2 size={14} className="animate-spin" /> : null}
                Save Draft
              </button>
            )}

            {step < 10 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 2 && !personalDetails.full_legal_name) {
                    setError("Please fill in your legal name.");
                    return;
                  }
                  if (step === 3 && !uploadedDoc) {
                    setError("Please upload an identity document before continuing.");
                    return;
                  }
                  setError("");
                  // Auto-save silently on continue
                  saveDraft(true);
                  setStep((s) => s + 1);
                }}
                className="button primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="button primary"
                style={{
                  background: BRAND.colors.green,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  fontSize: "15px",
                }}
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                Complete & Submit Application
              </button>
            )}
          </div>
        </div>

        {draftSavedMsg && (
          <div style={{ marginTop: "12px", textAlign: "right", color: "var(--green)", fontSize: "12.5px", fontWeight: 600 }}>
            {draftSavedMsg}
          </div>
        )}
      </div>
    </div>
  );
}
