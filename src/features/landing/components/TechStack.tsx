import React, { useState } from 'react';
import { TECH_STACK } from '../data/mockData';
import { motion } from 'framer-motion';
import { Server, Zap, Activity, Database, Radio, Cpu, Share2, Code, Layers, ShieldCheck, CheckCircle } from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Server: <Server className="w-5 h-5 text-rose-400" />,
  Zap: <Zap className="w-5 h-5 text-amber-400" />,
  Activity: <Activity className="w-5 h-5 text-indigo-400" />,
  Database: <Database className="w-5 h-5 text-cyan-400" />,
  Radio: <Radio className="w-5 h-5 text-emerald-400" />,
  Cpu: <Cpu className="w-5 h-5 text-purple-400" />,
  Share2: <Share2 className="w-5 h-5 text-violet-400" />,
  Code: <Code className="w-5 h-5 text-orange-400" />,
  Layers: <Layers className="w-5 h-5 text-sky-400" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-teal-400" />
};

export const TechStack: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState(TECH_STACK[2]); // Default Kafka

  return (
    <section className="py-16 bg-[#04060d] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-purple-400 mb-2 block">
          Enterprise Technology Stack
        </span>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
          Powered by Industrial-Grade Open Source & AI Infrastructure
        </h2>
      </div>

      {/* Infinite Marquee */}
      <div className="relative w-full overflow-hidden py-4 flex gap-6 bg-slate-950/40 border-y border-white/5">
        <div className="flex shrink-0 gap-6 animate-marquee">
          {TECH_STACK.concat(TECH_STACK).map((tech, index) => (
            <button
              key={`${tech.name}-${index}`}
              onClick={() => setSelectedTech(tech)}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer whitespace-nowrap ${
                selectedTech.name === tech.name
                  ? 'bg-purple-500/20 border-purple-500/50 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
              }`}
            >
              {ICON_MAP[tech.icon]}
              <span className="font-heading font-semibold text-sm">{tech.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Tech Detail Drawer / Card */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <motion.div
          key={selectedTech.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 rounded-2xl glass-panel border border-purple-500/30 flex flex-col sm:flex-row items-center sm:items-start gap-6"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/30 shrink-0">
            {ICON_MAP[selectedTech.icon]}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h3 className="text-xl font-heading font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <span>{selectedTech.name}</span>
                <span className="text-xs font-mono font-normal text-purple-300 px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30">
                  {selectedTech.role}
                </span>
              </h3>
              <span className="text-xs font-mono text-cyan-400 flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Zero Downtime SLA</span>
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              FraudGuard AI integrates {selectedTech.name} directly into its sub-100ms pipeline to handle high-concurrency transaction streaming, low-latency state vector caching, and resilient error recovery.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
