import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Curso } from '../types/database'
import { GridSkeleton } from '../components/Skeleton'
import { config } from '../config'
import { buildWhatsappUrl } from '../lib/format'

type Filtro = 'todos' | 'particular' | 'empresa'

export default function Cursos() {
  const [cursos, setCursos] = useState<Curso[] | null>(null)
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('cursos')
      .select('*')
      .eq('activo', true)
      .order('orden')
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setError(error.message)
        else setCursos(data ?? [])
      })
    return () => { cancelled = true }
  }, [])

  const filtrados = useMemo(() => {
    if (!cursos) return []
    if (filtro === 'todos') return cursos
    return cursos.filter(c => c.tipo === filtro)
  }, [cursos, filtro])

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-2">Cursos</h1>
        <p className="text-[var(--color-text)]/65 max-w-2xl">
          Programas para mejorar el bienestar personal y la cultura de tu organización.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        <Filtrar activo={filtro === 'todos'} onClick={() => setFiltro('todos')}>Todos</Filtrar>
        <Filtrar activo={filtro === 'particular'} onClick={() => setFiltro('particular')}>Para particulares</Filtrar>
        <Filtrar activo={filtro === 'empresa'} onClick={() => setFiltro('empresa')}>Para empresas</Filtrar>
      </div>

      {error && (
        <div className="card p-4 text-sm text-red-700 bg-red-50 mb-4">
          No se pudieron cargar los cursos: {error}
        </div>
      )}

      {!error && cursos === null && <GridSkeleton count={6} />}

      {!error && cursos && filtrados.length === 0 && (
        <div className="card p-8 text-center text-[var(--color-text)]/60">
          No hay cursos en esta categoría todavía.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filtrados.map(c => {
          const mensaje = c.whatsapp_mensaje?.trim() ||
            `Hola Mamen, querría más información sobre el curso "${c.titulo}".`
          const url = buildWhatsappUrl(config.contact.whatsappE164, mensaje)
          return (
            <article key={c.id} className="card flex flex-col">
              {c.imagen_url && (
                <div className="aspect-[16/9] bg-black/5 overflow-hidden">
                  <img
                    src={c.imagen_url}
                    alt={c.titulo}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="tag">{c.tipo === 'empresa' ? 'Empresas' : 'Particulares'}</span>
                  <span className="text-xs text-[var(--color-text)]/50">
                    {c.modalidad}{c.duracion ? ` · ${c.duracion}` : ''}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">{c.titulo}</h3>
                {c.descripcion && (
                  <p className="text-sm text-[var(--color-text)]/70 mb-4 leading-relaxed">
                    {c.descripcion}
                  </p>
                )}
                <div className="mt-auto pt-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    Más información
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function Filtrar({
  activo, onClick, children,
}: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
        activo
          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
          : 'bg-white text-[var(--color-text)]/75 border-black/8 hover:border-[var(--color-primary)]/40'
      }`}
    >
      {children}
    </button>
  )
}
