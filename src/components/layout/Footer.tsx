import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/lib/next-shims";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/10">
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
        <div className="absolute -top-[20%] -left-[10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Founder Photo */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white/20 mb-8 grayscale contrast-125 brightness-90">
          <Image 
            src="/images/founder.jpg" 
            alt="Arsalan Azad" 
            fill 
            className="object-cover object-top"
          />
        </div>

        {/* Massive Typography Slogan */}
        <h2 className="font-hindi text-[10vw] sm:text-[8vw] leading-none text-white font-black tracking-tighter text-center uppercase mb-12 hover:text-red transition-colors duration-500 cursor-default drop-shadow-lg">
          काम दिखना चाहिए।
        </h2>

        {/* Volunteer CTA */}
        <div className="mb-20">
          <Link 
            href="/join" 
            className="inline-block bg-red text-white px-10 py-5 font-mono text-sm sm:text-base uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(255,43,43,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
          >
            [ JOIN ]
          </Link>
        </div>

        {/* Minimal Link Row */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-16">
          <FooterLink href="/manifesto" text="MANIFESTO" />
          <FooterLink href="/issues" text="LIVE ISSUES" />
          <FooterLink href="/cadre" text="CADRE DASHBOARD" />
          <FooterLink href="/donate" text="DONATE" />
        </div>

        {/* Socials & Legal */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 pt-8">
          <div className="flex items-center gap-6">
            <a href="https://instagram.com/nagrikparty" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://x.com/nagrikparty" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors" aria-label="X (Twitter)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
            </a>
            <a href="https://youtube.com/@nagrikparty" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors" aria-label="YouTube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-white/40 font-mono text-[10px] uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">TERMS OF SERVICE</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">CONTACT</Link>
          </div>

          <div className="text-white/20 font-mono text-[10px] uppercase tracking-widest">
            © {new Date().getFullYear()} NAGRIK PARTY.
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-1 text-white/60 hover:text-white font-mono text-xs font-bold tracking-[0.2em] transition-colors duration-300"
    >
      {text}
      <ArrowUpRight size={14} className="opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-red" />
    </Link>
  );
}
