import { getRiskColor } from '@/shared/utils/risk-calculator'

interface RiskScoreGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export function RiskScoreGauge({ score, size = 'md' }: RiskScoreGaugeProps) {
  const percentage = Math.round(score * 100)
  const color = getRiskColor(score)

  const sizeClasses = {
    sm: 'h-1.5 w-16',
    md: 'h-2 w-24',
    lg: 'h-3 w-32',
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} bg-muted rounded-full overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <span className="text-xs font-mono font-medium" style={{ color }}>
        {(score * 100).toFixed(0)}%
      </span>
    </div>
  )
}
