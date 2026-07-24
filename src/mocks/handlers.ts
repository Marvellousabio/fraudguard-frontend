import { http, HttpResponse, delay } from 'msw'
import { seedTransactions } from './seed-data'
import type { FlaggedTransaction } from '@/shared/types/transaction'

const DB_KEY = 'fraudguard_mock_db'

function getDb(): { transactions: FlaggedTransaction[]; confirmedIds: Set<string> } {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  const seed = seedTransactions(50)
  const db = { transactions: seed, confirmedIds: new Set<string>() }
  saveDb(db)
  return db
}

function saveDb(db: { transactions: FlaggedTransaction[]; confirmedIds: Set<string> }) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(300)
    const body = await request.json() as { username: string; password: string }
    const roleMap: Record<string, string> = {
      admin: 'COMPLIANCE_OFFICER',
      analyst: 'FRAUD_ANALYST',
      dev: 'BACKEND_DEVELOPER',
    }
    const role = roleMap[body.username]
    if (!role) return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    return HttpResponse.json({
      token: `mock-token-${body.username}`,
      role,
      name: body.username.charAt(0).toUpperCase() + body.username.slice(1),
    })
  }),

  http.get('/api/transactions/flagged', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const ruleType = url.searchParams.get('ruleType') as FlaggedTransaction['reason'] | undefined
    const minRiskScore = url.searchParams.get('minRiskScore') ? parseFloat(url.searchParams.get('minRiskScore')!) : undefined

    let db = getDb()
    let filtered = db.transactions

    if (ruleType) filtered = filtered.filter(t => t.reason === ruleType)
    if (minRiskScore !== undefined) filtered = filtered.filter(t => t.riskScore >= minRiskScore)

    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const start = (page - 1) * pageSize
    const paginated = filtered.slice(start, start + pageSize)

    return HttpResponse.json({
      data: paginated,
      total: filtered.length,
      page,
      pageSize,
    })
  }),

  http.get('/api/transactions/flagged/:id', async ({ params }) => {
    await delay(150)
    const db = getDb()
    const tx = db.transactions.find(t => t.id === params.id)
    if (!tx) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(tx)
  }),

  http.post('/api/transactions/:id/confirm-fraud', async ({ params }) => {
    await delay(400)
    const db = getDb()
    const txIndex = db.transactions.findIndex(t => t.id === params.id)
    if (txIndex === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })

    db.transactions[txIndex] = {
      ...db.transactions[txIndex],
      vectorFeedbackStatus: 'SUBMITTED',
    }
    db.confirmedIds.add(params.id as string)
    saveDb(db)

    return HttpResponse.json({ success: true, status: 'SUBMITTED' })
  }),

  http.get('/api/analytics/summary', async () => {
    await delay(200)
    const db = getDb()
    const today = new Date().toDateString()
    const todayTxs = db.transactions.filter(t => new Date(t.timestamp).toDateString() === today)

    const breakdown: Record<string, number> = {
      HIGH_VELOCITY: 0,
      DAILY_LIMIT_EXCEEDED: 0,
      GEO_VELOCITY: 0,
      INTELLIGENT_ANOMALY: 0,
    }

    todayTxs.forEach(t => { breakdown[t.reason]++ })

    const avgRisk = todayTxs.length > 0 ? todayTxs.reduce((sum, t) => sum + t.riskScore, 0) / todayTxs.length : 0

    return HttpResponse.json({
      totalFlaggedToday: todayTxs.length,
      breakdownByRule: breakdown,
      averageRiskScore: Math.round(avgRisk * 100) / 100,
      ahnlichP99Latency: 6.2,
    })
  }),

  http.get('/api/analytics/timeseries', async () => {
    await delay(200)
    const db = getDb()
    const buckets: { timestamp: string; count: number }[] = []
    const now = new Date()

    for (let i = 23; i >= 0; i--) {
      const hourStart = new Date(now)
      hourStart.setHours(now.getHours() - i, 0, 0, 0)
      const hourEnd = new Date(hourStart)
      hourEnd.setHours(hourStart.getHours() + 1)

      const count = db.transactions.filter(t => {
        const ts = new Date(t.timestamp)
        return ts >= hourStart && ts < hourEnd
      }).length

      buckets.push({
        timestamp: hourStart.toISOString(),
        count,
      })
    }

    return HttpResponse.json(buckets)
  }),

  http.get('/api/export/csv', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    let db = getDb()
    let filtered = db.transactions

    if (startDate) {
      const start = new Date(startDate)
      filtered = filtered.filter(t => new Date(t.timestamp) >= start)
    }
    if (endDate) {
      const end = new Date(endDate)
      filtered = filtered.filter(t => new Date(t.timestamp) <= end)
    }

    const headers = 'transactionId,userId,reason,riskScore,aiConfidenceScore,aiExplanation,timestamp,amount,merchant,latitude,longitude\n'
    const rows = filtered.map(t =>
      `${t.transactionId},${t.userId},${t.reason},${t.riskScore},${t.aiConfidenceScore ?? ''},"${(t.aiExplanation || '').replace(/"/g, '""')}",${t.timestamp},${t.amount},${t.merchant},${t.location.latitude},${t.location.longitude}`
    ).join('\n')

    return new HttpResponse(headers + rows, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="fraud-export-${Date.now()}.csv"`,
      },
    })
  }),
]

export { getDb, saveDb }
