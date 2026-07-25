import React from 'react';
import { Shield, Download, Play, Pause, Moon, Sun, LogOut } from 'lucide-react';
import { SimulatorConfig } from '@/shared/types/fraud';
import { useAuthStore } from '@/features/auth/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';

interface HeaderProps {
  isConnected: boolean;
  tps: number;
  simulatorConfig: SimulatorConfig;
  onUpdateSimulator: (config: Partial<SimulatorConfig>) => void;
  onExportCsv: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: 'DASHBOARD' | 'TRANSACTIONS' | 'GEO_MAP' | 'RULES' | 'ANALYTICS' | 'NETWORK';
  onSelectTab: (tab: 'DASHBOARD' | 'TRANSACTIONS' | 'GEO_MAP' | 'RULES' | 'ANALYTICS' | 'NETWORK') => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  tps,
  simulatorConfig,
  onUpdateSimulator,
  onExportCsv,
  isDarkMode,
  onToggleDarkMode,
  activeTab,
  onSelectTab,
}) => {
  const { accessToken, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch {
      // Ignore logout API errors — clear local state regardless
    } finally {
      logout()
      navigate('/login')
    }
  }
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Connection Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                  FRAUDGUARD<span className="text-indigo-600 dark:text-indigo-400 font-extrabold"></span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/80 rounded-md">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-Time Fraud Engine & Threat Intelligence</p>
            </div>
          </div>

          {/* SSE Connection Pulse */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  isConnected ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
            </span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {isConnected ? 'Stream Active' : 'Connecting...'}
            </span>
            <span className="text-slate-400 dark:text-slate-500">|</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{tps} TPS</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50 text-xs font-medium">
          <button
            onClick={() => onSelectTab('DASHBOARD')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'DASHBOARD'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('TRANSACTIONS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'TRANSACTIONS'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Live Stream
          </button>
          <button
            onClick={() => onSelectTab('GEO_MAP')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'GEO_MAP'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Geo Threat Map
          </button>
          <button
            onClick={() => onSelectTab('ANALYTICS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'ANALYTICS'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => onSelectTab('RULES')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'RULES'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Rule Engine
          </button>
          <button
            onClick={() => onSelectTab('NETWORK')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'NETWORK'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Network
          </button>
        </nav>

        {/* Simulator Bar & Actions */}
        <div className="flex items-center gap-2">
          {/* Stream Generator Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => onUpdateSimulator({ isRunning: !simulatorConfig.isRunning })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                simulatorConfig.isRunning
                  ? 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600'
                  : 'bg-amber-500 text-white shadow-sm hover:bg-amber-600'
              }`}
              title={simulatorConfig.isRunning ? 'Pause Traffic Stream' : 'Resume Traffic Stream'}
            >
              {simulatorConfig.isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{simulatorConfig.isRunning ? 'Streaming' : 'Paused'}</span>
            </button>

            {/* Attack Wave Generator Button */}
            <select
              value={simulatorConfig.attackType}
              onChange={(e) =>
                onUpdateSimulator({
                  attackType: e.target.value as SimulatorConfig['attackType'],
                  isRunning: true,
                })
              }
              className="text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="NORMAL">Normal Traffic Mode</option>
              <option value="GEO_VELOCITY_ATTACK">⚠️ Geo-Speed Attack Wave</option>
              <option value="HIGH_VALUE_BURST">🔥 High-Value Crypto Burst</option>
              <option value="MIXED_ATTACK">🚨 Organized Crime Attack Scenario</option>
            </select>
          </div>

          {/* Export CSV */}
          <button
            onClick={onExportCsv}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors"
            title="Export Fraud Transactions CSV"
          >
            <Download className="h-4 w-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
