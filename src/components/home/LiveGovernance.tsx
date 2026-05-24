"use client";

import { motion } from "framer-motion";
import { AlertCircle, Clock, MapPin } from "lucide-react";

export default function LiveGovernance() {
  const blocks = [
    {
      id: 1,
      ward: "Ward 42",
      issue: "Drainage complaints",
      status: "14 unresolved",
      metricLabel: "Avg response",
      metricValue: "11 days",
      alert: true,
    },
    {
      id: 2,
      ward: "Okhla Phase 2",
      issue: "Streetlights inactive",
      status: "23 poles",
      metricLabel: "Status",
      metricValue: "Pending Action",
      alert: true,
    },
    {
      id: 3,
      ward: "Lajpat Nagar",
      issue: "Public toilet maintenance",
      status: "Reported poor",
      metricLabel: "Last inspection",
      metricValue: "47 days ago",
      alert: true,
    },
    {
      id: 4,
      ward: "South Extension",
      issue: "Water Supply Delay",
      status: "3 areas affected",
      metricLabel: "Expected fix",
      metricValue: "Unknown",
      alert: true,
    }
  ];

  return (
    <section className="bg-white py-24 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-black/10 pb-6">
          <div>
            <h2 className="font-hindi text-4xl sm:text-5xl font-bold text-black uppercase tracking-tight mb-2">
              Live Governance
            </h2>
            <p className="font-mono text-sm tracking-widest text-black/50 uppercase">
              Real-time public infrastructure monitoring
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red"></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-widest font-bold text-red">System Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-black/10 bg-off-white p-6 relative group hover:border-black/30 transition-colors"
            >
              {block.alert && (
                <div className="absolute top-0 left-0 w-full h-1 bg-red"></div>
              )}
              
              <div className="flex items-center gap-2 text-black/60 mb-4">
                <MapPin size={14} />
                <span className="font-mono text-xs uppercase tracking-widest font-bold">{block.ward}</span>
              </div>

              <h3 className="font-body text-lg font-bold text-black mb-1">{block.issue}</h3>
              <p className="font-mono text-sm text-red font-bold mb-6 flex items-center gap-2">
                <AlertCircle size={14} />
                {block.status}
              </p>

              <div className="border-t border-black/10 pt-4 mt-auto">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-black/50">{block.metricLabel}</span>
                  <span className="font-mono text-xs font-bold flex items-center gap-1 text-black/80">
                    <Clock size={12} className="text-black/40"/>
                    {block.metricValue}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
