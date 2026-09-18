// Weighted Formation Progress Calculation Service
// Computes real progress based on weighted milestones or explicit auditable override.

import { supabase } from "@/lib/supabase";

export interface MilestoneItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "UPCOMING" | "IN_PROGRESS" | "COMPLETED";
  weight: number;
  sort_order: number;
  evidence_url?: string | null;
  public_note?: string | null;
}

export interface ProgressSummary {
  percentage: number;
  phaseCode: string;
  phaseLabel: string;
  currentPhaseName: string;
  totalMilestones: number;
  completedCount: number;
  inProgressCount: number;
  isOverride: boolean;
  milestones: MilestoneItem[];
}

// Canonical fallback milestones with weights (total weight = 16.5)
const FALLBACK_MILESTONES: MilestoneItem[] = [
  {
    id: "m-1",
    title: "Platform Architecture & Privacy Vault",
    description: "Production-grade digital induction system, SHA-256 document hashing, zero-leak member card QR verification, and export engine.",
    category: "Foundation",
    status: "COMPLETED",
    weight: 2.0,
    sort_order: 1,
    evidence_url: "/documents",
    public_note: "Completed and live in production.",
  },
  {
    id: "m-2",
    title: "Draft Party Constitution & Democratic By-laws",
    description: "Democratic party constitution with mandatory periodic inner elections, non-violence pledge, and allegiance to the Constitution of India.",
    category: "Foundation",
    status: "COMPLETED",
    weight: 2.0,
    sort_order: 2,
    evidence_url: "/legal/constitution",
    public_note: "Internal draft completed for Section 29A filing.",
  },
  {
    id: "m-3",
    title: "Founding Member Induction (100+ Verified Voters)",
    description: "Enrolling founding members with valid EPIC voter IDs across Delhi Assembly Constituencies.",
    category: "Membership",
    status: "IN_PROGRESS",
    weight: 3.0,
    sort_order: 3,
    evidence_url: "/membership",
    public_note: "Currently active: onboarding voters across Delhi ACs.",
  },
  {
    id: "m-4",
    title: "General Body Convention & Executive Confirmation",
    description: "Formal convention of verified founding members to ratify party constitution and confirm Founding Convener and office bearers.",
    category: "Organisation",
    status: "UPCOMING",
    weight: 2.0,
    sort_order: 4,
    public_note: "Scheduled upon reaching statutory induction threshold.",
  },
  {
    id: "m-5",
    title: "Cashless Formation Accounts & Audit",
    description: "Maintenance of 100% digital bank accounts, audited voluntary contribution registers, and public transparency disclosures.",
    category: "Finance",
    status: "IN_PROGRESS",
    weight: 2.0,
    sort_order: 5,
    evidence_url: "/transparency",
    public_note: "Zero-cash ledger active and published.",
  },
  {
    id: "m-6",
    title: "Public Statutory Notice in Daily Newspapers",
    description: "Publication of formal public notice in one national English daily and one national Hindi daily inviting public feedback.",
    category: "Compliance",
    status: "UPCOMING",
    weight: 1.5,
    sort_order: 6,
    public_note: "Required statutory newspaper notice following general assembly.",
  },
  {
    id: "m-7",
    title: "Section 29A Application Filing at Nirvachan Sadan",
    description: "Physical submission of compiled, continuous page-numbered dossier (1..N) to the Election Commission of India.",
    category: "Compliance",
    status: "UPCOMING",
    weight: 2.5,
    sort_order: 7,
    public_note: "Continuous page-numbered filing dossier under preparation.",
  },
  {
    id: "m-8",
    title: "ECI Scrutiny & Regulatory Due Diligence",
    description: "Clarification rounds, document verification, and compliance scrutiny by the Election Commission of India Secretariat.",
    category: "Compliance",
    status: "UPCOMING",
    weight: 1.5,
    sort_order: 8,
    public_note: "Statutory review process.",
  },
  {
    id: "m-9",
    title: "Gazette Notification & Registered Party Status",
    description: "Official notification of party registration under Section 29A of the Representation of the People Act, 1951.",
    category: "Compliance",
    status: "UPCOMING",
    weight: 2.0,
    sort_order: 9,
    public_note: "Completion of Phase 1 upon official publication.",
  },
];

export async function getFormationProgress(): Promise<ProgressSummary> {
  let milestones: MilestoneItem[] = FALLBACK_MILESTONES;
  let isOverride = false;
  let overridePercentage: number | null = null;

  if (supabase) {
    try {
      // Check for explicit override in organization_settings
      const { data: settingData } = await supabase
        .from("organization_settings")
        .select("value")
        .eq("key", "public_progress_override")
        .maybeSingle();

      if (settingData && settingData.value !== null && settingData.value !== undefined) {
        const val = typeof settingData.value === "number" ? settingData.value : parseFloat(String(settingData.value));
        if (!isNaN(val) && val >= 0 && val <= 100) {
          isOverride = true;
          overridePercentage = Math.round(val);
        }
      }

      // Fetch structured milestones
      const { data: dbMilestones } = await supabase
        .from("founding_milestones")
        .select("id, title, description, category, status, weight, sort_order, evidence_url, public_note")
        .eq("is_public", true)
        .order("sort_order", { ascending: true });

      if (dbMilestones && dbMilestones.length > 0) {
        milestones = dbMilestones.map((m) => ({
          ...m,
          weight: Number(m.weight) || 1.0,
        }));
      }
    } catch (err) {
      console.warn("Could not load milestones from DB, using structured fallback:", err);
    }
  }

  // Calculate weighted progress:
  // Completed milestones contribute full weight.
  // In-progress milestones contribute 25% of weight to reflect partial groundwork.
  const totalWeight = milestones.reduce((sum, m) => sum + (Number(m.weight) || 1), 0);
  const earnedWeight = milestones.reduce((sum, m) => {
    const w = Number(m.weight) || 1;
    if (m.status === "COMPLETED") return sum + w;
    if (m.status === "IN_PROGRESS") return sum + (w * 0.25);
    return sum;
  }, 0);

  const computedPercentage = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  const finalPercentage = isOverride && overridePercentage !== null ? overridePercentage : computedPercentage;

  const completedCount = milestones.filter((m) => m.status === "COMPLETED").length;
  const inProgressCount = milestones.filter((m) => m.status === "IN_PROGRESS").length;

  return {
    percentage: finalPercentage,
    phaseCode: "PHASE_1",
    phaseLabel: "PHASE 1 · FORMATION PHASE",
    currentPhaseName: "Building the foundation",
    totalMilestones: milestones.length,
    completedCount,
    inProgressCount,
    isOverride,
    milestones,
  };
}
