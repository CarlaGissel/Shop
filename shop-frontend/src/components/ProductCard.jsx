import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  return (
    <div className="group bg-white overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {product.image_url
          ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">📦</div>
        }
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-black text-white text-xs font-semibold px-3 py-1 uppercase tracking-widest">Sin stock</span>
          </div>
        )}
        {/* Quick add button on hover */}
        {product.stock > 0 && (
          <button
            onClick={() => addItem(product)}
            className="absolute bottom-0 left-0 right-0 bg-black text-white text-xs font-semibold py-3 uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300"
          >
            Agregar al carrito
          </button>
        )}
      </div>

      {/* Info */}
      <div className="pt-3 pb-1">
        {product.category && (
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{product.category.name}</p>
        )}
        <h3 className="text-sm font-semibold text-black leading-snug">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-black">${parseFloat(product.price).toFixed(2)}</span>
          {product.stock > 0 && (
            <span className="text-xs text-gray-400">Stock: {product.stock}</span>
          )}
        </div>
      </div>
    </div>
  )
}
