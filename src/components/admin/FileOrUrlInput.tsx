import { useState } from 'react'
import { uploadToBucket, STORAGE_BUCKETS } from '../../lib/supabase'

interface Props {
  bucket: keyof typeof STORAGE_BUCKETS
  value: string
  onChange: (url: string) => void
  accept?: string
  label?: string
  placeholder?: string
}

export default function FileOrUrlInput({
  bucket, value, onChange, accept, label, placeholder,
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadToBucket(bucket, file)
      onChange(url)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error subiendo archivo')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? 'https://...'}
          className="input flex-1"
        />
        <label className={`btn-ghost border border-[var(--color-primary)]/30 cursor-pointer text-center text-sm ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {uploading ? 'Subiendo…' : 'Subir archivo'}
          <input type="file" accept={accept} className="hidden" onChange={onFile} />
        </label>
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
      {value && (
        <div className="text-xs text-[var(--color-text)]/50 truncate">URL: {value}</div>
      )}
    </div>
  )
}
