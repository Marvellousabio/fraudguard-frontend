import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'
import ProfileSettingsPage from '@/features/auth/ProfileSettingsPage'
import AnalystDashboard from '@/features/dashboard/AnalystDashboard'
import ComplianceDashboard from '@/features/dashboard/ComplianceDashboard'
import DeveloperDashboard from '@/features/dashboard/DeveloperDashboard'
import LandingPage from '@/features/landing/LandingPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Navigate to="/dashboard/analyst" replace />} />
      <Route path="/profile" element={<ProfileSettingsPage />} />
      <Route path="/dashboard/analyst" element={<AnalystDashboard />} />
      <Route path="/dashboard/compliance" element={<ComplianceDashboard />} />
      <Route path="/dashboard/developer" element={<DeveloperDashboard />} />
      <Route path="*" element={<Navigate to="/dashboard/analyst" replace />} />
    </Routes>
  )
}
