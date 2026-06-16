import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer() {
  const { items, removeItem, updateQty, total, open, setOpen } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    setOpen(false)
    navigate(user ? '/checkout' : '/login')
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-black">
            Mi carrito ({items.length})
          </h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-black transition-colors text-2xl leading-none">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🛒</p>
              <p className="text-gray-400">El carrito está vacío</p>
            </div>
          ) : items.map(item => (
            <div key={item.id} className="flex gap-3 items-start">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                <p className="text-sm text-indigo-600 font-semibold mt-0.5">${parseFloat(item.price).toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 text-sm flex items-center justify-center hover:bg-gray-50">−</button>
                  <span className="text-sm w-5 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 text-sm flex items-center justify-center hover:bg-gray-50">+</button>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors mt-1">
                🗑️
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-200 space-y-4 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-gray-500">Subtotal:</span>
              <span className="text-lg font-bold text-black">${total.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout}
              className="w-full bg-black hover:bg-gray-800 text-white py-3.5 text-xs font-semibold uppercase tracking-widest transition-colors">
              Tramitar pedido
            </button>
            <button onClick={() => setOpen(false)}
              className="w-full text-center text-xs text-gray-400 hover:text-black transition-colors py-1 uppercase tracking-widest">
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
