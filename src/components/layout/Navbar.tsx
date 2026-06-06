import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Megaphone } from "lucide-react";
import FullscreenMenu from "./FullscreenMenu";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
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

  const toggleLocale = "hi";
  const toggleText = "हिन्दी";

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest">
        Skip to content
      </a>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-off-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-black/10 dark:border-white/10 shadow-sm py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left: Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" aria-label="Home page" className="flex items-center gap-2 group z-50" onClick={() => setMenuOpen(false)}>
                <Logo size={28} className="text-red transition-transform duration-300 group-hover:scale-110" />
                <div className="flex flex-col notranslate" translate="no">
                  <span className="font-hindi text-2xl leading-none tracking-tighter font-bold text-black dark:text-[#F7F7F5] uppercase">
                    नागरिक पार्टी
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              <NavLink href="/issues" text="ISSUES" />
              <NavLink href="/action" text="ACTION" />
              <NavLink href="/cadre" text="CADRE" highlight />
              <NavLink href="/transparency" text="TRANSPARENCY" />
              <NavLink href="/join" text="JOIN" />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              <Link
                href={pathname}
                aria-label="Switch Language"
                className="flex text-xs font-mono font-bold text-black/70 dark:text-white/70 hover:text-red transition-colors duration-300 tracking-widest uppercase bg-black/5 dark:bg-white/5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full"
              >
                {toggleText}
              </Link>



              {/* Mobile Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden relative text-black dark:text-[#F7F7F5] hover:text-red transition-colors p-2 z-50 bg-black/5 dark:bg-white/5 rounded-full"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X size={20} strokeWidth={2} />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu size={20} strokeWidth={2} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <FullscreenMenu onClose={() => setMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, text, highlight = false }: { href: string; text: string; highlight?: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase font-bold transition-colors duration-300 ${
        isActive ? "text-red" : highlight ? "text-red" : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
      }`}
    >
      {highlight && <span className="w-1.5 h-1.5 rounded-full bg-red inline-block"></span>}
      {text}
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-red rounded-none"
        />
      )}
    </Link>
  );
}
