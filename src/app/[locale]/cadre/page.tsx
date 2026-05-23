"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Shield, Target, Zap, Share2, MapPin, Award, CheckCircle2, Megaphone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { toast } from "sonner";

export default function CadreDashboard() {
  const [points, setPoints] = useState(1250);
  const [rank] = useState("Digital Foot Soldier");
  
  const tasks = [
    { id: 1, title: "Share Manifesto on WhatsApp", points: 50, icon: <Share2 size={20} />, completed: false },
    { id: 2, title: "Report a local pothole", points: 100, icon: <MapPin size={20} />, completed: false },
    { id: 3, title: "Recruit 2 members", points: 500, icon: <Target size={20} />, completed: false },
    { id: 4, title: "Amplify our latest Tweet", points: 20, icon: <Megaphone size={20} />, completed: true },
  ];

  const handleCompleteTask = (id: number, taskPoints: number) => {
    setPoints(points + taskPoints);
    toast.success(`Task Completed! +${taskPoints} XP`, { icon: <Zap size={16} className="text-yellow-500" /> });
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-black pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-5xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-8 items-start mb-12"
          >
            {/* Player Profile / Stats */}
            <div className="w-full md:w-1/3 bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red/20 blur-3xl -mr-10 -mt-10 rounded-full"></div>
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 bg-red/20 border-2 border-red rounded-full flex items-center justify-center">
                  <Shield size={32} className="text-red" />
                </div>
                <div>
                  <h2 className="font-hindi text-2xl font-bold tracking-widest uppercase">Cadre 001</h2>
                  <p className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase">{rank}</p>
                </div>
              </div>

              <div className="bg-black/50 rounded-2xl p-4 mb-4 border border-white/5">
                <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Total Impact (XP)</p>
                <div className="flex items-center gap-2">
                  <Zap size={24} className="text-yellow-500 fill-yellow-500/20" />
                  <span className="font-hindi text-4xl font-black">{points}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-white/40 tracking-widest uppercase">
                <span>Next Rank: Commander</span>
                <span>2500 XP</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(points / 2500) * 100}%` }}
                  className="h-full bg-red"
                />
              </div>
            </div>

            {/* Active Missions */}
            <div className="w-full md:w-2/3">
              <div className="flex items-center gap-3 mb-6">
                <Target className="text-red" size={24} />
                <h3 className="font-hindi text-3xl font-bold tracking-widest uppercase">Active Missions</h3>
              </div>

              <div className="grid gap-4">
                {tasks.map((task, i) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                      task.completed 
                        ? 'bg-white/5 border-white/5 opacity-50' 
                        : 'bg-white/5 border-white/10 hover:border-red/50 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${task.completed ? 'bg-white/5 text-white/40' : 'bg-red/10 text-red'}`}>
                        {task.icon}
                      </div>
                      <div>
                        <h4 className={`font-body font-bold ${task.completed ? 'line-through text-white/40' : 'text-white'}`}>
                          {task.title}
                        </h4>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-yellow-500">+{task.points} XP</p>
                      </div>
                    </div>
                    
                    {task.completed ? (
                      <CheckCircle2 className="text-green-500" />
                    ) : (
                      <button 
                        onClick={() => handleCompleteTask(task.id, task.points)}
                        className="px-4 py-2 bg-red hover:bg-white hover:text-black transition-colors rounded-full font-mono text-[10px] uppercase font-bold tracking-widest"
                      >
                        Action
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Badges Section */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="font-hindi text-2xl font-bold tracking-widest uppercase mb-6 flex items-center gap-3">
              <Award className="text-yellow-500" /> Earned Badges
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-black/50 border border-white/5 rounded-2xl w-32 h-32 grayscale hover:grayscale-0 transition-all">
                <Shield size={40} className="text-blue-500 mb-2" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-center">Early Adopter</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-black/50 border border-white/5 rounded-2xl w-32 h-32 grayscale hover:grayscale-0 transition-all">
                <Megaphone size={40} className="text-orange-500 mb-2" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-center">Loudspeaker</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-black/50 border border-white/5 rounded-2xl w-32 h-32 opacity-20 border-dashed">
                <Target size={40} className="mb-2" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-center">Locked</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
