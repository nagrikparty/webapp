import { redirect } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect({ href: "/login", locale });
    return null;
  }

  // Temporary admin authorization check
  const adminEmails = [
    "admin@nagrikparty.in",
    "hudav@nagrikparty.in"
  ];

  if (!adminEmails.includes(user.email)) {
    redirect({ href: "/dashboard", locale });
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white transition-colors duration-300">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-black/20 border-r border-black/10 dark:border-white/10 hidden md:flex flex-col">
          <div className="p-6 border-b border-black/10 dark:border-white/10">
            <h1 className="font-hindi text-2xl font-bold uppercase tracking-tight text-red">Nagrik Admin</h1>
          </div>
          <nav className="flex-1 p-4 flex flex-col gap-2">
            <a href={`/${locale}/admin`} className="px-4 py-2 bg-black/5 dark:bg-white/5 rounded-lg font-mono text-xs uppercase tracking-widest font-semibold">
              Dashboard
            </a>
            <a href={`/${locale}/admin/users`} className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg font-mono text-xs uppercase tracking-widest text-black/60 dark:text-white/60">
              Users
            </a>
            <a href={`/${locale}/admin/reports`} className="px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg font-mono text-xs uppercase tracking-widest text-black/60 dark:text-white/60">
              Reports
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
