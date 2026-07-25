import React, { useState } from 'react';
import { FEATURES_LIST } from '../data/mockData';
import { FeatureItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Share2, Bot, Radio, Activity, Globe, TrendingUp, Flame, Layers, Terminal, RefreshCw, CheckCircle2, Play } from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-5 h-5 text-amber-400" />,
  Share2: <Share2 className="w-5 h-5 text-violet-400" />,
  Bot: <Bot className="w-5 h-5 text-cyan-400" />,
  Radio: <Radio className="w-5 h-5 text-emerald-400" />,
  Activity: <Activity className="w-5 h-5 text-indigo-400" />,
  Globe: <Globe className="w-5 h-5 text-purple-400" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-pink-400" />,
  Flame: <Flame className="w-5 h-5 text-rose-400" />,
  Layers: <Layers className="w-5 h-5 text-sky-400" />,
  Terminal: <Terminal className="w-5 h-5 text-teal-400" />,
  RefreshCw: <RefreshCw className="w-5 h-5 text-blue-400" />
};

export const Features: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureItem>(FEATURES_LIST[0]);
  const [demoActive, setDemoActive] = useState<boolean>(false);

  const handleRunFeatureDemo = () => {
    setDemoActive(true);
    setTimeout(() => setDemoActive(false), 2000);
  };

  return (
    <section id="features" className="py-24 relative bg-[#04060d] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400 mb-3 block">
            Capabilities Matrix
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight mb-4">
            Built for Enterprise Scale & Sub-100ms Accuracy
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            11 core platform modules designed to catch zero-day fraud signatures, automate compliance audits, and protect payment flows.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {FEATURES_LIST.map((feature, idx) => {
            const isSelected = activeFeature.id === feature.id;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => {
                  setActiveFeature(feature);
                  handleRunFeatureDemo();
                }}
                className={`p-6 rounded-2xl glass-card-hover cursor-pointer border relative overflow-hidden group ${
                  isSelected
                    ? 'bg-purple-950/30 border-purple-500/50 shadow-xl shadow-purple-950/40'
                    : 'glass-panel border-white/10 hover:border-purple-500/30'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10 group-hover:scale-105 transition-transform">
                    {ICON_MAP[feature.icon]}
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-lg font-heading font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <span className="text-xs font-mono text-purple-300/80 mb-3 block">{feature.subtitle}</span>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Sub Features Bullet List */}
                <ul className="space-y-1.5 pt-3 border-t border-white/5">
                  {feature.details.map((detail, dIdx) => (
                    <li key={dIdx} className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Feature Live Interactive Visualizer */}
        <div className="max-w-4xl mx-auto p-8 rounded-3xl glass-panel-glow border border-purple-500/40 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-900/50 border border-purple-500/30">
                {ICON_MAP[activeFeature.icon]}
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-white">
                  Interactive Module: {activeFeature.title}
                </h3>
                <span className="text-xs font-mono text-cyan-400">
                  {activeFeature.subtitle} // Active SLA Test
                </span>
              </div>
            </div>

            <button
              onClick={handleRunFeatureDemo}
              disabled={demoActive}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
            >
              <Play className={`w-3.5 h-3.5 ${demoActive ? 'animate-spin' : ''}`} />
              <span>{demoActive ? 'Executing Vector Scan...' : 'Trigger Test Pipeline'}</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs">
            <div className="flex justify-between text-slate-400 text-[10px] mb-3 pb-2 border-b border-white/5">
              <span>MODULE ID: {activeFeature.id.toUpperCase()}</span>
              <span className="text-emerald-400">STATUS: HEALTHY // READY</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id + (demoActive ? '-active' : '-idle')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2 text-slate-300"
              >
                <div className="text-purple-300 font-bold">
                  &gt; [INGEST] Event stream payload received. Vectorizing attributes...
                </div>
                <div className="text-slate-400">
                  &gt; [Ahnlich Engine] Computing 1536-D cosine similarity against 10M+ centroids...
                </div>
                <div className="text-cyan-300">
                  &gt; [Result] Cosine Distance = 0.0124 (High Threat Centroid Match)
                </div>
                <div className="text-rose-400 font-bold">
                  &gt; [ACTION] Sub-100ms Block Decision Executed. Payload forwarded to Kafka Dead-Letter Topic.
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
