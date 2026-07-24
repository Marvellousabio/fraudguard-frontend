import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Loader2, XCircle, RefreshCw } from 'lucide-react'
import type { VectorFeedbackStatus } from '@/shared/types/transaction'

interface ConfirmFraudButtonProps {
  transactionId: string
}

const statusConfig: Record<VectorFeedbackStatus, { label: string; variant: 'default' | 'secondary' | 'destructive'; icon: React.ReactNode }> = {
  PENDING: { label: 'Pending Feedback', variant: 'secondary', icon: <RefreshCw className="w-4 h-4" /> },
  SUBMITTED: { label: 'Submitted', variant: 'default', icon: <CheckCircle className="w-4 h-4" /> },
  FAILED: { label: 'Failed', variant: 'destructive', icon: <XCircle className="w-4 h-4" /> },
}

export function ConfirmFraudButton({ transactionId }: ConfirmFraudButtonProps) {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<VectorFeedbackStatus>('PENDING')

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/transactions/${transactionId}/confirm-fraud`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    onMutate: () => setStatus('SUBMITTED'),
    onError: () => setStatus('FAILED'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['flagged-transactions'] })
    },
  })

  const handleConfirm = () => {
    if (status === 'PENDING') {
      mutation.mutate()
    } else if (status === 'FAILED') {
      mutation.mutate()
    }
  }

  const config = statusConfig[status]

  return (
    <div className="space-y-2">
      <Button
        onClick={handleConfirm}
        disabled={mutation.isPending || status === 'SUBMITTED'}
        variant={status === 'FAILED' ? 'destructive' : 'default'}
        className="w-full"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : status === 'PENDING' ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm True-Positive Fraud
          </>
        ) : status === 'FAILED' ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Submission
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Already Submitted
          </>
        )}
      </Button>
      <div className="flex items-center justify-center gap-2">
        <Badge variant={config.variant} className="text-xs">
          {config.icon}
          {config.label}
        </Badge>
      </div>
    </div>
  )
}
