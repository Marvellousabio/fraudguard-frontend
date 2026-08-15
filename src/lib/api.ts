import { useAuthStore } from '@/features/auth/useAuthStore'

const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function getUrl(path: string): string {
  if (baseUrl) return `${baseUrl}${path}`
  return path
}

function getAuthHeader(): Record<string, string> {
  const token = useAuthStore.getState().accessToken
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = getUrl(path)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
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
  const url = getUrl(path)
  return new EventSource(url)
}
