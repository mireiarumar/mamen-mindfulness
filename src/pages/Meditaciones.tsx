import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { usePlayer } from '../contexts/PlayerContext'
import type { Categoria, Meditacion } from '../types/database'
import { GridSkeleton } from '../components/Skeleton'
import { formatDuracion } from '../lib/format'

export default function Meditaciones() {
  const [meds, setMeds] = useState<Meditacion[] | null>(null)
  const [cats, setCats] = useState<Categoria[]>([])
  const [filtro, setFiltro] = useState<string>('todas')
  const [busqueda, setBusqueda] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { play, current, isPlaying, toggle } = usePlayer()

  useEffect(() => {
    let cancelled = false
    Promise.all([
      supabase.from('meditaciones').select('*').eq('activa', true).order('orden'),
      supabase.from('categorias').select('*').order('orden'),
    ]).then(([m, c]) => {
      if (cancelled) return
      if (m.error) setError(m.error.message)
      else setMeds(m.data ?? [])
      if (!c.error) setCats(c.data ?? [])
    })
    return () => { cancelled = true }
  }, [])

  const filtradas = useMemo(() => {
    if (!meds) return []
    const term = busqueda.trim().toLowerCase()
    return meds.filter(m => {
      if (filtro !== 'todas' && m.categoria !== filtro) return false
      if (term && !m.titulo.toLowerCase().includes(term)) return false
      return true
    })
  }, [meds, filtro, busqueda])

  const categoriasMostradas = useMemo(() => {
    if (cats.length > 0) return cats
    const slugs = Array.from(new Set((meds ?? []).map(m => m.categoria)))
    return slugs.map(s => ({ id: s, slug: s, nombre: capitalize(s.replace(/-/g, ' ')), orden: 0, created_at: '' } as Categoria))
  }, [cats, meds])

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-2">Meditaciones</h1>
        <p className="text-[var(--color-text)]/65 max-w-2xl">
          Audios guiados para practicar mindfulness en cualquier momento del día.
        </p>
      </header>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text)]/40"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por título…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      <div className="mb-6 -mx-1 flex flex-wrap gap-2">
        <CategoriaChip activa={filtro === 'todas'} onClick={() => setFiltro('todas')}>
          Todas
        </CategoriaChip>
        {categoriasMostradas.map(c => (
          <CategoriaChip key={c.slug} activa={filtro === c.slug} onClick={() => setFiltro(c.slug)}>
            {c.nombre}
          </CategoriaChip>
        ))}
      </div>

      {error && (
        <div className="card p-4 text-sm text-red-700 bg-red-50 mb-4">
          No se pudieron cargar las meditaciones: {error}
        </div>
      )}

      {!error && meds === null && <GridSkeleton count={9} />}

      {!error && meds && filtradas.length === 0 && (
        <div className="card p-8 text-center text-[var(--color-text)]/60">
          No hay meditaciones que coincidan con tu búsqueda.
        </div>
      )}

      {filtradas.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtradas.map(m => {
            const isCurrent = current?.id === m.id
            const playing = isCurrent && isPlaying
            return (
              <article key={m.id} className="card p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="tag">{nombreCategoria(m.categoria, categoriasMostradas)}</span>
                  {m.duracion_minutos != null && (
                    <span className="text-xs text-[var(--color-text)]/50">
                      {formatDuracion(m.duracion_minutos)}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">{m.titulo}</h3>
                {m.descripcion && (
                  <p className="text-sm text-[var(--color-text)]/70 mb-4 line-clamp-3">
                    {m.descripcion}
                  </p>
                )}
                <div className="mt-auto pt-2">
                  <button
                    onClick={() => (isCurrent ? toggle() : play(m))}
                    className={`btn-primary inline-flex items-center gap-2 ${playing ? 'bg-[var(--color-primary)]/85' : ''}`}
                  >
                    {playing ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="5" width="4" height="14" rx="1" />
                          <rect x="14" y="5" width="4" height="14" rx="1" />
                        </svg>
                        Pausar
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="6 4 20 12 6 20 6 4" />
                        </svg>
                        Reproducir
                      </>
                    )}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

function CategoriaChip({
  activa, onClick, children,
}: { activa: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
        activa
          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
          : 'bg-white text-[var(--color-text)]/75 border-black/8 hover:border-[var(--color-primary)]/40'
      }`}
    >
      {children}
    </button>
  )
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

function nombreCategoria(slug: string, cats: Categoria[]) {
  return cats.find(c => c.slug === slug)?.nombre ?? capitalize(slug.replace(/-/g, ' '))
}
