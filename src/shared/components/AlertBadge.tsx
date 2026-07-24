import { Badge } from '@/components/ui/badge'
import type { RuleType } from '@/shared/types/transaction'

interface RuleBadgeProps {
  rule: RuleType
  size?: 'sm' | 'default'
}

const ruleConfig: Record<RuleType, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'ai' | 'warning' | 'success' }> = {
  HIGH_VELOCITY: { label: 'High Velocity', variant: 'destructive' },
  DAILY_LIMIT_EXCEEDED: { label: 'Daily Limit', variant: 'warning' },
  GEO_VELOCITY: { label: 'Geo Velocity', variant: 'destructive' },
  INTELLIGENT_ANOMALY: { label: 'AI Anomaly', variant: 'ai' },
}

export function RuleBadge({ rule, size = 'default' }: RuleBadgeProps) {
  const config = ruleConfig[rule]
  return (
    <Badge variant={config.variant} className={size === 'sm' ? 'text-xs px-1.5 py-0' : ''}>
      {config.label}
    </Badge>
  )
}
