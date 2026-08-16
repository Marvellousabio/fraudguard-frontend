import { useState, useEffect, useRef } from 'react';
import type { AnalyticsSummary, HeatmapPoint, SimulatorConfig, Transaction, FraudRule, AIExplanationResult } from '@/shared/types/fraud';
// import { apiFetch, apiEventSource } from '@/lib/api';
import { Header } from '@/features/analyst-dashboard/Header';
import { MetricCards } from '@/features/analyst-dashboard/MetricCards';
import { LiveFeedTicker } from '@/features/analyst-dashboard/LiveFeedTicker';
import { TransactionTable } from '@/features/analyst-dashboard/TransactionTable';
import { FraudDetailsDrawer } from '@/features/analyst-dashboard/FraudDetailsDrawer';
import { GeoHeatmap } from '@/features/analyst-dashboard/GeoHeatmap';
import { LeafletHeatmap } from '@/features/analyst-dashboard/LeafletHeatmap';
import { AnalyticsCharts } from '@/features/analyst-dashboard/AnalyticsCharts';
import { RuleEngineManager } from '@/features/analyst-dashboard/RuleEngineManager';
import { RiskDistributionBar } from '@/features/analyst-dashboard/RiskDistributionBar';
import { FraudNetworkGraph } from '@/features/network-dashboard/FraudNetworkGraph';
// import { BackendUnavailableBanner } from '@/features/analyst-dashboard/BackendUnavailableBanner';

const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    amount: 2500,
    currency: 'USD',
    accountId: 'ACC-1001',
    accountName: 'John Doe',
    cardLast4: '4242',
    merchant: 'Electronics Store',
    merchantCategory: 'RETAIL',
    location: { lat: 40.7128, lng: -74.006, city: 'New York', country: 'US' },
    previousLocation: { lat: 40.7306, lng: -73.9352, city: 'New York', country: 'US' },
    distanceKmFromLastTx: 12.5,
    timeDiffSecondsFromLastTx: 3600,
    speedKmh: 12.5,
    deviceFingerprint: 'fp-abc123',
    ipAddress: '192.168.1.1',
    cardType: 'VISA',
    isInternational: false,
    isCardNotPresent: true,
    status: 'FLAGGED',
    riskScore: 0.87,
    riskLevel: 'HIGH',
    triggeredRules: ['GEO_VELOCITY'],
    aiExplanation: {
      summary: 'High geo-velocity detected between New York and Boston.',
      rootCause: 'Transaction occurred in a different city within 1 hour.',
      riskReasoning: ['Speed exceeds 500 km/h threshold', 'Distance exceeds 100 km threshold'],
      recommendedAction: 'MANUAL_REVIEW',
      confidenceScore: 0.92,
      vectorMatches: [],
      generationTimeMs: 120,
      modelUsed: 'fraud-v1',
    } as AIExplanationResult,
    latencyMs: 45,
    feedbackStatus: 'PENDING',
    preTransactionScore: { score: 0.85, modelVersion: 'v1' },
  },
  {
    id: 'tx-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    amount: 12000,
    currency: 'USD',
    accountId: 'ACC-1002',
    accountName: 'Jane Smith',
    cardLast4: '5555',
    merchant: 'Crypto Exchange',
    merchantCategory: 'FINANCIAL',
    location: { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' },
    deviceFingerprint: 'fp-xyz789',
    ipAddress: '10.0.0.1',
    cardType: 'MASTERCARD',
    isInternational: true,
    isCardNotPresent: true,
    status: 'BLOCKED',
    riskScore: 0.95,
    riskLevel: 'CRITICAL',
    triggeredRules: ['HIGH_VALUE', 'INTELLIGENT_ANOMALY'],
    latencyMs: 32,
    feedbackStatus: 'CONFIRMED_FRAUD',
    blockedReason: 'Amount exceeds high-value threshold',
  },
];

const DUMMY_ANALYTICS: { summary: AnalyticsSummary; heatmapPoints: HeatmapPoint[] } = {
  summary: {
    totalProcessedCount: 15420,
    totalVolumeUsd: 2450000,
    fraudCount: 312,
    fraudVolumeUsd: 890000,
    blockedCount: 45,
    fraudRatePercentage: 2.02,
    avgRiskScore: 0.34,
    avgLatencyMs: 28,
    p99LatencyMs: 65,
    activeRulesCount: 12,
    ruleTriggersCount: { GEO_VELOCITY: 120, HIGH_VALUE: 80, INTELLIGENT_ANOMALY: 112 },
    hourlyTrend: [],
  },
  heatmapPoints: [
    { lat: 40.7128, lng: -74.006, city: 'New York', country: 'US', txCount: 450, fraudCount: 23, maxRiskScore: 0.92 },
    { lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK', txCount: 320, fraudCount: 15, maxRiskScore: 0.88 },
    { lat: 35.6762, lng: 139.6503, city: 'Tokyo', country: 'JP', txCount: 280, fraudCount: 8, maxRiskScore: 0.76 },
  ],
};

const DUMMY_RULES: FraudRule[] = [
  {
    id: 'rule-1',
    code: 'GEO_VELOCITY',
    name: 'Geo Velocity',
    category: 'GEO_VELOCITY',
    severity: 'HIGH',
    enabled: true,
    action: 'FLAG',
    description: 'Detects impossible travel speed',
    parameters: { maxSpeedKmh: 500, maxDistanceKm: 100 },
    triggerCount: 120,
    lastTriggered: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'rule-2',
    code: 'HIGH_VALUE',
    name: 'High Value',
    category: 'HIGH_VALUE',
    severity: 'MEDIUM',
    enabled: true,
    action: 'BLOCK',
    description: 'Blocks high-value transactions',
    parameters: { highValueThresholdUsd: 10000 },
    triggerCount: 80,
    lastTriggered: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];

export default function AnalystDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analytics, setAnalytics] = useState<{ summary: AnalyticsSummary; heatmapPoints: HeatmapPoint[] } | null>(null);
  const [rules, setRules] = useState<FraudRule[]>([]);
  const [simulatorConfig, setSimulatorConfig] = useState<SimulatorConfig>({
    isRunning: true,
    speedMs: 1500,
    fraudRatePercentage: 18,
    attackType: 'NORMAL',
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'TRANSACTIONS' | 'GEO_MAP' | 'RULES' | 'ANALYTICS' | 'NETWORK'>('DASHBOARD');
  const [filteredEntity, setFilteredEntity] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [tps, setTps] = useState<number>(0);
  const [backendUnavailable, setBackendUnavailable] = useState<boolean>(false);

  // TPS Calculation Ref
  const txCounterRef = useRef<number>(0);

  // Toggle dark mode class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initial Data Fetch
  const fetchAllData = async () => {
    try {
      // Mocked backend responses
      setTransactions(DUMMY_TRANSACTIONS);
      setAnalytics(DUMMY_ANALYTICS);
      setRules(DUMMY_RULES);
      setBackendUnavailable(false);
    } catch (err) {
      console.error('Failed to fetch initial application data:', err);
      setBackendUnavailable(true);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // SSE Real-Time Stream Receiver
  useEffect(() => {
    // Mocked SSE - simulate new transactions every 3 seconds
    const interval = setInterval(() => {
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        timestamp: new Date().toISOString(),
        amount: Math.floor(Math.random() * 5000) + 100,
        currency: 'USD',
        accountId: `ACC-${Math.floor(Math.random() * 9000) + 1000}`,
        accountName: 'Mock User',
        cardLast4: `${Math.floor(Math.random() * 9000) + 1000}`,
        merchant: 'Mock Merchant',
        merchantCategory: 'RETAIL',
        location: { lat: 40.7 + Math.random(), lng: -74 + Math.random(), city: 'New York', country: 'US' },
        deviceFingerprint: 'fp-mock',
        ipAddress: '10.0.0.1',
        cardType: 'VISA',
        isInternational: false,
        isCardNotPresent: true,
        status: Math.random() > 0.7 ? 'FLAGGED' : 'APPROVED',
        riskScore: Math.random(),
        riskLevel: Math.random() > 0.7 ? 'HIGH' : 'LOW',
        triggeredRules: Math.random() > 0.7 ? ['GEO_VELOCITY'] : [],
        latencyMs: Math.floor(Math.random() * 100),
        feedbackStatus: 'PENDING',
        preTransactionScore: { score: Math.random(), modelVersion: 'v1' },
      };
      txCounterRef.current += 1;
      setTransactions((prev) => [newTx, ...prev.slice(0, 499)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // TPS Meter Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTps(txCounterRef.current);
      txCounterRef.current = 0;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update Simulator Settings
  const handleUpdateSimulator = async (newConfig: Partial<SimulatorConfig>) => {
    // Mocked - just update local state
    setSimulatorConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Update Fraud Rule
  const handleUpdateRule = async (rule: FraudRule) => {
    // Mocked - just update local state
    setRules((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
  };

  // Trigger Gemini AI Fraud Explanation
  const handleGenerateAIExplanation = async (tx: Transaction) => {
    // Mocked - generate dummy explanation
    const aiResult: AIExplanationResult = {
      summary: 'Mock AI explanation generated.',
      rootCause: 'Mock root cause analysis.',
      riskReasoning: ['Mock reasoning 1', 'Mock reasoning 2'],
      recommendedAction: 'MANUAL_REVIEW',
      confidenceScore: 0.85,
      vectorMatches: [],
      generationTimeMs: 50,
      modelUsed: 'mock-v1',
    };
    const updatedTx = { ...tx, aiExplanation: aiResult };
    setTransactions((prev) => prev.map((t) => (t.id === tx.id ? updatedTx : t)));
    if (selectedTransaction?.id === tx.id) {
      setSelectedTransaction(updatedTx);
    }
  };

  // Provide Analyst Feedback (Confirm Fraud / Mark False Positive)
  const handleProvideFeedback = async (
    txId: string,
    status: 'CONFIRMED_FRAUD' | 'FALSE_POSITIVE'
  ) => {
    // Mocked - just update local state
    const updated = { ...transactions.find((t) => t.id === txId)!, feedbackStatus: status };
    setTransactions((prev) => prev.map((t) => (t.id === txId ? updated : t)));
    if (selectedTransaction?.id === txId) {
      setSelectedTransaction(updated);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    // Mocked export
    alert('CSV export would download here (mock mode)')
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors">
      {/* App Header */}
      <Header
        isConnected={isConnected}
        tps={tps}
        simulatorConfig={simulatorConfig}
        onUpdateSimulator={handleUpdateSimulator}
        onExportCsv={handleExportCsv}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Body Layout */}
      <main className="max-w-[1600px] mx-auto p-4 lg:p-8 space-y-6">
        {backendUnavailable && (
          <BackendUnavailableBanner message="The backend API at the configured base URL is not responding. Displaying limited data." />
        )}
        {/* KPI Metric Cards Always At Top */}
        <RiskDistributionBar transactions={transactions} />
        <MetricCards summary={analytics?.summary || null} />

        {/* Tab View Routing */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* Real-time Ingestion Ticker Stream */}
            <LiveFeedTicker
              transactions={transactions}
              onSelectTransaction={setSelectedTransaction}
            />

            {/* Geographic Threat Heatmap */}
            <GeoHeatmap
              heatmapPoints={analytics?.heatmapPoints || []}
              latestTransactions={transactions}
              />

            {/* Inspection Table */}
            <TransactionTable
              transactions={transactions}
              onSelectTransaction={setSelectedTransaction}
              onQuickAIExplain={handleGenerateAIExplanation}
            />
          </div>
        )}

        {activeTab === 'TRANSACTIONS' && (
          <div className="space-y-6">
            <LiveFeedTicker
              transactions={transactions}
              onSelectTransaction={setSelectedTransaction}
            />
            <TransactionTable
              transactions={transactions}
              onSelectTransaction={setSelectedTransaction}
              onQuickAIExplain={handleGenerateAIExplanation}
            />
          </div>
        )}

        {activeTab === 'GEO_MAP' && (
          <div className="space-y-6">
            <LeafletHeatmap
              heatmapPoints={analytics?.heatmapPoints || []}
              latestTransactions={transactions}
            />
            <TransactionTable
              transactions={transactions.filter((t) => t.status !== 'APPROVED')}
              onSelectTransaction={setSelectedTransaction}
              onQuickAIExplain={handleGenerateAIExplanation}
            />
          </div>
        )}

        {activeTab === 'ANALYTICS' && (
          <div className="space-y-6">
            <AnalyticsCharts
              summary={analytics?.summary || null}
              transactions={transactions}
            />
          </div>
        )}

        {activeTab === 'RULES' && (
          <div className="space-y-6">
            <RuleEngineManager rules={rules} onUpdateRule={handleUpdateRule} />
          </div>
        )}

        {activeTab === 'NETWORK' && (
          <div className="space-y-6">
            <FraudNetworkGraph
              transactions={transactions}
              onSelectNode={(entityId) => setFilteredEntity(entityId === filteredEntity ? null : entityId)}
            />
            {filteredEntity && (
              <TransactionTable
                transactions={transactions.filter((tx) => {
                  if (filteredEntity.startsWith('account:')) return tx.accountId === filteredEntity.replace('account:', '');
                  if (filteredEntity.startsWith('merchant:')) return tx.merchant === filteredEntity.replace('merchant:', '');
                  if (filteredEntity.startsWith('ip:')) return tx.ipAddress === filteredEntity.replace('ip:', '');
                  return false;
                })}
                onSelectTransaction={setSelectedTransaction}
                onQuickAIExplain={handleGenerateAIExplanation}
              />
            )}
          </div>
        )}
      </main>

      {/* Fraud Details Slide-Over Drawer */}
      <FraudDetailsDrawer
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onGenerateAIExplanation={handleGenerateAIExplanation}
        onProvideFeedback={handleProvideFeedback}
      />
    </div>
  );
}
