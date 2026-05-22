"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-charcoal text-white/80 pt-16 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-14 sm:mb-16">
          {/* Column 1 — Movement */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">
              {t("movement")}
            </span>
            <FooterLink href="/mission" text={t("mission")} />
            <FooterLink href="/about" text={t("about")} />
            <FooterLink href="/manifesto" text={t("manifesto")} />
            <FooterLink href="/issues" text={t("issues")} />
          </div>

          {/* Column 2 — Participate */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">
              {t("participate")}
            </span>
            <FooterLink href="/report" text={t("report")} />
            <FooterLink href="/join" text={t("join")} />
            <FooterLink href="/infrastructure" text={t("infrastructure")} />
            <FooterLink href="/donate" text={t("donate")} />
          </div>

          {/* Column 3 — Transparency */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">
              {t("transparencyLabel")}
            </span>
            <FooterLink href="/transparency" text={t("transparency")} />
            <FooterLink href="/constitution" text={t("constitution")} />
            <FooterLink href="/media" text={t("media")} />
            <FooterLink href="/leadership" text={t("leadership")} />
          </div>

          {/* Column 4 — Legal */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30 mb-2">
              {t("legal")}
            </span>
            <FooterLink href="/candidates" text={t("candidates")} />
            <FooterLink href="/contact" text={t("contact")} />
            <FooterLink href="/privacy" text={t("privacy")} />
            <FooterLink href="/terms" text={t("terms")} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 sm:pt-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8">
          <div className="flex flex-col gap-1.5 text-white/40 font-body text-xs sm:text-sm">
            <span className="text-white/70 font-semibold tracking-wider text-sm">NAGRIK PARTY</span>
            <span>B-80, Street 8</span>
            <span>Ghaffar Manzil, Jamia Nagar</span>
            <span>Okhla, New Delhi – 110025</span>
          </div>

          <div className="text-right w-full md:w-auto">
            <h2 className="font-hindi text-3xl sm:text-4xl lg:text-5xl text-white font-semibold tracking-wide">
              काम दिखना चाहिए.
            </h2>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="font-mono text-[9px] text-white/20 tracking-wider">
            © {new Date().getFullYear()} NAGRIK PARTY. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="text-white/50 hover:text-white font-body text-sm tracking-wide transition-colors duration-300 inline-block"
    >
      {text}
    </Link>
  );
}
