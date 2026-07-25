import React from 'react';
import { METRICS_PRD } from '../data/mockData';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export const PerformanceMetrics: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="metrics" ref={ref} className="py-24 relative bg-[#05070f] border-t border-white/5 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3 block">
            Verified Benchmarks
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight mb-4">
            PRD Performance SLAs & Business Impact
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Hard SLA targets verified across millions of concurrent enterprise transaction events.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {METRICS_PRD.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-3xl glass-panel-glow border border-purple-500/30 relative group hover:border-cyan-400/50 transition-all shadow-xl"
            >
              <div className="flex items-baseline gap-1 mb-2">
                {metric.prefix && (
                  <span className="text-3xl sm:text-4xl font-heading font-bold text-slate-400">
                    {metric.prefix}
                  </span>
                )}
                <span className={`text-4xl sm:text-5xl font-heading font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${metric.highlightColor}`}>
                  {isInView ? metric.value.toLocaleString() : 0}
                </span>
                <span className="text-xl sm:text-2xl font-heading font-bold text-slate-300 ml-1">
                  {metric.suffix}
                </span>
              </div>

              <h3 className="text-lg font-heading font-bold text-white mb-2">
                {metric.label}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {metric.description}
              </p>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-purple-300">
                <span>{metric.prdBenchmark}</span>
                <span className="text-emerald-400">✓ Verified</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
