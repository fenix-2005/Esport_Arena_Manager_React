import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const ubicacion = useLocation()
  const destino = ubicacion.state?.desde || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function iniciar(e) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await login({ email, password })
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
        <div className="card tarjeta border-secondary text-light p-4 shadow">
          <h2 className="text-info mb-3">Iniciar sesión</h2>
          <form onSubmit={iniciar}>
            <div className="mb-3">
              <label htmlFor="login-email" className="form-label">
                Correo electrónico
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="correo@esports.cl"
                className="form-control bg-dark text-light border-secondary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="login-password" className="form-label">
                Contraseña
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                className="form-control bg-dark text-light border-secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn boton-primario w-100" disabled={enviando}>
              {enviando ? 'Ingresando...' : 'Entrar'}
            </button>
            {error && <p className="text-danger mt-3 mb-0">{error}</p>}
          </form>

          <p className="text-secondary small text-center mt-3 mb-0">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-info">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}