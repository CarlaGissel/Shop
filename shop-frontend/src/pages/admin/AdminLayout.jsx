import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  {
    to: '/admin', label: 'Dashboard', end: true,
    svg: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  },
  {
    to: '/admin/products', label: 'Productos',
    svg: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />,
  },
  {
    to: '/admin/categories', label: 'Categorías',
    svg: <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />,
  },
  {
    to: '/admin/orders', label: 'Órdenes',
    svg: <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />,
  },
  {
    to: '/admin/users', label: 'Usuarios',
    svg: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />,
  },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-black min-h-screen flex flex-col flex-shrink-0">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-white/10">
          <Link to="/" className="block">
            <span className="text-white font-bold tracking-widest text-base uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
              SHOP
            </span>
          </Link>
          <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mt-0.5">Admin</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
          {links.map(({ to, label, end, svg }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors border-l-2 ${
                  isActive
                    ? 'text-amber-400 border-amber-400 bg-white/5'
                    : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'
                }`
              }
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {svg}
              </svg>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="px-5 py-5 border-t border-white/10">
          <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
          <p className="text-gray-500 text-xs truncate mb-3">{user?.email}</p>
          <button onClick={handleLogout}
            className="w-full text-left text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
            ← Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Panel de administración</p>
          <Link to="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            Ver tienda →
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
