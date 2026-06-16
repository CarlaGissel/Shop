import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const fmt = v => `$${parseFloat(v).toFixed(2)}`

export default function Checkout() {
  const { items, total, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    line1: '',
    city: '',
    country: 'Paraguay',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(null) // pedido confirmado

  // Si no hay nada en el carrito (y no se acaba de confirmar), volver a la tienda.
  if (items.length === 0 && !done) return <Navigate to="/" replace />

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { data } = await api.post('/orders', {
        customer: { name: form.name, email: form.email, phone: form.phone || null },
        shipping_address: { line1: form.line1, city: form.city, country: form.country },
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
      })
      clear()
      setDone(data.data)
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(
        errors ? Object.values(errors).flat().join('\n')
          : err.response?.data?.message || 'No se pudo procesar el pedido. Intentá de nuevo.'
      )
    } finally {
      setSaving(false)
    }
  }

  // Pantalla de confirmación
  if (done) {
    return (
      <div className="min-h-screen bg-white">
        <section className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-black mb-3"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '-0.02em' }}>
            ¡Pedido confirmado!
          </h1>
          <p className="text-gray-500 mb-1">Tu pedido <span className="font-semibold text-black">#{done.id}</span> fue registrado.</p>
          <p className="text-gray-400 text-sm mb-8">Total: <span className="font-semibold">{fmt(done.total)}</span></p>
          <div className="flex flex-col gap-3">
            <Link to="/pedidos"
              className="px-6 py-3 bg-black text-white text-xs font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors">
              Ver mis pedidos
            </Link>
            <Link to="/"
              className="px-6 py-3 border border-gray-300 text-black text-xs font-semibold uppercase tracking-widest hover:border-black transition-colors">
              Seguir comprando
            </Link>
          </div>
        </section>
      </div>
    )
  }

  const inputCls = "w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
  const labelCls = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5"

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate(-1)} className="text-xs text-gray-400 hover:text-black uppercase tracking-widest mb-4">
          ← Volver
        </button>
        <h1 className="text-3xl font-bold text-black mb-8"
          style={{ fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '-0.02em' }}>
          Finalizar compra
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <fieldset className="space-y-3">
              <legend className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">Datos de contacto</legend>
              <div>
                <label className={labelCls}>Nombre completo</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} required className={inputCls} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls} placeholder="Opcional" />
                </div>
              </div>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">Dirección de envío</legend>
              <div>
                <label className={labelCls}>Dirección</label>
                <input value={form.line1} onChange={e => set('line1', e.target.value)} required className={inputCls} placeholder="Calle y número" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Ciudad</label>
                  <input value={form.city} onChange={e => set('city', e.target.value)} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>País</label>
                  <input value={form.country} onChange={e => set('country', e.target.value)} required className={inputCls} />
                </div>
              </div>
            </fieldset>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 whitespace-pre-line">
                {error}
              </div>
            )}

            <button type="submit" disabled={saving}
              className="w-full bg-black text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50">
              {saving ? 'Procesando...' : `Confirmar pedido · ${fmt(total)}`}
            </button>
          </form>

          {/* Resumen */}
          <aside className="lg:col-span-1">
            <div className="border border-gray-200 p-5 lg:sticky lg:top-24">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Resumen del pedido</h2>
              <ul className="space-y-3 mb-4">
                {items.map(item => (
                  <li key={item.id} className="flex gap-3 items-start">
                    <div className="w-12 h-12 bg-gray-100 flex-shrink-0 overflow-hidden">
                      {item.image_url
                        ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-lg">📦</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Cantidad: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-black">{fmt(parseFloat(item.price) * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <span className="text-xs uppercase tracking-widest text-gray-500">Total</span>
                <span className="text-lg font-bold text-black">{fmt(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
