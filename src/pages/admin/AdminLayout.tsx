import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/meditaciones', label: 'Meditaciones' },
  { to: '/admin/cursos', label: 'Cursos' },
  { to: '/admin/eventos', label: 'Eventos' },
  { to: '/admin/categorias', label: 'Categorías' },
]

export default function AdminLayout() {
  const { signOut, session } = useAuth()
  const navigate = useNavigate()

  async function logout() {
    await signOut()
    navigate('/admin', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-black/5 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white grid place-items-center font-serif text-sm font-semibold">
              MF
            </div>
            <span className="font-medium text-sm">Panel de administración</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-[var(--color-text)]/50">
              {session?.user.email}
            </span>
            <button onClick={logout} className="btn-ghost text-sm">Salir</button>
          </div>
        </div>
        <nav className="border-t border-black/5">
          <div className="max-w-6xl mx-auto px-2 sm:px-6 flex gap-1 overflow-x-auto">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'border-transparent text-[var(--color-text)]/65 hover:text-[var(--color-text)]'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
