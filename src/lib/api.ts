const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

export function apiEventSource(path: string) {
  const url = `${BASE_URL}${path}`
  return new EventSource(url)
}
