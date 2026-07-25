import { http, HttpResponse, delay } from 'msw'
import { seedTransactions } from './seed-data'
import type { FlaggedTransaction } from '@/shared/types/transaction'
import {
  generateTransaction,
  generateMockAnalytics,
  DEFAULT_RULES,
  DEFAULT_SIMULATOR_CONFIG,
  generateMockAIExplanation,
} from './analystSeed'
import type { Transaction, FraudRule, SimulatorConfig } from '@/shared/types/fraud'

const DB_KEY = 'fraudguard_mock_db'
const ANALYST_DB_KEY = 'fraudguard_analyst_mock_db'
const AUTH_DB_KEY = 'fraudguard_auth_mock_db'

type OldDb = { transactions: FlaggedTransaction[]; confirmedIds: Set<string> }
type AnalystDb = {
  transactions: Transaction[]
  rules: FraudRule[]
  simulatorConfig: SimulatorConfig
  aiExplanations: Record<string, ReturnType<typeof generateMockAIExplanation>>
}
type AuthDb = Record<string, { email: string; name: string; role: string; password: string; otp?: string }>

function getOldDb(): OldDb {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  const seed = seedTransactions(50)
  const db = { transactions: seed, confirmedIds: new Set<string>() }
  saveOldDb(db)
  return db
}

function saveOldDb(db: OldDb) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

function getAnalystDb(): AnalystDb {
  try {
    const raw = localStorage.getItem(ANALYST_DB_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  const transactions = Array.from({ length: 50 }, (_, i) => generateTransaction(i))
  const db: AnalystDb = {
    transactions,
    rules: DEFAULT_RULES.map((r) => ({ ...r })),
    simulatorConfig: { ...DEFAULT_SIMULATOR_CONFIG },
    aiExplanations: {},
  }
  saveAnalystDb(db)
  return db
}

function saveAnalystDb(db: AnalystDb) {
  localStorage.setItem(ANALYST_DB_KEY, JSON.stringify(db))
}

function getAuthDb(): AuthDb {
  try {
    const raw = localStorage.getItem(AUTH_DB_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return {}
}

function saveAuthDb(db: AuthDb) {
  localStorage.setItem(AUTH_DB_KEY, JSON.stringify(db))
}

export const handlers = [
  http.post('/auth/register', async ({ request }) => {
    await delay(300)
    const body = await request.json() as { email: string; name: string; role: string }
    const db = getAuthDb()

    if (db[body.email]) {
      return HttpResponse.json({ message: 'Email already registered' }, { status: 409 })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    db[body.email] = { email: body.email, name: body.name, role: body.role, password: '', otp }
    saveAuthDb(db)

    return HttpResponse.json({ message: 'OTP sent to email', email: body.email, otp }, { status: 201 })
  }),

  http.post('/auth/verify-otp', async ({ request }) => {
    await delay(200)
    const body = await request.json() as { email: string; otp: string }
    const db = getAuthDb()
    const user = db[body.email]

    if (!user) return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    if (user.otp !== body.otp) return HttpResponse.json({ message: 'Invalid OTP' }, { status: 400 })

    return HttpResponse.json({ message: 'OTP verified', email: body.email })
  }),

  http.post('/auth/set-password', async ({ request }) => {
    await delay(200)
    const body = await request.json() as { email: string; password: string }
    const db = getAuthDb()
    const user = db[body.email]

    if (!user) return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    if (!user.otp) return HttpResponse.json({ message: 'OTP not verified' }, { status: 400 })

    user.password = body.password
    user.otp = undefined
    saveAuthDb(db)

    return HttpResponse.json({ message: 'Password set successfully', email: body.email })
  }),

http.post('/auth/logout', async ({ request }) => {
    await delay(200)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return HttpResponse.json({ message: 'Logged out successfully' })
  }),

  http.post('/auth/login', async ({ request }) => {
    await delay(300)
    const body = await request.json() as { email: string; password: string }
    const email = body.email
    const db = getAuthDb()
    const registeredUser = db[email]

    let role: string
    if (registeredUser && registeredUser.password === body.password) {
      role = registeredUser.role
    } else {
      if (email.includes('admin') || email.includes('compliance')) {
        role = 'COMPLIANCE_OFFICER'
      } else if (email.includes('analyst') || email.includes('fraud')) {
        role = 'FRAUD_ANALYST'
      } else if (email.includes('dev') || email.includes('developer') || email.includes('backend')) {
        role = 'BACKEND_DEVELOPER'
      } else {
        role = 'FRAUD_ANALYST'
      }
    }

    return HttpResponse.json({
      accessToken: `mock-access-token-${email}`,
      refreshToken: `mock-refresh-token-${email}`,
      user: { id: '1', email, name: registeredUser?.name || email.split('@')[0], role },
    })
  }),

  http.get('/auth/me', async ({ request }) => {
    await delay(100)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')
    const email = token.replace('mock-access-token-', '')
    const db = getAuthDb()
    const registeredUser = db[email]

    const roleMap: Record<string, string> = {
      'mock-access-token-admin@fraudguard.com': 'COMPLIANCE_OFFICER',
      'mock-access-token-analyst@fraudguard.com': 'FRAUD_ANALYST',
      'mock-access-token-dev@fraudguard.com': 'BACKEND_DEVELOPER',
    }
    const role = registeredUser?.role || roleMap[token]
    if (!role) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    return HttpResponse.json({ id: '1', email, name: registeredUser?.name || role, role })
  }),

  http.get('/api/transactions/flagged', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const ruleType = url.searchParams.get('ruleType') as FlaggedTransaction['reason'] | undefined
    const minRiskScore = url.searchParams.get('minRiskScore') ? parseFloat(url.searchParams.get('minRiskScore')!) : undefined

    let db = getOldDb()
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
    const db = getOldDb()
    const tx = db.transactions.find(t => t.id === params.id)
    if (!tx) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(tx)
  }),

  http.post('/api/transactions/:id/confirm-fraud', async ({ params }) => {
    await delay(400)
    const db = getOldDb()
    const txIndex = db.transactions.findIndex(t => t.id === params.id)
    if (txIndex === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })

    db.transactions[txIndex] = {
      ...db.transactions[txIndex],
      vectorFeedbackStatus: 'SUBMITTED',
    }
    db.confirmedIds.add(params.id as string)
    saveOldDb(db)

    return HttpResponse.json({ success: true, status: 'SUBMITTED' })
  }),

  http.get('/api/analytics/summary', async () => {
    await delay(200)
    const db = getOldDb()
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
    const db = getOldDb()
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

    let db = getOldDb()
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

  http.get('/api/transactions', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const db = getAnalystDb()
    const sorted = [...db.transactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    return HttpResponse.json(sorted.slice(0, limit))
  }),

  http.get('/api/analytics', async () => {
    await delay(200)
    const db = getAnalystDb()
    const result = generateMockAnalytics(db.transactions)
    return HttpResponse.json(result)
  }),

  http.get('/api/rules', async () => {
    await delay(150)
    const db = getAnalystDb()
    return HttpResponse.json(db.rules)
  }),

  http.put('/api/rules/:id', async ({ params, request }) => {
    await delay(200)
    const db = getAnalystDb()
    const index = db.rules.findIndex(r => r.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    const updated = await request.json() as FraudRule
    db.rules[index] = updated
    saveAnalystDb(db)
    return HttpResponse.json(updated)
  }),

  http.post('/api/simulator/config', async ({ request }) => {
    await delay(150)
    const db = getAnalystDb()
    const patch = await request.json() as Partial<SimulatorConfig>
    db.simulatorConfig = { ...db.simulatorConfig, ...patch }
    saveAnalystDb(db)
    return HttpResponse.json(db.simulatorConfig)
  }),

  http.post('/api/fraud/ai-explain', async ({ request }) => {
    await delay(400)
    const body = await request.json() as { transactionId: string }
    const db = getAnalystDb()
    const txIndex = db.transactions.findIndex(t => t.id === body.transactionId)
    if (txIndex === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })

    const explanation = generateMockAIExplanation(db.transactions[txIndex])
    db.aiExplanations[body.transactionId] = explanation
    db.transactions[txIndex] = { ...db.transactions[txIndex], aiExplanation: explanation }
    saveAnalystDb(db)
    return HttpResponse.json(explanation)
  }),

  http.post('/api/feedback', async ({ request }) => {
    await delay(300)
    const body = await request.json() as { transactionId: string; status: 'CONFIRMED_FRAUD' | 'FALSE_POSITIVE' }
    const db = getAnalystDb()
    const txIndex = db.transactions.findIndex(t => t.id === body.transactionId)
    if (txIndex === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })

    db.transactions[txIndex] = { ...db.transactions[txIndex], feedbackStatus: body.status }
    saveAnalystDb(db)
    return HttpResponse.json(db.transactions[txIndex])
  }),

  http.get('/api/export/transactions', async () => {
    await delay(300)
    const db = getAnalystDb()
    const headers = 'id,timestamp,amount,currency,accountId,accountName,cardLast4,merchant,merchantCategory,location.city,location.country,deviceFingerprint,ipAddress,cardType,isInternational,isCardNotPresent,status,riskScore,riskLevel,triggeredRules,latencyMs,feedbackStatus\n'
    const rows = db.transactions.map(t =>
      `${t.id},"${t.timestamp}",${t.amount},${t.currency},${t.accountId},"${t.accountName}","${t.cardLast4}","${t.merchant}",${t.merchantCategory},"${t.location.city}","${t.location.country}","${t.deviceFingerprint}","${t.ipAddress}","${t.cardType}",${t.isInternational},${t.isCardNotPresent},${t.status},${t.riskScore},${t.riskLevel},"${t.triggeredRules.join(';')}",${t.latencyMs},${t.feedbackStatus ?? ''}`
    ).join('\n')
    return new HttpResponse(headers + rows, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="fraudguard-transactions-${Date.now()}.csv"`,
      },
    })
  }),

  http.get('/api/stream/transactions', async () => {
    const db = getAnalystDb()
    const controller = new ReadableStream({
      start(controller) {
        const { speedMs, isRunning } = db.simulatorConfig
        if (!isRunning) return

        const interval = setInterval(() => {
          const tx = generateTransaction(Date.now())
          db.transactions.unshift(tx)
          if (db.transactions.length > 500) db.transactions.pop()
          saveAnalystDb(db)

          const data = `data: ${JSON.stringify(tx)}\n\n`
          controller.enqueue(new TextEncoder().encode(data))
        }, speedMs)

        return () => clearInterval(interval)
      },
    })

    return new HttpResponse(controller, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  }),
]

export { getOldDb, saveOldDb, getAnalystDb, saveAnalystDb }
