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
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 pb-12 sm:pb-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <span className="tag mb-4">Mindfulness · Liderazgo consciente</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl leading-tight font-semibold mb-4">
              Gestión emocional y mindfulness para entornos de alta presión
            </h1>
            <p className="text-base sm:text-lg text-[var(--color-text)]/70 leading-relaxed mb-6">
              Ingeniera. Experta en estrés y liderazgo consciente. Sin espiritualidad innecesaria.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/meditaciones" className="btn-primary">
                Empezar a meditar
              </Link>
              <Link to="/cursos" className="btn-ghost">
                Ver cursos
              </Link>
            </div>
          </div>

          <div className="order-first md:order-last">
            <div className="relative aspect-[4/5] max-w-sm mx-auto rounded-3xl overflow-hidden shadow-card">
              <img
                src={config.heroImageUrl}
                alt={`${config.brand.name}`}
                loading="eager"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
          <QuickAccessCard
            to="/meditaciones"
            title="Meditaciones"
            description="Audios guiados para practicar en cualquier momento."
            color="primary"
          />
          <QuickAccessCard
            to="/cursos"
            title="Cursos"
            description="Programas para particulares y para empresas."
            color="accent"
          />
          <QuickAccessCard
            to="/eventos"
            title="Eventos"
            description="Próximos encuentros, retiros y sesiones."
            color="primary-light"
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-1">Meditaciones recientes</h2>
            <p className="text-sm text-[var(--color-text)]/60">
              Elige la que mejor encaje con tu momento.
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {!error && destacadas && destacadas.length === 0 && (
          <div className="card p-8 text-center text-[var(--color-text)]/60">
            Aún no hay meditaciones publicadas.
          </div>
        )}

        {!error && destacadas && destacadas.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {destacadas.map(m => {
              const isCurrent = current?.id === m.id
              return (
                <article key={m.id} className="card p-5 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="tag">{m.categoria}</span>
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
                  <div className="mt-auto">
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
      className="card p-6 hover:shadow-md transition-shadow group"
    >
      <div className={`w-10 h-10 rounded-xl mb-4 grid place-items-center ${colorMap[color]}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
      <h3 className="font-serif text-xl font-semibold mb-1 group-hover:text-[var(--color-primary)] transition-colors">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text)]/65">{description}</p>
    </Link>
  )
}
