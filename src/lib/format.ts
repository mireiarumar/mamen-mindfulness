export function formatDuracion(minutos: number | null | undefined): string {
  if (minutos == null) return ''
  if (minutos < 1) return '< 1 min'
  return `${minutos} min`
}

export function formatTiempoAudio(segundos: number): string {
  if (!isFinite(segundos) || segundos < 0) return '0:00'
  const m = Math.floor(segundos / 60)
  const s = Math.floor(segundos % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const MESES_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

export function formatFechaLarga(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const dia = d.getDate()
  const mes = MESES_ES[d.getMonth()]
  const anio = d.getFullYear()
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  const hasTime = hh !== '00' || mm !== '00'
  return hasTime
    ? `${dia} de ${mes} de ${anio} · ${hh}:${mm}`
    : `${dia} de ${mes} de ${anio}`
}

export function formatFechaCorta(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return `${d.getDate()} ${MESES_ES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`
}

export function isPasado(fechaIso: string): boolean {
  const d = new Date(fechaIso)
  return d.getTime() < Date.now()
}

export function buildWhatsappUrl(numeroE164: string, mensaje: string): string {
  const text = encodeURIComponent(mensaje)
  return `https://wa.me/${numeroE164}?text=${text}`
}
