"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import FullscreenMenu from "./FullscreenMenu";
import Logo from "@/components/ui/Logo";

export default function Navbar() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const currentLocale = useLocale();
  const toggleLocale = currentLocale === "hi" ? "en" : "hi";
  const toggleText = currentLocale === "hi" ? "EN" : "हिन्दी";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-off-white/90 backdrop-blur-xl border-b border-black/8 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Logo & Language */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setMenuOpen(false)}>
                <Logo size={32} className="text-black group-hover:text-red transition-colors duration-300" />
                <div className="flex flex-col notranslate" translate="no">
                  <span className="font-hindi text-xl sm:text-2xl leading-none tracking-wide font-medium text-black">
                    नागरिक पार्टी
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.2em] font-medium uppercase text-black/60">
                    NAGRIK PARTY
                  </span>
                </div>
              </Link>

              <div className="h-5 w-px bg-black/15"></div>

              <Link
                href={pathname}
                locale={toggleLocale as "en" | "hi"}
                className="text-xs sm:text-sm font-medium text-black/70 hover:text-red transition-colors duration-300 tracking-wider"
              >
                {toggleText}
              </Link>
            </div>

            {/* Right: Hamburger Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative text-black hover:text-red transition-colors p-2 z-50"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={26} strokeWidth={1.5} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={26} strokeWidth={1.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <FullscreenMenu
            onClose={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
