import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import HeroSlider from '../components/HeroSlider'

export default function Home() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(() => searchParams.get('q') || '')
  const [category, setCategory] = useState(() => searchParams.get('cat') || '')
  const [gender, setGender] = useState(() => searchParams.get('gender') || '')
  const [sort, setSort] = useState(() => searchParams.get('sort') || 'newest')
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data))
  }, [])

  // Sincronizar los filtros con la URL: al navegar (links del navbar o
  // buscador del header) la query cambia pero el componente sigue montado,
  // así que hay que reflejar ?q= y ?cat= en el estado para volver a filtrar.
  useEffect(() => {
    setSearch(searchParams.get('q') || '')
    setCategory(searchParams.get('cat') || '')
    setGender(searchParams.get('gender') || '')
    setSort(searchParams.get('sort') || 'newest')
    setPage(1)
  }, [searchParams])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page })
      if (search) params.set('search', search)
      if (category) params.set('category', category)
      if (gender) params.set('gender', gender)
      if (sort) params.set('sort', sort)
      const { data } = await api.get(`/products?${params}`)
      setProducts(data.data)
      setMeta(data)
    } finally {
      setLoading(false)
    }
  }, [search, category, gender, sort, page])

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300)
    return () => clearTimeout(t)
  }, [fetchProducts])

  return (
    <div className="min-h-screen bg-white">

      <HeroSlider />

      {/* Category pills */}
      {categories.length > 0 && (
        <section className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { setCategory(''); setPage(1) }}
                className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-widest border transition-colors ${category === '' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}
              >
                Todos
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setCategory(c.slug); setPage(1) }}
                  className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-widest border transition-colors ${category === c.slug ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products section */}
      <section id="productos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="pl-9 pr-4 py-2.5 border border-gray-300 text-sm w-72 focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Ordenar:</span>
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1) }}
              className="border border-gray-300 px-3 py-2.5 text-xs focus:outline-none focus:border-black transition-colors uppercase tracking-wide"
            >
              <option value="newest">Más recientes</option>
              <option value="price_asc">Menor precio</option>
              <option value="price_desc">Mayor precio</option>
            </select>
          </div>
        </div>

        {loading ? <Spinner /> : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-300 text-sm uppercase tracking-widest font-semibold">No se encontraron productos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {meta?.last_page > 1 && (
              <div className="flex justify-center gap-1 mt-12">
                {Array.from({ length: meta.last_page }, (_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 text-sm font-medium transition-colors ${page === i + 1 ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-300 hover:border-black'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
