import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Curso } from '../../types/database'
import Modal from '../../components/admin/Modal'
import FileOrUrlInput from '../../components/admin/FileOrUrlInput'

interface FormState {
  titulo: string
  descripcion: string
  tipo: 'particular' | 'empresa'
  modalidad: 'Presencial' | 'Online' | 'Ambas'
  duracion: string
  imagen_url: string
  whatsapp_mensaje: string
  activo: boolean
  orden: string
}

const empty: FormState = {
  titulo: '', descripcion: '', tipo: 'particular', modalidad: 'Online',
  duracion: '', imagen_url: '', whatsapp_mensaje: '', activo: true, orden: '0',
}

export default function AdminCursos() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; editing: Curso | null }>({ open: false, editing: null })
  const [form, setForm] = useState<FormState>(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('cursos').select('*').order('orden')
    setCursos(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setForm(empty)
    setModal({ open: true, editing: null })
    setError(null)
  }

  function openEdit(c: Curso) {
    setForm({
      titulo: c.titulo,
      descripcion: c.descripcion ?? '',
      tipo: c.tipo,
      modalidad: c.modalidad,
      duracion: c.duracion ?? '',
      imagen_url: c.imagen_url ?? '',
      whatsapp_mensaje: c.whatsapp_mensaje ?? '',
      activo: c.activo,
      orden: c.orden.toString(),
    })
    setModal({ open: true, editing: c })
    setError(null)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion || null,
      tipo: form.tipo,
      modalidad: form.modalidad,
      duracion: form.duracion || null,
      imagen_url: form.imagen_url || null,
      whatsapp_mensaje: form.whatsapp_mensaje || null,
      activo: form.activo,
      orden: parseInt(form.orden || '0', 10),
    }
    const { error } = modal.editing
      ? await supabase.from('cursos').update(payload).eq('id', modal.editing.id)
      : await supabase.from('cursos').insert(payload)
    setSaving(false)
    if (error) { setError(error.message); return }
    setModal({ open: false, editing: null })
    load()
  }

  async function remove(c: Curso) {
    if (!confirm(`¿Eliminar "${c.titulo}"?`)) return
    const { error } = await supabase.from('cursos').delete().eq('id', c.id)
    if (error) alert(error.message)
    else load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Cursos</h1>
        <button onClick={openNew} className="btn-primary">+ Nuevo</button>
      </div>

      {loading ? (
        <div className="card p-6 text-sm text-[var(--color-text)]/60">Cargando…</div>
      ) : cursos.length === 0 ? (
        <div className="card p-6 text-sm text-[var(--color-text)]/60">Aún no hay cursos.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Título</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Modalidad</th>
                  <th className="px-4 py-3 font-medium">Orden</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {cursos.map(c => (
                  <tr key={c.id} className="border-t border-black/5">
                    <td className="px-4 py-3 font-medium">{c.titulo}</td>
                    <td className="px-4 py-3 text-[var(--color-text)]/65">
                      {c.tipo === 'empresa' ? 'Empresa' : 'Particular'}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text)]/65">{c.modalidad}</td>
                    <td className="px-4 py-3 text-[var(--color-text)]/65">{c.orden}</td>
                    <td className="px-4 py-3">
                      <span className={c.activo ? 'tag' : 'text-xs px-2 py-1 rounded-full bg-black/10 text-[var(--color-text)]/60'}>
                        {c.activo ? 'Activo' : 'Oculto'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(c)} className="btn-ghost text-sm">Editar</button>
                      <button onClick={() => remove(c)} className="text-sm text-red-600 hover:underline px-2">
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
        title={modal.editing ? 'Editar curso' : 'Nuevo curso'}
        footer={
          <>
            <button
              type="button"
              onClick={() => setModal({ open: false, editing: null })}
              className="btn-ghost"
            >
              Cancelar
            </button>
            <button form="curso-form" type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="curso-form" onSubmit={save} className="space-y-4">
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
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select
                value={form.tipo}
                onChange={e => setForm({ ...form, tipo: e.target.value as FormState['tipo'] })}
                className="input"
              >
                <option value="particular">Particular</option>
                <option value="empresa">Empresa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Modalidad</label>
              <select
                value={form.modalidad}
                onChange={e => setForm({ ...form, modalidad: e.target.value as FormState['modalidad'] })}
                className="input"
              >
                <option value="Online">Online</option>
                <option value="Presencial">Presencial</option>
                <option value="Ambas">Ambas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Duración (texto libre)</label>
            <input
              value={form.duracion}
              onChange={e => setForm({ ...form, duracion: e.target.value })}
              className="input"
              placeholder='Ej: "8 sesiones", "2 días intensivos"'
            />
          </div>

          <FileOrUrlInput
            bucket="cursos"
            value={form.imagen_url}
            onChange={url => setForm({ ...form, imagen_url: url })}
            accept="image/*"
            label="Imagen (opcional)"
            placeholder="URL de la imagen o sube un archivo"
          />

          <div>
            <label className="block text-sm font-medium mb-1">Mensaje de WhatsApp predefinido</label>
            <textarea
              rows={2}
              value={form.whatsapp_mensaje}
              onChange={e => setForm({ ...form, whatsapp_mensaje: e.target.value })}
              className="input"
              placeholder='Ej: "Hola Mamen, querría más información sobre..."'
            />
          </div>

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
                  checked={form.activo}
                  onChange={e => setForm({ ...form, activo: e.target.checked })}
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
