"use client";
import { useLenis } from "@/hooks/useLenis";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/effects/PageTransition";
import { motion } from "framer-motion";
import { Download, FileText, CheckCircle } from "lucide-react";
import { constitutionContent } from "@/data/constitutionData";
import { Fragment } from "react";

export default function ConstitutionPage() {
  useLenis();

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="bg-off-white min-h-screen text-black pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16 border-b border-black/10 pb-10"
            >
              <div className="inline-flex items-center justify-center p-4 bg-white border border-black/10 rounded-full mb-6">
                <FileText size={40} className="text-black" />
              </div>
              <h1 className="font-hindi text-4xl md:text-6xl font-bold text-black tracking-tight mb-4 uppercase leading-[0.9]">
                CONSTITUTION OF NAGRIK PARTY
              </h1>
              <p className="font-hindi text-2xl text-red tracking-wide mb-8">
                “Kaam dikhna chahiye.”
              </p>
              
              <button className="inline-flex items-center gap-2 bg-red text-black px-8 py-4 rounded-full font-mono font-bold hover:bg-red/90 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-red/20 uppercase tracking-widest text-sm">
                <Download size={18} />
                DOWNLOAD PDF
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-black/10 rounded-2xl p-6 sm:p-12 space-y-8"
            >
              {constitutionContent.map((block, index) => {
                if (block.type === "h1") {
                  if (block.text === "CONSTITUTION OF NAGRIK PARTY" || block.text === "NAGRIK PARTY") return null; // Handled in header/footer
                  return (
                    <h1 key={index} className="font-hindi text-4xl font-bold text-black uppercase tracking-tight pt-8 border-t border-black/10 mt-12 first:mt-0 first:pt-0 first:border-0">
                      {block.text}
                    </h1>
                  );
                }
                
                if (block.type === "h2") {
                  if (block.text === "“Kaam dikhna chahiye.”") return null; // Handled
                  return (
                    <h2 key={index} className="font-hindi text-2xl font-bold text-black border-l-4 border-red pl-4 mt-8">
                      {block.text}
                    </h2>
                  );
                }
                
                if (block.type === "p") {
                  return (
                    <p key={index} className="font-body text-black/70 leading-relaxed text-lg">
                      {block.text}
                    </p>
                  );
                }

                if (block.type === "list") {
                  return (
                    <ul key={index} className="list-disc list-outside ml-6 space-y-2 text-black/70 font-body text-lg">
                      {block.items?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  );
                }

                if (block.type === "divider") {
                  return <div key={index} className="w-full h-px bg-black/10 my-10"></div>;
                }

                return null;
              })}
              
              <div className="pt-12 mt-12 border-t border-black/10 flex flex-col items-center justify-center gap-4 text-center">
                <h1 className="font-hindi text-5xl font-bold text-black uppercase tracking-tight">
                  NAGRIK PARTY
                </h1>
                <h2 className="font-hindi text-3xl font-bold text-red">
                  “Kaam dikhna chahiye.”
                </h2>
                <div className="flex items-center justify-center gap-2 text-black/40 mt-8">
                  <CheckCircle size={16} />
                  <span className="font-mono text-xs uppercase tracking-widest">ECI Compliant Document</span>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
