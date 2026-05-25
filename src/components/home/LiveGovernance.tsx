"use client";

import { motion } from "framer-motion";
import { FileText, Users, Building, Shield } from "lucide-react";

export default function LiveGovernance() {
  const blocks = [
    {
      id: 1,
      title: "Ward Assemblies",
      description: "Mandatory public meetings held every month to audit local expenditures and prioritize neighborhood work.",
      icon: Users,
    },
    {
      id: 2,
      title: "Open Ledgers",
      description: "Complete transparency of all municipal contracts, vendor payments, and project timelines accessible to any citizen.",
      icon: FileText,
    },
    {
      id: 3,
      title: "Accountable Representatives",
      description: "Elected officials bound by a public charter, facing immediate recall votes if constitutional duties are breached.",
      icon: Building,
    },
    {
      id: 4,
      title: "Citizen Grievance Cells",
      description: "Local hubs in every zone dedicated to tracking and resolving civic infrastructure complaints within strict deadlines.",
      icon: Shield,
    }
  ];

  return (
    <section className="bg-white py-24 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-black/10 pb-6">
          <div>
            <h2 className="font-hindi text-4xl sm:text-5xl font-bold text-black uppercase tracking-tight mb-2">
              Civic Accountability Structure
            </h2>
            <p className="font-mono text-sm tracking-widest text-black/50 uppercase">
              How we enforce governance at the ward level
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <span className="font-mono text-xs uppercase tracking-widest font-bold text-black border border-black px-4 py-2">
              Constitutional Framework
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blocks.map((block, index) => {
            const Icon = block.icon;
            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border border-black p-8 bg-off-white hover:bg-black hover:text-white transition-colors group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-black text-white group-hover:bg-white group-hover:text-black transition-colors">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-body text-2xl font-bold uppercase tracking-tight">{block.title}</h3>
                </div>
                <p className="font-body text-lg opacity-80 leading-relaxed">
                  {block.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
