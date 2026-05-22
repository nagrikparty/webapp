import { getSession } from "@/lib/auth";
import { getMemberData } from "@/actions";
import { redirect } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, User } from "lucide-react";

export default async function DashboardPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await getSession();
  
  if (!session?.memberId) {
    redirect({ href: "/login", locale });
  }

  const member = await getMemberData(session.memberId);
  if (!member) {
    redirect({ href: "/login", locale });
  }

  const t = await getTranslations({ locale, namespace: "Dashboard" });

  return (
    <>
      <Navbar />
      <main className="bg-off-white min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="font-hindi text-4xl md:text-5xl font-bold text-black uppercase tracking-tight mb-2">
              {t("title")}
            </h1>
            <p className="font-mono text-black/60 tracking-widest uppercase text-xs">
              {t("subtitle")}
            </p>
          </div>

          <div className="civic-card bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-red"></div>
            
            <div className="p-8 sm:p-10 border-b border-black/10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-24 h-24 rounded-full bg-black/5 flex items-center justify-center border border-black/10 shrink-0">
                <User size={40} className="text-black/40" />
              </div>
              <div className="flex-1">
                <p className="font-mono text-xs text-red font-bold tracking-widest uppercase mb-1">{t("idCard")}</p>
                <h2 className="font-hindi text-3xl font-bold text-black mb-1">{member.name}</h2>
                <p className="font-mono text-black/60 tracking-widest uppercase text-xs mb-4">{t("memberId")}: {member.id}</p>
                <div className="flex flex-wrap gap-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/5 border border-black/10 rounded-full font-mono text-[10px] uppercase tracking-widest">
                    {member.phone}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/5 border border-black/10 rounded-full font-mono text-[10px] uppercase tracking-widest">
                    {member.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-10 bg-black/5 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-black/40 mb-2">{t("epic")}</p>
                <p className="font-mono text-lg uppercase tracking-widest text-black font-semibold">{member.epic_number}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-black/40 mb-2">{t("status")}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  <ShieldCheck size={18} />
                  <span className="font-mono text-xs uppercase tracking-widest font-bold">{t("verified")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
