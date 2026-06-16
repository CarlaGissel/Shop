import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const navLinks = [
  { label: 'Todos', to: '/' },
  { label: 'Novedades', to: '/?sort=newest' },
  { label: 'Hombre', to: '/?gender=hombre' },
  { label: 'Mujer', to: '/?gender=mujer' },
  { label: 'Accesorios', to: '/?cat=accesorios' },
]

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { count, setOpen } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Cerrar el menú de cuenta al hacer click fuera
  useEffect(() => {
    if (!menuOpen) return
    const handler = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const handleLogout = async () => {
    setMenuOpen(false)
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

            {/* Account dropdown */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  title={user.name}
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                  className="p-2 text-gray-600 hover:text-black transition-colors cursor-pointer flex items-center"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                {menuOpen && (
                  <div
                    className="absolute right-0 bg-white border border-gray-200 shadow-lg overflow-hidden"
                    style={{ top: 'calc(100% + 8px)', width: '224px', zIndex: 50 }}
                  >
                    {/* Encabezado: nombre + email */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-black truncate">{user.name}</p>
                      {user.email && <p className="text-xs text-gray-400 truncate">{user.email}</p>}
                    </div>

                    {/* Opciones */}
                    <nav className="py-1">
                      <Link to="/cuenta" onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                        Mi cuenta
                      </Link>
                      <Link to="/pedidos" onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                        Mis pedidos
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-colors">
                          Panel admin
                        </Link>
                      )}
                    </nav>

                    {/* Cerrar sesión */}
                    <div className="border-t border-gray-100 py-1">
                      <button onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors cursor-pointer">
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
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
