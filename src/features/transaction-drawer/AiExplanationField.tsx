import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle } from 'lucide-react'

interface AiExplanationFieldProps {
  transactionId: string
  initialExplanation?: string | null
}

export function AiExplanationField({ transactionId, initialExplanation }: AiExplanationFieldProps) {
  const [showFallback, setShowFallback] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['ai-explanation', transactionId],
    queryFn: async () => {
      const res = await fetch(`/api/transactions/flagged/${transactionId}`)
      if (!res.ok) throw new Error('Failed')
      return res.json() as Promise<{ aiExplanation: string | null }>
    },
    enabled: !initialExplanation,
    refetchInterval: 2000,
  })

  const explanation = initialExplanation ?? data?.aiExplanation

  useEffect(() => {
    if (!initialExplanation && !isLoading && !isError && !data?.aiExplanation) {
      const timeout = setTimeout(() => setShowFallback(true), 3000)
      return () => clearTimeout(timeout)
    }
  }, [initialExplanation, isLoading, isError, data?.aiExplanation])

  if (isLoading && !initialExplanation) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 text-destructive text-sm">
        <AlertTriangle className="w-4 h-4" />
        Failed to load AI explanation
      </div>
    )
  }

  if (!explanation) {
    if (showFallback) {
      return (
        <div className="text-sm text-muted-foreground italic">
          AI analysis is processing. Explanation will appear shortly.
        </div>
      )
    }
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-sm leading-relaxed bg-muted/50 p-4 rounded-lg border"
    >
      {explanation}
    </motion.div>
  )
}
