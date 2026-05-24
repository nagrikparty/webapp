"use client";

import { motion } from "framer-motion";
import { Building2, Activity, ShieldCheck, BookOpen, Droplet } from "lucide-react";

export default function CivicInfrastructure() {
  const infraItems = [
    {
      title: "Ward Clinics",
      description: "Accessible primary healthcare in every neighborhood, fully staffed and equipped.",
      icon: Activity,
    },
    {
      title: "Functional Hospitals",
      description: "Upgraded secondary and tertiary care centers with transparent bed availability systems.",
      icon: Building2,
    },
    {
      title: "Women Safety Systems",
      description: "Rapid response networks, well-lit public corridors, and dedicated grievance cells.",
      icon: ShieldCheck,
    },
    {
      title: "Public Libraries",
      description: "Modern, quiet, and digitally-enabled study spaces for youth in every zone.",
      icon: BookOpen,
    },
    {
      title: "Clean Water Infrastructure",
      description: "Regulated municipal supply replacing private tanker monopolies.",
      icon: Droplet,
    }
  ];

  return (
    <section className="bg-off-white py-24 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <h2 className="font-hindi text-4xl sm:text-5xl font-bold text-black uppercase tracking-tight mb-4">
            What Nagrik Builds
          </h2>
          <p className="font-body text-xl text-black/70">
            We do not promise abstract ideals. We commit to operational public infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {infraItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-black flex items-center justify-center text-white">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="font-body text-xl font-bold text-black mb-2">{item.title}</h3>
                  <p className="font-body text-black/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
