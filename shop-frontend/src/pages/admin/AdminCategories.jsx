import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '' })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await api.get('/categories')
    setCategories(data.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm({ name: '' }); setModal(true) }
  const openEdit = c => { setEditing(c.id); setForm({ name: c.name }); setModal(true) }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) await api.put(`/admin/categories/${editing}`, form)
      else await api.post('/admin/categories', form)
      setModal(false)
      load()
    } catch (err) {
      alert(Object.values(err.response?.data?.errors ?? {}).flat().join('\n') || 'Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async id => {
    if (!confirm('¿Eliminar esta categoría?')) return
    await api.delete(`/admin/categories/${id}`)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-0.5">Gestión</p>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: 'Playfair Display, serif' }}>Categorías</h1>
        </div>
        <button onClick={openCreate}
          className="px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
          + Nueva categoría
        </button>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Nombre', 'Slug', 'Productos activos', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-black">{c.name}</td>
                  <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">{c.slug}</td>
                  <td className="px-5 py-3.5 text-gray-500">{c.products_count ?? 0}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-4 justify-end">
                      <button onClick={() => openEdit(c)} className="text-xs font-bold uppercase tracking-wide text-amber-600 hover:text-amber-800 transition-colors">Editar</button>
                      <button onClick={() => handleDelete(c.id)} className="text-xs font-bold uppercase tracking-wide text-red-500 hover:text-red-700 transition-colors">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">
                    No hay categorías aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-sm p-7">
            <h2 className="text-lg font-bold text-black mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
              {editing ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nombre</label>
                <input value={form.name} onChange={e => setForm({ name: e.target.value })} required
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2.5 text-xs font-bold uppercase tracking-wide hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-black text-white py-2.5 text-xs font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
