export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 0.9) return 'CRITICAL'
  if (score >= 0.75) return 'HIGH'
  if (score >= 0.5) return 'MEDIUM'
  return 'LOW'
}

export function getRiskColor(score: number): string {
  const level = getRiskLevel(score)
  switch (level) {
    case 'CRITICAL': return '#dc2626'
    case 'HIGH': return '#ef4444'
    case 'MEDIUM': return '#eab308'
    case 'LOW': return '#22c55e'
  }
}

export function getRiskLabel(score: number): string {
  return getRiskLevel(score)
}
