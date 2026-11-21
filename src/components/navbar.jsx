import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function Navbar() {
  const { autenticado, usuario, logout } = useAuth()
  const navigate = useNavigate()

  const claseLink = ({ isActive }) =>
    isActive ? 'btn boton-primario' : 'btn btn-dark text-light'

  function cerrarSesion() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="py-3 shadow-sm">
      <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
        <h1 className="titulo-principal mb-0">eSports Arena Manager</h1>

        <nav className="d-flex flex-wrap align-items-center gap-2">
          <ul className="nav gap-1">
            <li className="nav-item">
              <NavLink to="/" end className={claseLink}>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/torneos" className={claseLink}>
                Torneos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/equipos" className={claseLink}>
                Equipos
              </NavLink>
            </li>
            {autenticado && (
              <>
                <li className="nav-item">
                  <NavLink to="/inscripcion" className={claseLink}>
                    Inscripción
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/perfil" className={claseLink}>
                    Perfil
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2 ms-md-3">
            {autenticado ? (
              <>
                <span className="text-light small">
                  {usuario.email} <span className="badge bg-warning text-dark">{usuario.rol}</span>
                </span>
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={cerrarSesion}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <NavLink to="/login" className="btn btn-outline-warning btn-sm">
                Iniciar sesión
              </NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}