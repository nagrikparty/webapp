"use client";

import { motion } from "framer-motion";
import { Users, PhoneCall, Calendar, Flame } from "lucide-react";

export default function ActionNetwork() {
  const steps = [
    {
      title: "Ward Captains",
      description: "Local leaders designated in each neighborhood to coordinate issue reporting.",
      icon: Users,
    },
    {
      title: "Issue Escalation",
      description: "Dedicated teams pushing reported issues through bureaucratic channels.",
      icon: Flame,
    },
    {
      title: "Weekly Meetings",
      description: "Open public assemblies every Sunday to review pending ward tasks.",
      icon: Calendar,
    },
    {
      title: "Direct Action",
      description: "Protests and peaceful sit-ins organized when institutional pathways fail.",
      icon: PhoneCall,
    }
  ];

  return (
    <section className="bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-hindi text-4xl sm:text-5xl font-bold uppercase tracking-tight mb-4 text-white">
                People's <br/> Opposition
              </h2>
              <p className="font-body text-lg text-white/70 mb-8 border-l-2 border-red pl-4">
                This movement exists to pressure governance systems daily, not only during elections.
              </p>
            </motion.div>
          </div>

          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="border border-white/10 p-6 bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <Icon size={24} className="text-red mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-body text-xl font-bold mb-2">{step.title}</h3>
                    <p className="font-body text-white/60 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
