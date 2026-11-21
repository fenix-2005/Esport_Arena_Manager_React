import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const ubicacion = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function entrar(e) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await login(form)
      const destino = ubicacion.state?.desde ?? '/'
      navigate(destino, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card bg-dark text-light p-4 shadow">
          <h2 className="mb-3">Iniciar sesión</h2>
          <form onSubmit={entrar}>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                name="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={cambiar}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                name="password"
                type="password"
                className="form-control"
                value={form.password}
                onChange={cambiar}
                required
              />
            </div>
            <button type="submit" className="btn boton-primario w-100" disabled={enviando}>
              {enviando ? 'Entrando...' : 'Entrar'}
            </button>
            {error && <p className="text-danger mt-3 mb-0">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}