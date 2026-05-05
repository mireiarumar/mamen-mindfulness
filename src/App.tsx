import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PlayerProvider } from './contexts/PlayerContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Meditaciones from './pages/Meditaciones'
import Cursos from './pages/Cursos'
import Eventos from './pages/Eventos'
import AdminLogin from './pages/admin/Login'
import AdminLayout from './pages/admin/AdminLayout'
import ProtectedRoute from './pages/admin/ProtectedRoute'
import Dashboard from './pages/admin/Dashboard'
import AdminMeditaciones from './pages/admin/AdminMeditaciones'
import AdminCursos from './pages/admin/AdminCursos'
import AdminEventos from './pages/admin/AdminEventos'
import AdminCategorias from './pages/admin/AdminCategorias'

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="meditaciones" element={<Meditaciones />} />
            <Route path="cursos" element={<Cursos />} />
            <Route path="eventos" element={<Eventos />} />
          </Route>

          <Route path="admin" element={<AdminLogin />} />
          <Route
            path="admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="meditaciones" element={<AdminMeditaciones />} />
            <Route path="cursos" element={<AdminCursos />} />
            <Route path="eventos" element={<AdminEventos />} />
            <Route path="categorias" element={<AdminCategorias />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PlayerProvider>
    </AuthProvider>
  )
}
