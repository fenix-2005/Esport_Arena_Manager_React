import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function Registro() {
  const { registrar } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '', confirmar: '' })
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function crearCuenta(e) {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setEnviando(true)
    try {
      await registrar({ email: form.email, password: form.password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card tarjeta border-secondary text-light p-4 shadow">
          <h2 className="text-info mb-3">Crear cuenta</h2>
          <form onSubmit={crearCuenta}>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                name="email"
                type="email"
                className="form-control bg-dark text-light border-secondary"
                value={form.email}
                onChange={cambiar}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña (mínimo 6 caracteres)</label>
              <input
                name="password"
                type="password"
                className="form-control bg-dark text-light border-secondary"
                value={form.password}
                onChange={cambiar}
                minLength={6}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar contraseña</label>
              <input
                name="confirmar"
                type="password"
                className="form-control bg-dark text-light border-secondary"
                value={form.confirmar}
                onChange={cambiar}
                minLength={6}
                required
              />
            </div>
            <button type="submit" className="btn boton-primario w-100" disabled={enviando}>
              {enviando ? 'Creando cuenta...' : 'Registrarse'}
            </button>
            {error && <p className="text-danger mt-3 mb-0">{error}</p>}
          </form>
          <p className="text-secondary small text-center mt-3 mb-0">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-info">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}