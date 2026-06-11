import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const navLinks = [
  { label: 'Todos', to: '/' },
  { label: 'Novedades', to: '/?q=novedades' },
  { label: 'Hombre', to: '/?cat=hombre' },
  { label: 'Mujer', to: '/?cat=mujer' },
  { label: 'Accesorios', to: '/?cat=accesorios' },
]

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { count, setOpen } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleSearch = e => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Announcement bar */}
      <div className="bg-black text-white text-center py-2.5 tracking-widest font-light" style={{ fontSize: '11px' }}>
        Envíos gratis a todo el país desde Gs. 500.000
      </div>

      {/* Main navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px', height: '72px' }}
          className="flex items-center gap-6">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-bold tracking-tight text-black"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '-0.02em' }}>
              SHOP
            </span>
          </Link>

          {/* Nav links – center */}
          <div className="hidden md:flex items-center flex-1 justify-center gap-1">
            {navLinks.map(({ label, to }) => (
              <Link key={label} to={to}
                className="px-3 py-5 text-xs font-bold uppercase tracking-widest text-gray-700 hover:text-black transition-colors border-b-2 border-transparent hover:border-amber-500">
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin"
                className="px-3 py-5 text-xs font-bold uppercase tracking-widest text-amber-500 hover:text-amber-600 transition-colors border-b-2 border-transparent border-amber-500">
                Admin
              </Link>
            )}
          </div>

          {/* Right: search + icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar"
                className="w-44 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:bg-gray-200 transition-colors border-0"
                style={{ borderRadius: 0 }}
              />
              <button type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 transition-colors flex items-center justify-center"
                style={{ height: '36px' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Separator */}
            <div className="w-px h-6 bg-gray-200 mx-1 hidden lg:block" />

            {/* User icon */}
            {user ? (
              <div className="flex items-center">
                <button
                  onClick={() => isAdmin ? navigate('/admin') : null}
                  title={user.name}
                  className="p-2 text-gray-600 hover:text-black transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <button onClick={handleLogout} title="Cerrar sesión"
                  className="p-2 text-gray-400 hover:text-black transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-3l-3 3m0 0l3 3m-3-3H21" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link to="/login" title="Iniciar sesión"
                className="p-2 text-gray-600 hover:text-black transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            )}

            {/* Cart */}
            <button onClick={() => setOpen(true)}
              className="relative p-2 text-gray-600 hover:text-black transition-colors">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white font-bold rounded-full flex items-center justify-center"
                  style={{ width: '17px', height: '17px', fontSize: '10px' }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
