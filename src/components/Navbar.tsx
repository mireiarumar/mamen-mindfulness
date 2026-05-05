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
    <header className="sticky top-0 z-30 bg-[var(--color-bg)]/90 backdrop-blur border-b border-black/5">
      <div className="px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-1.5 min-w-0" onClick={() => setOpen(false)}>
          <span className="font-serif text-base font-semibold text-[var(--color-primary)] truncate">
            {config.brand.name}
          </span>
          <span className="text-[11px] text-[var(--color-text)]/60 whitespace-nowrap">
            · {config.brand.tagline}
          </span>
        </Link>

        <button
          aria-label="Menú"
          className="p-2 -mr-2 rounded-lg hover:bg-black/5"
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
        <nav className="border-t border-black/5 bg-[var(--color-bg)]">
          <div className="px-4 py-2 flex flex-col">
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
