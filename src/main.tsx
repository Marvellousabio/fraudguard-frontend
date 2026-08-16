import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
// import { initMsw } from '@/mocks/worker'
// import { initOfflineBypass } from '@/mocks/offlineBypass'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

async function bootstrap() {
  // const useMocks = import.meta.env.VITE_MOCK_MODE !== 'false'

  // if (useMocks) {
  //   await initMsw()
  //   initOfflineBypass()
  // }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>,
  )
}

bootstrap()

