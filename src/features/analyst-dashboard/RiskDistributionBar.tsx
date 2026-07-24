import React from 'react';
import { Transaction } from '@/shared/types/fraud';

interface RiskDistributionBarProps {
  transactions: Transaction[];
}

export const RiskDistributionBar: React.FC<RiskDistributionBarProps> = ({ transactions }) => {
  const total = transactions.length;
  if (total === 0) return null;

  const counts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  transactions.forEach((tx) => {
    if (tx.riskLevel in counts) {
      counts[tx.riskLevel]++;
    }
  });

  const lowPct = (counts.LOW / total) * 100;
  const medPct = (counts.MEDIUM / total) * 100;
  const highPct = (counts.HIGH / total) * 100;
  const critPct = (counts.CRITICAL / total) * 100;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
          Risk Distribution
        </h3>
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> LOW {counts.LOW}</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> MED {counts.MEDIUM}</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> HIGH {counts.HIGH}</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> CRIT {counts.CRITICAL}</span>
        </div>
      </div>

      <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${lowPct}%` }} />
        <div className="bg-amber-500 transition-all duration-500" style={{ width: `${medPct}%` }} />
        <div className="bg-orange-500 transition-all duration-500" style={{ width: `${highPct}%` }} />
        <div className="bg-rose-500 transition-all duration-500" style={{ width: `${critPct}%` }} />
      </div>
    </div>
  );
};
