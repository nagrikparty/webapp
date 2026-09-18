// Founder Profile & Public Narrative Configuration
// Factual, dignified, and auditable information regarding the founding of Nagrik Party.

export const FOUNDER_DATA = {
  legalName: "Sheikh Arsalanullah Chishti",
  publicName: "Arsalan Azad",
  role: "Founder / Founding Convener (Formation Phase)",
  electoralHistory: "Contested the 2025 Delhi Assembly election as an independent candidate.",
  familyBackground: "Comes from a family with decades of public service in education and government service.",
  imageSlot: import.meta.env.PUBLIC_FOUNDER_IMAGE || "/assets/leader.png",
  
  corePrinciples: [
    "From voter to participant: moving citizens from passive spectators to co-builders of their political representation.",
    "Cashless, radical transparency: 100% digital receipts, published formation expenditures, and zero undeclared funds.",
    "Evidence-driven governance: public accountability grounded in verified citations, RTI inquiries, and field audits.",
    "Institutional dignity: building an enduring civic framework rather than a personality-driven vehicle."
  ],

  publicOutcomes: [
    { title: "Public Healthcare", desc: "Reliable government hospitals, stocked dispensaries, and affordable treatment without catastrophic debt." },
    { title: "Quality Education", desc: "Equitable government schools, transparent fees, and genuine vocational opportunities." },
    { title: "Jobs & Economic Security", desc: "Fair livelihoods, protection for small traders and gig workers, and inflation protection." },
    { title: "Clean Air & Environment", desc: "Year-round emission controls, dust suppression, and Yamuna ecological revival." },
    { title: "Safe Streets & Protection", desc: "Accountable neighborhood policing, illuminated streets, and safety for women and children." },
    { title: "Shelter & Living Dignity", desc: "Equitable public housing, humane rehabilitation, and dignified civic infrastructure." },
    { title: "Clean Water & Sewage", desc: "Piped potable water, leak-proof sewerage, and zero untreated runoff." },
  ],

  foundingNarrative: {
    heroQuote: "The goal isn't to complain about what is broken. The goal is to build what should work.",
    perspective: "We are trying to build an organisation that works.",
    storySummary: "After contesting the 2025 Delhi Assembly election independently, Sheikh Arsalanullah Chishti recognized that individual candidacies cannot fix systemic institutional failure. Genuine political power belongs in a durable, accountable, member-driven organisation.",
    livedExperience: "Coming from a family where both parents served as government teachers, the reality is clear: decades of honest public service and education do not automatically shield families from the pressures of inflation, healthcare insecurity, and institutional apathy. If citizens who devote their lives to teaching and public duty face insecurity in their senior years, what kind of society are we constructing? Building Nagrik Party is an answer to that question: a platform to turn voter frustration into structured, accountable civic action."
  }
} as const;
