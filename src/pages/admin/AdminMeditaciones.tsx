import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Categoria, Meditacion } from '../../types/database'
import Modal from '../../components/admin/Modal'
import FileOrUrlInput from '../../components/admin/FileOrUrlInput'

interface FormState {
  titulo: string
  descripcion: string
  categoria: string
  duracion_minutos: string
  url_audio: string
  activa: boolean
  orden: string
}

const empty: FormState = {
  titulo: '', descripcion: '', categoria: 'general',
  duracion_minutos: '', url_audio: '', activa: true, orden: '0',
}

export default function AdminMeditaciones() {
  const [meds, setMeds] = useState<Meditacion[]>([])
  const [cats, setCats] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; editing: Meditacion | null }>({ open: false, editing: null })
  const [form, setForm] = useState<FormState>(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const [{ data: m }, { data: c }] = await Promise.all([
      supabase.from('meditaciones').select('*').order('orden'),
      supabase.from('categorias').select('*').order('orden'),
    ])
    setMeds(m ?? [])
    setCats(c ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setForm({ ...empty, categoria: cats[0]?.slug ?? 'general' })
    setModal({ open: true, editing: null })
    setError(null)
  }

  function openEdit(m: Meditacion) {
    setForm({
      titulo: m.titulo,
      descripcion: m.descripcion ?? '',
      categoria: m.categoria,
      duracion_minutos: m.duracion_minutos?.toString() ?? '',
      url_audio: m.url_audio,
      activa: m.activa,
      orden: m.orden.toString(),
    })
    setModal({ open: true, editing: m })
    setError(null)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!form.url_audio) { setError('La URL del audio es obligatoria'); return }
    setSaving(true)
    setError(null)
    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion || null,
      categoria: form.categoria,
      duracion_minutos: form.duracion_minutos ? parseInt(form.duracion_minutos, 10) : null,
      url_audio: form.url_audio,
      activa: form.activa,
      orden: parseInt(form.orden || '0', 10),
    }
    const { error } = modal.editing
      ? await supabase.from('meditaciones').update(payload).eq('id', modal.editing.id)
      : await supabase.from('meditaciones').insert(payload)
    setSaving(false)
    if (error) { setError(error.message); return }
    setModal({ open: false, editing: null })
    load()
  }

  async function remove(m: Meditacion) {
    if (!confirm(`¿Eliminar "${m.titulo}"? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('meditaciones').delete().eq('id', m.id)
    if (error) alert(error.message)
    else load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Meditaciones</h1>
        <button onClick={openNew} className="btn-primary">+ Nueva</button>
      </div>

      {loading ? (
        <div className="card p-6 text-sm text-[var(--color-text)]/60">Cargando…</div>
      ) : meds.length === 0 ? (
        <div className="card p-6 text-sm text-[var(--color-text)]/60">Aún no hay meditaciones.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Título</th>
                  <th className="px-4 py-3 font-medium">Categoría</th>
                  <th className="px-4 py-3 font-medium">Duración</th>
                  <th className="px-4 py-3 font-medium">Orden</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {meds.map(m => (
                  <tr key={m.id} className="border-t border-black/5">
                    <td className="px-4 py-3 font-medium">{m.titulo}</td>
                    <td className="px-4 py-3 text-[var(--color-text)]/65">{m.categoria}</td>
                    <td className="px-4 py-3 text-[var(--color-text)]/65">
                      {m.duracion_minutos != null ? `${m.duracion_minutos} min` : '—'}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text)]/65">{m.orden}</td>
                    <td className="px-4 py-3">
                      <span className={m.activa ? 'tag' : 'text-xs px-2 py-1 rounded-full bg-black/10 text-[var(--color-text)]/60'}>
                        {m.activa ? 'Activa' : 'Oculta'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(m)} className="btn-ghost text-sm">Editar</button>
                      <button onClick={() => remove(m)} className="text-sm text-red-600 hover:underline px-2">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, editing: null })}
        title={modal.editing ? 'Editar meditación' : 'Nueva meditación'}
        footer={
          <>
            <button
              type="button"
              onClick={() => setModal({ open: false, editing: null })}
              className="btn-ghost"
            >
              Cancelar
            </button>
            <button form="med-form" type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="med-form" onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título *</label>
            <input
              required
              value={form.titulo}
              onChange={e => setForm({ ...form, titulo: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              rows={3}
              value={form.descripcion}
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
              className="input"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <select
                value={form.categoria}
                onChange={e => setForm({ ...form, categoria: e.target.value })}
                className="input"
              >
                {cats.map(c => (
                  <option key={c.slug} value={c.slug}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duración (minutos)</label>
              <input
                type="number" min={0}
                value={form.duracion_minutos}
                onChange={e => setForm({ ...form, duracion_minutos: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <FileOrUrlInput
            bucket="meditaciones"
            value={form.url_audio}
            onChange={url => setForm({ ...form, url_audio: url })}
            accept="audio/*"
            label="Audio MP3 *"
            placeholder="URL del audio o sube un archivo"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Orden</label>
              <input
                type="number"
                value={form.orden}
                onChange={e => setForm({ ...form, orden: e.target.value })}
                className="input"
              />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.activa}
                  onChange={e => setForm({ ...form, activa: e.target.checked })}
                  className="w-4 h-4 accent-[var(--color-primary)]"
                />
                <span className="text-sm">Visible en la web pública</span>
              </label>
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 rounded p-3">{error}</div>}
        </form>
      </Modal>
    </div>
  )
}
