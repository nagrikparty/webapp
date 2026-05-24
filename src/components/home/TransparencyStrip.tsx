"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";

export default function TransparencyStrip() {
  const trackers = [
    { label: "Public Donations", value: "₹4,20,500", detail: "Last 30 days" },
    { label: "Issue Resolution", value: "68%", detail: "Avg 14 days" },
    { label: "Representative Attendance", value: "92%", detail: "Assembly Sessions" },
    { label: "Response Timeline", value: "< 24h", detail: "Emergency queries" },
  ];

  return (
    <section className="bg-white py-16 border-y border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-hindi text-3xl sm:text-4xl font-bold text-black uppercase tracking-tight mb-2">
            Public Transparency
          </h2>
          <p className="font-mono text-sm tracking-widest text-black/50 uppercase">
            Open ledgers for everything we do.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trackers.map((tracker, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 border border-black/10 hover:border-red transition-colors group"
            >
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 mb-4">{tracker.label}</h3>
              <p className="font-body text-3xl font-black text-black group-hover:text-red transition-colors mb-2">{tracker.value}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-black/40">{tracker.detail}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/transparency" className="inline-block font-mono text-xs font-bold uppercase tracking-widest text-red hover:text-black transition-colors border-b border-red hover:border-black pb-1">
            View Complete Ledger
          </Link>
        </div>
      </div>
    </section>
  );
}
