import { handlers } from './handlers'
import { setupWorker } from 'msw/browser'

export const worker = setupWorker(...handlers)

export async function initMsw() {
  if (import.meta.env.DEV) {
    await worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}
