import { getDashboardStats } from "@/actions";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h2 className="font-hindi text-3xl font-bold mb-6">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl shadow-sm">
          <p className="font-mono text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">Total Volunteers</p>
          <p className="font-hindi text-4xl font-bold text-black dark:text-white">{stats?.volunteerCount || 0}</p>
        </div>
        
        <div className="p-6 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl shadow-sm">
          <p className="font-mono text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">Reports Submitted</p>
          <p className="font-hindi text-4xl font-bold text-red">{stats?.reportCount || 0}</p>
        </div>
        
        <div className="p-6 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl shadow-sm">
          <p className="font-mono text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">Total Donations</p>
          <p className="font-hindi text-4xl font-bold text-black dark:text-white">{stats?.donationCount || 0}</p>
        </div>
      </div>
      
      <div className="mt-12 p-8 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-black/60 dark:text-white/60 mb-2">More Admin Features Coming Soon</p>
        <p className="font-body text-black/40 dark:text-white/40">User management, report moderation, and broadcast messaging.</p>
      </div>
    </div>
  );
}
