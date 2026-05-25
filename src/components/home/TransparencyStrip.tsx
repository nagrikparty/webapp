"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";

export default function TransparencyStrip() {
  const trackers = [
    { label: "Principle I", value: "Right to Information", detail: "Mandatory public disclosure of all municipal contracts and vendor payments." },
    { label: "Principle II", value: "Public Audits", detail: "Citizens hold the legal right to audit local government expenditure." },
    { label: "Principle III", value: "Elected Accountability", detail: "Representatives must attend monthly ward assemblies or face recall." },
    { label: "Principle IV", value: "Decentralized Power", detail: "Budgetary control shifted directly to neighborhood civic committees." },
  ];

  return (
    <section className="bg-white py-24 border-y border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-hindi text-4xl sm:text-5xl font-bold text-black uppercase tracking-tight mb-4">
            Movement Foundations
          </h2>
          <p className="font-mono text-sm tracking-widest text-black/50 uppercase">
            The constitutional basis of our civic intervention
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trackers.map((tracker, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 border border-black hover:bg-black hover:text-white transition-colors group text-left flex flex-col"
            >
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60 mb-6 pb-4 border-b border-black/10 group-hover:border-white/20">
                {tracker.label}
              </h3>
              <p className="font-body text-2xl font-black mb-4 leading-tight">{tracker.value}</p>
              <p className="font-body text-sm opacity-80 leading-relaxed mt-auto">{tracker.detail}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/join" className="inline-block font-mono text-sm font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white border border-black px-8 py-4 transition-colors">
            Read Complete Manifesto
          </Link>
        </div>
      </div>
    </section>
  );
}
