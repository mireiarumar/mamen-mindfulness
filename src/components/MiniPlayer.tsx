import { usePlayer } from '../contexts/PlayerContext'

export default function MiniPlayer() {
  const p = usePlayer()
  if (!p.current || p.expanded) return null

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 px-2 pb-2 pointer-events-none">
      <div className="pointer-events-auto bg-white shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.15)] rounded-2xl border border-black/5 animate-fade-in flex items-center gap-3 px-3 py-2.5">
        <button
          onClick={p.expand}
          aria-label="Abrir reproductor"
          className="min-w-0 flex-1 flex items-center gap-3 text-left rounded-xl hover:bg-black/[0.02] -mx-1 px-1 py-0.5"
        >
          <div className="relative w-10 h-10 rounded-full grid place-items-center shrink-0 overflow-hidden"
               style={{ background: 'radial-gradient(circle at 30% 30%, var(--color-primary-light), var(--color-primary) 80%)' }}>
            <div className={`w-3 h-3 rounded-full bg-white/85 ${p.isPlaying ? 'breathe-core' : ''}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wide text-[var(--color-primary)]/80">
              {p.isPlaying ? 'Reproduciendo' : 'En pausa'}
            </div>
            <div className="font-medium text-sm truncate">{p.current.titulo}</div>
          </div>
        </button>
        <button
          aria-label={p.isPlaying ? 'Pausar' : 'Reproducir'}
          onClick={p.toggle}
          className="w-10 h-10 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white grid place-items-center shadow-md shrink-0"
        >
          {p.isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          )}
        </button>
        <button
          aria-label="Cerrar reproductor"
          onClick={p.close}
          className="w-8 h-8 rounded-full hover:bg-black/5 grid place-items-center text-[var(--color-text)]/45 shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
