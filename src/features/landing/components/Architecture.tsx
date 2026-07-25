import React, { useState } from 'react';
import { ARCHITECTURE_NODES } from '../data/mockData';
import { ArchitectureNode } from '../types';
import { motion } from 'framer-motion';
import { Shield, Activity, Layers, Zap, Cpu, Share2, Bot, Radio, Layout } from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Layout: <Layout className="w-5 h-5 text-purple-400" />,
  Shield: <Shield className="w-5 h-5 text-cyan-400" />,
  Activity: <Activity className="w-5 h-5 text-indigo-400" />,
  Layers: <Layers className="w-5 h-5 text-sky-400" />,
  Zap: <Zap className="w-5 h-5 text-amber-400" />,
  Cpu: <Cpu className="w-5 h-5 text-rose-400" />,
  Share2: <Share2 className="w-5 h-5 text-violet-400" />,
  Bot: <Bot className="w-5 h-5 text-blue-400" />,
  Radio: <Radio className="w-5 h-5 text-emerald-400" />
};

export const Architecture: React.FC = () => {
  const [activeNode, setActiveNode] = useState<ArchitectureNode>(ARCHITECTURE_NODES[5]); // Default Fraud Engine

  return (
    <section id="architecture" className="py-24 relative bg-[#04060d] border-t border-white/5 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400 mb-3 block">
            System Topology
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight mb-4">
            Fault-Tolerant Distributed Microservices
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            High-availability event-driven infrastructure engineered for 99.99% SLA uptime and sub-100ms authorization decisions.
          </p>
        </div>

        {/* Architecture Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {ARCHITECTURE_NODES.map((node) => {
            const isSelected = activeNode.id === node.id;
            return (
              <motion.div
                key={node.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveNode(node)}
                className={`p-6 rounded-2xl cursor-pointer border transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-purple-950/40 border-cyan-400 shadow-2xl shadow-purple-950/50'
                    : 'glass-panel border-white/10 hover:border-purple-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                    {ICON_MAP[node.iconName]}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {node.latency}
                  </span>
                </div>

                <span className="text-[10px] font-mono uppercase text-purple-400 tracking-wider block mb-1">
                  {node.category} Layer
                </span>
                <h3 className="text-lg font-heading font-bold text-white mb-1">
                  {node.name}
                </h3>
                <span className="text-xs font-mono text-slate-400 block mb-3">
                  {node.tech}
                </span>

                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
                  {node.description}
                </p>

                {/* Animated Connection Indicator */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] font-mono">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Active // Circuit Clear</span>
                  </span>
                  <span className="text-slate-500 group-hover:text-cyan-400 transition-colors">
                    Click to Inspect →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Architecture Node Detail Box */}
        <div className="max-w-4xl mx-auto p-8 rounded-3xl glass-panel-glow border border-purple-500/40 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-purple-900/50 border border-purple-500/30">
                {ICON_MAP[activeNode.iconName]}
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
                  LAYER: {activeNode.category}
                </span>
                <h3 className="text-xl font-heading font-bold text-white">
                  {activeNode.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                ● Circuit Breaker: CLOSED (Healthy)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs mb-6">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10">
              <span className="text-slate-400 text-[10px] block uppercase">Technology Core</span>
              <span className="text-white font-bold text-sm">{activeNode.tech}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10">
              <span className="text-slate-400 text-[10px] block uppercase">Internal Latency</span>
              <span className="text-cyan-300 font-bold text-sm">{activeNode.latency}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10">
              <span className="text-slate-400 text-[10px] block uppercase">Failover Policy</span>
              <span className="text-purple-300 font-bold text-sm">Exponential Backoff Retries</span>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {activeNode.description} In the event of a regional datacenter degradation, request routing automatically fails over to Redis backup queues without dropping transaction state.
          </p>
        </div>
      </div>
    </section>
  );
};
