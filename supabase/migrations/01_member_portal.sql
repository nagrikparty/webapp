-- Create profiles table if not exists, and add columns
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'volunteer',
    full_name TEXT,
    ward TEXT,
    epic TEXT,
    referred_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist in profiles table (just in case the table existed already)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'volunteer';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ward TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS epic TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update/insert their own profile" ON public.profiles;

CREATE POLICY "Allow public read access to profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow users to update/insert their own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    transaction_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow users to insert their own transactions" ON public.transactions;

CREATE POLICY "Allow users to view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_audience TEXT DEFAULT 'all',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to announcements" ON public.announcements;

CREATE POLICY "Allow public read access to announcements" ON public.announcements
    FOR SELECT USING (true);

-- Create volunteer_tasks table
CREATE TABLE IF NOT EXISTS public.volunteer_tasks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open',
    ward TEXT,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for volunteer_tasks
ALTER TABLE public.volunteer_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read access to volunteer_tasks" ON public.volunteer_tasks;
DROP POLICY IF EXISTS "Allow users to update tasks assigned to them or open tasks" ON public.volunteer_tasks;

CREATE POLICY "Allow authenticated read access to volunteer_tasks" ON public.volunteer_tasks
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update tasks assigned to them or open tasks" ON public.volunteer_tasks
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND (
            assigned_to = auth.uid() OR status = 'open'
        )
    );
