const MOCK_PATTERNS = ['test', 'demo', 'admin', 'analyst', 'compliance', 'dev', 'developer', 'backend']

function isMockSession() {
  try {
    const raw = localStorage.getItem('fraudguard-auth')
    if (!raw) return false
    const parsed = JSON.parse(raw)
    const token = parsed?.state?.accessToken || ''
    if (!token.startsWith('mock-access-token-')) return false
    const email = token.replace('mock-access-token-', '')
    const lower = email.toLowerCase()
    return MOCK_PATTERNS.some(p => lower.includes(p))
  } catch {
    return false
  }
}

function mockResponse(path: string): Response {
  const url = new URL(path, 'http://localhost')

  if (url.pathname === '/auth/me') {
    return new Response(
      JSON.stringify({
        id: '1',
        email: 'test@fraudguard.com',
        name: 'Test User',
        role: 'FRAUD_ANALYST',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (url.pathname === '/api/analytics/summary') {
    return new Response(
      JSON.stringify({
        totalFlaggedToday: 12,
        breakdownByRule: {
          HIGH_VELOCITY: 3,
          DAILY_LIMIT_EXCEEDED: 2,
          GEO_VELOCITY: 1,
          INTELLIGENT_ANOMALY: 6,
        },
        averageRiskScore: 0.82,
        ahnlichP99Latency: 6.2,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (url.pathname === '/api/analytics/timeseries') {
    const buckets = Array.from({ length: 24 }, (_, i) => {
      const d = new Date()
      d.setHours(d.getHours() - 23 + i, 0, 0, 0)
      return { timestamp: d.toISOString(), count: Math.floor(Math.random() * 5) }
    })
    return new Response(JSON.stringify(buckets), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (url.pathname.startsWith('/api/transactions/flagged')) {
    const txs = Array.from({ length: 10 }, (_, i) => ({
      id: `tx-mock-${i}`,
      transactionId: `TXN-${1000 + i}`,
      userId: 'USR_001',
      reason: ['HIGH_VELOCITY', 'GEO_VELOCITY', 'INTELLIGENT_ANOMALY'][i % 3],
      riskScore: 0.5 + Math.random() * 0.5,
      aiConfidenceScore: 0.8 + Math.random() * 0.2,
      aiExplanation: null,
      metadata: {},
      vectorFeedbackStatus: 'PENDING',
      timestamp: new Date().toISOString(),
      amount: 100 + Math.random() * 4900,
      merchant: ['Amazon', 'Uber', 'Starbucks', 'Apple', 'Nike'][i % 5],
      location: { latitude: 40.7, longitude: -74.0 },
    }))
    if (url.pathname.includes('/')) {
      const id = url.pathname.split('/').pop()
      const tx = txs.find(t => t.id === id) || txs[0]
      return new Response(JSON.stringify(tx), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    const page = Number(url.searchParams.get('page') || 1)
    const pageSize = Number(url.searchParams.get('pageSize') || 20)
    return new Response(
      JSON.stringify({
        data: txs.slice(0, pageSize),
        total: txs.length,
        page,
        pageSize,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (url.pathname === '/api/transactions') {
    const txs = Array.from({ length: 50 }, (_, i) => ({
      id: `tx-mock-${i}`,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      amount: 100 + Math.random() * 4900,
      currency: 'USD',
      accountId: 'ACC_001',
      accountName: 'Test Account',
      cardLast4: '4242',
      merchant: ['Amazon', 'Uber', 'Starbucks', 'Apple', 'Nike'][i % 5],
      merchantCategory: 5999,
      location: { city: 'New York', country: 'US' },
      deviceFingerprint: `FP_${i}`,
      ipAddress: '192.168.1.1',
      cardType: 'VISA',
      isInternational: false,
      isCardNotPresent: true,
      status: ['APPROVED', 'FLAGGED', 'BLOCKED'][i % 3],
      riskScore: Math.round(Math.random() * 100),
      riskLevel: ['LOW', 'MEDIUM', 'HIGH'][i % 3],
      triggeredRules: ['HIGH_VELOCITY'],
      latencyMs: 20 + Math.random() * 80,
      feedbackStatus: null,
    }))
    const limit = Number(url.searchParams.get('limit') || 100)
    return new Response(JSON.stringify(txs.slice(0, limit)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (url.pathname === '/api/rules') {
    return new Response(
      JSON.stringify([
        { id: '1', name: 'High Velocity', description: 'Too many transactions', isActive: true, threshold: 10 },
        { id: '2', name: 'Geo Velocity', description: 'Impossible travel', isActive: true, threshold: 1000 },
      ]),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (url.pathname.startsWith('/api/rules/')) {
    return new Response(
      JSON.stringify({ id: '1', name: 'High Velocity', description: 'Too many transactions', isActive: true, threshold: 10 }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (url.pathname === '/api/simulator/config') {
    return new Response(
      JSON.stringify({ speedMs: 1000, isRunning: false }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (url.pathname === '/api/fraud/ai-explain') {
    return new Response(
      JSON.stringify({
        transactionId: 'tx-1',
        aiExplanation: 'Semantic similarity analysis detected a high-risk pattern.',
        confidence: 0.95,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (url.pathname === '/api/feedback') {
    return new Response(
      JSON.stringify({ success: true, status: 'SUBMITTED' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (url.pathname === '/api/export/csv' || url.pathname === '/api/export/transactions') {
    return new Response(
      'id,transactionId,reason,riskScore,timestamp,amount,merchant\n',
      {
        status: 200,
        headers: { 'Content-Type': 'text/csv' },
      }
    )
  }

  if (url.pathname === '/api/stream/transactions') {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('data: {"id":"tx-1","timestamp":"' + new Date().toISOString() + '"}\n\n'))
        controller.close()
      },
    })
    return new Response(stream, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    })
  }

  return new Response(JSON.stringify({ message: 'Mock not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function initOfflineBypass() {
  const originalFetch = window.fetch
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    let path: string
    if (typeof input === 'string') {
      path = input
    } else if (input instanceof URL) {
      path = input.pathname
    } else {
      path = new URL(input.url).pathname
    }

    if (path.startsWith('/auth/') || path.startsWith('/api/') || path.startsWith('/socket.io/')) {
      if (isMockSession()) {
        return mockResponse(path)
      }
    }
    return originalFetch(input, init)
  }
}
