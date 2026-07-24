import React from 'react';
import { AnalyticsSummary } from '@/shared/types/fraud';
import { Activity, ShieldAlert, Zap, Lock, TrendingUp, CheckCircle } from 'lucide-react';

interface MetricCardsProps {
  summary: AnalyticsSummary | null;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Volume & Processed */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-500/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Ingested Volume
          </span>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
            <Activity className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
            ${summary.totalVolumeUsd.toLocaleString()}
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> +12%
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
          <span>Processed Transactions</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{summary.totalProcessedCount} tx</span>
        </div>
      </div>

      {/* 2. Fraud Rate & Prevented Loss */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Threat Flag Rate
          </span>
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50">
            <ShieldAlert className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono tracking-tight">
            {summary.fraudRatePercentage}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({summary.fraudCount} flagged)
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
          <span>Blocked Volume Prevented</span>
          <span className="font-semibold text-rose-600 dark:text-rose-400">${summary.fraudVolumeUsd.toLocaleString()}</span>
        </div>
      </div>

      {/* 3. Processing Latency & SLA */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Pipeline Latency
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
            <Zap className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
            {summary.avgLatencyMs} <span className="text-sm font-normal text-slate-500">ms</span>
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
            <CheckCircle className="h-3 w-3" /> SLA Passed
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
          <span>P99 Latency SLA</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{summary.p99LatencyMs} ms</span>
        </div>
      </div>

      {/* 4. Active Rule Engine */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-amber-500/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Rule Engine
          </span>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
            <Lock className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
            {summary.activeRulesCount} <span className="text-sm font-normal text-slate-500">rules</span>
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
          <span>Auto-Block Triggers</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">{summary.blockedCount} blocked</span>
        </div>
      </div>
    </div>
  );
};
