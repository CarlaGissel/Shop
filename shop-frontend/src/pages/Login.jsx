import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 bg-gray-900 items-center justify-center p-12">
        <div className="text-white max-w-sm">
          <h2 className="text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Bienvenido de vuelta
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Ingresá a tu cuenta para ver tus pedidos, guardar favoritos y acceder a ofertas exclusivas.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>SHOP</span>
            <h1 className="text-2xl font-bold text-black mt-6 mb-1">Iniciar sesión</h1>
            <p className="text-sm text-gray-400">Ingresá tus credenciales para continuar</p>
          </div>

          {error && (
            <div className="border border-red-200 bg-red-50 text-red-600 text-sm p-3 mb-5">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-600 mb-2">Email</label>
              <input name="email" type="email" value={form.email} onChange={handle} required
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-600 mb-2">Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handle} required
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white py-3.5 text-xs font-semibold uppercase tracking-widest transition-colors disabled:opacity-60 mt-2">
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="text-black font-semibold hover:underline">Crear cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
