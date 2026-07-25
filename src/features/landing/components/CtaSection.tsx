import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface CtaSectionProps {
  onOpenDemoModal: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onOpenDemoModal }) => {
  return (
    <section className="py-28 relative overflow-hidden bg-[#05070f]">
      {/* Background Animated Gradient Ring */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-cyan-900/30 opacity-70" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[180px] pointer-events-none animate-pulse-glow" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-12 sm:p-16 rounded-3xl glass-panel-glow border border-purple-500/50 shadow-2xl relative overflow-hidden"
        >
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs mb-6">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>ENTERPRISE TRIAL // 14-DAY SUB-100MS SANDBOX</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight mb-6 leading-tight">
            Ready to Stop Fraud <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
              Before It Happens?
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Deploy FraudGuard AI alongside your payment gateway in under 15 minutes. Sign up today to experience sub-100ms vector decisioning and zero false decline friction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/register"
              className="w-full sm:w-auto relative group overflow-hidden rounded-xl p-[1px] font-bold text-sm shadow-2xl shadow-purple-500/30"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-xl animate-pulse-glow" />
              <span className="relative flex items-center justify-center gap-2 px-8 py-4 rounded-[11px] bg-[#090d1f] group-hover:bg-opacity-80 transition duration-300 text-white">
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            <button
              onClick={onOpenDemoModal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>Request Enterprise Demo</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
