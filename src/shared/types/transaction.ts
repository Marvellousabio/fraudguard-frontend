export type RuleType = 'HIGH_VELOCITY' | 'DAILY_LIMIT_EXCEEDED' | 'GEO_VELOCITY' | 'INTELLIGENT_ANOMALY'

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type UserRole = 'FRAUD_ANALYST' | 'COMPLIANCE_OFFICER' | 'BACKEND_DEVELOPER'

export type VectorFeedbackStatus = 'PENDING' | 'SUBMITTED' | 'FAILED'

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface FlaggedTransaction {
  id: string
  transactionId: string
  userId: string
  reason: RuleType
  riskScore: number
  aiConfidenceScore: number | null
  aiExplanation: string | null
  metadata: Record<string, unknown>
  vectorFeedbackStatus: VectorFeedbackStatus
  timestamp: string
  amount: number
  merchant: string
  location: Coordinates
}

export interface AnalyticsSummary {
  totalFlaggedToday: number
  breakdownByRule: Record<RuleType, number>
  averageRiskScore: number
  ahnlichP99Latency: number
}

export interface TimeSeriesBucket {
  timestamp: string
  count: number
}

export interface SocketPayload {
  'fraud.detected': FlaggedTransaction
  'ai_explanation.updated': {
    transactionId: string
    aiExplanation: string
  }
}

export interface FilterState {
  ruleType?: RuleType
  minRiskScore?: number
  zoneId?: string
}
