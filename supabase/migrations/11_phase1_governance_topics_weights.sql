-- ============================================================================
-- Migration 11: Phase 1 Formation Milestones, Weights, Topics & Governance
-- Nagrik Party Platform - Formation Phase
-- ============================================================================

-- 1. FORMATION PHASES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.formation_phases (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 1,
    started_at TIMESTAMPTZ,
    target_completion TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.formation_phases (id, code, name, description, is_active, sort_order, started_at)
VALUES
    ('phase-1', 'PHASE_1', 'Phase 1, Formation Phase', 'Building the foundation, founding member induction, and preparation for Section 29A RPA 1951 registration.', true, 1, '2025-02-01'),
    ('phase-2', 'PHASE_2', 'Phase 2, Organisational Build', 'Constituency committee formalization, delegate conventions, and public policy formulation.', false, 2, NULL),
    ('phase-3', 'PHASE_3', 'Phase 3, Democratic Organisation', 'Full democratic party operation, periodic internal elections, and candidate selection.', false, 3, NULL)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

-- 2. PROGRESS WEIGHT CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.progress_weights (
    category TEXT PRIMARY KEY,
    phase_id TEXT REFERENCES public.formation_phases(id) ON DELETE CASCADE,
    weight_percentage NUMERIC(5,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.progress_weights (category, phase_id, weight_percentage, description)
VALUES
    ('Foundation', 'phase-1', 20.0, 'Platform architecture, digital induction, SHA-256 document hashing, privacy vault'),
    ('Membership', 'phase-1', 25.0, 'Enrolling founding members with valid EPIC voter IDs across Delhi constituencies'),
    ('Organisation', 'phase-1', 15.0, 'Founding assembly convention, constitution ratification, executive resolution'),
    ('Compliance', 'phase-1', 15.0, 'Statutory public notices, newspaper publication, continuous dossier assembly'),
    ('Finance', 'phase-1', 15.0, 'Cashless formation accounts, public transparency ledger, audit preparation'),
    ('Public Readiness', 'phase-1', 10.0, 'Civic topic tracking, verified crime tracker, living manifesto consultation')
ON CONFLICT (category) DO UPDATE SET
    weight_percentage = EXCLUDED.weight_percentage,
    description = EXCLUDED.description;

-- 3. FOUNDING MILESTONES (Structured & Auditable)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.founding_milestones (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    phase_id TEXT NOT NULL REFERENCES public.formation_phases(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('UPCOMING', 'IN_PROGRESS', 'COMPLETED')),
    weight NUMERIC(5,2) NOT NULL DEFAULT 1.0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    evidence_url TEXT,
    public_note TEXT,
    sort_order INTEGER NOT NULL DEFAULT 1,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.founding_milestones 
(id, title, description, phase_id, category, status, weight, started_at, completed_at, evidence_url, public_note, sort_order)
VALUES
    ('m-1', 'Platform Architecture & Privacy Vault', 'Production-grade digital induction system, SHA-256 document hashing, zero-leak member card QR verification, and export engine.', 'phase-1', 'Foundation', 'COMPLETED', 2.0, '2025-02-01', '2025-03-01', '/documents', 'Completed and live.', 1),
    ('m-2', 'Draft Party Constitution & Democratic By-laws', 'Democratic party constitution with mandatory periodic inner elections, non-violence pledge, and allegiance to the Constitution of India.', 'phase-1', 'Foundation', 'COMPLETED', 2.0, '2025-02-15', '2025-03-10', '/legal/constitution', 'Draft ratified internally for registration filing.', 2),
    ('m-3', 'Founding Member Induction', 'Enrolling founding members with valid EPIC voter IDs across Delhi Assembly Constituencies with statutory declarations.', 'phase-1', 'Membership', 'IN_PROGRESS', 3.0, '2025-03-11', NULL, '/membership', 'Actively onboarding founding voters.', 3),
    ('m-4', 'General Body Convention & Executive Confirmation', 'Formal convention of verified founding members to ratify party constitution and confirm Founding Convener and office bearers.', 'phase-1', 'Organisation', 'UPCOMING', 2.0, NULL, NULL, NULL, 'Scheduled upon reaching induction threshold.', 4),
    ('m-5', 'Cashless Formation Accounts & Audit', 'Maintenance of 100% digital bank accounts, audited voluntary contribution registers, and public transparency disclosures.', 'phase-1', 'Finance', 'IN_PROGRESS', 2.0, '2025-02-10', NULL, '/transparency', 'Operating on zero-cash principle.', 5),
    ('m-6', 'Public Statutory Notice in Daily Newspapers', 'Publication of formal statutory notice in one national English daily and one national Hindi daily inviting public feedback as per ECI guidelines.', 'phase-1', 'Compliance', 'UPCOMING', 1.5, NULL, NULL, NULL, 'Will be published following General Body Convention.', 6),
    ('m-7', 'Section 29A Application Filing at Nirvachan Sadan', 'Physical submission of compiled, continuous page-numbered dossier (1..N) to the Election Commission of India.', 'phase-1', 'Compliance', 'UPCOMING', 2.5, NULL, NULL, NULL, 'Submission dossier prepared continuously.', 7),
    ('m-8', 'ECI Scrutiny & Regulatory Due Diligence', 'Clarification rounds, document verification, and compliance scrutiny by Election Commission of India.', 'phase-1', 'Compliance', 'UPCOMING', 1.5, NULL, NULL, NULL, 'Pending submission.', 8),
    ('m-9', 'Gazette Notification & Registered Party Status', 'Official notification of party registration under Section 29A of the Representation of the People Act, 1951.', 'phase-1', 'Compliance', 'UPCOMING', 2.0, NULL, NULL, NULL, 'Final statutory step for Phase 1.', 9)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    status = EXCLUDED.status,
    weight = EXCLUDED.weight,
    sort_order = EXCLUDED.sort_order;

-- 4. FINANCIAL PERIODS & REPORTING
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.financial_periods (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    period_type TEXT NOT NULL DEFAULT 'HALF_YEARLY' CHECK (period_type IN ('ANNUAL', 'HALF_YEARLY', 'QUARTERLY', 'HISTORICAL')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_closed BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    total_receipts NUMERIC(12,2) DEFAULT 0.00,
    total_expenditure NUMERIC(12,2) DEFAULT 0.00,
    closing_balance NUMERIC(12,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.financial_periods (id, title, period_type, start_date, end_date, is_closed, is_published, notes)
VALUES
    ('period-2025-hist', '2025 Formation Stage Historical Record', 'HISTORICAL', '2025-01-01', '2025-12-31', true, true, 'Covers pre-registration independent campaign and formation groundwork.'),
    ('period-2026-h1', '2026 H1 Formation Accounts', 'HALF_YEARLY', '2026-01-01', '2026-06-30', false, true, 'Current formation phase operations, server infrastructure, and verification systems.')
ON CONFLICT (id) DO NOTHING;

-- 5. DONATION & UPI CONFIGURATION
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.donation_configuration (
    id TEXT PRIMARY KEY DEFAULT 'default',
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    legal_status_label TEXT NOT NULL DEFAULT 'Contributions currently accepted under the Formation Phase',
    upi_id TEXT,
    account_name TEXT,
    bank_name TEXT,
    account_number TEXT,
    ifsc_code TEXT,
    qr_image_url TEXT,
    payment_instructions TEXT DEFAULT 'Scan the UPI QR code or transfer directly to the formation account. Retain reference UTR for audit receipting.',
    disclosure_text TEXT DEFAULT 'Nagrik Party is in its Formation Phase. All contributions are recorded in our public transparency ledger with complete donor provenance.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.donation_configuration (id, is_enabled, legal_status_label, payment_instructions, disclosure_text)
VALUES (
    'default',
    false,
    'Contributions currently accepted under the Formation Phase',
    'Voluntary contributions for formation-stage operations. Cashless only.',
    'Nagrik Party operates on a 100% digital, zero-cash basis. Every receipt is auditable.'
)
ON CONFLICT (id) DO NOTHING;

-- 6. CIVIC TOPICS & SOURCE PROVENANCE PIPELINE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.civic_topics (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    methodology TEXT NOT NULL DEFAULT 'Mentions are extracted from verified news publications and civic feeds using keyword matching and algorithmic deduplication.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.civic_topics (id, slug, name, description, icon, sort_order, methodology)
VALUES
    ('topic-air-pollution', 'air-pollution', 'Air Pollution', 'AQI levels, stubble burning impact, winter smog, and vehicular emission records in Delhi NCR.', 'Wind', 1, 'Aggregated from CPCB public telemetry, Delhi pollution control bulletins, and indexed news reports mentioning Delhi Air Quality.'),
    ('topic-garbage', 'garbage', 'Garbage & Solid Waste', 'MCD sanitation wards, landfill remediation, unsegregated waste dumps, and neighborhood cleanliness.', 'Trash2', 2, 'Indexed from municipal complaint registries and verified local civic reports across Delhi 70 ACs.'),
    ('topic-roads', 'roads', 'Roads & Potholes', 'Pothole incidents, road construction delays, pedestrian safety hazards, and PWD/MCD maintenance.', 'Route', 3, 'Derived from municipal public work logs and reported road infrastructure hazards in Delhi.'),
    ('topic-water', 'water', 'Water Supply & Quality', 'DJB tanker dependency, pipeline contamination, low water pressure, and billing anomalies.', 'Droplets', 4, 'Aggregated from Delhi Jal Board advisory reports and verified community supply complaints.'),
    ('topic-sewage', 'sewage', 'Sewage & Drainage', 'Open drains, monsoon waterlogging, sewer overflow, and Yamuna discharge monitoring.', 'Waves', 5, 'Tracked via storm water drainage advisories and environmental clearance records.'),
    ('topic-healthcare', 'healthcare', 'Public Healthcare', 'Dispensary medication availability, emergency hospital beds, wait times, and mohalla clinic operations.', 'HeartPulse', 6, 'Indexed from Delhi government health bulletins and verified public medical reports.'),
    ('topic-homelessness', 'homelessness', 'Homelessness & Shelter', 'Night shelter capacities, winter rescue operations, and slum rehabilitation progress.', 'Home', 7, 'Derived from DUSIB shelter audit reports and verified civic NGO surveys.'),
    ('topic-crime', 'crime', 'Crime & Public Safety', 'Street crime, women safety incidents, theft, and policing response across Delhi police stations.', 'ShieldAlert', 8, 'Linked with the Nagrik Verified Crime Tracker cross-referenced with FIR registrations and news reports.'),
    ('topic-jobs', 'jobs', 'Jobs & Livelihoods', 'Unemployment data, street vendor hawking rights, industrial zoning, and local economic security.', 'Briefcase', 9, 'Compiled from labour department notifications and economic survey indicators.'),
    ('topic-education', 'education', 'Public Education', 'Government school infrastructure, pupil-teacher ratios, vocational facilities, and fee transparency.', 'GraduationCap', 10, 'Tracked through Directorate of Education notices and school management committee reports.')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order,
    methodology = EXCLUDED.methodology;

CREATE TABLE IF NOT EXISTS public.topic_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id TEXT NOT NULL REFERENCES public.civic_topics(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    is_regex BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(topic_id, keyword)
);

CREATE TABLE IF NOT EXISTS public.source_publications (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    publication_type TEXT DEFAULT 'NEWS' CHECK (publication_type IN ('NEWS', 'GOVERNMENT_GAZETTE', 'CIVIC_PORTAL', 'RESEARCH_REPORT')),
    credibility_tier TEXT DEFAULT 'TIER_1' CHECK (credibility_tier IN ('TIER_1', 'TIER_2', 'OFFICIAL')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.source_publications (id, name, domain, publication_type, credibility_tier)
VALUES
    ('pub-the-hindu', 'The Hindu', 'thehindu.com', 'NEWS', 'TIER_1'),
    ('pub-indian-express', 'The Indian Express', 'indianexpress.com', 'NEWS', 'TIER_1'),
    ('pub-hindustan-times', 'Hindustan Times', 'hindustantimes.com', 'NEWS', 'TIER_1'),
    ('pub-times-of-india', 'Times of India', 'timesofindia.indiatimes.com', 'NEWS', 'TIER_1'),
    ('pub-cpcb', 'Central Pollution Control Board', 'cpcb.nic.in', 'CIVIC_PORTAL', 'OFFICIAL'),
    ('pub-delhi-govt', 'Delhi Government Portal', 'delhi.gov.in', 'GOVERNMENT_GAZETTE', 'OFFICIAL')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.source_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_id TEXT REFERENCES public.source_publications(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    collected_at TIMESTAMPTZ DEFAULT NOW(),
    raw_snippet TEXT,
    source_hash TEXT NOT NULL,
    dedupe_group_id TEXT,
    status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (status IN ('PENDING', 'VERIFIED', 'DUPLICATE', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.topic_mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id TEXT NOT NULL REFERENCES public.civic_topics(id) ON DELETE CASCADE,
    source_item_id UUID NOT NULL REFERENCES public.source_items(id) ON DELETE CASCADE,
    mention_count INTEGER NOT NULL DEFAULT 1,
    confidence NUMERIC(3,2) DEFAULT 1.0,
    snippet TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(topic_id, source_item_id)
);

CREATE TABLE IF NOT EXISTS public.topic_monthly_aggregates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id TEXT NOT NULL REFERENCES public.civic_topics(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    indexed_mentions INTEGER NOT NULL DEFAULT 0,
    unique_articles INTEGER NOT NULL DEFAULT 0,
    unique_publications INTEGER NOT NULL DEFAULT 0,
    source_count INTEGER NOT NULL DEFAULT 0,
    data_freshness TIMESTAMPTZ DEFAULT NOW(),
    methodology TEXT,
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(topic_id, year, month)
);

-- 7. DATA RUNS & SCHEDULER AUDIT
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.data_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    items_processed INTEGER DEFAULT 0,
    items_matched INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    triggered_by TEXT DEFAULT 'SCHEDULER',
    log_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.data_run_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES public.data_runs(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR')),
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BUILD WITH US: VOLUNTEER TASKS & SKILLS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.volunteer_skill_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 1
);

INSERT INTO public.volunteer_skill_categories (id, name, description, sort_order)
VALUES
    ('community-work', 'Community Work', 'On-the-ground constituency organizing and public grievance intake.', 1),
    ('research', 'Research & Analysis', 'Policy papers, RTI filing, and constituency demographic analysis.', 2),
    ('design', 'Visual Design', 'Informational posters, civic infographics, and print collateral.', 3),
    ('video', 'Video & Media Production', 'Documenting local civic issues and ground updates.', 4),
    ('writing', 'Writing & Editorial', 'Drafting public policy summaries, statements, and plain-English briefs.', 5),
    ('legal', 'Legal & Compliance', 'RPA 1951 filing compliance, constitutional review, and verification.', 6),
    ('technology', 'Technology & Engineering', 'Developing open digital tools, verifiable cards, and privacy vaults.', 7),
    ('policy', 'Public Policy', 'Urban governance, public health, education, and transport systems.', 8),
    ('data', 'Data & Statistics', 'Pollution tracking, municipal spend auditing, and crime data analysis.', 9),
    ('media', 'Media & Press Relations', 'Journalist outreach, press release distribution, and fact checks.', 10),
    ('outreach', 'Constituency Outreach', 'Connecting with residents, youth, trade unions, and senior citizens.', 11),
    ('event-support', 'Event & Meeting Logistics', 'Organizing volunteer inductions and democratic conventions.', 12),
    ('administration', 'Administration', 'Record keeping, voter list cross-referencing, and coordination.', 13),
    ('translation', 'Translation & Language', 'Making all civic documents accessible in Hindustani and English.', 14)
ON CONFLICT (id) DO NOTHING;

-- 9. RLS POLICIES FOR NEW TABLES
-- ============================================================================
ALTER TABLE public.formation_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founding_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.civic_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_monthly_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_run_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_skill_categories ENABLE ROW LEVEL SECURITY;

-- Public read access for transparency records
CREATE POLICY "Public read formation phases" ON public.formation_phases FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read progress weights" ON public.progress_weights FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read founding milestones" ON public.founding_milestones FOR SELECT TO anon, authenticated USING (is_public = true);
CREATE POLICY "Public read financial periods" ON public.financial_periods FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Public read donation config" ON public.donation_configuration FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read civic topics" ON public.civic_topics FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public read topic keywords" ON public.topic_keywords FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read source publications" ON public.source_publications FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public read source items" ON public.source_items FOR SELECT TO anon, authenticated USING (status = 'VERIFIED');
CREATE POLICY "Public read topic mentions" ON public.topic_mentions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read topic aggregates" ON public.topic_monthly_aggregates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read volunteer skills" ON public.volunteer_skill_categories FOR SELECT TO anon, authenticated USING (true);

-- Admin management policies
CREATE POLICY "Admin manage milestones" ON public.founding_milestones FOR ALL TO authenticated
USING (public.get_user_role(auth.uid()) IN ('ADMIN', 'SUPER_ADMIN'));

CREATE POLICY "Admin manage donation config" ON public.donation_configuration FOR ALL TO authenticated
USING (public.get_user_role(auth.uid()) IN ('ADMIN', 'SUPER_ADMIN'));

CREATE POLICY "Admin manage data runs" ON public.data_runs FOR ALL TO authenticated
USING (public.get_user_role(auth.uid()) IN ('ADMIN', 'SUPER_ADMIN'));

CREATE POLICY "Admin manage data run logs" ON public.data_run_logs FOR ALL TO authenticated
USING (public.get_user_role(auth.uid()) IN ('ADMIN', 'SUPER_ADMIN'));
