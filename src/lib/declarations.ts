// Nagrik Party Authoritative Declarations & Statutory Frameworks
// Sourced from Constitutional Charters & Statutory Guidelines

export interface DeclarationDefinition {
  version: string;
  effectiveDate: string;
  title: string;
  titleHi: string;
  text: string;
}

export const CONSTITUTIONAL_DECLARATION_V1: DeclarationDefinition = {
  version: "1.0",
  effectiveDate: "2025-01-01",
  title: "Official Nagrik Party Constitutional Declaration",
  titleHi: "नागरिक पार्टी आधिकारिक संवैधानिक घोषणा",
  text: `I hereby declare that I am an Indian citizen, at least 18 years of age, and voluntarily seek membership in the Nagrik Party.

1. Allegiance to Constitution: I bear true faith and allegiance to the Constitution of India as by law established, and to the principles of socialism, secularism, and democracy, and I will uphold the sovereignty, unity, and integrity of India.
2. Party Constitution & Discipline: I agree to abide by the Constitution, rules, regulations, and disciplinary codes of the Nagrik Party.
3. No Dual Membership: I solemnly declare that I am not a member of any other political party registered with the Election Commission of India.
4. Non-Violence & Lawful Conduct: I commit to peaceful, constitutional, and non-violent political participation, and affirm that I will never participate in any corrupt, communal, sectarian, or unlawful activities.
5. Veracity of Records: All details and documentation provided by me in this induction application are true, accurate, and complete to the best of my knowledge.`,
};

export const DATA_CONSENT_V1: DeclarationDefinition = {
  version: "1.0",
  effectiveDate: "2025-01-01",
  title: "Nagrik Party Statutory Data Consent & Privacy Framework",
  titleHi: "नागरिक पार्टी वैधानिक डेटा सहमति और गोपनीयता ढांचा",
  text: `I voluntarily consent to the collection, verification, storage, and administrative processing of my personal, contact, electoral, and uploaded identity records by the Nagrik Party for legitimate political party formation, internal membership roll maintenance, regulatory filings under Section 29A of the Representation of the People Act, 1951, and official communications.

I understand that:
1. Sensitive identity documents (such as Aadhaar, Voter ID/EPIC numbers, and full residential addresses) will remain vaulted in secure, private storage and will never be published to public directories or exposed through public QR verification endpoints.
2. The public QR verification endpoint will strictly confirm only membership standing, category, and issue date without exposing private personally identifiable information (PII).
3. I have the right to request review or correction of my vaulted membership data through the official portal.`,
};

export const MEMBERSHIP_CATEGORIES = [
  { id: "Primary Member", nameHi: "प्राथमिक सदस्य", desc: "Basic party member affirming the constitution and civic principles." },
  { id: "Active Member", nameHi: "सक्रिय सदस्य", desc: "Engaged in grassroots initiatives, public grievance reporting, and local units." },
  { id: "Volunteer", nameHi: "स्वयंसेवक", desc: "Support civic work, translations, research, and outreach without legal obligations." },
  { id: "Organisational Worker", nameHi: "संगठनात्मक कार्यकर्ता", desc: "Dedicated coordinator for ward/constituency level administration." },
  { id: "Digital Volunteer", nameHi: "डिजिटल स्वयंसेवक", desc: "Assists with technical systems, digital governance, and verified media." },
] as const;

export const PARTICIPATION_AREAS = [
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
] as const;

export const IDENTITY_PROOF_TYPES = [
  "Voter ID (EPIC)",
  "Aadhaar Card",
  "Passport",
  "Driving License",
  "Other",
] as const;
