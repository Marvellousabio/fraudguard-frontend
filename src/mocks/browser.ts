import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' })),
]

export const worker = null as any
