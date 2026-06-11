import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.password_confirmation) { setError('Las contraseñas no coinciden.'); return }
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.password_confirmation)
      navigate('/')
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join(' ') : 'Error al registrarse.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'name', label: 'Nombre completo', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Contraseña', type: 'password' },
    { name: 'password_confirmation', label: 'Confirmar contraseña', type: 'password' },
  ]

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-8 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>SHOP</span>
          <h1 className="text-2xl font-bold text-black mt-6 mb-1">Crear cuenta</h1>
          <p className="text-sm text-gray-400">Completá tus datos para registrarte</p>
        </div>

        {error && (
          <div className="border border-red-200 bg-red-50 text-red-600 text-sm p-3 mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-600 mb-2">{label}</label>
              <input name={name} type={type} value={form[name]} onChange={handle} required
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white py-3.5 text-xs font-semibold uppercase tracking-widest transition-colors disabled:opacity-60 mt-2">
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-black font-semibold hover:underline">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}
