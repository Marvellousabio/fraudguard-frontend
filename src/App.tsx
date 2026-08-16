import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/useAuthStore'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'
import ProfileSettingsPage from '@/features/auth/ProfileSettingsPage'
import AnalystDashboard from '@/features/dashboard/AnalystDashboard'
import ComplianceDashboard from '@/features/dashboard/ComplianceDashboard'
import DeveloperDashboard from '@/features/dashboard/DeveloperDashboard'
import LandingPage from '@/features/landing/LandingPage'

const roleToPath: Record<string, string> = {
  FRAUD_ANALYST: 'analyst',
  COMPLIANCE_OFFICER: 'compliance',
  BACKEND_DEVELOPER: 'developer',
}

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles: string[] }) {
  const { role } = useAuthStore()
  if (!role) return <Navigate to="/dashboard/analyst" replace />
  if (!roles.includes(role)) return <Navigate to="/dashboard/analyst" replace />
  return <>{children}</>
}

export default function App() {
  const { role } = useAuthStore()
  const dashboardPath = role ? roleToPath[role] : 'analyst'

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={role ? <Navigate to={`/dashboard/${dashboardPath}`} replace /> : <LoginPage />} />
      <Route path="/register" element={role ? <Navigate to={`/dashboard/${dashboardPath}`} replace /> : <RegisterPage />} />
      <Route path="/profile" element={<ProtectedRoute roles={['FRAUD_ANALYST', 'COMPLIANCE_OFFICER', 'BACKEND_DEVELOPER']}><ProfileSettingsPage /></ProtectedRoute>} />
      <Route path="/dashboard/analyst" element={<ProtectedRoute roles={['FRAUD_ANALYST']}><AnalystDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/compliance" element={<ProtectedRoute roles={['COMPLIANCE_OFFICER']}><ComplianceDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/developer" element={<ProtectedRoute roles={['BACKEND_DEVELOPER']}><DeveloperDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
