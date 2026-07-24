import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/shared/types/transaction'

interface AuthState {
  token: string | null
  role: UserRole | null
  name: string | null
  setAuth: (token: string, role: UserRole, name: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      name: null,
      setAuth: (token, role, name) => set({ token, role, name }),
      logout: () => set({ token: null, role: null, name: null }),
    }),
    {
      name: 'fraudguard-auth',
    }
  )
)
