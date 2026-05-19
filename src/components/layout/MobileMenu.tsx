"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  translations: {
    home: string;
    mission: string;
    about: string;
    report: string;
    join: string;
    issues: string;
    subtext: string;
  };
}

export default function MobileMenu({ isOpen, onClose, translations }: MobileMenuProps) {
  const menuItems = [
    { href: "/", label: translations.home },
    { href: "/mission", label: translations.mission },
    { href: "/about", label: translations.about },
    { href: "/report", label: translations.report },
    { href: "/join", label: translations.join },
    { href: "/issues", label: translations.issues },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5, staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-30 bg-off-white/95 backdrop-blur-xl flex flex-col justify-center px-8"
    >
      <div className="flex flex-col space-y-8 max-w-md mx-auto w-full">
        {menuItems.map((item, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Link 
              href={item.href} 
              onClick={onClose}
              className="text-4xl sm:text-5xl font-hindi font-medium tracking-wide text-black hover:text-red transition-colors inline-block"
            >
              {item.label}
            </Link>
          </motion.div>
        ))}

        <motion.div 
          variants={itemVariants}
          className="pt-12 border-t border-black/10 mt-8 flex flex-col space-y-4"
        >
          <p className="text-black/60 font-english text-sm tracking-widest uppercase">
            {translations.subtext}
          </p>
          <h2 className="text-4xl font-hindi text-red font-semibold tracking-wide">
            काम दिखना चाहिए.
          </h2>
        </motion.div>
      </div>
    </motion.div>
  );
}
