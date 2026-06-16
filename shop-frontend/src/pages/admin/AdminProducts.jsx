import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'

const empty = { category_id: '', gender: 'unisex', name: '', description: '', price: '', stock: '', image_url: '', is_active: true }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)

  const load = async (p = page) => {
    setLoading(true)
    const [prod, cats] = await Promise.all([
      api.get(`/admin/products?page=${p}`),
      api.get('/categories'),
    ])
    setProducts(prod.data.data)
    setMeta(prod.data)
    setCategories(cats.data.data)
    setLoading(false)
  }

  useEffect(() => { load(page) }, [page])

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = p => { setEditing(p.id); setForm({ ...p, category_id: p.category_id ?? '' }); setModal(true) }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) await api.put(`/admin/products/${editing}`, form)
      else await api.post('/admin/products', form)
      setModal(false)
      load(page)
    } catch (err) {
      alert(Object.values(err.response?.data?.errors ?? {}).flat().join('\n') || 'Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async id => {
    if (!confirm('¿Desactivar este producto?')) return
    await api.delete(`/admin/products/${id}`)
    load(page)
  }

  const field = (label, children) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  )

  const inputCls = "w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-0.5">Gestión</p>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: 'Playfair Display, serif' }}>Productos</h1>
        </div>
        <button onClick={openCreate}
          className="px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
          + Nuevo producto
        </button>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div className="bg-white border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Producto', 'Categoría', 'Precio', 'Stock', 'Estado', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 flex-shrink-0 overflow-hidden">
                          {p.image_url
                            ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">□</div>
                          }
                        </div>
                        <span className="font-semibold text-black">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{p.category?.name ?? '–'}</td>
                    <td className="px-5 py-3.5 font-bold text-black">Gs. {parseFloat(p.price).toLocaleString('es')}</td>
                    <td className="px-5 py-3.5 text-gray-500">{p.stock}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${p.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {p.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-4 justify-end">
                        <button onClick={() => openEdit(p)} className="text-xs font-bold uppercase tracking-wide text-amber-600 hover:text-amber-800 transition-colors">Editar</button>
                        <button onClick={() => handleDelete(p.id)} className="text-xs font-bold uppercase tracking-wide text-red-500 hover:text-red-700 transition-colors">Desactivar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No hay productos aún.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {meta?.last_page > 1 && (
            <div className="flex justify-center gap-1 mt-5">
              {Array.from({ length: meta.last_page }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 text-sm font-medium transition-colors ${page === i + 1 ? 'bg-black text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-black'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-black mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
              {editing ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  {field('Nombre',
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className={inputCls} />
                  )}
                </div>
                <div>
                  {field('Categoría',
                    <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} required className={inputCls}>
                      <option value="">Seleccionar</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  {field('Precio (Gs.)',
                    <input type="number" step="1" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required className={inputCls} />
                  )}
                </div>
                <div>
                  {field('Stock',
                    <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required className={inputCls} />
                  )}
                </div>
                <div>
                  {field('Estado',
                    <select value={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.value === 'true' })} className={inputCls}>
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  )}
                </div>
                <div className="col-span-2">
                  {field('Sección / Género',
                    <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} required className={inputCls}>
                      <option value="unisex">Unisex (aparece en Hombre y Mujer)</option>
                      <option value="hombre">Hombre</option>
                      <option value="mujer">Mujer</option>
                    </select>
                  )}
                </div>
                <div className="col-span-2">
                  {field('URL de imagen',
                    <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className={inputCls} placeholder="https://..." />
                  )}
                </div>
                <div className="col-span-2">
                  {field('Descripción',
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className={inputCls} />
                  )}
                </div>
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
