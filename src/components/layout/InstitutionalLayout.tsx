"use client";

import { motion } from "framer-motion";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";

interface InstitutionalLayoutProps {
  title: string;
  content: string;
}

export default function InstitutionalLayout({ title, content }: InstitutionalLayoutProps) {
  useLenis();

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen pt-40 pb-32">
          <div className="absolute inset-0 film-grain opacity-20 pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-hindi text-[clamp(3rem,6vw,4.5rem)] leading-none text-black font-bold mb-12 pb-2">
                {title}
              </h1>
              
              <div className="prose prose-stone prose-lg max-w-none font-english text-black/70 leading-relaxed">
                <p className="text-xl sm:text-2xl font-light text-black/90 border-l-4 border-red pl-6 mb-8">
                  {content}
                </p>
                {/* Additional content blocks would go here if this was a real CMS */}
                <p>
                  This document serves as an institutional record for the Nagrik Party. The primary objective is to maintain complete transparency with the public regarding our internal operating procedures, legal compliance, and structural organization. 
                </p>
                <p>
                  All updates to this document will be broadcasted to active Ward Captains and publicly archived. If you believe this document is missing critical civic protections, please submit a structural proposal through the Nagrik Report system.
                </p>
              </div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
