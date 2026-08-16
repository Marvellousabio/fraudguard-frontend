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
