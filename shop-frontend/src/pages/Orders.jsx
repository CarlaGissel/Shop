import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Spinner from '../components/Spinner'
import { formatGs as fmtPrice } from '../utils/format'

const STATUS_LABELS = {
  pending: 'Pendiente',
  paid: 'Pagado',
  shipped: 'Enviado',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

const fmtDate = v => new Date(v).toLocaleDateString('es-PY', { day: '2-digit', month: 'short', year: 'numeric' })

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api.get('/orders')
      .then(({ data }) => { if (active) setOrders(data.data) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-black mb-8"
          style={{ fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '-0.02em' }}>
          Mis pedidos
        </h1>

        {loading ? <Spinner /> : orders.length === 0 ? (
          <div className="text-center py-20 border border-gray-200">
            <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold mb-6">
              Todavía no tenés pedidos.
            </p>
            <Link to="/"
              className="inline-block px-6 py-3 bg-black text-white text-xs font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors">
              Explorar productos
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map(order => (
              <article key={order.id} className="border border-gray-200">
                {/* Cabecera del pedido */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50">
                  <div>
                    <p className="text-sm font-semibold text-black">Pedido #{order.id}</p>
                    <p className="text-xs text-gray-400">{fmtDate(order.created_at)}</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 border border-gray-300 text-gray-700">
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>

                {/* Items */}
                <ul className="px-5 py-3 divide-y divide-gray-100">
                  {order.items?.map(item => (
                    <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-gray-700">
                        {item.quantity}× {item.product_name}
                        {item.size && <span className="text-gray-400"> · {item.size}</span>}
                        {item.color && <span className="text-gray-400"> · {item.color}</span>}
                      </span>
                      <span className="font-medium text-black">{fmtPrice(item.subtotal)}</span>
                    </li>
                  ))}
                </ul>

                {/* Total */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400 uppercase tracking-widest">Total</span>
                  <span className="text-base font-bold text-black">{fmtPrice(order.total)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
