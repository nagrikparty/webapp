"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentLocale = useLocale();
  const toggleLocale = currentLocale === "hi" ? "en" : "hi";
  const toggleText = currentLocale === "hi" ? "EN" : "हिन्दी";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
          scrolled || mobileMenuOpen ? "bg-off-white/95 backdrop-blur-md border-b border-black/10 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Logo & Language */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <Logo size={36} className="text-black group-hover:text-red transition-colors duration-300" />
                <div className="flex flex-col notranslate" translate="no">
                  <span className="font-hindi text-2xl leading-none tracking-wide font-medium text-black">नागरिक पार्टी</span>
                  <span className="text-[10px] tracking-[0.2em] font-medium uppercase text-black/70">NAGRIK PARTY</span>
                </div>
              </Link>
              
              <div className="h-6 w-px bg-black/20"></div>
              
              <Link 
                href={pathname} 
                locale={toggleLocale as any}
                className="text-sm font-medium text-black/80 hover:text-red transition-colors"
              >
                {toggleText}
              </Link>
            </div>

            {/* Right: Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="/" text={t("home")} />
              <NavLink href="/mission" text={t("mission")} />
              <NavLink href="/about" text={t("about")} />
              <NavLink href="/report" text={t("report")} />
              <NavLink href="/join" text={t("join")} />
              <NavLink href="/issues" text={t("issues")} />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-black hover:text-red transition-colors p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu 
            isOpen={mobileMenuOpen} 
            onClose={() => setMobileMenuOpen(false)} 
            translations={{
              home: t("home"),
              mission: t("mission"),
              about: t("about"),
              report: t("report"),
              join: t("join"),
              issues: t("issues"),
              subtext: t("menuSubtext")
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, text }: { href: string; text: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={`text-sm tracking-widest font-medium transition-colors hover:text-red ${
        isActive ? "text-red font-semibold" : "text-black/80"
      }`}
    >
      {text}
    </Link>
  );
}
