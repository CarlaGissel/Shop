import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'

const empty = { name: '', email: '', password: '', role: 'customer' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)

  const load = async (p = page) => {
    setLoading(true)
    const { data } = await api.get(`/admin/users?page=${p}`)
    setUsers(data.data)
    setMeta(data)
    setLoading(false)
  }

  useEffect(() => { load(page) }, [page])

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/admin/users', form)
      setModal(false)
      setForm(empty)
      load(page)
    } catch (err) {
      alert(Object.values(err.response?.data?.errors ?? {}).flat().join('\n') || 'Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  const changeRole = async (id, role) => {
    await api.patch(`/admin/users/${id}/role`, { role })
    load(page)
  }

  const handleDelete = async id => {
    if (!confirm('¿Eliminar este usuario?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      load(page)
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar.')
    }
  }

  const inputCls = "w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-0.5">Gestión</p>
          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: 'Playfair Display, serif' }}>Usuarios</h1>
        </div>
        <button onClick={() => { setForm(empty); setModal(true) }}
          className="px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
          + Nuevo usuario
        </button>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div className="bg-white border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Usuario', 'Email', 'Rol', 'Registro', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-black">{u.name}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <select
                        value={u.role}
                        onChange={e => changeRole(u.id, e.target.value)}
                        className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-black ${u.role === 'admin' ? 'bg-black text-amber-400' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <option value="customer">Cliente</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">
                      {new Date(u.created_at).toLocaleDateString('es-PY')}
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => handleDelete(u.id)}
                        className="text-xs font-bold uppercase tracking-wide text-red-500 hover:text-red-700 transition-colors">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                      No hay usuarios aún.
                    </td>
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
          <div className="bg-white w-full max-w-sm p-7">
            <h2 className="text-lg font-bold text-black mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
              Nuevo usuario
            </h2>
            <form onSubmit={handleSave} className="space-y-3">
              {[
                { key: 'name', label: 'Nombre completo', type: 'text' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'password', label: 'Contraseña', type: 'password' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required className={inputCls} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Rol</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={inputCls}>
                  <option value="customer">Cliente</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2.5 text-xs font-bold uppercase tracking-wide hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-black text-white py-2.5 text-xs font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {saving ? 'Creando...' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
