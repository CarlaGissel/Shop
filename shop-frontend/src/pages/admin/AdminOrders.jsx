import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'

const STATUS_COLORS = {
  pending: 'bg-yellow-50 text-yellow-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-600',
}

const STATUS_LABELS = {
  pending: 'Pendiente',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)
  const [expanded, setExpanded] = useState(null)

  const load = async (p = page) => {
    setLoading(true)
    const { data } = await api.get(`/admin/orders?page=${p}`)
    setOrders(data.data)
    setMeta(data)
    setLoading(false)
  }

  useEffect(() => { load(page) }, [page])

  const updateStatus = async (id, status) => {
    await api.patch(`/admin/orders/${id}/status`, { status })
    load(page)
  }

  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-0.5">Gestión</p>
        <h1 className="text-2xl font-bold text-black" style={{ fontFamily: 'Playfair Display, serif' }}>Órdenes</h1>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div className="bg-white border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['#', 'Cliente', 'Total', 'Estado', 'Fecha', 'Cambiar estado'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <>
                    <tr
                      key={o.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                    >
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-400">#{o.id}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-black">{o.customer?.name}</p>
                        <p className="text-xs text-gray-400">{o.customer?.email}</p>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-black">
                        Gs. {parseFloat(o.total).toLocaleString('es')}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${STATUS_COLORS[o.status]}`}>
                          {STATUS_LABELS[o.status]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">
                        {new Date(o.created_at).toLocaleDateString('es-PY')}
                      </td>
                      <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                        <select
                          value={o.status}
                          onChange={e => updateStatus(o.id, e.target.value)}
                          className="border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:border-black transition-colors"
                        >
                          {Object.entries(STATUS_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {expanded === o.id && o.items && (
                      <tr key={`${o.id}-items`}>
                        <td colSpan={6} className="px-5 py-4 bg-amber-50 border-b border-amber-100">
                          <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">
                            Items del pedido
                          </p>
                          <div className="space-y-1.5">
                            {o.items.map(item => (
                              <div key={item.id} className="flex justify-between text-sm text-gray-700">
                                <span>{item.product_name} <span className="text-gray-400">× {item.quantity}</span></span>
                                <span className="font-semibold">Gs. {parseFloat(item.subtotal).toLocaleString('es')}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                      No hay órdenes aún.
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
    </div>
  )
}
