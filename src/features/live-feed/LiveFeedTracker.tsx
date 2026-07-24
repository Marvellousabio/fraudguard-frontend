import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RiskScoreGauge } from '@/shared/components/RiskScoreGauge'
import { RuleBadge } from '@/shared/components/AlertBadge'
import { AnalystDrawer } from '@/features/transaction-drawer/AnalystDrawer'
import type { FlaggedTransaction, FilterState } from '@/shared/types/transaction'
import { Shield, AlertTriangle, Search, Filter } from 'lucide-react'

interface LiveFeedTrackerProps {
  filter: FilterState
  onFilterChange: (filter: FilterState) => void
  transactions: FlaggedTransaction[]
  isLoading: boolean
}

export function LiveFeedTracker({ filter, onFilterChange, transactions, isLoading }: LiveFeedTrackerProps) {
  const [selectedTx, setSelectedTx] = useState<FlaggedTransaction | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filteredTransactions = useMemo(() => {
    return transactions
  }, [transactions])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Live Feed Tracker</h2>
          <Badge variant="ai" className="animate-pulse">
            {filteredTransactions.length} active
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Rule Type</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={filter.ruleType || ''}
                  onChange={(e) => onFilterChange({ ...filter, ruleType: e.target.value as FlaggedTransaction['reason'] | undefined })}
                >
                  <option value="">All Rules</option>
                  <option value="HIGH_VELOCITY">High Velocity</option>
                  <option value="DAILY_LIMIT_EXCEEDED">Daily Limit</option>
                  <option value="GEO_VELOCITY">Geo Velocity</option>
                  <option value="INTELLIGENT_ANOMALY">AI Anomaly</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Min Risk Score</Label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  placeholder="0.0 - 1.0"
                  value={filter.minRiskScore ?? ''}
                  onChange={(e) => onFilterChange({
                    ...filter,
                    minRiskScore: e.target.value ? parseFloat(e.target.value) : undefined,
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Zone ID</Label>
                <Input
                  placeholder="Filter by zone..."
                  value={filter.zoneId || ''}
                  onChange={(e) => onFilterChange({ ...filter, zoneId: e.target.value || undefined })}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFilterChange({})}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {isLoading && filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                Loading transactions...
              </CardContent>
            </Card>
          ) : filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                No transactions match your filters
              </CardContent>
            </Card>
          ) : (
            filteredTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    tx.reason === 'INTELLIGENT_ANOMALY' ? 'border-fraud-ai/50 bg-fraud-ai/5' : ''
                  }`}
                  onClick={() => setSelectedTx(tx)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-medium">{tx.transactionId}</span>
                          <RuleBadge rule={tx.reason} size="sm" />
                          {tx.reason === 'INTELLIGENT_ANOMALY' && (
                            <Badge variant="ai" className="text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>User: {tx.userId}</p>
                          <p>Merchant: {tx.merchant} | ${tx.amount.toFixed(2)}</p>
                          <p className="text-xs">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <RiskScoreGauge score={tx.riskScore} size="sm" />
                        {tx.aiConfidenceScore && (
                          <div className="text-xs text-muted-foreground">
                            AI: {(tx.aiConfidenceScore * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AnalystDrawer transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  )
}
