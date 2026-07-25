import React, { useState } from 'react';
import { XCircle, CheckCircle2, AlertOctagon, Sparkles, Sliders, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const TraditionalVsAI: React.FC = () => {
  const [monthlyVolume, setMonthlyVolume] = useState<number>(500000); // 500k txns/mo
  const [avgTicket, setAvgTicket] = useState<number>(120); // $120 avg ticket

  // Fraud calculations
  const traditionalFraudRate = 0.012; // 1.2% fraud attempts
  const traditionalFalsePositiveRate = 0.038; // 3.8% false decline rate
  const aiFraudCatchRate = 0.985; // 98.5% catch rate
  const aiFalseDeclineRate = 0.006; // 0.6% false decline rate

  const lostToFraudTraditional = monthlyVolume * traditionalFraudRate * avgTicket * 0.45; // 45% missed fraud
  const lostToFalseDeclinesTraditional = monthlyVolume * traditionalFalsePositiveRate * avgTicket;

  const lostToFraudAI = monthlyVolume * traditionalFraudRate * avgTicket * (1 - aiFraudCatchRate);
  const lostToFalseDeclinesAI = monthlyVolume * aiFalseDeclineRate * avgTicket;

  const totalSavedMonthly = (lostToFraudTraditional + lostToFalseDeclinesTraditional) - (lostToFraudAI + lostToFalseDeclinesAI);
  const totalSavedYearly = totalSavedMonthly * 12;

  return (
    <section id="why-us" className="py-24 relative overflow-hidden bg-[#05070f]">
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3 block">
            Paradigm Shift
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight mb-4">
            Why Traditional Fraud Rules Fail Modern Enterprise
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Legacy rule engines suffer from rigidity, high false decline rates, and zero semantic awareness. FraudGuard AI introduces hybrid vector neural matching.
          </p>
        </div>

        {/* Side by Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Traditional Fraud Detection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-3xl bg-slate-950/80 border border-rose-500/20 relative group hover:border-rose-500/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-white">Legacy Rule Engines</h3>
                <span className="text-xs font-mono text-rose-400">Static IF/ELSE Logic</span>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Static Hardcoded Thresholds</strong>
                  <span>Breached by simple micro-amount variations and proxy rotation scripts.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">High False Negative Rate (up to 38%)</strong>
                  <span>Misses complex multi-card syndicate testing and account takeover patterns.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Zero Semantic Context</strong>
                  <span>Cannot interpret device behavior, natural language, or merchant similarity.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Manual Analyst Bottlenecks</strong>
                  <span>Requires hours of human review for flagged edge cases, slowing customer checkout.</span>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* AI Powered FraudGuard AI */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-3xl glass-panel-glow border border-purple-500/40 relative group hover:border-purple-500/60 transition-colors shadow-2xl shadow-purple-950/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-cyan-300">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                  <span>FraudGuard AI</span>
                  <span className="text-[10px] font-mono bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 rounded-full">
                    Hybrid Intelligence
                  </span>
                </h3>
                <span className="text-xs font-mono text-purple-300">1536-D Vector Similarity + GPT</span>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Sub-100ms Vector Similarity Search</strong>
                  <span>Translates payloads into high-dimensional embeddings matched against known threat clusters.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Real-Time Behavior Analysis</strong>
                  <span>Calculates rolling spending Z-scores and physics-based haversine geo-velocity.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">GPT Natural Language Explanations</strong>
                  <span>Generates instant human-readable audit summaries and chargeback dispute briefs.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">99.4% Precision & Zero Delay</strong>
                  <span>Dramatically cuts false declines while blocking zero-day fraud before payment auth.</span>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Interactive Fraud Cost Calculator */}
        <div className="p-8 rounded-3xl glass-panel border border-white/10 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-heading font-bold text-white">
              Interactive ROI & False Decline Reduction Calculator
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Slider 1: Monthly Txns */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-slate-300">Monthly Transaction Volume</span>
                <span className="text-cyan-300 font-bold">{monthlyVolume.toLocaleString()} txns/mo</span>
              </div>
              <input
                type="range"
                min={50000}
                max={5000000}
                step={50000}
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            {/* Slider 2: Average Order Value */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-slate-300">Average Order Value (AOV)</span>
                <span className="text-purple-300 font-bold">${avgTicket} USD</span>
              </div>
              <input
                type="range"
                min={20}
                max={1000}
                step={10}
                value={avgTicket}
                onChange={(e) => setAvgTicket(Number(e.target.value))}
                className="w-full accent-purple-400 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase block mb-1">
                Estimated Annual Saved Revenue
              </span>
              <div className="text-3xl sm:text-4xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-purple-300">
                ${Math.round(totalSavedYearly).toLocaleString()} / year
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                Calculated from 85% reduced chargebacks + 82% saved false decline revenue.
              </span>
            </div>

            <a
              href="#dashboard-showcase"
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shrink-0 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <span>Test Live Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
