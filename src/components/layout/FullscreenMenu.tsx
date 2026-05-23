"use client";

import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Megaphone } from "lucide-react";

interface FullscreenMenuProps {
  onClose: () => void;
}

const primaryLinks = [
  { href: "/", labelKey: "home" },
  { href: "/manifesto", labelKey: "manifesto" },
  { href: "/cadre", label: "CADRE" },
  { href: "/report", labelKey: "report" },
  { href: "/join", labelKey: "join" },
  { href: "/issues", labelKey: "issues" },
] as const;

const secondaryLinks = [
  { href: "/about", labelKey: "about" },
  { href: "/transparency", labelKey: "transparency" },
  { href: "/donate", labelKey: "donate" },
  { href: "/contact", labelKey: "contact" },
  { href: "/login", labelKey: "login" },
] as const;

export default function FullscreenMenu({ onClose }: FullscreenMenuProps) {
  const t = useTranslations("Navigation");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.06,
        delayChildren: 0.15,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -15,
      filter: "blur(4px)",
      transition: { duration: 0.2 },
    },
  };

  const secondaryVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-30 bg-black/[0.97] backdrop-blur-2xl flex flex-col justify-center overflow-hidden"
    >
      <div className="relative z-10 px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto w-full">
        {/* Primary Navigation */}
        <nav className="flex flex-col gap-2 sm:gap-3 mb-12">
          {primaryLinks.map((item) => (
            <motion.div key={item.href} variants={itemVariants}>
              <Link
                href={item.href}
                onClick={onClose}
                className="group flex items-baseline gap-4 py-1"
              >
                <span className={`font-hindi text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase group-hover:text-red transition-colors duration-300 leading-tight ${'label' in item ? 'text-red' : 'text-white'}`}>
                  {'labelKey' in item ? t(item.labelKey) : item.label}
                </span>
                <span className="hidden sm:block w-0 group-hover:w-16 h-px bg-red transition-all duration-500"></span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Divider */}
        <motion.div
          variants={secondaryVariants}
          className="w-full h-px bg-white/10 mb-8"
        ></motion.div>

        {/* Secondary Navigation */}
        <motion.div
          variants={secondaryVariants}
          className="flex flex-wrap gap-x-8 gap-y-3 mb-12"
        >
          {secondaryLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="text-sm font-mono tracking-widest text-white/40 hover:text-red transition-colors duration-300 uppercase font-bold"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </motion.div>

        {/* Report Now Mobile CTA */}
        <motion.div variants={secondaryVariants}>
          <Link 
            href="/report" 
            onClick={onClose}
            className="md:hidden inline-flex items-center gap-2 bg-red text-white px-6 py-4 rounded-full font-mono text-xs uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(255,43,43,0.3)] mb-8"
          >
            <Megaphone size={16} />
            REPORT NOW
          </Link>
        </motion.div>

        {/* Bottom slogan */}
        <motion.div
          variants={secondaryVariants}
          className="flex flex-col gap-2"
        >
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-white/30">
            {t("menuSubtext")}
          </p>
          <h2 className="font-hindi text-3xl sm:text-4xl text-red font-black tracking-tighter uppercase">
            काम दिखना चाहिए.
          </h2>
        </motion.div>
      </div>
    </motion.div>
  );
}

