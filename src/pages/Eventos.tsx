import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Evento } from '../types/database'
import { CardSkeleton } from '../components/Skeleton'
import { config } from '../config'
import { buildWhatsappUrl, formatFechaCorta, formatFechaLarga, isPasado } from '../lib/format'

export default function Eventos() {
  const [eventos, setEventos] = useState<Evento[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [emailNl, setEmailNl] = useState('')
  const [nlEstado, setNlEstado] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [nlMensaje, setNlMensaje] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    supabase
      .from('eventos')
      .select('*')
      .eq('activo', true)
      .order('fecha', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setError(error.message)
        else setEventos(data ?? [])
      })
    return () => { cancelled = true }
  }, [])

  const { proximos, pasados } = useMemo(() => {
    const all = eventos ?? []
    const proximos = all.filter(e => !isPasado(e.fecha)).sort((a, b) => +new Date(a.fecha) - +new Date(b.fecha))
    const pasados = all.filter(e => isPasado(e.fecha)).sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha))
    return { proximos, pasados }
  }, [eventos])

  async function suscribir(e: React.FormEvent) {
    e.preventDefault()
    if (!emailNl) return
    setNlEstado('loading')
    setNlMensaje('')
    const { error } = await supabase.from('newsletter').insert({ email: emailNl })
    if (error) {
      setNlEstado('error')
      setNlMensaje(
        error.code === '23505'
          ? 'Este email ya está suscrito. ¡Gracias!'
          : 'No hemos podido suscribirte. Inténtalo más tarde.',
      )
      if (error.code === '23505') setNlEstado('ok')
    } else {
      setNlEstado('ok')
      setEmailNl('')
      setNlMensaje('¡Listo! Te avisaremos cuando haya nuevos eventos.')
    }
  }

  return (
    <section className="px-5 pt-6 pb-8">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold mb-1">Eventos</h1>
        <p className="text-sm text-[var(--color-text)]/65">
          Encuentros, retiros y sesiones presenciales y online.
        </p>
      </header>

      {error && (
        <div className="card p-4 text-sm text-red-700 bg-red-50 mb-4">
          No se pudieron cargar los eventos: {error}
        </div>
      )}

      {!error && eventos === null && (
        <div className="space-y-3">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {!error && eventos && proximos.length === 0 && (
        <NewsletterEmpty
          email={emailNl}
          setEmail={setEmailNl}
          onSubmit={suscribir}
          estado={nlEstado}
          mensaje={nlMensaje}
        />
      )}

      {proximos.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3 mt-1 text-[var(--color-text)]/80">
            Próximos eventos
          </h2>
          <div className="space-y-3 mb-8">
            {proximos.map(ev => <EventoCard key={ev.id} ev={ev} grande />)}
          </div>
        </>
      )}

      {pasados.length > 0 && (
        <>
          <h2 className="text-base font-semibold mb-2 text-[var(--color-text)]/60">Eventos pasados</h2>
          <div className="space-y-2">
            {pasados.map(ev => <EventoCard key={ev.id} ev={ev} grande={false} />)}
          </div>
        </>
      )}
    </section>
  )
}

function EventoCard({ ev, grande }: { ev: Evento; grande: boolean }) {
  const inscripcionUrl = useInscripcionUrl(ev)
  const fecha = grande ? formatFechaLarga(ev.fecha) : formatFechaCorta(ev.fecha)
  return (
    <article className={`card flex flex-col ${grande ? '' : 'opacity-80'}`}>
      {grande && ev.imagen_url && (
        <div className="aspect-[16/9] bg-black/5 overflow-hidden">
          <img src={ev.imagen_url} alt={ev.titulo} loading="lazy" className="w-full h-full object-cover" />
        </div>
      )}
      <div className={`${grande ? 'p-4' : 'p-3'} flex flex-col flex-1`}>
        <div className="text-xs uppercase tracking-wide text-[var(--color-primary)] font-semibold mb-1">
          {fecha}
        </div>
        <h3 className={`font-serif font-semibold mb-1 ${grande ? 'text-xl' : 'text-base'}`}>
          {ev.titulo}
        </h3>
        {ev.lugar && (
          <p className="text-xs text-[var(--color-text)]/55 mb-2">{ev.lugar}</p>
        )}
        {grande && ev.descripcion && (
          <p className="text-sm text-[var(--color-text)]/70 mb-4 leading-relaxed">
            {ev.descripcion}
          </p>
        )}
        {grande && inscripcionUrl && (
          <div className="mt-auto pt-2">
            <a
              href={inscripcionUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              Inscribirme
            </a>
          </div>
        )}
      </div>
    </article>
  )
}

function useInscripcionUrl(ev: Evento): string | null {
  if (!ev.tipo_inscripcion || !ev.url_inscripcion) return null
  if (ev.tipo_inscripcion === 'whatsapp') {
    const num = ev.url_inscripcion.replace(/\D/g, '') || config.contact.whatsappE164
    return buildWhatsappUrl(num, `Hola Mamen, me gustaría inscribirme en "${ev.titulo}".`)
  }
  if (ev.tipo_inscripcion === 'email') {
    const subject = encodeURIComponent(`Inscripción a ${ev.titulo}`)
    return `mailto:${ev.url_inscripcion}?subject=${subject}`
  }
  return ev.url_inscripcion
}

function NewsletterEmpty({
  email, setEmail, onSubmit, estado, mensaje,
}: {
  email: string
  setEmail: (s: string) => void
  onSubmit: (e: React.FormEvent) => void
  estado: 'idle' | 'loading' | 'ok' | 'error'
  mensaje: string
}) {
  return (
    <div className="card p-6 text-center">
      <h2 className="font-serif text-xl font-semibold mb-2">
        Aún no hay eventos próximos
      </h2>
      <p className="text-sm text-[var(--color-text)]/65 mb-5">
        Déjanos tu email y te avisaremos cuando publiquemos nuevas fechas.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          required
          placeholder="tucorreo@ejemplo.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input flex-1"
        />
        <button
          type="submit"
          disabled={estado === 'loading' || estado === 'ok'}
          className="btn-primary"
        >
          {estado === 'loading' ? 'Enviando…' : estado === 'ok' ? 'Suscrito' : 'Suscribirme'}
        </button>
      </form>
      {mensaje && (
        <p className={`text-sm mt-3 ${estado === 'error' ? 'text-red-600' : 'text-[var(--color-primary)]'}`}>
          {mensaje}
        </p>
      )}
    </div>
  )
}
