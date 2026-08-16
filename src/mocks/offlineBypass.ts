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
      return mockResponse(path)
    }
    return originalFetch(input, init)
  }
}

