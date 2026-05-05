import { usePlayer } from '../contexts/PlayerContext'
import { formatTiempoAudio } from '../lib/format'

export default function MiniPlayer() {
  const p = usePlayer()
  if (!p.current) return null

  const progress = p.duration > 0 ? (p.currentTime / p.duration) * 100 : 0

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40 px-2 pb-2 pointer-events-none">
      <div className="pointer-events-auto bg-white shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.15)] rounded-2xl border border-black/5 animate-fade-in">
        <div className="px-4 sm:px-5 pt-3 pb-2">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] uppercase tracking-wide text-[var(--color-primary)]/80">
                Reproduciendo
              </div>
              <div className="font-medium text-sm sm:text-base truncate">{p.current.titulo}</div>
            </div>
            <button
              aria-label="Cerrar"
              onClick={p.close}
              className="text-[var(--color-text)]/40 hover:text-[var(--color-text)] p-1 rounded"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-5">
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
          <div className="flex justify-between text-xs text-[var(--color-text)]/60 mt-1">
            <span>{formatTiempoAudio(p.currentTime)}</span>
            <span>{formatTiempoAudio(p.duration)}</span>
          </div>
        </div>

        <div className="px-4 sm:px-5 pb-3 pt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <button
              aria-label="Retroceder 15 segundos"
              onClick={() => p.skip(-15)}
              className="w-10 h-10 rounded-full hover:bg-black/5 grid place-items-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 19 2 12 11 5 11 19" />
                <polygon points="22 19 13 12 22 5 22 19" />
              </svg>
            </button>
            <button
              aria-label={p.isPlaying ? 'Pausar' : 'Reproducir'}
              onClick={p.toggle}
              className="w-12 h-12 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white grid place-items-center shadow-md"
            >
              {p.isPlaying ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              )}
            </button>
            <button
              aria-label="Avanzar 15 segundos"
              onClick={() => p.skip(15)}
              className="w-10 h-10 rounded-full hover:bg-black/5 grid place-items-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 19 22 12 13 5 13 19" />
                <polygon points="2 19 11 12 2 5 2 19" />
              </svg>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-[160px]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 010 14.14" />
              <path d="M15.54 8.46a5 5 0 010 7.07" />
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={p.volume}
              onChange={e => p.setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1.5 accent-[var(--color-primary)]"
              aria-label="Volumen"
            />
          </div>

          <div className="text-[11px] tabular-nums text-[var(--color-text)]/40 sm:hidden">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  )
}
