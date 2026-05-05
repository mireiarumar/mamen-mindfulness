import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !anon) {
  console.error(
    '[Supabase] Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. ' +
      'Copia .env.example a .env y rellena los valores.',
  )
}

export const supabase = createClient(url ?? 'http://invalid', anon ?? 'invalid', {
  auth: { persistSession: true, autoRefreshToken: true },
})

export const STORAGE_BUCKETS = {
  meditaciones: 'meditaciones',
  cursos: 'cursos',
  eventos: 'eventos',
} as const

export async function uploadToBucket(
  bucket: keyof typeof STORAGE_BUCKETS,
  file: File,
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'bin'
  const safe = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60) || 'archivo'
  const path = `${Date.now()}-${safe}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
