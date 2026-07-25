import React, { useState } from 'react';
import { Bot, Cpu, Sparkles } from 'lucide-react';

export const AiIntelligence: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<'CRYPTO' | 'GIFT' | 'NORMAL'>('CRYPTO');

  const PRESETS = {
    CRYPTO: {
      merchant: 'CoinVault Global',
      amount: '$12,500.00 USD',
      location: 'Lagos, Nigeria (Registered: Boston, MA)',
      time: '03:14 AM (Off-hours)',
      device: 'Tor Exit Node / Linux Firefox',
      score: 99,
      vectorDistance: 0.009,
      gptReasoning: 'Critical Threat: Transaction attempts high-value cryptocurrency withdrawal from a Tor Exit Node IP in Lagos, 12 minutes after card was used in Boston. Vector distance of 0.009 matches known stolen card syndicate cluster.'
    },
    GIFT: {
      merchant: 'Instant e-Gift Card Hub',
      amount: '$4,999.00 USD',
      location: 'Sao Paulo, Brazil (Registered: Chicago, IL)',
      time: '14:22 PM',
      device: 'Headless Chrome / Proxy',
      score: 94,
      vectorDistance: 0.032,
      gptReasoning: 'High Risk: Immediate liquidation into untraceable digital gift cards via foreign proxy server. Cardholder has zero prior gift card purchases in 24-month history.'
    },
    NORMAL: {
      merchant: 'Whole Foods Market',
      amount: '$84.20 USD',
      location: 'Chicago, IL (Registered: Chicago, IL)',
      time: '18:10 PM',
      device: 'Apple Pay / iPhone 15 Pro',
      score: 2,
      vectorDistance: 0.912,
      gptReasoning: 'Safe: Matches regular grocery shopping baseline and registered device biometric token signature. Vector distance is 0.912, far from fraud centroids.'
    }
  };

  const currentData = PRESETS[selectedPreset];

  const handleRunAnalysis = () => {
    setSelectedPreset(selectedPreset);
  };

  return (
    <section className="py-24 relative bg-[#04060d] border-t border-white/5 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400 mb-3 block">
            Generative Fraud Analyst
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight mb-4">
            GPT-4o & Semantic Similarity Engine
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Translating complex vector math and high-velocity network signals into audit-ready natural language summaries.
          </p>
        </div>

        {/* AI Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
            <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-cyan-300 w-fit">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">Semantic Similarity</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Maps un-structured transaction attributes into 1536-D vector space, catching novel zero-day fraud variants before hard rules are updated.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
            <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 w-fit">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">Natural Language Audit Briefs</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generates instant compliance summaries and automated chargeback dispute documentation for bank partners.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
            <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 w-fit">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">Behavioral Z-Score Profiling</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Continuously learns individual cardholder spending baselines across rolling 90-day time horizons.
            </p>
          </div>
        </div>

        {/* Interactive AI Transaction Analyzer Playground */}
        <div className="p-8 rounded-3xl glass-panel-glow border border-purple-500/40 max-w-4xl mx-auto shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400">Interactive Playground</span>
              <h3 className="text-xl font-heading font-bold text-white">
                Test the GPT Fraud Intelligence Engine
              </h3>
            </div>

            {/* Presets Selector */}
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs font-mono">
              <button
                onClick={() => {
                  setSelectedPreset('CRYPTO');
                  handleRunAnalysis();
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedPreset === 'CRYPTO' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Crypto Drain
              </button>

              <button
                onClick={() => {
                  setSelectedPreset('GIFT');
                  handleRunAnalysis();
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedPreset === 'GIFT' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Gift Card Sweep
              </button>

              <button
                onClick={() => {
                  setSelectedPreset('NORMAL');
                  handleRunAnalysis();
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  selectedPreset === 'NORMAL' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Normal Grocery
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs mb-6">
            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2">
              <span className="text-slate-400 text-[10px] uppercase block">Input Payload</span>
              <div className="space-y-1 text-slate-200">
                <div><span className="text-slate-500">Merchant:</span> {currentData.merchant}</div>
                <div><span className="text-slate-500">Amount:</span> {currentData.amount}</div>
                <div><span className="text-slate-500">Location:</span> {currentData.location}</div>
                <div><span className="text-slate-500">Device:</span> {currentData.device}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2">
              <span className="text-slate-400 text-[10px] uppercase block">Engine Outputs</span>
              <div className="space-y-1">
                <div><span className="text-slate-500">Risk Score:</span> <span className="text-white font-bold">{currentData.score}/100</span></div>
                <div><span className="text-slate-500">Vector Distance:</span> <span className="text-purple-300 font-bold">{currentData.vectorDistance}</span></div>
                <div><span className="text-slate-500">SLA decision:</span> <span className="text-cyan-400 font-bold">18.2 ms</span></div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#060813] border border-purple-500/30 font-mono text-xs">
            <div className="flex items-center gap-2 mb-2 text-purple-300 text-[11px] font-bold">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Synthesized GPT Fraud Explanation:</span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">
              "{currentData.gptReasoning}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
