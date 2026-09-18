# Nagrik Party Webapp Rules

These rules apply to all AI-assisted work in this repository.

## Writing Style

### Punctuation
- **Never use em dashes** (`—`). They look AI-generated.
  - For brand/label separators: use middle dot (`·`), e.g. `PHASE 1 · FORMATION PHASE`
  - For inline prose: use commas, colons, or rewrite the sentence
  - For missing-data fallbacks in UI: use en-dash (`–`)
  - For parenthetical context: use actual parentheses `(Formation Phase)`
- Do not use semicolons to join clauses. Use two sentences.

### Language System
- The public product UI uses ONE consistent language: **Plain Indian English**.
- Direct, simple English, short sentences, familiar Indian conversational vocabulary. Avoid bureaucratic and legalistic wording in public UI.
- Legal documents (constitutional text, statutory declarations, formal filings) remain formal and accurate as source documents, accompanied by plain-English summaries.
- Hindi text, when used in source charters or formal statutory documents, should be natural Hindustani, not formal textbook Hindi or machine-translated.

### Banned AI Patterns
Never use any of these words/phrases in user-facing text:
leverage, empower, streamline, cutting-edge, state-of-the-art, seamless, harness, holistic, synergy, paradigm, transformative, revolutionize, unprecedented, tapestry, vibrant, beacon, testament, crucible, cornerstone, pivotal, underpinned, underscores, multifaceted, nuanced, intricate, endeavor, realm, furthermore, moreover, it is imperative, commence, utilize, utilization, facilitate, subsequently, henceforth, aforementioned, delve, foster, elevate, spearhead, navigate, robust, comprehensive (when used as marketing filler).

Also avoid:
- "In today's [noun]..."
- "It's important to note that..."
- "plays a crucial role"
- "at its core"
- "serves as a"
- "not just X, but Y"
- Any sentence starting with "This is where..."

## Brand & Legal

### Terminology
- Always call it "Formation Phase" or "Phase 1, Formation Phase".
- The party is "Nagrik Party", not "The Nagrik Party" unless in a legal sentence.
- Current phase: proposed party / party under registration. Never claim registered-party status, ECI recognition, or an allotted election symbol.
- Use "Section 29A RPA 1951" for the registration statute.
- Membership cards are "organisational records", never "government-issued documents".

### Phase Label Format
- In uppercase labels/badges: `PHASE 1 · FORMATION PHASE`
- In prose: `Phase 1, Formation Phase` or `Formation Phase`
- In page titles: use pipe `|` as separator, e.g. `Nagrik Party | Formation Phase`

## Design & Code

### CSS
- Always use existing CSS custom properties (`var(--ink)`, `var(--saffron)`, `var(--paper-card)`, etc.).
- Never introduce arbitrary hex colours outside `brand.ts` and `global.css`.
- The design language is editorial/civic, not startup/SaaS.

### Architecture
- Astro pages (`.astro`) for routes, React (`.tsx`) for interactive islands.
- API endpoints in `src/pages/api/v1/`.
- Shared utilities in `src/lib/`.
- Supabase for auth and database.
- Cloudflare Workers adapter for deployment.

### Existing Features (Do Not Remove)
- Verified Crime Tracker (`/crime`, `/crimes/[type]`)
- Formation Roadmap (`/formation-progress`)
- Financial Transparency (`/transparency`)
- Public Document Vault (`/documents`)
- Digital Induction Wizard (`/member/induction`)
- Membership Card & QR Verification
- Admin panels (`/admin/*`)

### Documentation
- Preserve all existing comments and docstrings unless they're wrong.
- Do not add comments that merely restate what code does.
