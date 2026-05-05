import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { config } from '../config'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/meditaciones', label: 'Meditaciones' },
  { to: '/cursos', label: 'Cursos' },
  { to: '/eventos', label: 'Eventos' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-[var(--color-bg)]/85 backdrop-blur border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2 group" onClick={() => setOpen(false)}>
          <span className="font-serif text-lg sm:text-xl font-semibold text-[var(--color-primary)]">
            {config.brand.name}
          </span>
          <span className="hidden sm:inline text-sm text-[var(--color-text)]/60">
            · {config.brand.tagline}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                    : 'text-[var(--color-text)]/70 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          aria-label="Menú"
          className="md:hidden p-2 rounded-lg hover:bg-black/5"
          onClick={() => setOpen(o => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-black/5 bg-[var(--color-bg)]">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-3 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                      : 'text-[var(--color-text)]/80 hover:bg-black/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
