import React, { useState } from 'react';
import { Transaction } from '@/shared/types/fraud';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ShieldAlert, ShieldCheck, MapPin, Navigation, Cpu, CheckCircle2, AlertTriangle, Lock, RefreshCw, UserCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DrawerProps {
  transaction: Transaction | null;
  onClose: () => void;
  onGenerateAIExplanation: (tx: Transaction) => Promise<void>;
  onProvideFeedback: (txId: string, status: 'CONFIRMED_FRAUD' | 'FALSE_POSITIVE') => void;
}

export const FraudDetailsDrawer: React.FC<DrawerProps> = ({
  transaction,
  onClose,
  onGenerateAIExplanation,
  onProvideFeedback,
}) => {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  if (!transaction) return null;

  const isHighRisk = transaction.riskScore >= 60;
  const isMediumRisk = transaction.riskScore >= 35;

  const handleTriggerAI = async () => {
    setIsGeneratingAI(true);
    await onGenerateAIExplanation(transaction);
    setIsGeneratingAI(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm">
          {/* Backdrop click */}
          <div className="fixed inset-0" onClick={onClose}></div>

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative z-10 w-full max-w-2xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-2xl ${
                    transaction.status === 'BLOCKED'
                      ? 'bg-rose-500 text-white'
                      : transaction.status === 'FLAGGED'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {transaction.status === 'BLOCKED' ? (
                    <ShieldAlert className="h-6 w-6" />
                  ) : (
                    <ShieldCheck className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                      {transaction.id}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        transaction.status === 'BLOCKED'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : transaction.status === 'FLAGGED'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Ingested at {new Date(transaction.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Risk Meter Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    Calculated Risk Score
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span
                      className={`text-3xl font-extrabold font-mono ${
                        isHighRisk
                          ? 'text-rose-600 dark:text-rose-400'
                          : isMediumRisk
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {transaction.riskScore}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ 100</span>
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 ml-2">
                      {transaction.riskLevel} SEVERITY
                    </span>
                  </div>
                </div>

                <div className="w-36">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        isHighRisk ? 'bg-rose-500' : isMediumRisk ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${transaction.riskScore}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-right text-slate-400 mt-1 font-mono">
                    Latency: {transaction.latencyMs}ms
                  </div>
                </div>
              </div>

              {/* Financial & Merchant Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Amount</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                    ${transaction.amount.toLocaleString()} {transaction.currency}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Merchant</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
                    {transaction.merchant}
                  </div>
                  <div className="text-[10px] text-slate-400">{transaction.merchantCategory}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Account & Card</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    •••• {transaction.cardLast4}
                  </div>
                  <div className="text-[10px] text-slate-400">{transaction.cardType}</div>
                </div>
              </div>

              {/* Geo-Velocity Route Breakdown */}
              <div className="p-4 rounded-2xl border border-indigo-100 dark:border-indigo-950/80 bg-indigo-50/40 dark:bg-indigo-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <Navigation className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Geographic Location & Velocity Analysis
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Current Location</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                      {transaction.location.city}, {transaction.location.country}
                    </div>
                  </div>

                  {transaction.previousLocation && (
                    <>
                      <div className="text-center px-2">
                        <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                          {transaction.distanceKmFromLastTx} km jump
                        </div>
                        <div className="text-[10px] text-slate-400">in {transaction.timeDiffSecondsFromLastTx}s</div>
                        {transaction.speedKmh && (
                          <div className="mt-0.5 text-[11px] font-extrabold text-rose-500 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded font-mono">
                            ⚡ {transaction.speedKmh} km/h
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-400">Previous Location</div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {transaction.previousLocation.city}, {transaction.previousLocation.country}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Device & Network Security Footprint */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Cpu className="h-4 w-4 text-slate-500" />
                  Network & Device Footprint
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <div>IP Address: <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{transaction.ipAddress}</span></div>
                  <div>Device Hash: <span className="font-mono text-slate-900 dark:text-slate-100">{transaction.deviceFingerprint}</span></div>
                  <div>Card-Not-Present: <span className="font-bold">{transaction.isCardNotPresent ? 'YES (E-Commerce)' : 'NO (POS)'}</span></div>
                  <div>International: <span className="font-bold">{transaction.isInternational ? 'YES' : 'NO'}</span></div>
                </div>
              </div>

              {/* Triggered Rules List */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-2">
                  Evaluated Threat Rules ({transaction.triggeredRules.length})
                </h3>
                {transaction.triggeredRules.length === 0 ? (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>All enterprise rule assertions passed with zero violations.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {transaction.triggeredRules.map((ruleName, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                          <span className="font-bold text-rose-900 dark:text-rose-200">{ruleName}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                          Triggered
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Gemini AI Analyst Explanation Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/90 via-slate-900 to-indigo-950 text-white border border-indigo-700/50 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-600/60 text-indigo-300">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold tracking-tight">Gemini AI Threat Analyst</h3>
                      <p className="text-[11px] text-indigo-200/80">
                        Powered by gemini-3.6-flash Intelligence Engine
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleTriggerAI}
                    disabled={isGeneratingAI}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                    <span>{transaction.aiExplanation ? 'Re-Analyze' : 'Generate AI Report'}</span>
                  </button>
                </div>

                {isGeneratingAI ? (
                  <Skeleton className="h-24 w-full rounded-xl" />
                ) : transaction.aiExplanation ? (
                  <div className="space-y-4 text-xs">
                    {/* Executive Summary */}
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                      <div className="text-[10px] font-bold uppercase text-indigo-300 mb-1">Executive Summary</div>
                      <p className="text-slate-200 leading-relaxed font-sans">{transaction.aiExplanation.summary}</p>
                    </div>

                    {/* Root Cause */}
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                      <div className="text-[10px] font-bold uppercase text-indigo-300 mb-1">Primary Anomaly Root Cause</div>
                      <p className="text-slate-200 leading-relaxed">{transaction.aiExplanation.rootCause}</p>
                    </div>

                    {/* Risk Reasoning Bullets */}
                    <div>
                      <div className="text-[10px] font-bold uppercase text-indigo-300 mb-2">Threat Vector Factors</div>
                      <ul className="space-y-1.5 text-slate-300">
                        {transaction.aiExplanation.riskReasoning.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Ahnlich Vector Similarity Match */}
                    {transaction.aiExplanation.vectorMatches && transaction.aiExplanation.vectorMatches.length > 0 && (
                      <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-800/80">
                        <div className="text-[10px] font-bold text-indigo-300 uppercase mb-2">
                          Ahnlich Vector Pattern Match
                        </div>
                        {transaction.aiExplanation.vectorMatches.map((v, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-200">{v.patternName}</span>
                            <span className="font-mono font-bold text-indigo-400 bg-indigo-900/90 px-2 py-0.5 rounded">
                              {Math.round(v.similarityScore * 100)}% Match
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Recommendation */}
                    <div className="flex items-center justify-between pt-2 border-t border-indigo-800/60">
                      <span className="text-slate-300 font-semibold">Recommended Response:</span>
                      <span className="px-3 py-1 rounded-lg bg-rose-600 text-white font-extrabold uppercase text-xs tracking-wider shadow">
                        {transaction.aiExplanation.recommendedAction}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-indigo-200 text-xs">
                    Click <span className="font-bold underline">Generate AI Report</span> to synthesize an immediate deep threat explanation powered by Gemini 3.6 Flash.
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Feedback Status: <span className="font-bold text-slate-800 dark:text-slate-200">{transaction.feedbackStatus || 'PENDING'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onProvideFeedback(transaction.id, 'FALSE_POSITIVE');
                    onClose();
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <UserCheck className="h-4 w-4 text-emerald-500" />
                  <span>False Positive</span>
                </button>

                <button
                  onClick={() => {
                    onProvideFeedback(transaction.id, 'CONFIRMED_FRAUD');
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Lock className="h-4 w-4" />
                  <span>Confirm Fraud & Block</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
    </AnimatePresence>
  );
};
