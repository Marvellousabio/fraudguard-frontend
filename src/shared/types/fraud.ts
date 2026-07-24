export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type TransactionStatus = 'APPROVED' | 'FLAGGED' | 'BLOCKED'

export type FeedbackStatus = 'PENDING' | 'CONFIRMED_FRAUD' | 'FALSE_POSITIVE'

export type SimulatorAttackType = 'NORMAL' | 'GEO_VELOCITY_ATTACK' | 'HIGH_VALUE_BURST' | 'CARDING_BOTNET' | 'MIXED_ATTACK'

export interface Location {
  lat: number
  lng: number
  city: string
  country: string
}

export interface Transaction {
  id: string
  timestamp: string
  amount: number
  currency: string
  accountId: string
  accountName: string
  cardLast4: string
  merchant: string
  merchantCategory: string
  location: Location
  previousLocation?: Location
  distanceKmFromLastTx?: number
  timeDiffSecondsFromLastTx?: number
  speedKmh?: number
  deviceFingerprint: string
  ipAddress: string
  cardType: string
  isInternational: boolean
  isCardNotPresent: boolean
  status: TransactionStatus
  riskScore: number
  riskLevel: RiskLevel
  triggeredRules: string[]
  aiExplanation?: AIExplanationResult
  latencyMs: number
  feedbackStatus?: FeedbackStatus
}

export interface FraudRule {
  id: string
  code: string
  name: string
  category: 'VELOCITY' | 'GEO_VELOCITY' | 'DAILY_LIMIT' | 'HIGH_VALUE' | 'ANOMALY' | 'DEVICE'
  severity: RiskLevel
  enabled: boolean
  action: 'FLAG' | 'BLOCK' | 'REVIEW'
  description: string
  parameters: {
    maxTxCount?: number
    timeWindowSeconds?: number
    maxSpeedKmh?: number
    maxDistanceKm?: number
    dailyLimitUsd?: number
    highValueThresholdUsd?: number
  }
  triggerCount: number
  lastTriggered?: string
}

export interface VectorMatch {
  patternId: string
  patternName: string
  similarityScore: number
  matchedFeatures: string[]
  historicalCount: number
}

export interface AIExplanationResult {
  summary: string
  rootCause: string
  riskReasoning: string[]
  recommendedAction: 'BLOCK_CARD' | 'REQUEST_2FA' | 'WHITELIST_MERCHANT' | 'MANUAL_REVIEW'
  confidenceScore: number
  vectorMatches: VectorMatch[]
  generationTimeMs: number
  modelUsed: string
}

export interface AnalyticsSummary {
  totalProcessedCount: number
  totalVolumeUsd: number
  fraudCount: number
  fraudVolumeUsd: number
  blockedCount: number
  fraudRatePercentage: number
  avgRiskScore: number
  avgLatencyMs: number
  p99LatencyMs: number
  activeRulesCount: number
  ruleTriggersCount: Record<string, number>
  hourlyTrend: Array<{
    time: string
    total: number
    flagged: number
    blocked: number
    volumeUsd: number
  }>
}

export interface HeatmapPoint {
  lat: number
  lng: number
  city: string
  country: string
  txCount: number
  fraudCount: number
  maxRiskScore: number
}

export interface SimulatorConfig {
  isRunning: boolean
  speedMs: number
  fraudRatePercentage: number
  attackType: SimulatorAttackType
}
