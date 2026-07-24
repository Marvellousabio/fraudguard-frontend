import React, { useState, useMemo } from 'react';
import { Transaction } from '@/shared/types/fraud';
import { Sparkles, ChevronLeft, ChevronRight, Eye, Search } from 'lucide-react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from 'cmdk';
import { motion } from 'framer-motion';

interface TransactionTableProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onQuickAIExplain: (tx: Transaction) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onSelectTransaction,
  onQuickAIExplain,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const uniqueMerchants = useMemo(() => {
    const map = new Map<string, Transaction>();
    transactions.forEach((tx) => {
      if (!map.has(tx.merchant)) map.set(tx.merchant, tx);
    });
    return Array.from(map.values());
  }, [transactions]);

  const uniqueCities = useMemo(() => {
    const map = new Map<string, Transaction>();
    transactions.forEach((tx) => {
      if (!map.has(tx.location.city)) map.set(tx.location.city, tx);
    });
    return Array.from(map.values());
  }, [transactions]);

  const uniqueAccounts = useMemo(() => {
    const map = new Map<string, Transaction>();
    transactions.forEach((tx) => {
      if (!map.has(tx.accountId)) map.set(tx.accountId, tx);
    });
    return Array.from(map.values());
  }, [transactions]);

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      !searchTerm ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.location.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
    const matchesRisk = riskFilter === 'ALL' || tx.riskLevel === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectItem = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Controls Header */}
      <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans">
            Transaction Inspection Ledger
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time ingested transactions with automated threat score vector matching
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Smart Search Bar (cmdk) */}
          <Command className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 w-full sm:w-80">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search transactions, accounts, merchants, cities..."
              className="h-9 text-xs border-0 focus:ring-0 bg-transparent"
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Transactions">
                {transactions
                  .filter((tx) => tx.id.toLowerCase().includes(searchTerm.toLowerCase()))
                  .slice(0, 5)
                  .map((tx) => (
                    <CommandItem
                      key={tx.id}
                      value={tx.id}
                      onSelect={() => handleSelectItem(tx.id)}
                      className="text-xs"
                    >
                      <span className="font-mono font-bold">{tx.id}</span>
                      <span className="ml-2 text-slate-500 dark:text-slate-400">${tx.amount.toLocaleString()} at {tx.merchant}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Accounts">
                {uniqueAccounts
                  .filter((tx) => tx.accountId.toLowerCase().includes(searchTerm.toLowerCase()) || tx.accountName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .slice(0, 5)
                  .map((tx) => (
                    <CommandItem
                      key={tx.accountId}
                      value={tx.accountId}
                      onSelect={() => handleSelectItem(tx.accountId)}
                      className="text-xs"
                    >
                      <span className="font-medium">{tx.accountName}</span>
                      <span className="ml-2 text-slate-500 dark:text-slate-400 font-mono">{tx.accountId}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Merchants">
                {uniqueMerchants
                  .filter((tx) => tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()))
                  .slice(0, 5)
                  .map((tx) => (
                    <CommandItem
                      key={tx.merchant}
                      value={tx.merchant}
                      onSelect={() => handleSelectItem(tx.merchant)}
                      className="text-xs"
                    >
                      <span className="font-medium">{tx.merchant}</span>
                      <span className="ml-2 text-slate-500 dark:text-slate-400">{tx.merchantCategory}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Cities">
                {uniqueCities
                  .filter((tx) => tx.location.city.toLowerCase().includes(searchTerm.toLowerCase()))
                  .slice(0, 5)
                  .map((tx) => (
                    <CommandItem
                      key={tx.location.city}
                      value={tx.location.city}
                      onSelect={() => handleSelectItem(tx.location.city)}
                      className="text-xs"
                    >
                      <span className="font-medium">{tx.location.city}</span>
                      <span className="ml-2 text-slate-500 dark:text-slate-400">{tx.location.country}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">APPROVED</option>
            <option value="FLAGGED">FLAGGED</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">CRITICAL (&gt;80)</option>
            <option value="HIGH">HIGH (60-79)</option>
            <option value="MEDIUM">MEDIUM (35-59)</option>
            <option value="LOW">LOW (&lt;35)</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Merchant</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Risk Score</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Triggered Rules</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                  No matching transactions found.
                </td>
              </tr>
            ) : (
              paginated.map((tx) => {
                const isHighRisk = tx.riskScore >= 60;
                const isMediumRisk = tx.riskScore >= 35;

                return (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {tx.id}
                      <div className="text-[10px] font-sans font-normal text-slate-400">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {tx.accountName}
                      <div className="text-[10px] font-mono text-slate-400">{tx.accountId}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white font-mono">
                      ${tx.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{tx.merchant}</div>
                      <div className="text-[10px] text-slate-400">{tx.merchantCategory}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{tx.location.city}, {tx.location.country}</div>
                      {tx.speedKmh ? (
                        <div className="text-[10px] text-rose-500 font-semibold">{tx.speedKmh} km/h jump</div>
                      ) : (
                        <div className="text-[10px] text-slate-400">{tx.ipAddress}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold ${
                            isHighRisk
                              ? 'text-rose-600 dark:text-rose-400'
                              : isMediumRisk
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {tx.riskScore}
                        </span>
                        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              isHighRisk ? 'bg-rose-500' : isMediumRisk ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${tx.riskScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          tx.status === 'BLOCKED'
                            ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            : tx.status === 'FLAGGED'
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {tx.triggeredRules.length === 0 ? (
                        <span className="text-slate-400 text-[11px]">None</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {tx.triggeredRules.map((r, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onQuickAIExplain(tx)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                          title="Generate Gemini AI Analysis"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>AI Explain</span>
                        </button>
                        <button
                          onClick={() => onSelectTransaction(tx)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Full Details Drawer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{filtered.length > 0 ? startIndex + 1 : 0}</span> to{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {Math.min(startIndex + itemsPerPage, filtered.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-800 dark:text-slate-200">{filtered.length}</span> records
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
