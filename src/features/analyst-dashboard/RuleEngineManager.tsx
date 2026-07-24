import React, { useState } from 'react';
import { FraudRule } from '@/shared/types/fraud';
import { Lock, Edit3, Save, ToggleLeft, ToggleRight } from 'lucide-react';

interface RuleEngineManagerProps {
  rules: FraudRule[];
  onUpdateRule: (rule: FraudRule) => void;
}

export const RuleEngineManager: React.FC<RuleEngineManagerProps> = ({ rules, onUpdateRule }) => {
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FraudRule>>({});

  const handleStartEdit = (rule: FraudRule) => {
    setEditingRuleId(rule.id);
    setEditForm({ ...rule });
  };

  const handleSaveEdit = () => {
    if (editingRuleId && editForm.id) {
      onUpdateRule(editForm as FraudRule);
      setEditingRuleId(null);
      setEditForm({});
    }
  };

  const handleToggleEnable = (rule: FraudRule) => {
    onUpdateRule({ ...rule, enabled: !rule.enabled });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
              Rule Assertion & Parameter Manager
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure automated assertion logic thresholds, enforcement actions, and velocity limits
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          Active Assertions: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{rules.filter((r) => r.enabled).length} / {rules.length}</span>
        </div>
      </div>

      {/* Rules List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => {
          const isEditing = editingRuleId === rule.id;

          return (
            <div
              key={rule.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                rule.enabled
                  ? 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-indigo-500/50'
                  : 'bg-slate-100/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 opacity-60'
              }`}
            >
              <div>
                {/* Rule Title & Toggle */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-900">
                      {rule.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        rule.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : rule.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {rule.severity}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleEnable(rule)}
                    className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title={rule.enabled ? 'Disable Rule' : 'Enable Rule'}
                  >
                    {rule.enabled ? (
                      <ToggleRight className="h-7 w-7 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="h-7 w-7 text-slate-400" />
                    )}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {rule.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {rule.description}
                </p>

                {/* Parameters Section */}
                <div className="mt-4 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Configuration Parameters</div>

                  {isEditing ? (
                    <div className="space-y-2 pt-1">
                      {rule.parameters.maxTxCount !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Max Transactions:</span>
                          <input
                            type="number"
                            value={editForm.parameters?.maxTxCount || ''}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                parameters: { ...editForm.parameters, maxTxCount: parseInt(e.target.value, 10) },
                              })
                            }
                            className="w-20 px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                          />
                        </div>
                      )}
                      {rule.parameters.timeWindowSeconds !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Time Window (sec):</span>
                          <input
                            type="number"
                            value={editForm.parameters?.timeWindowSeconds || ''}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                parameters: { ...editForm.parameters, timeWindowSeconds: parseInt(e.target.value, 10) },
                              })
                            }
                            className="w-20 px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                          />
                        </div>
                      )}
                      {rule.parameters.maxSpeedKmh !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Max Speed (km/h):</span>
                          <input
                            type="number"
                            value={editForm.parameters?.maxSpeedKmh || ''}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                parameters: { ...editForm.parameters, maxSpeedKmh: parseInt(e.target.value, 10) },
                              })
                            }
                            className="w-20 px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                          />
                        </div>
                      )}
                      {rule.parameters.dailyLimitUsd !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Daily Cap ($):</span>
                          <input
                            type="number"
                            value={editForm.parameters?.dailyLimitUsd || ''}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                parameters: { ...editForm.parameters, dailyLimitUsd: parseInt(e.target.value, 10) },
                              })
                            }
                            className="w-20 px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                          />
                        </div>
                      )}
                      {rule.parameters.highValueThresholdUsd !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-300">High Value Threshold ($):</span>
                          <input
                            type="number"
                            value={editForm.parameters?.highValueThresholdUsd || ''}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                parameters: { ...editForm.parameters, highValueThresholdUsd: parseInt(e.target.value, 10) },
                              })
                            }
                            className="w-20 px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      {rule.parameters.maxTxCount !== undefined && <div>Max Tx: <span className="font-bold">{rule.parameters.maxTxCount}</span></div>}
                      {rule.parameters.timeWindowSeconds !== undefined && <div>Window: <span className="font-bold">{rule.parameters.timeWindowSeconds}s</span></div>}
                      {rule.parameters.maxSpeedKmh !== undefined && <div>Max Speed: <span className="font-bold">{rule.parameters.maxSpeedKmh} km/h</span></div>}
                      {rule.parameters.dailyLimitUsd !== undefined && <div>Daily Cap: <span className="font-bold">${rule.parameters.dailyLimitUsd.toLocaleString()}</span></div>}
                      {rule.parameters.highValueThresholdUsd !== undefined && <div>High Value: <span className="font-bold">${rule.parameters.highValueThresholdUsd.toLocaleString()}</span></div>}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Info & Controls */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Total Triggers: <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{rule.triggerCount}</span>
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingRuleId(null)}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-indigo-500 shadow-sm"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit(rule)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Configure
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
