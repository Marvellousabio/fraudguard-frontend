const isDev = import.meta.env.DEV
const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = isDev ? path : `${baseUrl}${path}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  const contentType = res.headers.get('content-type') || ''
  if (!res.ok || !contentType.includes('application/json')) {
    const text = await res.text()
    let message = 'Request failed'
    try {
      const json = JSON.parse(text)
      message = json.message || message
    } catch {
      message = text.slice(0, 120) || message
    }
    throw new Error(message)
  }

  return res
}

export function apiEventSource(path: string) {
  const url = isDev ? path : `${baseUrl}${path}`
  return new EventSource(url)
}
