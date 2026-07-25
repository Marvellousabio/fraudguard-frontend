import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiFetch } from '@/lib/api'
import { useAuthStore } from './useAuthStore'
import { BackendUnavailableBanner } from '@/features/analyst-dashboard/BackendUnavailableBanner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [backendDown, setBackendDown] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setBackendDown(false)

    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Invalid email or password')
      }

      const data = await res.json()
      setAuth(data.accessToken, data.user.role, data.user.name, data.user.id, data.refreshToken)
      const roleMap: Record<string, string> = {
        FRAUD_ANALYST: 'analyst',
        COMPLIANCE_OFFICER: 'compliance',
        BACKEND_DEVELOPER: 'developer',
      }
      const path = roleMap[data.user.role] || 'analyst'
      navigate(`/dashboard/${path}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      const lower = message.toLowerCase()
      if (
        lower.includes('502') ||
        lower.includes('bad gateway') ||
        lower.includes('failed to fetch') ||
        lower.includes('networkerror') ||
        lower.includes('network request')
      ) {
        setBackendDown(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-7 h-7 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">FraudGuard</CardTitle>
          <CardDescription className="text-center">Real-Time Fraud Detection System</CardDescription>
        </CardHeader>
        <CardContent>
          {backendDown && (
            <div className="mb-4">
              <BackendUnavailableBanner />
            </div>
          )}
          {error && !backendDown && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <p className="text-xs text-muted-foreground">
                Backend requires a valid email address (e.g. analyst@fraudguard.com)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                minLength={1}
              />
              <p className="text-xs text-muted-foreground">
                Backend requires a non-empty password string
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Don't have an account? <Link to="/register" className="text-primary hover:underline">Create one</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}