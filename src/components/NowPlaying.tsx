import { useEffect } from 'react'
import { usePlayer } from '../contexts/PlayerContext'
import { formatTiempoAudio } from '../lib/format'
import BreathingCircle from './BreathingCircle'

export default function NowPlaying() {
  const p = usePlayer()

  useEffect(() => {
    if (!p.expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') p.collapse()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [p.expanded, p.collapse])

  if (!p.current || !p.expanded) return null

  return (
    <div
      className="fixed inset-x-0 top-0 bottom-0 z-50 flex justify-center pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-label="Reproduciendo meditación"
    >
      <div
        className="pointer-events-auto w-full max-w-[480px] flex flex-col animate-fade-in"
        style={{
          background:
            'linear-gradient(180deg, #F9F6F1 0%, #EFE9DD 55%, #E1E8DC 100%)',
        }}
      >
        <header className="flex items-center justify-between px-5 pt-5 pb-2">
          <button
            onClick={p.collapse}
            aria-label="Minimizar"
            className="p-2 -ml-2 rounded-full hover:bg-black/5 text-[var(--color-text)]/60"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-primary)]/80 font-medium">
            Reproduciendo
          </span>
          <button
            onClick={p.close}
            aria-label="Cerrar"
            className="p-2 -mr-2 rounded-full hover:bg-black/5 text-[var(--color-text)]/60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div className="flex-1 grid place-items-center px-6 py-4">
          <BreathingCircle size={260} showHint={p.isPlaying} />
        </div>

        <div className="px-6 pb-2 text-center">
          <span className="tag mb-3">{p.current.categoria}</span>
          <h2 className="font-serif text-2xl font-semibold mt-3 mb-2 leading-tight">
            {p.current.titulo}
          </h2>
          {p.current.descripcion && (
            <p className="text-sm text-[var(--color-text)]/65 leading-relaxed line-clamp-3">
              {p.current.descripcion}
            </p>
          )}
        </div>

        <div className="px-6 pt-3">
          <input
            type="range"
            min={0}
            max={p.duration || 1}
            step={0.1}
            value={p.currentTime}
            onChange={e => p.seek(parseFloat(e.target.value))}
            className="w-full h-1.5 accent-[var(--color-primary)] cursor-pointer"
            aria-label="Progreso"
          />
          <div className="flex justify-between text-xs text-[var(--color-text)]/55 mt-1.5 mb-4 tabular-nums">
            <span>{formatTiempoAudio(p.currentTime)}</span>
            <span>{formatTiempoAudio(p.duration)}</span>
          </div>
        </div>

        <div className="px-6 pb-8 flex items-center justify-center gap-6">
          <button
            aria-label="Retroceder 15 segundos"
            onClick={() => p.skip(-15)}
            className="w-12 h-12 rounded-full hover:bg-black/5 grid place-items-center text-[var(--color-text)]/70"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 19 2 12 11 5 11 19" />
              <polygon points="22 19 13 12 22 5 22 19" />
            </svg>
          </button>
          <button
            aria-label={p.isPlaying ? 'Pausar' : 'Reproducir'}
            onClick={p.toggle}
            className="w-16 h-16 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white grid place-items-center shadow-lg transition-transform active:scale-95"
          >
            {p.isPlaying ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            )}
          </button>
          <button
            aria-label="Avanzar 15 segundos"
            onClick={() => p.skip(15)}
            className="w-12 h-12 rounded-full hover:bg-black/5 grid place-items-center text-[var(--color-text)]/70"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 19 22 12 13 5 13 19" />
              <polygon points="2 19 11 12 2 5 2 19" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
