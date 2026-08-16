import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiFetch } from '@/lib/api'
import { useAuthStore } from './useAuthStore'
import { BackendUnavailableBanner } from '@/features/analyst-dashboard/BackendUnavailableBanner'

type Step = 'register' | 'verify-otp' | 'set-password' | 'success'

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('register')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<string>('FRAUD_ANALYST')
  const [otp, setOtp] = useState('')
  const [displayedOtp, setDisplayedOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [backendDown, setBackendDown] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)

  const handleBackendError = (err: unknown) => {
    const message = err instanceof Error ? err.message : 'Request failed'
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
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setBackendDown(false)

    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Registration failed')
      }

      const data = await res.json()
      setDisplayedOtp(data.otp)
      setStep('verify-otp')
    } catch (err) {
      handleBackendError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setBackendDown(false)

    try {
      const res = await apiFetch('/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Invalid OTP')
      }

      setStep('set-password')
    } catch (err) {
      handleBackendError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setBackendDown(false)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const res = await apiFetch('/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to set password')
      }

      setStep('success')
    } catch (err) {
      handleBackendError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAutoLogin = async () => {
    setLoading(true)
    setError('')
    setBackendDown(false)

    const roleMap: Record<string, string> = {
      FRAUD_ANALYST: 'analyst',
      COMPLIANCE_OFFICER: 'compliance',
      BACKEND_DEVELOPER: 'developer',
    }
    const path = roleMap[role] || 'analyst'
    setAuth('token', role, name, 'user-id', 'refresh-token')
    navigate(`/dashboard/${path}`)
  }

  useEffect(() => {
    if (step === 'success') {
      handleAutoLogin()
    }
  }, [step])

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
          <CardDescription className="text-center">
            {step === 'register' && 'Create your account'}
            {step === 'verify-otp' && 'Verify your email'}
            {step === 'set-password' && 'Set your password'}
            {step === 'success' && 'Registration complete'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {backendDown && (
            <div className="mb-4">
              <BackendUnavailableBanner />
            </div>
          )}

          {step === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {error && !backendDown && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FRAUD_ANALYST">Fraud Analyst</SelectItem>
                    <SelectItem value="COMPLIANCE_OFFICER">Compliance Officer</SelectItem>
                    <SelectItem value="BACKEND_DEVELOPER">Backend Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Continue'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
              </p>
            </form>
          )}

          {step === 'verify-otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {error && !backendDown && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground space-y-1">
                 <p>Enter the 6-digit OTP sent to <span className="font-semibold text-foreground">{email}</span></p>
                 <p className="font-mono text-foreground bg-background p-2 rounded text-center text-sm tracking-widest">{displayedOtp}</p>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="otp">One-Time Password</Label>
                 <Input
                   id="otp"
                   type="text"
                   placeholder="123456"
                   value={otp}
                   onChange={(e) => setOtp(e.target.value)}
                   required
                   maxLength={6}
                   autoComplete="off"
                 />
               </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <button
                type="button"
                onClick={() => setStep('register')}
                className="text-xs text-muted-foreground hover:text-foreground w-full text-center"
              >
                Change email
              </button>
            </form>
          )}

          {step === 'set-password' && (
            <form onSubmit={handleSetPassword} className="space-y-4">
              {error && !backendDown && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Setting password...' : 'Create Account'}
              </Button>
            </form>
          )}

          {step === 'success' && (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 w-16 h-16 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium">Account created successfully!</p>
              <Button onClick={handleAutoLogin} className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Continue to Dashboard'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
