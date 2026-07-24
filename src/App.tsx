import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/useAuthStore'
import LoginPage from '@/features/auth/LoginPage'
import AnalystDashboard from '@/features/dashboard/AnalystDashboard'
import ComplianceDashboard from '@/features/dashboard/ComplianceDashboard'
import DeveloperDashboard from '@/features/dashboard/DeveloperDashboard'

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles: string[] }) {
  const { role } = useAuthStore()
  if (!role) return <Navigate to="/login" replace />
  if (!roles.includes(role)) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { role } = useAuthStore()

  return (
    <Routes>
      <Route path="/login" element={role ? <Navigate to={`/dashboard/${role.toLowerCase()}`} replace /> : <LoginPage />} />
      <Route path="/dashboard/analyst" element={<ProtectedRoute roles={['FRAUD_ANALYST']}><AnalystDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/compliance" element={<ProtectedRoute roles={['COMPLIANCE_OFFICER']}><ComplianceDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/developer" element={<ProtectedRoute roles={['BACKEND_DEVELOPER']}><DeveloperDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
