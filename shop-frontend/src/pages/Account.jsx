import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Account() {
  const { user, isAdmin } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-black mb-8"
          style={{ fontFamily: 'Playfair Display, Georgia, serif', letterSpacing: '-0.02em' }}>
          Mi cuenta
        </h1>

        <div className="border border-gray-200">
          <Field label="Nombre" value={user?.name} />
          <Field label="Email" value={user?.email} />
          <Field label="Tipo de cuenta" value={isAdmin ? 'Administrador' : 'Cliente'} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
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

function Field({ label, value }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 last:border-b-0">
      <span className="text-xs text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-medium text-black">{value || '—'}</span>
    </div>
  )
}
