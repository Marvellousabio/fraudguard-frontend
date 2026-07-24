import type { FlaggedTransaction, RuleType } from '@/shared/types/transaction'

const RULE_TYPES: RuleType[] = ['HIGH_VELOCITY', 'DAILY_LIMIT_EXCEEDED', 'GEO_VELOCITY', 'INTELLIGENT_ANOMALY']
const MERCHANTS = ['Amazon', 'Walmart', 'Target', 'Apple Store', 'Best Buy', 'Nike', 'Starbucks', 'Shell', 'Uber', 'Airbnb']
const CITIES: { name: string; lat: number; lng: number }[] = [
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
  { name: 'Houston', lat: 29.7604, lng: -95.3698 },
  { name: 'Phoenix', lat: 33.4484, lng: -112.0740 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function generateUserId(index: number): string {
  const prefixes = ['USR', 'CUST', 'ACCT', 'MEM']
  const prefix = randomItem(prefixes)
  return `${prefix}_${String(index).padStart(6, '0')}`
}

function generateTransactionId(): string {
  return `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}

function generateAiExplanation(rule: RuleType, confidence: number): string {
  const explanations: Record<RuleType, string[]> = {
    HIGH_VELOCITY: [
      `Transaction velocity analysis indicates ${Math.floor(randomBetween(6, 15))} transactions within a 60-second rolling window, exceeding the threshold of 5 operations. This pattern is consistent with automated fraud scripts or account takeover scenarios.`,
      `Unusually high transaction frequency detected: ${Math.floor(randomBetween(7, 12))} operations in under 60 seconds. Velocity rules triggered with ${(confidence * 100).toFixed(1)}% confidence. Recommend immediate account review.`,
    ],
    DAILY_LIMIT_EXCEEDED: [
      `Cumulative daily spending has reached $${randomBetween(10500, 25000).toFixed(2)}, exceeding the $10,000 daily threshold. Aggregation across ${Math.floor(randomBetween(3, 8))} transactions suggests possible coordinated spending or stolen credentials.`,
      `Daily transaction volume aggregation triggered limit breach. Total spend: $${randomBetween(11000, 18000).toFixed(2)}. Pattern matches known fraud ring behavior of distributing large amounts across multiple small transactions.`,
    ],
    GEO_VELOCITY: [
      `Geographic impossibility detected: transaction originated from ${randomItem(CITIES).name} but previous transaction was from ${randomItem(CITIES.filter(c => c.name !== 'New York')).name} within a 2-minute window. Haversine distance calculation indicates travel speed exceeding ${randomBetween(800, 1500).toFixed(0)} km/h, which is physically impossible.`,
      `Location-based velocity rule triggered. Positional shift of ${randomBetween(1.5, 5).toFixed(1)} km in under 2 minutes. This indicates either GPS spoofing or compromised account credentials being used from a different physical location.`,
    ],
    INTELLIGENT_ANOMALY: [
      `Semantic similarity analysis via Ahnlich vector engine detected a ${(confidence * 100).toFixed(1)}% match against known fraud cluster patterns. Transaction context (merchant: ${randomItem(MERCHANTS)}, location: ${randomItem(CITIES).name}) aligns with behavioral signatures of confirmed fraud cases.`,
      `AI-powered anomaly detection flagged this transaction. Nearest-neighbor search against ${randomBetween(12, 50)} fraud cluster vectors returned similarity score of ${(confidence * 100).toFixed(1)}%. This exceeds the ${randomBetween(85, 90)}% threshold and warrants immediate investigation.`,
    ],
  }

  const options = explanations[rule]
  return randomItem(options)
}

export function generateTransaction(index: number): FlaggedTransaction {
  const rule = randomItem(RULE_TYPES)
  const city = randomItem(CITIES)
  const riskScore = rule === 'INTELLIGENT_ANOMALY'
    ? randomBetween(0.85, 0.98)
    : rule === 'GEO_VELOCITY'
      ? randomBetween(0.80, 0.95)
      : randomBetween(0.60, 0.90)

  const aiConfidenceScore = rule === 'INTELLIGENT_ANOMALY'
    ? randomBetween(0.85, 0.99)
    : null

  const now = new Date()
  const timestamp = new Date(now.getTime() - randomBetween(0, 7 * 24 * 60 * 60 * 1000))

  return {
    id: `tx-${index}`,
    transactionId: generateTransactionId(),
    userId: generateUserId(index),
    reason: rule,
    riskScore: Math.round(riskScore * 100) / 100,
    aiConfidenceScore: aiConfidenceScore ? Math.round(aiConfidenceScore * 100) / 100 : null,
    aiExplanation: null,
    metadata: {
      matchedVectorIds: aiConfidenceScore ? [`vec-${Math.floor(randomBetween(1, 100))}`] : [],
      velocityCount: rule === 'HIGH_VELOCITY' ? Math.floor(randomBetween(6, 15)) : undefined,
      dailyTotal: rule === 'DAILY_LIMIT_EXCEEDED' ? randomBetween(10500, 25000) : undefined,
      distanceKm: rule === 'GEO_VELOCITY' ? randomBetween(1.5, 5) : undefined,
      previousLocation: rule === 'GEO_VELOCITY' ? randomItem(CITIES.filter(c => c.name !== city.name)) : undefined,
    },
    vectorFeedbackStatus: 'PENDING',
    timestamp: timestamp.toISOString(),
    amount: parseFloat(randomBetween(50, 5000).toFixed(2)),
    merchant: randomItem(MERCHANTS),
    location: {
      latitude: city.lat + randomBetween(-0.1, 0.1),
      longitude: city.lng + randomBetween(-0.1, 0.1),
    },
  }
}

export function seedTransactions(count: number): FlaggedTransaction[] {
  const transactions: FlaggedTransaction[] = []
  for (let i = 0; i < count; i++) {
    transactions.push(generateTransaction(i))
  }
  return transactions
}

export function generateExplanationForTransaction(tx: FlaggedTransaction): string {
  return generateAiExplanation(tx.reason, tx.aiConfidenceScore || tx.riskScore)
}
