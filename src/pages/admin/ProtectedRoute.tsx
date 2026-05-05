import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-[var(--color-text)]/60 text-sm">
        Cargando…
      </div>
    )
  }
  if (!session) return <Navigate to="/admin" replace />
  return <>{children}</>
}
