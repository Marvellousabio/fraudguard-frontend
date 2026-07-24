import type {
  Transaction,
  FraudRule,
  Location,
  VectorMatch,
  RiskLevel,
  TransactionStatus,
  SimulatorConfig,
} from '@/shared/types/fraud'

export const GLOBAL_CITIES: Location[] = [
  { city: 'New York', country: 'US', lat: 40.7128, lng: -74.006 },
  { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { city: 'Tokyo', country: 'JP', lat: 35.6762, lng: 139.6503 },
  { city: 'Singapore', country: 'SG', lat: 1.3521, lng: 103.8198 },
  { city: 'San Francisco', country: 'US', lat: 37.7749, lng: -122.4194 },
  { city: 'Paris', country: 'FR', lat: 48.8566, lng: 2.3522 },
  { city: 'Frankfurt', country: 'DE', lat: 50.1109, lng: 8.6821 },
  { city: 'Sydney', country: 'AU', lat: -33.8688, lng: 151.2093 },
  { city: 'Sao Paulo', country: 'BR', lat: -23.5505, lng: -46.6333 },
  { city: 'Dubai', country: 'AE', lat: 25.2048, lng: 55.2708 },
  { city: 'Hong Kong', country: 'HK', lat: 22.3193, lng: 114.1694 },
  { city: 'Toronto', country: 'CA', lat: 43.6532, lng: -79.3832 },
  { city: 'Amsterdam', country: 'NL', lat: 52.3676, lng: 4.9041 },
]

export const MERCHANTS = [
  { name: 'Amazon Web Services', category: 'CLOUD_SERVICES', avgAmount: 250 },
  { name: 'Apple Store Online', category: 'ELECTRONICS', avgAmount: 899 },
  { name: 'Binance Exchange', category: 'CRYPTO', avgAmount: 2500 },
  { name: 'Luxury Watches Paris', category: 'JEWELRY', avgAmount: 4800 },
  { name: 'Uber Trips', category: 'TRANSPORT', avgAmount: 28 },
  { name: 'Starbucks Coffee', category: 'FOOD_BEVERAGE', avgAmount: 9.5 },
  { name: 'Delta Air Lines', category: 'TRAVEL', avgAmount: 620 },
  { name: 'DraftKings Gaming', category: 'GAMBLING', avgAmount: 450 },
  { name: 'Nordstrom Retail', category: 'APPAREL', avgAmount: 180 },
  { name: 'Best Buy Tech', category: 'ELECTRONICS', avgAmount: 420 },
  { name: 'Sephora Beauty', category: 'COSMETICS', avgAmount: 115 },
  { name: 'Steam Games', category: 'DIGITAL_GOODS', avgAmount: 59 },
  { name: 'Shell Gas Station', category: 'FUEL', avgAmount: 45 },
]

export const DEFAULT_RULES: FraudRule[] = [
  {
    id: 'rule-01',
    code: 'R_HIGH_VELOCITY',
    name: 'High Frequency Velocity Spikes',
    category: 'VELOCITY',
    severity: 'HIGH',
    enabled: true,
    action: 'FLAG',
    description: 'Triggers when more than 3 transactions occur within 60 seconds on a single card.',
    parameters: { maxTxCount: 3, timeWindowSeconds: 60 },
    triggerCount: 42,
    lastTriggered: new Date(Date.now() - 1000 * 180).toISOString(),
  },
  {
    id: 'rule-02',
    code: 'R_GEO_IMPOSSIBLE_SPEED',
    name: 'Impossible Geographic Travel Speed',
    category: 'GEO_VELOCITY',
    severity: 'CRITICAL',
    enabled: true,
    action: 'BLOCK',
    description: 'Flags transactions where distance jump requires travel speed exceeding 800 km/h.',
    parameters: { maxSpeedKmh: 800, maxDistanceKm: 300 },
    triggerCount: 28,
    lastTriggered: new Date(Date.now() - 1000 * 300).toISOString(),
  },
  {
    id: 'rule-03',
    code: 'R_DAILY_LIMIT_EXCEEDED',
    name: 'Account 24h Daily Spend Cap',
    category: 'DAILY_LIMIT',
    severity: 'HIGH',
    enabled: true,
    action: 'FLAG',
    description: 'Triggers when 24-hour total account expenditure exceeds $5,000 threshold.',
    parameters: { dailyLimitUsd: 5000 },
    triggerCount: 19,
    lastTriggered: new Date(Date.now() - 1000 * 600).toISOString(),
  },
  {
    id: 'rule-04',
    code: 'R_HIGH_VALUE_UNRECOGNIZED',
    name: 'High Value Luxury & Crypto Anomalies',
    category: 'HIGH_VALUE',
    severity: 'CRITICAL',
    enabled: true,
    action: 'BLOCK',
    description: 'Blocks single transactions exceeding $2,000 in high-risk categories (Crypto, Jewelry, Gambling).',
    parameters: { highValueThresholdUsd: 2000 },
    triggerCount: 35,
    lastTriggered: new Date(Date.now() - 1000 * 120).toISOString(),
  },
  {
    id: 'rule-05',
    code: 'R_CARDING_NEW_DEVICE',
    name: 'Card-Not-Present New Device Burst',
    category: 'DEVICE',
    severity: 'MEDIUM',
    enabled: true,
    action: 'FLAG',
    description: 'Flags rapid online transactions originating from an unrecognized device fingerprint or proxy IP.',
    parameters: { maxTxCount: 2, timeWindowSeconds: 120 },
    triggerCount: 51,
    lastTriggered: new Date(Date.now() - 1000 * 90).toISOString(),
  },
  {
    id: 'rule-06',
    code: 'R_SEMANTIC_VECTOR_ANOMALY',
    name: 'Ahnlich Vector Embedding Similarity Match',
    category: 'ANOMALY',
    severity: 'HIGH',
    enabled: true,
    action: 'FLAG',
    description: 'Calculates cosine similarity vector distance against known organized crime syndicate vectors.',
    parameters: {},
    triggerCount: 64,
    lastTriggered: new Date(Date.now() - 1000 * 45).toISOString(),
  },
]

export const KNOWN_VECTOR_PATTERNS: Array<{
  patternId: string
  patternName: string
  matchedFeatures: string[]
  historicalCount: number
}> = [
  {
    patternId: 'VEC-RING-901',
    patternName: 'Eastern European Carding Syndicate Cluster',
    matchedFeatures: [
      'High-frequency $1 micro-authorizations',
      'Proxy IP hop from Latvia',
      'Same device hash across 14 cards',
    ],
    historicalCount: 1420,
  },
  {
    patternId: 'VEC-RING-408',
    patternName: 'Automated Botnet Crypto Drainer Pattern',
    matchedFeatures: [
      'Instantaneous $2,500 Binance transfers',
      'Tor exit node routing',
      'Headless Chrome browser fingerprint',
    ],
    historicalCount: 890,
  },
  {
    patternId: 'VEC-RING-712',
    patternName: 'Stolen Identity Luxury Resale Ring',
    matchedFeatures: [
      'Rapid high-value luxury goods purchase',
      'Card-not-present international shipping mismatch',
    ],
    historicalCount: 512,
  },
  {
    patternId: 'VEC-RING-204',
    patternName: 'Geo-Spoofed Triangulation Fraud',
    matchedFeatures: [
      'GPS spoofing headers',
      'Impossible speed trans-atlantic jump',
      'Mismatched issuer BIN country',
    ],
    historicalCount: 1105,
  },
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function calculateHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'CRITICAL'
  if (score >= 60) return 'HIGH'
  if (score >= 35) return 'MEDIUM'
  return 'LOW'
}

function getStatus(level: RiskLevel): TransactionStatus {
  if (level === 'CRITICAL') return 'BLOCKED'
  if (level === 'HIGH' || level === 'MEDIUM') return 'FLAGGED'
  return 'APPROVED'
}

export function generateTransaction(index: number): Transaction {
  const city = randomItem(GLOBAL_CITIES)
  const merchant = randomItem(MERCHANTS)
  const amount = Math.round((merchant.avgAmount + randomBetween(-merchant.avgAmount * 0.3, merchant.avgAmount * 0.5)) * 100) / 100
  const hasPreviousLocation = Math.random() > 0.6
  const previousCity = hasPreviousLocation ? randomItem(GLOBAL_CITIES) : undefined

  let distanceKm: number | undefined
  let timeDiffSeconds: number | undefined
  let speedKmh: number | undefined

  if (previousCity) {
    distanceKm = calculateHaversineKm(previousCity.lat, previousCity.lng, city.lat, city.lng)
    timeDiffSeconds = Math.floor(randomBetween(60, 7200))
    const hours = timeDiffSeconds / 3600
    speedKmh = hours > 0 ? Math.round(distanceKm / hours) : 0
  }

  const isInternational = city.country !== 'US'
  const isCardNotPresent = Math.random() > 0.3

  let riskScore = Math.floor(randomBetween(5, 40))
  const triggeredRules: string[] = []

  if (speedKmh && speedKmh > 800) {
    triggeredRules.push('Impossible Geographic Travel Speed')
    riskScore += 45
  }

  if (amount > 2000 && ['CRYPTO', 'JEWELRY', 'GAMBLING'].includes(merchant.category)) {
    triggeredRules.push('High Value Luxury & Crypto Anomalies')
    riskScore += 40
  }

  if (isCardNotPresent && Math.random() > 0.7) {
    triggeredRules.push('Card-Not-Present New Device Burst')
    riskScore += 20
  }

  if (Math.random() > 0.8) {
    riskScore += 25
  }

  riskScore = Math.min(100, Math.max(0, riskScore))
  const riskLevel = getRiskLevel(riskScore)
  const status = getStatus(riskLevel)

  const accountId = `ACC-${Math.floor(100000 + Math.random() * 900000)}`

  return {
    id: `tx-${index}`,
    timestamp: new Date(Date.now() - randomBetween(0, 7 * 24 * 60 * 60 * 1000)).toISOString(),
    amount,
    currency: 'USD',
    accountId,
    accountName: `Account #${accountId.slice(-4)}`,
    cardLast4: `${Math.floor(1000 + Math.random() * 9000)}`,
    merchant: merchant.name,
    merchantCategory: merchant.category,
    location: { lat: city.lat, lng: city.lng, city: city.city, country: city.country },
    previousLocation: previousCity ? { lat: previousCity.lat, lng: previousCity.lng, city: previousCity.city, country: previousCity.country } : undefined,
    distanceKmFromLastTx: distanceKm,
    timeDiffSecondsFromLastTx: timeDiffSeconds,
    speedKmh,
    deviceFingerprint: `dev-${Math.random().toString(36).slice(2, 9)}`,
    ipAddress: `${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 255)}.12.91`,
    cardType: 'VISA Platinum',
    isInternational,
    isCardNotPresent,
    status,
    riskScore,
    riskLevel,
    triggeredRules,
    latencyMs: Math.floor(randomBetween(4, 120)),
    feedbackStatus: 'PENDING',
  }
}

export function generateMockAnalytics(transactions: Transaction[]): {
  summary: {
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
  heatmapPoints: Array<{
    lat: number
    lng: number
    city: string
    country: string
    txCount: number
    fraudCount: number
    maxRiskScore: number
  }>
} {
  const totalProcessedCount = transactions.length
  const totalVolumeUsd = transactions.reduce((sum, tx) => sum + tx.amount, 0)
  const fraudTxs = transactions.filter((tx) => tx.status !== 'APPROVED')
  const fraudCount = fraudTxs.length
  const fraudVolumeUsd = fraudTxs.reduce((sum, tx) => sum + tx.amount, 0)
  const blockedCount = transactions.filter((tx) => tx.status === 'BLOCKED').length
  const fraudRatePercentage = totalProcessedCount > 0 ? Math.round((fraudCount / totalProcessedCount) * 100) : 0
  const avgRiskScore = totalProcessedCount > 0 ? Math.round(transactions.reduce((sum, tx) => sum + tx.riskScore, 0) / totalProcessedCount) : 0
  const latencies = transactions.map((tx) => tx.latencyMs).sort((a, b) => a - b)
  const avgLatencyMs = latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0
  const p99Index = Math.max(0, Math.floor(latencies.length * 0.99) - 1)
  const p99LatencyMs = latencies[p99Index] || 0
  const activeRulesCount = DEFAULT_RULES.filter((r) => r.enabled).length
  const ruleTriggersCount: Record<string, number> = {}
  transactions.forEach((tx) => {
    tx.triggeredRules.forEach((ruleName) => {
      ruleTriggersCount[ruleName] = (ruleTriggersCount[ruleName] || 0) + 1
    })
  })

  const hourlyTrend = Array.from({ length: 24 }, (_, i) => {
    const hourStart = new Date()
    hourStart.setHours(hourStart.getHours() - 23 + i, 0, 0, 0)
    const hourEnd = new Date(hourStart)
    hourEnd.setHours(hourStart.getHours() + 1)
    const hourTxs = transactions.filter((tx) => {
      const ts = new Date(tx.timestamp)
      return ts >= hourStart && ts < hourEnd
    })
    const total = hourTxs.length
    const flagged = hourTxs.filter((tx) => tx.status === 'FLAGGED').length
    const blocked = hourTxs.filter((tx) => tx.status === 'BLOCKED').length
    const volumeUsd = hourTxs.reduce((sum, tx) => sum + tx.amount, 0)
    return {
      time: hourStart.toISOString(),
      total,
      flagged,
      blocked,
      volumeUsd,
    }
  })

  const cityMap = new Map<string, { lat: number; lng: number; city: string; country: string; txCount: number; fraudCount: number; maxRiskScore: number }>()
  transactions.forEach((tx) => {
    const key = tx.location.city
    const existing = cityMap.get(key)
    if (existing) {
      existing.txCount++
      existing.fraudCount += tx.status !== 'APPROVED' ? 1 : 0
      existing.maxRiskScore = Math.max(existing.maxRiskScore, tx.riskScore)
    } else {
      cityMap.set(key, {
        lat: tx.location.lat,
        lng: tx.location.lng,
        city: tx.location.city,
        country: tx.location.country,
        txCount: 1,
        fraudCount: tx.status !== 'APPROVED' ? 1 : 0,
        maxRiskScore: tx.riskScore,
      })
    }
  })

  const heatmapPoints = Array.from(cityMap.values())

  return {
    summary: {
      totalProcessedCount,
      totalVolumeUsd,
      fraudCount,
      fraudVolumeUsd,
      blockedCount,
      fraudRatePercentage,
      avgRiskScore,
      avgLatencyMs,
      p99LatencyMs,
      activeRulesCount,
      ruleTriggersCount,
      hourlyTrend,
    },
    heatmapPoints,
  }
}

export function computeVectorMatches(tx: Transaction): VectorMatch[] {
  const matches: VectorMatch[] = []

  if (tx.riskScore >= 70) {
    matches.push({
      patternId: KNOWN_VECTOR_PATTERNS[0].patternId,
      patternName: KNOWN_VECTOR_PATTERNS[0].patternName,
      similarityScore: parseFloat((0.85 + Math.random() * 0.12).toFixed(2)),
      matchedFeatures: KNOWN_VECTOR_PATTERNS[0].matchedFeatures,
      historicalCount: KNOWN_VECTOR_PATTERNS[0].historicalCount,
    })
    if (tx.speedKmh && tx.speedKmh > 500) {
      matches.push({
        patternId: KNOWN_VECTOR_PATTERNS[3].patternId,
        patternName: KNOWN_VECTOR_PATTERNS[3].patternName,
        similarityScore: parseFloat((0.91 + Math.random() * 0.08).toFixed(2)),
        matchedFeatures: KNOWN_VECTOR_PATTERNS[3].matchedFeatures,
        historicalCount: KNOWN_VECTOR_PATTERNS[3].historicalCount,
      })
    }
  } else if (tx.riskScore >= 40) {
    matches.push({
      patternId: KNOWN_VECTOR_PATTERNS[1].patternId,
      patternName: KNOWN_VECTOR_PATTERNS[1].patternName,
      similarityScore: parseFloat((0.68 + Math.random() * 0.15).toFixed(2)),
      matchedFeatures: KNOWN_VECTOR_PATTERNS[1].matchedFeatures,
      historicalCount: KNOWN_VECTOR_PATTERNS[1].historicalCount,
    })
  } else {
    matches.push({
      patternId: 'VEC-NORM-001',
      patternName: 'Legitimate Consumer Behaviour Baseline',
      similarityScore: parseFloat((0.94 + Math.random() * 0.05).toFixed(2)),
      matchedFeatures: [
        'Verified home IP subnet',
        'Low historical velocity',
        'Chip & PIN authorisations',
      ],
      historicalCount: 892000,
    })
  }

  return matches
}

export function generateMockAIExplanation(tx: Transaction) {
  const vectorMatches = computeVectorMatches(tx)
  const isHighRisk = tx.riskScore >= 60
  const isMediumRisk = tx.riskScore >= 35

  const summary = isHighRisk
    ? `High-risk transaction flag triggered by ${tx.triggeredRules.join(', ') || 'anomalous velocity'}.`
    : isMediumRisk
      ? `Moderate anomaly detected for ${tx.merchant} transaction of $${tx.amount.toLocaleString()}.`
      : `Standard low-risk transaction evaluated with normal behavioural baseline.`

  const rootCause = isHighRisk
    ? `Physical or logical anomaly: ${tx.speedKmh ? `Travel speed of ${tx.speedKmh} km/h exceeds human limits.` : 'Unusual location & merchant combination.'}`
    : `Transaction pattern matches low-to-medium anomaly threshold.`

  const riskReasoning = [
    `Transaction amount $${tx.amount.toFixed(2)} at ${tx.merchant} (${tx.merchantCategory}).`,
    `Location telemetry: ${tx.location.city}, ${tx.location.country}. ${tx.isInternational ? 'Cross-border transaction detected.' : 'Domestic transaction.'}`,
    `Device fingerprint ${tx.deviceFingerprint} — ${tx.isCardNotPresent ? 'Card-not-present environment.' : 'Physical card present.'}`,
    `AI vector similarity: ${vectorMatches[0]?.similarityScore ?? 0} match against ${vectorMatches[0]?.patternName ?? 'baseline'}.`,
  ]

  const recommendedAction: 'BLOCK_CARD' | 'REQUEST_2FA' | 'WHITELIST_MERCHANT' | 'MANUAL_REVIEW' = isHighRisk
    ? (tx.status === 'BLOCKED' ? 'BLOCK_CARD' : 'MANUAL_REVIEW')
    : isMediumRisk
      ? 'REQUEST_2FA'
      : 'WHITELIST_MERCHANT'

  return {
    summary,
    rootCause,
    riskReasoning,
    recommendedAction,
    confidenceScore: Math.min(99, Math.max(60, tx.riskScore + randomBetween(-10, 10))),
    vectorMatches,
    generationTimeMs: Math.floor(randomBetween(200, 900)),
    modelUsed: 'mock-gemini-flash',
  }
}

export const DEFAULT_SIMULATOR_CONFIG: SimulatorConfig = {
  isRunning: true,
  speedMs: 1500,
  fraudRatePercentage: 18,
  attackType: 'NORMAL',
}
