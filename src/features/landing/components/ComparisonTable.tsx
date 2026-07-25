import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const MATRIX = [
    { feature: 'Decision SLA Latency', traditional: '350ms - 1200ms', mlLegacy: '150ms - 400ms', FraudGuard: '< 100ms Guaranteed', highlight: true },
    { feature: 'Zero-Day Fraud Vector Matching', traditional: false, mlLegacy: 'Partial (Slow retraining)', FraudGuard: true, highlight: true },
    { feature: '1536-D Vector Cosine Search', traditional: false, mlLegacy: false, FraudGuard: true, highlight: true },
    { feature: 'GPT Natural Language Reasoning', traditional: false, mlLegacy: false, FraudGuard: true, highlight: true },
    { feature: 'False Decline Rate', traditional: '3.8%', mlLegacy: '1.9%', FraudGuard: '< 0.6%', highlight: true },
    { feature: 'Kafka 100k+ TPS Ingestion', traditional: false, mlLegacy: 'Limited', FraudGuard: true },
    { feature: 'Offline Mock / CI Sandbox Mode', traditional: false, mlLegacy: false, FraudGuard: true },
    { feature: 'Real-Time Vector Feedback Loop', traditional: false, mlLegacy: 'Batch weekly', FraudGuard: 'Instant (< 5s)' }
  ];

  return (
    <section className="py-24 relative bg-[#05070f] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3 block">
            Competitive Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight mb-4">
            Generational Comparison
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            See how FraudGuard AI compares against legacy rule systems and 1st-generation ML tools.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="glass-panel-glow rounded-3xl border border-purple-500/30 overflow-x-auto shadow-2xl">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-[#0a0d20] text-slate-300 border-b border-white/10">
                <th className="p-5 font-bold uppercase text-[11px] text-slate-400">Capability</th>
                <th className="p-5 font-bold uppercase text-[11px] text-slate-400">Traditional Rules</th>
                <th className="p-5 font-bold uppercase text-[11px] text-slate-400">Legacy ML</th>
                <th className="p-5 font-bold uppercase text-xs text-cyan-300 bg-purple-900/30 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>FraudGuard AI</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {MATRIX.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-semibold text-white">{row.feature}</td>

                  {/* Traditional */}
                  <td className="p-5">
                    {typeof row.traditional === 'boolean' ? (
                      row.traditional ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-500" />
                    ) : (
                      row.traditional
                    )}
                  </td>

                  {/* ML Legacy */}
                  <td className="p-5">
                    {typeof row.mlLegacy === 'boolean' ? (
                      row.mlLegacy ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-500" />
                    ) : (
                      row.mlLegacy
                    )}
                  </td>

                  {/* FraudGuard AI */}
                  <td className="p-5 font-bold text-cyan-300 bg-purple-950/20">
                    {typeof row.FraudGuard === 'boolean' ? (
                      row.FraudGuard ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Check className="w-4 h-4 text-cyan-400" />
                          <span>Supported</span>
                        </span>
                      ) : (
                        <X className="w-4 h-4 text-rose-500" />
                      )
                    ) : (
                      row.FraudGuard
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
