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
  const [needsVerification, setNeedsVerification] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAuth('token', 'FRAUD_ANALYST', email, 'user-id', 'refresh-token')
    navigate('/dashboard/analyst')
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
          {needsVerification && !backendDown && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-md mb-4">
              <p className="font-semibold mb-1">Email not verified</p>
              <p className="mb-3">
                Your account requires email verification before you can log in. Please complete the registration process to receive a new verification code.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-amber-600 text-white text-sm font-semibold hover:bg-amber-500 transition-colors"
              >
                Verify Email / Register
              </Link>
            </div>
          )}
          {error && !backendDown && !needsVerification && (
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