// Central Brand & Phase Configuration
// Canonical branding for Nagrik Party

export const BRAND = {
  name: "Nagrik Party",
  fullName: "Nagrik Party",
  nameHi: "नागरिक पार्टी",
  tagline: "Kaam dikhna chahiye.",
  taglineHi: "काम दिखना चाहिए।",
  logoPath: "/nagrikpartylogo.svg",
  logoAlt: "Nagrik Party - Kaam dikhna chahiye",
  colors: {
    ink: "#1d1d1f",
    saffron: "#F58220",
    green: "#00873E",
    blue: "#0066cc",
    white: "#ffffff",
    muted: "#86868b",
    border: "rgba(0, 0, 0, 0.08)",
  },
  status: {
    phase: "formation" as const, // 'formation' | 'registered_party'
    phaseLabel: "PHASE 1 · FORMATION PHASE",
    phaseLabelHi: "चरण 1 · गठन चरण",
    phaseDescription: "An independent political initiative working toward the formation and registration of a political party.",
    phaseDescriptionHi: "एक स्वतंत्र राजनीतिक पहल जो राजनीतिक पार्टी के गठन और पंजीकरण की दिशा में काम कर रही है।",
    disclaimer: "Nagrik Party is currently in its formation phase. Not an ECI-registered political party. Membership cards and verification are organisational records and not government-issued documents."
  },
  founder: {
    publicName: "Arsalan Azad",
    legalName: "Sheikh Arsalanullah Chishti",
    role: "Founder / Founding Convener (Formation Phase)",
    biography: "Contested the 2025 Delhi Assembly election independently. Initiating the formation of Nagrik Party to build a durable, accountable citizen-led political organization.",
    imageSlot: import.meta.env.PUBLIC_FOUNDER_IMAGE || "/images/arsalanazadheroimage.png"
  }
} as const;

export type OrganizationPhase = "formation" | "registered_party";

export function isPhaseActive(phase: OrganizationPhase): boolean {
  return BRAND.status.phase === phase;
}
