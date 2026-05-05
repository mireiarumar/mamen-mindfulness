import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Evento } from '../../types/database'
import Modal from '../../components/admin/Modal'
import FileOrUrlInput from '../../components/admin/FileOrUrlInput'
import { formatFechaCorta, isPasado } from '../../lib/format'

interface FormState {
  titulo: string
  descripcion: string
  fecha: string
  lugar: string
  imagen_url: string
  tipo_inscripcion: '' | 'whatsapp' | 'email' | 'url'
  url_inscripcion: string
  activo: boolean
}

const empty: FormState = {
  titulo: '', descripcion: '', fecha: '', lugar: '', imagen_url: '',
  tipo_inscripcion: '', url_inscripcion: '', activo: true,
}

function toLocalDateTimeInput(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function AdminEventos() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; editing: Evento | null }>({ open: false, editing: null })
  const [form, setForm] = useState<FormState>(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('eventos').select('*').order('fecha', { ascending: false })
    setEventos(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setForm(empty)
    setModal({ open: true, editing: null })
    setError(null)
  }

  function openEdit(ev: Evento) {
    setForm({
      titulo: ev.titulo,
      descripcion: ev.descripcion ?? '',
      fecha: toLocalDateTimeInput(ev.fecha),
      lugar: ev.lugar ?? '',
      imagen_url: ev.imagen_url ?? '',
      tipo_inscripcion: ev.tipo_inscripcion ?? '',
      url_inscripcion: ev.url_inscripcion ?? '',
      activo: ev.activo,
    })
    setModal({ open: true, editing: ev })
    setError(null)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!form.fecha) { setError('La fecha es obligatoria'); return }
    setSaving(true)
    setError(null)
    const fechaIso = new Date(form.fecha).toISOString()
    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion || null,
      fecha: fechaIso,
      lugar: form.lugar || null,
      imagen_url: form.imagen_url || null,
      tipo_inscripcion: form.tipo_inscripcion || null,
      url_inscripcion: form.url_inscripcion || null,
      activo: form.activo,
    }
    const { error } = modal.editing
      ? await supabase.from('eventos').update(payload).eq('id', modal.editing.id)
      : await supabase.from('eventos').insert(payload)
    setSaving(false)
    if (error) { setError(error.message); return }
    setModal({ open: false, editing: null })
    load()
  }

  async function remove(ev: Evento) {
    if (!confirm(`¿Eliminar "${ev.titulo}"?`)) return
    const { error } = await supabase.from('eventos').delete().eq('id', ev.id)
    if (error) alert(error.message)
    else load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Eventos</h1>
        <button onClick={openNew} className="btn-primary">+ Nuevo</button>
      </div>

      {loading ? (
        <div className="card p-6 text-sm text-[var(--color-text)]/60">Cargando…</div>
      ) : eventos.length === 0 ? (
        <div className="card p-6 text-sm text-[var(--color-text)]/60">Aún no hay eventos.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Título</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Lugar</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {eventos.map(ev => (
                  <tr key={ev.id} className="border-t border-black/5">
                    <td className="px-4 py-3 font-medium">{ev.titulo}</td>
                    <td className="px-4 py-3 text-[var(--color-text)]/65">{formatFechaCorta(ev.fecha)}</td>
                    <td className="px-4 py-3 text-[var(--color-text)]/65">{ev.lugar ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        !ev.activo
                          ? 'bg-black/10 text-[var(--color-text)]/60'
                          : isPasado(ev.fecha)
                            ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                            : 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
                      }`}>
                        {!ev.activo ? 'Oculto' : isPasado(ev.fecha) ? 'Pasado' : 'Próximo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(ev)} className="btn-ghost text-sm">Editar</button>
                      <button onClick={() => remove(ev)} className="text-sm text-red-600 hover:underline px-2">
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
        title={modal.editing ? 'Editar evento' : 'Nuevo evento'}
        footer={
          <>
            <button
              type="button"
              onClick={() => setModal({ open: false, editing: null })}
              className="btn-ghost"
            >
              Cancelar
            </button>
            <button form="ev-form" type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="ev-form" onSubmit={save} className="space-y-4">
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
              <label className="block text-sm font-medium mb-1">Fecha y hora *</label>
              <input
                type="datetime-local"
                required
                value={form.fecha}
                onChange={e => setForm({ ...form, fecha: e.target.value })}
                className="input"
              />
              <p className="text-xs text-[var(--color-text)]/50 mt-1">
                Si la fecha es anterior a hoy, aparecerá en "Eventos pasados".
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lugar</label>
              <input
                value={form.lugar}
                onChange={e => setForm({ ...form, lugar: e.target.value })}
                className="input"
                placeholder='Ej: "Madrid", "Online"'
              />
            </div>
          </div>

          <FileOrUrlInput
            bucket="eventos"
            value={form.imagen_url}
            onChange={url => setForm({ ...form, imagen_url: url })}
            accept="image/*"
            label="Imagen (opcional)"
            placeholder="URL de la imagen o sube un archivo"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo de inscripción</label>
              <select
                value={form.tipo_inscripcion}
                onChange={e => setForm({ ...form, tipo_inscripcion: e.target.value as FormState['tipo_inscripcion'] })}
                className="input"
              >
                <option value="">Sin inscripción</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="url">Enlace externo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {form.tipo_inscripcion === 'whatsapp' ? 'Número (con código país)'
                  : form.tipo_inscripcion === 'email' ? 'Email de contacto'
                  : form.tipo_inscripcion === 'url' ? 'URL del formulario'
                  : 'Dato de contacto'}
              </label>
              <input
                value={form.url_inscripcion}
                onChange={e => setForm({ ...form, url_inscripcion: e.target.value })}
                className="input"
                disabled={!form.tipo_inscripcion}
              />
            </div>
          </div>

          <div>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={e => setForm({ ...form, activo: e.target.checked })}
                className="w-4 h-4 accent-[var(--color-primary)]"
              />
              <span className="text-sm">Visible en la web pública</span>
            </label>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 rounded p-3">{error}</div>}
        </form>
      </Modal>
    </div>
  )
}
