import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Meditacion } from '../types/database'

interface PlayerState {
  current: Meditacion | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  expanded: boolean
}

interface PlayerContextValue extends PlayerState {
  play: (m: Meditacion) => void
  toggle: () => void
  pause: () => void
  seek: (segundos: number) => void
  skip: (delta: number) => void
  setVolume: (v: number) => void
  close: () => void
  expand: () => void
  collapse: () => void
  audioRef: React.RefObject<HTMLAudioElement>
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [current, setCurrent] = useState<Meditacion | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration || 0)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const play = useCallback((m: Meditacion) => {
    const audio = audioRef.current
    if (!audio) return
    if (current?.id === m.id) {
      audio.play().catch(() => {})
      setExpanded(true)
      return
    }
    setCurrent(m)
    setCurrentTime(0)
    setDuration(0)
    audio.src = m.url_audio
    audio.load()
    audio.play().catch(() => {})
    setExpanded(true)
  }, [current?.id])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !current) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }, [current])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const seek = useCallback((segundos: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(segundos, audio.duration || 0))
  }, [])

  const skip = useCallback((delta: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + delta, audio.duration || 0))
  }, [])

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current
    if (!audio) return
    const clamped = Math.max(0, Math.min(1, v))
    audio.volume = clamped
    setVolumeState(clamped)
  }, [])

  const close = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
    setCurrent(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setExpanded(false)
  }, [])

  const expand = useCallback(() => setExpanded(true), [])
  const collapse = useCallback(() => setExpanded(false), [])

  const value = useMemo<PlayerContextValue>(() => ({
    current, isPlaying, currentTime, duration, volume, expanded,
    play, toggle, pause, seek, skip, setVolume, close, expand, collapse, audioRef,
  }), [current, isPlaying, currentTime, duration, volume, expanded,
      play, toggle, pause, seek, skip, setVolume, close, expand, collapse])

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer debe usarse dentro de PlayerProvider')
  return ctx
}
