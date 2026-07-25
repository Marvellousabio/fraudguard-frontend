import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap, Activity, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SAMPLE_TRANSACTIONS } from '../data/mockData';
import { Transaction } from '../types';

interface HeroProps {
  onOpenDemoModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemoModal }) => {
  const [activeTxIndex, setActiveTxIndex] = useState(0);
  const [simulationMode, setSimulationMode] = useState<'AUTO' | 'ATTACK' | 'NORMAL'>('AUTO');
  const [isSimulating, setIsSimulating] = useState(false);
  const [liveStream, setLiveStream] = useState<Transaction[]>(SAMPLE_TRANSACTIONS);

  // Auto-rotate transaction stream simulation
  useEffect(() => {
    if (simulationMode === 'AUTO') {
      const interval = setInterval(() => {
        setActiveTxIndex((prev) => (prev + 1) % SAMPLE_TRANSACTIONS.length);
      }, 4500);
      return () => clearInterval(interval);
    }
  }, [simulationMode]);

  const currentTx = liveStream[activeTxIndex] || SAMPLE_TRANSACTIONS[0];

  const handleSimulateAttack = () => {
    setIsSimulating(true);
    setSimulationMode('ATTACK');
    // Inject custom attack transaction
    const attackTx: Transaction = {
      id: `tx_attack_${Math.floor(Math.random() * 90000 + 10000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
      amount: 14850.00,
      currency: 'USD',
      merchant: 'Shadow Digital Vault',
      cardholder: 'Alexander Sterling',
      ipLocation: 'Bucharest, Romania (IP 185.220.101.4)',
      registeredLocation: 'Chicago, IL, USA',
      riskScore: 99,
      status: 'BLOCKED',
      confidence: 99.8,
      vectorDistance: 0.008,
      threatCategory: 'Vector Centroid Match #9901 - Botnet Drain',
      rulesTriggered: ['GEO_IMPOSSIBLE_SPEED', 'PROXY_TOR_EXIT', 'HIGH_VALUE_CRYPTO'],
      gptExplanation: 'Critical threat: Transaction matched high-density botnet vector cluster #9901 with 99.8% confidence. Physical geo-velocity discrepancy exceeds Mach 3 limits.',
      velocityWindow: '18 txns in 12 seconds',
      geoMismatch: true,
      deviceFingerprint: 'FP_ATTACK_HEADLESS_CHROME'
    };
    setLiveStream((prev) => [attackTx, ...prev]);
    setActiveTxIndex(0);
    setTimeout(() => setIsSimulating(false), 800);
  };

  const handleSimulateNormal = () => {
    setIsSimulating(true);
    setSimulationMode('NORMAL');
    const normalTx: Transaction = {
      id: `tx_safe_${Math.floor(Math.random() * 90000 + 10000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
      amount: 18.50,
      currency: 'USD',
      merchant: 'Starbucks Store #402',
      cardholder: 'Sarah Jenkins',
      ipLocation: 'Seattle, WA, USA',
      registeredLocation: 'Seattle, WA, USA',
      riskScore: 2,
      status: 'APPROVED',
      confidence: 99.9,
      vectorDistance: 0.942,
      threatCategory: 'Verified Regular Daily Habit',
      rulesTriggered: [],
      gptExplanation: 'Cardholder morning routine match. Zero velocity anomalies, vector distance 0.942 far from known threat clusters.',
      velocityWindow: '1 txn today',
      geoMismatch: false,
      deviceFingerprint: 'FP_SAFE_APPLE_PAY'
    };
    setLiveStream((prev) => [normalTx, ...prev]);
    setActiveTxIndex(0);
    setTimeout(() => setIsSimulating(false), 800);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Glow Ring */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-purple-600/20 via-indigo-500/10 to-cyan-400/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Copy */}
          <div className="lg:col-span-5 flex flex-col items-start py-4">
            {/* Pill Header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Semantic Similarity Powered</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl font-bold leading-[1.05] tracking-tight mb-6 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent"
            >
              Detect Fraud <br className="hidden sm:inline" />
              <span className="text-indigo-400">Before</span> It Happens
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-400 mb-8 leading-relaxed max-w-md font-normal"
            >
              Enterprise-grade real-time monitoring leveraging Vector Search and GPT intelligence to eliminate chargebacks with sub-100ms latency.
            </motion.p>

            {/* Key Value Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 w-full max-w-md text-xs font-mono"
            >
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Sub-100ms SLA</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                <Activity className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Kafka Stream</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Vector Cosine</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto"
            >
              <a
                href="/register"
                className="group flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 text-white transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={onOpenDemoModal}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 text-white transition-all text-sm"
              >
                <span>Request Demo</span>
              </button>

              <a
                href="#architecture"
                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 text-white transition-all text-sm"
              >
                <span>View Architecture</span>
              </a>
            </motion.div>
          </div>

          {/* Right Hero Dashboard Mockup Widget */}
          <div className="lg:col-span-7 relative">
            {/* Outer Glowing Glass Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-panel-glow rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-950/40 relative"
            >
              {/* Header Bar */}
              <div className="bg-[#0b0e1e] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">
                    FraudGuard Core Stream // Cluster-01-US-WEST
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    WS Connected
                  </span>
                </div>
              </div>

              {/* Live Interactive Control Bar */}
              <div className="bg-[#080b18] px-4 py-2 border-b border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Interactive Simulation:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateAttack}
                    disabled={isSimulating}
                    className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 flex items-center gap-1 transition-all active:scale-95"
                  >
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>Simulate Attack</span>
                  </button>
                  <button
                    onClick={handleSimulateNormal}
                    disabled={isSimulating}
                    className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 flex items-center gap-1 transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Normal Traffic</span>
                  </button>
                </div>
              </div>

              {/* Dashboard Content Body */}
              <div className="p-5 space-y-4 bg-[#070a14]/90">
                {/* Top Metrics Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Decision Time</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold font-mono text-cyan-300">22.4</span>
                      <span className="text-xs text-slate-400 font-mono">ms</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono mt-1">✓ SLA &lt; 100ms</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Vector Cosine</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold font-mono text-purple-300">{currentTx.vectorDistance}</span>
                      <span className="text-xs text-slate-400 font-mono">dist</span>
                    </div>
                    <span className="text-[10px] text-purple-300 font-mono mt-1">1536-D Ahnlich</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">AI Confidence</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-bold font-mono text-amber-300">{currentTx.confidence}%</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">GPT-4o Agent</span>
                  </div>
                </div>

                {/* Main Transaction Card Inspector */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-xl border ${
                      currentTx.status === 'BLOCKED'
                        ? 'bg-rose-950/30 border-rose-500/40'
                        : currentTx.status === 'FLAGGED'
                        ? 'bg-amber-950/30 border-amber-500/40'
                        : 'bg-emerald-950/20 border-emerald-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            currentTx.status === 'BLOCKED'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : currentTx.status === 'FLAGGED'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {currentTx.status}
                        </span>
                        <span className="text-xs font-mono text-slate-300">{currentTx.id}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{currentTx.timestamp}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3 font-mono">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Amount & Merchant</span>
                        <span className="text-white font-bold">
                          ${currentTx.amount.toLocaleString()} {currentTx.currency}
                        </span>
                        <span className="text-slate-300 block text-[11px] truncate">{currentTx.merchant}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">IP & Location</span>
                        <span className="text-cyan-300 font-semibold block truncate">{currentTx.ipLocation}</span>
                        <span className="text-slate-400 text-[10px] block truncate">Home: {currentTx.registeredLocation}</span>
                      </div>
                    </div>

                    {/* Risk Score Gauge Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center text-xs font-mono mb-1">
                        <span className="text-slate-300">Hybrid Risk Score</span>
                        <span
                          className={`font-bold ${
                            currentTx.riskScore > 75
                              ? 'text-rose-400'
                              : currentTx.riskScore > 40
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {currentTx.riskScore} / 100
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${currentTx.riskScore}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full rounded-full ${
                            currentTx.riskScore > 75
                              ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                              : currentTx.riskScore > 40
                              ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                              : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                          }`}
                        />
                      </div>
                    </div>

                    {/* GPT Natural Language Explanation */}
                    <div className="p-3 rounded-lg bg-slate-900/90 border border-white/10 text-xs">
                      <div className="flex items-center justify-between mb-1 text-[11px] font-mono text-purple-300">
                        <span className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                          <span>GPT Fraud Analyst Reasoning</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Kafka-Streamed</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        "{currentTx.gptExplanation}"
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Mini Transaction Feed List */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
                    <span>Recent Kafka Event Pipeline</span>
                    <span>Click to inspect</span>
                  </div>
                  {SAMPLE_TRANSACTIONS.slice(0, 3).map((tx, idx) => (
                    <div
                      key={tx.id}
                      onClick={() => setActiveTxIndex(idx)}
                      className={`p-2 rounded-lg border text-xs font-mono flex items-center justify-between cursor-pointer transition-all ${
                        activeTxIndex === idx
                          ? 'bg-purple-500/15 border-purple-500/40 text-white'
                          : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            tx.status === 'BLOCKED'
                              ? 'bg-rose-400'
                              : tx.status === 'FLAGGED'
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                        <span className="text-slate-200 font-semibold">{tx.merchant}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-300">${tx.amount}</span>
                        <span
                          className={`text-[10px] font-bold ${
                            tx.riskScore > 70 ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          Score: {tx.riskScore}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Card Over Dashboard */}
              <div className="absolute bottom-6 right-3 sm:right-[-12px] w-52 p-4 rounded-xl bg-indigo-600 shadow-2xl shadow-black/60 border border-indigo-400/50 z-20 hidden sm:block">
                <div className="text-[10px] font-bold text-indigo-200 uppercase mb-0.5">Engine Latency</div>
                <div className="text-2xl font-mono font-bold text-white">42ms</div>
                <div className="text-[10px] text-indigo-200 mt-1 uppercase tracking-tight">Optimized by Kafka Edge</div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
