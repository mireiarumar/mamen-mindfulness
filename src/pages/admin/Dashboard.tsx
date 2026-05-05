import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface Counts { meditaciones: number; cursos: number; eventos: number }

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      supabase.from('meditaciones').select('id', { count: 'exact', head: true }).eq('activa', true),
      supabase.from('cursos').select('id', { count: 'exact', head: true }).eq('activo', true),
      supabase.from('eventos').select('id', { count: 'exact', head: true }).eq('activo', true),
    ]).then(([m, c, e]) => {
      if (cancelled) return
      setCounts({
        meditaciones: m.count ?? 0,
        cursos: c.count ?? 0,
        eventos: e.count ?? 0,
      })
    })
    return () => { cancelled = true }
  }, [])

  const cards = [
    { to: '/admin/meditaciones', label: 'Meditaciones', value: counts?.meditaciones, action: 'Gestionar audios' },
    { to: '/admin/cursos', label: 'Cursos', value: counts?.cursos, action: 'Gestionar cursos' },
    { to: '/admin/eventos', label: 'Eventos', value: counts?.eventos, action: 'Gestionar eventos' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Resumen</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <Link to={c.to} key={c.to} className="card p-5 hover:shadow-md transition-shadow">
            <div className="text-xs uppercase tracking-wide text-[var(--color-text)]/50 mb-1">{c.label} activos</div>
            <div className="text-3xl font-serif font-semibold text-[var(--color-primary)] mb-2">
              {c.value ?? '—'}
            </div>
            <div className="text-sm text-[var(--color-text)]/65">{c.action} →</div>
          </Link>
        ))}
      </div>

      <div className="card p-5">
        <h2 className="font-serif text-lg font-semibold mb-2">Sugerencias rápidas</h2>
        <ul className="text-sm text-[var(--color-text)]/70 space-y-1.5 list-disc pl-5">
          <li>Completa la duración de cada meditación desde el listado.</li>
          <li>Añade nuevos audios al bucket "meditaciones" o pega URLs externas.</li>
          <li>Si organizas un evento, añádelo en la sección Eventos para que aparezca en la web pública.</li>
        </ul>
      </div>
    </div>
  )
}
