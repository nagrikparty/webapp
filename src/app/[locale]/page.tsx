import { constructMetadata } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import HeroSection from "@/components/home/HeroSection";
import DifferentSection from "@/components/home/DifferentSection";
import FounderQuote from "@/components/home/FounderQuote";
import TransparencyStrip from "@/components/home/TransparencyStrip";
import { Link } from "@/i18n/routing";
import { getDashboardStats } from "@/actions";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return constructMetadata({ locale, path: '' });
}

export default async function HomePage() {
  const stats = await getDashboardStats();
  const t = await getTranslations('HomePageV2.FinalCTA');

  return (
    <>
      <Navbar />

      <PageTransition>
        <main className="bg-off-white min-h-screen text-black transition-colors duration-300">
          
          <HeroSection />

          <DifferentSection />

          <FounderQuote />

          <TransparencyStrip />

          {/* FINAL CTA with Real DB Stats */}
          <section className="bg-off-white dark:bg-[#0A0A0A] py-32 text-center border-t-4 border-black/10 dark:border-white/10 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-hindi text-4xl sm:text-6xl font-black text-black dark:text-[#F7F7F5] uppercase tracking-tighter mb-8 drop-shadow-sm">
                Democracy should work <br/>
                <span className="text-red">even after elections.</span>
              </h2>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
                <Link 
                  href="/join" 
                  className="w-full sm:w-auto bg-black dark:bg-[#F7F7F5] text-white dark:text-[#0A0A0A] px-10 py-5 font-mono uppercase tracking-widest font-bold hover:bg-black/80 dark:hover:bg-white/80 transition-colors rounded-none"
                >
                  [ {t('joinButton')} ]
                </Link>
                <Link 
                  href="/report" 
                  className="w-full sm:w-auto border-2 border-black dark:border-[#F7F7F5] text-black dark:text-[#F7F7F5] px-10 py-5 font-mono uppercase tracking-widest font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-none"
                >
                  [ {t('reportButton')} ]
                </Link>
              </div>
              
              <div className="flex flex-wrap justify-center gap-12 mt-16 text-sm font-mono opacity-80 border-t border-black/10 dark:border-white/10 pt-16">
                <div className="flex flex-col items-center">
                  <span className="font-black text-4xl text-black dark:text-white mb-2">{stats?.volunteerCount || '...'}</span>
                  <span className="tracking-widest uppercase">Verified Cadre</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-black text-4xl text-red mb-2">{stats?.reportCount || '...'}</span>
                  <span className="tracking-widest uppercase">Live Issues</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-black text-4xl text-black dark:text-white mb-2">{stats?.donationCount || '...'}</span>
                  <span className="tracking-widest uppercase">Public Audits</span>
                </div>
              </div>
            </div>
          </section>

        </main>
      </PageTransition>

      <Footer />
    </>
  );
}
