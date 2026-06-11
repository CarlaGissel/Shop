import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

const cards = [
  {
    label: 'Productos',
    key: 'products',
    to: '/admin/products',
    accent: '#f59e0b',
    svg: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    label: 'Órdenes',
    key: 'orders',
    to: '/admin/orders',
    accent: '#111',
    svg: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
      </svg>
    ),
  },
  {
    label: 'Usuarios',
    key: 'users',
    to: '/admin/users',
    accent: '#6b7280',
    svg: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    label: 'Categorías',
    key: 'categories',
    to: '/admin/categories',
    accent: '#d97706',
    svg: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
]

export default function Dashboard() {
  const [stats, setStats] = useState({ products: '—', orders: '—', users: '—', categories: '—' })

  useEffect(() => {
    Promise.allSettled([
      api.get('/admin/products'),
      api.get('/admin/orders'),
      api.get('/admin/users'),
      api.get('/categories'),
    ]).then(([products, orders, users, categories]) => {
      setStats({
        products: products.value?.data?.total ?? '–',
        orders: orders.value?.data?.total ?? '–',
        users: users.value?.data?.total ?? '–',
        categories: categories.value?.data?.data?.length ?? '–',
      })
    })
  }, [])

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(({ label, key, to, accent, svg }) => (
          <Link key={label} to={to}
            className="bg-white border border-gray-200 p-5 hover:border-black transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 flex items-center justify-center bg-gray-100 group-hover:bg-black group-hover:text-white transition-colors"
                style={{ color: accent }}>
                {svg}
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-black tabular-nums">{stats[key]}</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-semibold">{label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Acceso rápido</p>
        <div className="flex flex-wrap gap-3">
          {cards.map(({ label, to }) => (
            <Link key={label} to={to}
              className="px-5 py-2.5 border border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600 hover:border-black hover:text-black transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
