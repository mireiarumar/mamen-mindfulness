import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Categoria } from '../../types/database'
import Modal from '../../components/admin/Modal'

interface FormState {
  slug: string
  nombre: string
  orden: string
}

const empty: FormState = { slug: '', nombre: '', orden: '0' }

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminCategorias() {
  const [cats, setCats] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; editing: Categoria | null }>({ open: false, editing: null })
  const [form, setForm] = useState<FormState>(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('categorias').select('*').order('orden')
    setCats(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setForm(empty)
    setModal({ open: true, editing: null })
    setError(null)
  }

  function openEdit(c: Categoria) {
    setForm({ slug: c.slug, nombre: c.nombre, orden: c.orden.toString() })
    setModal({ open: true, editing: c })
    setError(null)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const slug = form.slug || slugify(form.nombre)
    if (!slug) { setError('Pon al menos un nombre'); setSaving(false); return }
    const payload = {
      slug,
      nombre: form.nombre,
      orden: parseInt(form.orden || '0', 10),
    }
    const { error } = modal.editing
      ? await supabase.from('categorias').update(payload).eq('id', modal.editing.id)
      : await supabase.from('categorias').insert(payload)
    setSaving(false)
    if (error) {
      setError(error.code === '23505' ? 'Ya existe una categoría con ese identificador' : error.message)
      return
    }
    setModal({ open: false, editing: null })
    load()
  }

  async function remove(c: Categoria) {
    if (!confirm(`¿Eliminar la categoría "${c.nombre}"? Las meditaciones que la usan no se borrarán pero conservarán el slug.`)) return
    const { error } = await supabase.from('categorias').delete().eq('id', c.id)
    if (error) alert(error.message)
    else load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Categorías</h1>
        <button onClick={openNew} className="btn-primary">+ Nueva</button>
      </div>

      <p className="text-sm text-[var(--color-text)]/60 mb-4 max-w-prose">
        Las categorías agrupan las meditaciones. El "identificador" es el valor que se guarda en cada
        meditación; si lo cambias, las meditaciones existentes seguirán apuntando al antiguo.
      </p>

      {loading ? (
        <div className="card p-6 text-sm text-[var(--color-text)]/60">Cargando…</div>
      ) : cats.length === 0 ? (
        <div className="card p-6 text-sm text-[var(--color-text)]/60">No hay categorías.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Identificador</th>
                  <th className="px-4 py-3 font-medium">Orden</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {cats.map(c => (
                  <tr key={c.id} className="border-t border-black/5">
                    <td className="px-4 py-3 font-medium">{c.nombre}</td>
                    <td className="px-4 py-3 text-[var(--color-text)]/60 font-mono text-xs">{c.slug}</td>
                    <td className="px-4 py-3 text-[var(--color-text)]/65">{c.orden}</td>
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
        title={modal.editing ? 'Editar categoría' : 'Nueva categoría'}
        footer={
          <>
            <button
              type="button"
              onClick={() => setModal({ open: false, editing: null })}
              className="btn-ghost"
            >
              Cancelar
            </button>
            <button form="cat-form" type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="cat-form" onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input
              required
              value={form.nombre}
              onChange={e => {
                const nombre = e.target.value
                setForm(f => ({
                  ...f,
                  nombre,
                  slug: f.slug && modal.editing ? f.slug : slugify(nombre),
                }))
              }}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Identificador</label>
            <input
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              className="input font-mono text-sm"
              placeholder="auto desde el nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Orden</label>
            <input
              type="number"
              value={form.orden}
              onChange={e => setForm({ ...form, orden: e.target.value })}
              className="input"
            />
          </div>
          {error && <div className="text-sm text-red-600 bg-red-50 rounded p-3">{error}</div>}
        </form>
      </Modal>
    </div>
  )
}
