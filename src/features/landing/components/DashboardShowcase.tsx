import React, { useState } from 'react';
import { SAMPLE_TRANSACTIONS } from '../data/mockData';
import { Transaction } from '../types';
import { motion } from 'framer-motion';
import { Share2, Globe, Bot, Download, Search, Activity, BarChart2 } from 'lucide-react';

export const DashboardShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STREAM' | 'VECTOR' | 'GEO' | 'GPT' | 'BATCH'>('STREAM');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'BLOCKED' | 'FLAGGED' | 'APPROVED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction>(SAMPLE_TRANSACTIONS[0]);
  const [exported, setExported] = useState(false);

  // Filter transactions
  const filteredTxList = SAMPLE_TRANSACTIONS.filter((tx) => {
    const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
    const matchesSearch =
      tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.cardholder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <section id="dashboard-showcase" className="py-24 relative bg-[#05070f] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-3 block">
            Command Center Preview
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight mb-4">
            Interactive AI Security Dashboard
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Explore live threat telemetry, vector similarity distance clusters, geo-velocity heatmaps, and instant GPT dispute brief generation.
          </p>
        </div>

        {/* Dashboard Browser Replica */}
        <div className="glass-panel-glow rounded-3xl border border-purple-500/40 overflow-hidden shadow-2xl shadow-purple-950/40">
          {/* Top Browser Bar */}
          <div className="bg-[#090c1b] px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500/80" />
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80" />
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs font-mono text-slate-400 hidden sm:inline">
                https://console.FraudGuard.ai/live-stream/cluster-us-west
              </span>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs font-mono overflow-x-auto">
              <button
                onClick={() => setActiveTab('STREAM')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'STREAM' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Threat Feed</span>
              </button>

              <button
                onClick={() => setActiveTab('VECTOR')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'VECTOR' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Vector Space</span>
              </button>

              <button
                onClick={() => setActiveTab('GEO')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'GEO' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Geo Heatmap</span>
              </button>

              <button
                onClick={() => setActiveTab('GPT')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'GPT' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>GPT Inspector</span>
              </button>

              <button
                onClick={() => setActiveTab('BATCH')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === 'BATCH' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Analytics & Export</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Live Stream & Threat Feed */}
          {activeTab === 'STREAM' && (
            <div className="p-6 bg-[#070914] grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Feed Table */}
              <div className="lg:col-span-7 space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search cardholder, merchant, ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-white/10">
                    {(['ALL', 'BLOCKED', 'FLAGGED', 'APPROVED'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          statusFilter === st
                            ? 'bg-purple-500/30 text-cyan-300 border border-purple-500/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transaction List */}
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {filteredTxList.map((tx) => (
                    <div
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className={`p-3.5 rounded-xl border font-mono text-xs flex items-center justify-between cursor-pointer transition-all ${
                        selectedTx.id === tx.id
                          ? 'bg-purple-950/40 border-cyan-400 text-white shadow-lg shadow-purple-950/30'
                          : 'bg-slate-900/50 border-white/5 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.status === 'BLOCKED'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : tx.status === 'FLAGGED'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {tx.status}
                        </span>
                        <div>
                          <span className="font-semibold text-white block truncate">{tx.merchant}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{tx.cardholder}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-white font-bold block">${tx.amount.toLocaleString()}</span>
                        <span
                          className={`text-[10px] ${
                            tx.riskScore > 75 ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          Score: {tx.riskScore}/100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Detail Inspector Panel */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-slate-400 uppercase text-[10px]">Transaction Detail</span>
                  <span className="text-cyan-400 text-[11px] font-bold">{selectedTx.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Cardholder</span>
                    <span className="text-white font-bold">{selectedTx.cardholder}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Merchant</span>
                    <span className="text-cyan-300 font-bold">{selectedTx.merchant}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">IP Location</span>
                    <span className="text-slate-200">{selectedTx.ipLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Vector Distance</span>
                    <span className="text-purple-300 font-bold">{selectedTx.vectorDistance} (1536-D)</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block mb-1 uppercase">Triggered Rules</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedTx.rulesTriggered.length > 0 ? (
                      selectedTx.rulesTriggered.map((rule, rIdx) => (
                        <span
                          key={rIdx}
                          className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px]"
                        >
                          {rule}
                        </span>
                      ))
                    ) : (
                      <span className="text-emerald-400 text-[11px]">✓ No Hard Rule Violations</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                  <span className="text-purple-300 text-[10px] font-bold uppercase block">
                    GPT Fraud Reasoning
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    "{selectedTx.gptExplanation}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: AI Vector Similarity Space */}
          {activeTab === 'VECTOR' && (
            <div className="p-8 bg-[#070914] text-center font-mono space-y-6">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xl font-heading font-bold text-white mb-2">
                  1536-Dimensional Cosine Vector Distance Space
                </h3>
                <p className="text-xs text-slate-300 mb-6">
                  FraudGuard AI projects raw transactions into geometrical vector clusters. Red nodes represent confirmed fraud centroids, while green nodes indicate verified cardholder habits.
                </p>
              </div>

              {/* Vector Space Interactive Canvas Simulation */}
              <div className="relative h-80 rounded-2xl bg-[#04060e] border border-purple-500/30 overflow-hidden flex items-center justify-center p-6">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />

                {/* Fraud Cluster 1 (Red Orbs) */}
                <div className="absolute top-1/4 left-1/3 w-32 h-32 rounded-full bg-rose-600/20 border border-rose-500/40 flex items-center justify-center animate-pulse">
                  <span className="text-[10px] text-rose-300 font-bold">Botnet Cluster #401</span>
                </div>

                {/* Normal Cluster 2 (Green Orbs) */}
                <div className="absolute bottom-1/4 right-1/3 w-40 h-40 rounded-full bg-emerald-600/15 border border-emerald-500/40 flex items-center justify-center">
                  <span className="text-[10px] text-emerald-300 font-bold">Safe Baseline Cluster</span>
                </div>

                {/* Incoming Transaction Point */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-1/3 left-[36%] w-4 h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80 z-10"
                />

                <div className="absolute bottom-4 left-4 text-left text-[11px] text-slate-400">
                  <span>Cosine Distance: <strong>0.0082</strong> (Threshold &lt; 0.05 = Fraud)</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Geo Velocity Heatmap */}
          {activeTab === 'GEO' && (
            <div className="p-8 bg-[#070914] font-mono text-xs space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <h3 className="text-xl font-heading font-bold text-white mb-2">
                  Physics-Based Geo Velocity Radar
                </h3>
                <p className="text-slate-300 text-xs">
                  Detects impossible card travel by combining IP geolocation, flight physics velocity limits, and residential proxy node database lookups.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-rose-500/30">
                    <span className="text-rose-400 text-[10px] uppercase block">Cardholder Registered Base</span>
                    <span className="text-white font-bold text-sm">San Francisco, CA, USA</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-rose-500/30">
                    <span className="text-rose-400 text-[10px] uppercase block">Incoming IP Geolocation</span>
                    <span className="text-rose-300 font-bold text-sm">Lagos, Nigeria (IP 102.89.23.11)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40">
                    <span className="text-rose-400 text-[10px] uppercase block">Calculated Travel Speed</span>
                    <span className="text-white font-bold text-base">9,420 km/h (Mach 7.6 — Impossible)</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#04060e] border border-cyan-500/30 text-center space-y-3">
                  <Globe className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
                  <span className="text-xs font-bold text-cyan-300 block">
                    Haversine Velocity Trigger Executed
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Transaction blocked at Gateway Layer in 14ms. Cardholder notified via SMS OTP verification.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: GPT Threat Inspector */}
          {activeTab === 'GPT' && (
            <div className="p-8 bg-[#070914] font-mono text-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-cyan-400" />
                    <span>GPT-4o Automated Dispute & Audit Brief</span>
                  </h3>
                  <span className="text-slate-400 text-xs">Generated in 2.5 seconds</span>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{exported ? 'Brief Exported PDF!' : 'Export Compliance Brief'}</span>
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-purple-500/30 text-slate-200 leading-relaxed space-y-4">
                <div>
                  <strong className="text-cyan-300 text-sm block mb-1">EXECUTIVE SUMMARY:</strong>
                  <p className="text-xs text-slate-300">
                    On 2026-07-25 14:50:12 UTC, FraudGuard AI intercepted an authorized card drain attempt ($8,450.00 USD) targeting Nexus Crypto Exchange. The transaction was flagged within 22.4ms based on a 0.021 vector similarity distance to botnet signature cluster #9901.
                  </p>
                </div>

                <div>
                  <strong className="text-purple-300 text-sm block mb-1">EVIDENTIARY FACTORS:</strong>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300 text-xs">
                    <li>Physical distance discrepancy of 10,480 km from last valid tap 4 minutes prior.</li>
                    <li>Device fingerprint matches headless browser environment associated with proxy list #1029.</li>
                    <li>High velocity card testing window: 3 transactions attempted within 82 seconds.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Analytics & Export */}
          {activeTab === 'BATCH' && (
            <div className="p-8 bg-[#070914] font-mono text-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">
                    Batch Ingestion Analytics & Report Exporter
                  </h3>
                  <span className="text-slate-400 text-xs">PRD Benchmark: 10,000 Batch Transactions</span>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>{exported ? 'Downloaded Fraud_Report.csv!' : 'Export CSV Dataset'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <span className="text-slate-400 text-[10px] block">Batch Scan SLA</span>
                  <span className="text-2xl font-bold text-cyan-300">840ms</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <span className="text-slate-400 text-[10px] block">Processed In Batch</span>
                  <span className="text-2xl font-bold text-white">10,000</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <span className="text-slate-400 text-[10px] block">Blocked Fraud</span>
                  <span className="text-2xl font-bold text-rose-400">142</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10">
                  <span className="text-slate-400 text-[10px] block">Prevented Loss</span>
                  <span className="text-2xl font-bold text-emerald-400">$184,200</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
