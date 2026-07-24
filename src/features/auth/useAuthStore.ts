import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/shared/types/transaction'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  role: UserRole | null
  name: string | null
  userId: string | null
  setAuth: (accessToken: string, role: UserRole, name: string, userId?: string, refreshToken?: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      role: null,
      name: null,
      userId: null,
      setAuth: (accessToken, role, name, userId, refreshToken) => set({
        accessToken,
        refreshToken: refreshToken ?? null,
        role,
        name,
        userId: userId ?? null,
      }),
      logout: () => set({ accessToken: null, refreshToken: null, role: null, name: null, userId: null }),
    }),
    {
      name: 'fraudguard-auth',
    }
  )
)