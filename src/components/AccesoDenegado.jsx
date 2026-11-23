import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function AccesoDenegado() {
  const { usuario } = useAuth()

  return (
    <div className="row justify-content-center my-5">
      <div className="col-md-6">
        <div className="card tarjeta border-danger p-5 text-center">
          <h1 className="display-4 text-danger fw-bold mb-2">403</h1>
          <h4 className="text-light mb-3">Acceso Denegado</h4>
          <p className="text-secondary mb-4">
            Tu cuenta (<strong>{usuario?.email}</strong>) tiene rol{' '}
            <span className="badge bg-secondary">{usuario?.rol}</span> y no tiene permisos para
            entrar a la zona de administración.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/" className="btn boton-primario">
              Volver al Inicio
            </Link>
            <Link to="/torneos" className="btn btn-outline-light">
              Ver Torneos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}