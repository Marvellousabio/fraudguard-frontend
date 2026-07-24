import { useQuery } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import type { FlaggedTransaction, FilterState } from '@/shared/types/transaction'
import { useWebSocket } from '../../shared/hooks/useWebSocket'

export function useLiveFeed(filter: FilterState) {
  const queryClient = useQueryClient()

  useWebSocket({
    onFraudDetected: (tx: FlaggedTransaction) => {
      queryClient.setQueryData<FlaggedTransaction[]>(['flagged-transactions', filter], (old = []) => {
        if (old.some(t => t.id === tx.id)) return old
        return [tx, ...old]
      })
    },
    onAiExplanationUpdated: (data: { transactionId: string; aiExplanation: string }) => {
      queryClient.setQueryData<FlaggedTransaction[]>(['flagged-transactions', filter], (old = []) => {
        return old.map(t => t.id === data.transactionId ? { ...t, aiExplanation: data.aiExplanation } : t)
      })
    },
  })

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['flagged-transactions', filter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filter.ruleType) params.set('ruleType', filter.ruleType)
      if (filter.minRiskScore !== undefined) params.set('minRiskScore', String(filter.minRiskScore))

      const res = await fetch(`/api/transactions/flagged?${params}`)
      if (!res.ok) throw new Error('Failed to fetch transactions')
      const json = await res.json()
      return json.data as FlaggedTransaction[]
    },
    refetchInterval: 5000,
  })

  return {
    transactions: data ?? [],
    isLoading,
    error,
    refetch,
  }
}
