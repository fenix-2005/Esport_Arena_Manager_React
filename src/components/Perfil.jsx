import { useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { validarApodo } from '../logica/validaciones'

const JUEGOS = [
  { id: 1, nombre: 'Valorant' },
  { id: 2, nombre: 'Counter-Strike 2' },
  { id: 3, nombre: 'League of Legends' },
]

function Perfil({ torneos, onAgregarTorneo, onActualizarTorneo, onEliminarTorneo }) {
  const { usuario, esAdmin } = useAuth()
  const [apodoActual, setApodoActual] = useState(usuario?.email?.split('@')[0] || 'Jugador')
  const [nuevoApodo, setNuevoApodo] = useState('')
  const [errorApodo, setErrorApodo] = useState('')

  const [nuevoTorneo, setNuevoTorneo] = useState({
    nombre: '',
    juegoId: 1,
    fechaInicio: '2026-12-01',
    fechaFin: '2026-12-15',
    cupoMaximo: 16,
    estado: 'ABIERTO',
    modalidad: '5v5',
  })
  const [errorAdmin, setErrorAdmin] = useState('')
  const [exitoAdmin, setExitoAdmin] = useState('')
  const [enviando, setEnviando] = useState(false)

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

  const crearTorneoAdmin = async (e) => {
    e.preventDefault()
    setErrorAdmin('')
    setExitoAdmin('')

    if (nuevoTorneo.nombre.trim().length < 3) {
      setErrorAdmin('El nombre del torneo debe tener al menos 3 caracteres.')
      return
    }
    if (Number(nuevoTorneo.cupoMaximo) < 2) {
      setErrorAdmin('El cupo máximo debe ser al menos 2.')
      return
    }
    if (nuevoTorneo.fechaFin < nuevoTorneo.fechaInicio) {
      setErrorAdmin('La fecha de término no puede ser anterior a la de inicio.')
      return
    }

    setEnviando(true)
    try {
      await onAgregarTorneo({
        nombre: nuevoTorneo.nombre.trim(),
        juegoId: Number(nuevoTorneo.juegoId),
        fechaInicio: nuevoTorneo.fechaInicio,
        fechaFin: nuevoTorneo.fechaFin,
        cupoMaximo: Number(nuevoTorneo.cupoMaximo),
        estado: nuevoTorneo.estado,
        modalidad: nuevoTorneo.modalidad,
      })
      setExitoAdmin(`Torneo "${nuevoTorneo.nombre.trim()}" creado correctamente.`)
      setNuevoTorneo({
        nombre: '',
        juegoId: 1,
        fechaInicio: '2026-12-01',
        fechaFin: '2026-12-15',
        cupoMaximo: 16,
        estado: 'ABIERTO',
        modalidad: '5v5',
      })
    } catch (err) {
      setErrorAdmin(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const cambiarEstadoTorneo = async (torneo, nuevoEstado) => {
    setErrorAdmin('')
    setExitoAdmin('')
    try {
      await onActualizarTorneo(torneo.id, {
        nombre: torneo.nombre,
        juegoId: torneo.juegoId,
        fechaInicio: torneo.fechaInicio,
        fechaFin: torneo.fechaFin,
        cupoMaximo: torneo.cupoMaximo,
        modalidad: torneo.modalidad,
        estado: nuevoEstado,
      })
      setExitoAdmin(`Estado de "${torneo.nombre}" actualizado a ${nuevoEstado}.`)
    } catch (err) {
      setErrorAdmin(err.message)
    }
  }

  const borrarTorneo = async (torneo) => {
    if (!window.confirm(`¿Eliminar el torneo "${torneo.nombre}"?`)) return
    setErrorAdmin('')
    setExitoAdmin('')
    try {
      await onEliminarTorneo(torneo.id)
      setExitoAdmin(`Torneo "${torneo.nombre}" eliminado.`)
    } catch (err) {
      setErrorAdmin(err.message)
    }
  }

  return (
    <div className="row g-4">
      <div className="col-md-4">
        <div className="card tarjeta border-secondary p-4">
          <h4 className="text-info mb-1">{apodoActual}</h4>
          <p className="text-secondary small mb-2">{usuario?.email}</p>
          <p className="text-secondary mb-4">
            Rol activo: <strong className="badge bg-warning text-dark">{usuario?.rol}</strong>
          </p>

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
          <h4 className="text-info mb-3">Panel de {usuario?.rol}</h4>

          {!esAdmin && (
            <p className="text-light">
              Como jugador puedes explorar el catálogo de torneos, crear tu equipo e inscribirte en
              las competencias abiertas.
            </p>
          )}

          {esAdmin && (
            <>
              {errorAdmin && <div className="alert alert-danger py-2">{errorAdmin}</div>}
              {exitoAdmin && <div className="alert alert-success py-2">{exitoAdmin}</div>}

              <div className="mb-4">
                <h5 className="text-light mb-3">Gestión de Torneos ({torneos.length})</h5>
                {torneos.length === 0 ? (
                  <p className="text-secondary">No hay torneos registrados en la base de datos.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {torneos.map((t) => (
                      <li
                        key={t.id}
                        className="list-group-item bg-dark text-light d-flex flex-wrap justify-content-between align-items-center gap-2 border-secondary"
                      >
                        <div>
                          <strong>{t.nombre}</strong> ({t.modalidad}) — Cupos: {t.cupoMaximo}
                          <div className="small text-secondary">
                            {t.fechaInicio} al {t.fechaFin}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <select
                            className="form-select form-select-sm bg-dark text-light border-secondary"
                            value={t.estado}
                            onChange={(e) => cambiarEstadoTorneo(t, e.target.value)}
                          >
                            <option value="ABIERTO">ABIERTO</option>
                            <option value="EN_CURSO">EN_CURSO</option>
                            <option value="FINALIZADO">FINALIZADO</option>
                          </select>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => borrarTorneo(t)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <form onSubmit={crearTorneoAdmin} className="border-top border-secondary pt-3">
                <h5 className="text-info mb-3">Crear Nuevo Torneo</h5>
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label text-light small">Nombre *</label>
                    <input
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Ej: Copa Invierno 2026"
                      value={nuevoTorneo.nombre}
                      onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, nombre: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-light small">Juego *</label>
                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={nuevoTorneo.juegoId}
                      onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, juegoId: e.target.value })}
                    >
                      {JUEGOS.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-light small">Modalidad *</label>
                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={nuevoTorneo.modalidad}
                      onChange={(e) =>
                        setNuevoTorneo({ ...nuevoTorneo, modalidad: e.target.value })
                      }
                    >
                      <option value="5v5">5v5</option>
                      <option value="3v3">3v3</option>
                      <option value="1v1">1v1</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-light small">Inicio *</label>
                    <input
                      type="date"
                      className="form-control bg-dark text-light border-secondary"
                      value={nuevoTorneo.fechaInicio}
                      onChange={(e) =>
                        setNuevoTorneo({ ...nuevoTorneo, fechaInicio: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-light small">Término *</label>
                    <input
                      type="date"
                      className="form-control bg-dark text-light border-secondary"
                      value={nuevoTorneo.fechaFin}
                      onChange={(e) =>
                        setNuevoTorneo({ ...nuevoTorneo, fechaFin: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-light small">Cupo máximo *</label>
                    <input
                      type="number"
                      min="2"
                      className="form-control bg-dark text-light border-secondary"
                      value={nuevoTorneo.cupoMaximo}
                      onChange={(e) =>
                        setNuevoTorneo({ ...nuevoTorneo, cupoMaximo: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label text-light small">Estado *</label>
                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={nuevoTorneo.estado}
                      onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, estado: e.target.value })}
                    >
                      <option value="ABIERTO">ABIERTO</option>
                      <option value="EN_CURSO">EN_CURSO</option>
                      <option value="FINALIZADO">FINALIZADO</option>
                    </select>
                  </div>
                  <div className="col-12 mt-3">
                    <button type="submit" className="btn boton-primario w-100" disabled={enviando}>
                      {enviando ? 'Creando...' : 'Publicar Torneo'}
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Perfil