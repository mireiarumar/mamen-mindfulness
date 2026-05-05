import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { config } from '../config'
import { supabase } from '../lib/supabase'
import { usePlayer } from '../contexts/PlayerContext'
import type { Meditacion } from '../types/database'
import { CardSkeleton } from '../components/Skeleton'
import { formatDuracion } from '../lib/format'

export default function Home() {
  const [destacadas, setDestacadas] = useState<Meditacion[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { play, current, isPlaying, toggle } = usePlayer()

  useEffect(() => {
    let cancelled = false
    supabase
      .from('meditaciones')
      .select('*')
      .eq('activa', true)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setError(error.message)
        else setDestacadas(data ?? [])
      })
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <section className="px-5 pt-6 pb-8">
        <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-card mb-6">
          <img
            src={config.heroImageUrl}
            alt={config.brand.name}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="tag mb-3">Mindfulness · Liderazgo consciente</span>
        <h1 className="text-2xl leading-tight font-semibold mb-3 mt-2">
          Gestión emocional y mindfulness para entornos de alta presión
        </h1>
        <p className="text-base text-[var(--color-text)]/70 leading-relaxed mb-5">
          Ingeniera. Experta en estrés y liderazgo consciente. Sin espiritualidad innecesaria.
        </p>
        <div className="flex flex-col gap-2">
          <Link to="/meditaciones" className="btn-primary text-center">
            Empezar a meditar
          </Link>
          <Link to="/cursos" className="btn-ghost text-center">
            Ver cursos
          </Link>
        </div>
      </section>

      <section className="px-5 pb-8 space-y-3">
        <QuickAccessCard
          to="/meditaciones"
          title="Meditaciones"
          description="Audios guiados para cualquier momento."
          color="primary"
        />
        <QuickAccessCard
          to="/cursos"
          title="Cursos"
          description="Para particulares y para empresas."
          color="accent"
        />
        <QuickAccessCard
          to="/eventos"
          title="Eventos"
          description="Próximos encuentros y sesiones."
          color="primary-light"
        />
      </section>

      <section className="px-5 pb-12">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-0.5">Meditaciones recientes</h2>
            <p className="text-sm text-[var(--color-text)]/60">
              Elige la que encaje con tu momento.
            </p>
          </div>
          <Link
            to="/meditaciones"
            className="text-sm font-medium text-[var(--color-primary)] hover:underline whitespace-nowrap"
          >
            Ver todas →
          </Link>
        </div>

        {error && (
          <div className="card p-4 text-sm text-red-700 bg-red-50">
            No se pudieron cargar las meditaciones: {error}
          </div>
        )}

        {!error && destacadas === null && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {!error && destacadas && destacadas.length === 0 && (
          <div className="card p-6 text-center text-[var(--color-text)]/60">
            Aún no hay meditaciones publicadas.
          </div>
        )}

        {!error && destacadas && destacadas.length > 0 && (
          <div className="space-y-3">
            {destacadas.map(m => {
              const isCurrent = current?.id === m.id
              return (
                <article key={m.id} className="card p-4 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="tag">{m.categoria}</span>
                    {m.duracion_minutos != null && (
                      <span className="text-xs text-[var(--color-text)]/50">
                        {formatDuracion(m.duracion_minutos)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-base font-semibold mb-1">{m.titulo}</h3>
                  {m.descripcion && (
                    <p className="text-sm text-[var(--color-text)]/70 mb-3 line-clamp-2">
                      {m.descripcion}
                    </p>
                  )}
                  <div>
                    <button
                      onClick={() => (isCurrent ? toggle() : play(m))}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      {isCurrent && isPlaying ? (
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
    </>
  )
}

function QuickAccessCard({
  to, title, description, color,
}: {
  to: string
  title: string
  description: string
  color: 'primary' | 'primary-light' | 'accent'
}) {
  const colorMap = {
    primary: 'bg-[var(--color-primary)] text-white',
    'primary-light': 'bg-[var(--color-primary-light)] text-white',
    accent: 'bg-[var(--color-accent)] text-white',
  }
  return (
    <Link
      to={to}
      className="card p-4 hover:shadow-md transition-shadow group flex items-center gap-4"
    >
      <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${colorMap[color]}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-base font-semibold mb-0.5 group-hover:text-[var(--color-primary)] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-[var(--color-text)]/65">{description}</p>
      </div>
    </Link>
  )
}
