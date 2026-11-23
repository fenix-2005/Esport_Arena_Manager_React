import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { inscripcionesService } from '../services/inscripciones'
import { validarApodo } from '../logica/validaciones'

function Perfil({ torneos = [] }) {
  const { usuario, esAdmin } = useAuth()
  const [apodoActual, setApodoActual] = useState(usuario?.email?.split('@')[0] || 'Jugador')
  const [nuevoApodo, setNuevoApodo] = useState('')
  const [errorApodo, setErrorApodo] = useState('')

  const [misInscripciones, setMisInscripciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)

  useEffect(() => {
    inscripcionesService
      .listar()
      .then((lista) =>
        setMisInscripciones(lista.filter((ins) => Number(ins.jugadorId) === Number(usuario?.id)))
      )
      .catch((e) => setErrorCarga(e.message))
      .finally(() => setCargando(false))
  }, [usuario?.id])

  const actualizarApodo = (e) => {
    e.preventDefault()
    if (!validarApodo(nuevoApodo)) {
      setErrorApodo('El apodo debe tener al menos 3 caracteres y no contener espacios.')
      return
    }
    setApodoActual(nuevoApodo.trim())
    setNuevoApodo('')
    setErrorApodo('')
  }

  const nombreTorneo = (id) => torneos.find((t) => t.id === Number(id))?.nombre || `Torneo #${id}`

  return (
    <div className="row g-4">
      <div className="col-md-4">
        <div className="card tarjeta border-secondary p-4">
          <h4 className="text-info mb-1">{apodoActual}</h4>
          <p className="text-secondary small mb-2">{usuario?.email}</p>
          <p className="text-secondary mb-3">
            Rol activo: <strong className="badge bg-warning text-dark">{usuario?.rol}</strong>
          </p>

          {esAdmin && (
            <Link to="/admin" className="btn btn-outline-warning btn-sm w-100 mb-3">
              Ir al Panel de Administración
            </Link>
          )}

          <form onSubmit={actualizarApodo} className="border-top border-secondary pt-3">
            <label className="form-label text-light">Actualizar Apodo (Sin espacios)</label>
            <input
              className="form-control bg-dark text-light border-secondary mb-2"
              value={nuevoApodo}
              onChange={(e) => setNuevoApodo(e.target.value)}
              placeholder="NuevoApodo"
            />
            {errorApodo && <small className="alerta mb-2 d-block">{errorApodo}</small>}
            <button type="submit" className="btn boton-primario w-100">
              Guardar Apodo
            </button>
          </form>
        </div>
      </div>

      <div className="col-md-8">
        <div className="card tarjeta border-secondary p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-info m-0">Mis Inscripciones ({misInscripciones.length})</h4>
            <Link to="/inscripcion" className="btn btn-sm boton-primario">
              Nueva Inscripción
            </Link>
          </div>

          {cargando ? (
            <p className="text-secondary">Cargando tus inscripciones...</p>
          ) : errorCarga ? (
            <div className="alert alert-danger">{errorCarga}</div>
          ) : misInscripciones.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-secondary mb-3">
                Todavía no estás inscrito en ningún torneo.
              </p>
              <Link to="/torneos" className="btn btn-outline-light btn-sm">
                Explorar Torneos Abiertos
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle">
                <thead>
                  <tr>
                    <th>Torneo</th>
                    <th>Modalidad</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {misInscripciones.map((ins) => (
                    <tr key={ins.id}>
                      <td>
                        <Link to={`/torneos/${ins.torneoId}`} className="text-info text-decoration-none">
                          {nombreTorneo(ins.torneoId)}
                        </Link>
                      </td>
                      <td>{ins.tipoParticipante}</td>
                      <td>{ins.fechaInscripcion}</td>
                      <td>
                        <span className="badge bg-success text-dark">{ins.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Perfil