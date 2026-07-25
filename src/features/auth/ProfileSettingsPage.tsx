import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from './useAuthStore'
import { apiFetch } from '@/lib/api'
import { BackendUnavailableBanner } from '@/features/analyst-dashboard/BackendUnavailableBanner'
import { User, Mail, Shield, LogOut, ArrowLeft } from 'lucide-react'

export default function ProfileSettingsPage() {
  const { accessToken, name, role, userId, logout } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [backendDown, setBackendDown] = useState(false)
  const [displayName, setDisplayName] = useState(name ?? '')
  const [email, setEmail] = useState('')

  const handleSignout = async () => {
    setLoading(true)
    setError('')
    setBackendDown(false)

    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch {
      // Ignore logout API errors — clear local state regardless
    } finally {
      logout()
      navigate('/login')
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setBackendDown(false)

    try {
      const res = await apiFetch('/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to update profile')
      }

      const data = await res.json()
      setDisplayName(data.name)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Update failed'
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

  const roleLabel: Record<string, string> = {
    FRAUD_ANALYST: 'Fraud Analyst',
    COMPLIANCE_OFFICER: 'Compliance Officer',
    BACKEND_DEVELOPER: 'Backend Developer',
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard/analyst" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <CardTitle className="text-2xl text-center flex-1">Profile Settings</CardTitle>
            <div className="w-5" />
          </div>
          <CardDescription className="text-center">Manage your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {backendDown && (
            <div className="mb-2">
              <BackendUnavailableBanner />
            </div>
          )}

          {error && !backendDown && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{displayName || 'User'}</p>
              <p className="text-sm text-muted-foreground">{email || 'Not set'}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Account Details</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" /> User ID
                </span>
                <span className="font-mono text-xs">{userId ?? 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </span>
                <span className="font-mono text-xs">{email || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Role
                </span>
                <Badge variant="secondary">{roleLabel[role ?? ''] ?? role}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Danger Zone</h3>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleSignout}
              disabled={loading}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {loading ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}