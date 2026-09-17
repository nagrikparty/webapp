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

const PARTICIPATION_AREAS = [
  "Public Grievance Support",
  "Infrastructure Accountability",
  "Women Safety Initiatives",
  "Youth Programs",
  "Legal Aid Support",
  "Healthcare Initiatives",
  "Environmental Work",
  "Digital Governance",
  "Media & Communications",
  "Policy Research",
  "Community Outreach",
  "Election Operations",
  "Volunteer Coordination",
];

const MEMBERSHIP_CATEGORIES = [
  { id: "Primary Member", desc: "Basic party member affirming the constitution and civic principles." },
  { id: "Active Member", desc: "Engaged in grassroots initiatives, public grievance reporting, and local units." },
  { id: "Volunteer", desc: "Support civic work, translations, research, and outreach without legal obligations." },
  { id: "Organisational Worker", desc: "Dedicated coordinator for ward/constituency level administration." },
  { id: "Digital Volunteer", desc: "Assists with technical systems, digital governance, and verified media." },
];

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
          if (data.application.status === "APPROVED" || data.application.status === "SUBMITTED") {
            setSubmittedApp({
              id: data.application.id,
              number: data.application.application_number,
            });
          }
        }
      }
      setLoading(false);
    }
    loadUserData();
  }, []);

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
          declaration_text: "Official Nagrik Party Constitutional Declaration",
          declaration_version: "1.0",
          bears_true_faith: true,
          upholds_sovereignty: true,
          accepts_constitution: true,
          no_other_party_membership: true,
          no_prohibited_conduct: true,
        },
        consent: {
          consent_text: "Official Nagrik Party Data Consent",
          consent_version: "1.0",
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
                <option value="Voter ID (EPIC)">Voter ID (EPIC)</option>
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                Voter ID / EPIC Number (if available)
              </label>
              <input
                type="text"
                value={electoralDetails.epic_number || ""}
                onChange={(e) => setElectoralDetails({ ...electoralDetails, epic_number: e.target.value })}
                placeholder="e.g. DL/01/001/000000"
              />
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
            <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px" }}>
              Step 6: Constitutional Declaration
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "16px" }}>
              Official Nagrik Party Declaration of Allegiance and Democratic Functioning.
            </p>

            <div
              style={{
                background: "var(--paper)",
                padding: "20px",
                borderRadius: "12px",
                maxHeight: "220px",
                overflowY: "auto",
                fontSize: "13px",
                lineHeight: 1.6,
                marginBottom: "20px",
                border: "1px solid var(--line)",
              }}
            >
              <p>
                <strong>Declaration:</strong> I hereby declare that I am an Indian citizen, at least 18 years of age. I voluntarily seek membership in Nagrik Party.
              </p>
              <p>
                I affirm my true faith and allegiance to the Constitution of India as by law established, and to the principles of socialism, secularism, and democracy, and would uphold the sovereignty, unity, and integrity of India.
              </p>
              <p>
                I agree to abide by the Party Constitution, rules, and disciplinary codes. I solemnly declare that I am not a member of any other political party registered with the Election Commission of India.
              </p>
              <p>
                I commit to non-violent, constitutional, and peaceful political participation and will never participate in any corrupt, communal, or criminal activity.
              </p>
            </div>

            <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={declarationAgreed}
                onChange={(e) => setDeclarationAgreed(e.target.checked)}
                style={{ marginTop: "3px" }}
              />
              <span style={{ fontSize: "14px", fontWeight: 600 }}>
                I have read, understood, and solemnly accept the Constitutional Declaration in its entirety.
              </span>
            </label>
          </div>
        )}

        {/* STEP 7: Data Consent */}
        {step === 7 && (
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px" }}>
              Step 7: Data Consent Framework
            </h3>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "16px" }}>
              Consent framework for legal compliance and administrative processing.
            </p>

            <div
              style={{
                background: "var(--paper)",
                padding: "20px",
                borderRadius: "12px",
                fontSize: "13px",
                lineHeight: 1.6,
                marginBottom: "20px",
                border: "1px solid var(--line)",
              }}
            >
              <p>
                I voluntarily consent to Nagrik Party collecting, verifying, and maintaining my personal and electoral information for lawful political administration, membership roll preparation, official filings, and internal communications, subject to reasonable privacy safeguards and applicable Indian laws.
              </p>
              <p style={{ margin: 0 }}>
                Sensitive identity documents will remain strictly in private vaults and will never be exposed in public directories or QR verification scans.
              </p>
            </div>

            <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                style={{ marginTop: "3px" }}
              />
              <span style={{ fontSize: "14px", fontWeight: 600 }}>
                I voluntarily give my consent for data processing under this framework.
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
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", paddingTop: "20px", borderTop: "1px solid var(--line)" }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="button"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <ChevronLeft size={16} /> Back
            </button>
          ) : <div />}

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
                setStep((s) => s + 1);
              }}
              className="button primary"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
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
                display: "flex",
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
    </div>
  );
}
