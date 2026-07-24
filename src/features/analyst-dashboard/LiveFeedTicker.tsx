import React from 'react';
import { Transaction } from '@/shared/types/fraud';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ShieldCheck, ShieldAlert, MapPin, ArrowRight } from 'lucide-react';

interface LiveFeedProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
}

export const LiveFeedTicker: React.FC<LiveFeedProps> = ({ transactions, onSelectTransaction }) => {
  const latestFive = transactions.slice(0, 6);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
            Real-Time Ingestion Stream
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Showing last 6 streaming records
        </span>
      </div>

      <div className="space-y-2.5">
        <AnimatePresence initial={false}>
          {latestFive.map((tx) => {
            const isHighRisk = tx.riskScore >= 60;
            const isMediumRisk = tx.riskScore >= 35;

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={() => onSelectTransaction(tx)}
                className={`group p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  tx.status === 'BLOCKED'
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 hover:border-rose-400'
                    : tx.status === 'FLAGGED'
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 hover:border-amber-400'
                    : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500'
                }`}
              >
                {/* Left: Status & Identity */}
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.status === 'BLOCKED'
                        ? 'bg-rose-500 text-white'
                        : tx.status === 'FLAGGED'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {tx.status === 'BLOCKED' ? (
                      <ShieldAlert className="h-4 w-4" />
                    ) : tx.status === 'FLAGGED' ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                        {tx.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        ${tx.amount.toLocaleString()} {tx.currency}
                      </span>
                      {tx.isInternational && (
                        <span className="px-1.5 py-0.2 text-[10px] font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded">
                          INTL
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{tx.merchant}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {tx.location.city}, {tx.location.country}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Risk Score & Triggered Rules */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/50 dark:border-slate-800">
                  {/* Triggered Rule Pill */}
                  {tx.triggeredRules.length > 0 && (
                    <div className="hidden lg:flex items-center gap-1.5">
                      <span className="px-2 py-0.5 text-[11px] font-medium bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded-md border border-rose-200 dark:border-rose-900">
                        {tx.triggeredRules[0]}
                      </span>
                      {tx.triggeredRules.length > 1 && (
                        <span className="text-[10px] font-bold text-rose-500">
                          +{tx.triggeredRules.length - 1}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Risk Score Meter */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Risk Score</div>
                      <div
                        className={`text-xs font-bold font-mono ${
                          isHighRisk
                            ? 'text-rose-600 dark:text-rose-400'
                            : isMediumRisk
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {tx.riskScore}/100
                      </div>
                    </div>

                    <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isHighRisk ? 'bg-rose-500' : isMediumRisk ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${tx.riskScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
