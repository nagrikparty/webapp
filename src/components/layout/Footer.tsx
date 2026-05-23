"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Globe, MessageCircle, Play, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/10">
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-5">
        <div className="absolute -top-[20%] -left-[10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        {/* Massive Typography Slogan */}
        <h2 className="font-hindi text-[12vw] leading-none text-white font-black tracking-tighter text-center uppercase mb-16 hover:text-red transition-colors duration-500 cursor-default">
          काम दिखना चाहिए
        </h2>

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
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
              <Globe size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
              <MessageCircle size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
              <Play size={20} />
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
