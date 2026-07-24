import { useState, useEffect, useRef } from 'react';
import type { AnalyticsSummary, HeatmapPoint, SimulatorConfig, Transaction, FraudRule } from '@/shared/types/fraud';
import { Header } from '@/features/analyst-dashboard/Header';
import { MetricCards } from '@/features/analyst-dashboard/MetricCards';
import { LiveFeedTicker } from '@/features/analyst-dashboard/LiveFeedTicker';
import { TransactionTable } from '@/features/analyst-dashboard/TransactionTable';
import { FraudDetailsDrawer } from '@/features/analyst-dashboard/FraudDetailsDrawer';
import { GeoHeatmap } from '@/features/analyst-dashboard/GeoHeatmap';
import { AnalyticsCharts } from '@/features/analyst-dashboard/AnalyticsCharts';
import { RuleEngineManager } from '@/features/analyst-dashboard/RuleEngineManager';
import { RiskDistributionBar } from '@/features/analyst-dashboard/RiskDistributionBar';
import { FraudNetworkGraph } from '@/features/network-dashboard/FraudNetworkGraph';

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
      const [txRes, analyticsRes, rulesRes] = await Promise.all([
        fetch('/api/transactions?limit=100'),
        fetch('/api/analytics'),
        fetch('/api/rules'),
      ]);

      if (txRes.ok) {
        const txJson = await txRes.json();
        setTransactions(txJson);
      }
      if (analyticsRes.ok) {
        const analyticsJson = await analyticsRes.json();
        setAnalytics(analyticsJson);
      }
      if (rulesRes.ok) {
        const rulesJson = await rulesRes.json();
        setRules(rulesJson);
      }
    } catch (err) {
      console.error('Failed to fetch initial application data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // SSE Real-Time Stream Receiver
  useEffect(() => {
    const eventSource = new EventSource('/api/stream/transactions');

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const newTx: Transaction = JSON.parse(event.data);
        txCounterRef.current += 1;

        setTransactions((prev) => [newTx, ...prev.slice(0, 499)]);

        // Refresh analytics periodically
        if (Math.random() < 0.25) {
          fetch('/api/analytics')
            .then((res) => res.json())
            .then((data) => setAnalytics(data))
            .catch(() => {});
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
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
    try {
      const res = await fetch('/api/simulator/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });

      if (res.ok) {
        const updated = await res.json();
        setSimulatorConfig(updated);
      }
    } catch (err) {
      console.error('Failed to update simulator:', err);
    }
  };

  // Update Fraud Rule
  const handleUpdateRule = async (rule: FraudRule) => {
    try {
      const res = await fetch(`/api/rules/${rule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule),
      });

      if (res.ok) {
        const updated = await res.json();
        setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      }
    } catch (err) {
      console.error('Failed to update rule:', err);
    }
  };

  // Trigger Gemini AI Fraud Explanation
  const handleGenerateAIExplanation = async (tx: Transaction) => {
    try {
      const res = await fetch('/api/fraud/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: tx.id }),
      });

      if (res.ok) {
        const aiResult = await res.json();
        const updatedTx = { ...tx, aiExplanation: aiResult };

        setTransactions((prev) =>
          prev.map((t) => (t.id === tx.id ? updatedTx : t))
        );

        if (selectedTransaction?.id === tx.id) {
          setSelectedTransaction(updatedTx);
        }
      }
    } catch (err) {
      console.error('Failed to generate AI explanation:', err);
    }
  };

  // Provide Analyst Feedback (Confirm Fraud / Mark False Positive)
  const handleProvideFeedback = async (
    txId: string,
    status: 'CONFIRMED_FRAUD' | 'FALSE_POSITIVE'
  ) => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: txId, status }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTransactions((prev) =>
          prev.map((t) => (t.id === txId ? updated : t))
        );
        if (selectedTransaction?.id === txId) {
          setSelectedTransaction(updated);
        }
      }
    } catch (err) {
      console.error('Failed to send feedback:', err);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    window.open('/api/export/transactions', '_blank');
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
            <GeoHeatmap
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
