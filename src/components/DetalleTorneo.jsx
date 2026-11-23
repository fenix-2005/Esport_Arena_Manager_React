import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { torneosService } from '../services/torneos'
import { LogosJuegos } from '../logica/datos'

const NOMBRES_JUEGOS = {
  1: 'Valorant',
  2: 'Counter-Strike 2',
  3: 'League of Legends',
}

function colorEstado(estado = '') {
  const e = estado.toUpperCase()
  if (e === 'ABIERTO') return 'bg-success'
  if (e === 'EN_CURSO' || e === 'EN CURSO') return 'bg-warning'
  return 'bg-danger'
}

export default function DetalleTorneo({ torneos, onActualizarTorneo, onEliminarTorneo }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { esAdmin } = useAuth()

  const torneoEnLista = torneos.find((t) => String(t.id) === String(id))
  const [torneo, setTorneo] = useState(torneoEnLista || null)
  const [cargando, setCargando] = useState(!torneoEnLista)
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (torneoEnLista) {
      setTorneo(torneoEnLista)
      setCargando(false)
      return
    }
    torneosService
      .obtener(id)
      .then(setTorneo)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [id, torneoEnLista])

  async function cambiarEstado(nuevoEstado) {
    setGuardando(true)
    setError(null)
    try {
      const actualizado = await onActualizarTorneo(torneo.id, {
        nombre: torneo.nombre,
        juegoId: torneo.juegoId,
        fechaInicio: torneo.fechaInicio,
        fechaFin: torneo.fechaFin,
        cupoMaximo: torneo.cupoMaximo,
        modalidad: torneo.modalidad,
        estado: nuevoEstado,
      })
      setTorneo(actualizado)
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  async function borrar() {
    if (!window.confirm(`¿Eliminar el torneo "${torneo.nombre}"?`)) return
    setGuardando(true)
    try {
      await onEliminarTorneo(torneo.id)
      navigate('/torneos', { replace: true })
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <div className="text-center py-5 text-light">
        <div className="spinner-border text-warning mb-2" role="status" />
        <p>Cargando detalle del torneo...</p>
      </div>
    )
  }

  if (!torneo) {
    return (
      <div className="alert alert-danger">
        {error || 'Torneo no encontrado en la base de datos.'}
      </div>
    )
  }

  const nombreJuego = NOMBRES_JUEGOS[torneo.juegoId] || `Juego #${torneo.juegoId}`
  const imagen = LogosJuegos[nombreJuego] || LogosJuegos.Valorant
  const estaAbierto = torneo.estado?.toUpperCase() === 'ABIERTO'

  return (
    <div className="card tarjeta border-secondary p-4 mx-auto" style={{ maxWidth: 720 }}>
      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h3 className="text-info m-0">{torneo.nombre}</h3>
        <span className={`badge ${colorEstado(torneo.estado)} text-dark fs-6`}>
          {torneo.estado}
        </span>
      </div>

      <div className="text-center mb-4">
        <img
          src={imagen}
          alt={nombreJuego}
          style={{ maxHeight: 160, objectFit: 'contain' }}
        />
      </div>

      <div className="row g-2 mb-3 text-light">
        <div className="col-sm-6">
          <strong>Juego:</strong> {nombreJuego}
        </div>
        <div className="col-sm-6">
          <strong>Modalidad:</strong> {torneo.modalidad}
        </div>
        <div className="col-sm-6">
          <strong>Fecha inicio:</strong> {torneo.fechaInicio}
        </div>
        <div className="col-sm-6">
          <strong>Fecha término:</strong> {torneo.fechaFin}
        </div>
        <div className="col-sm-6">
          <strong>Cupo máximo:</strong> {torneo.cupoMaximo} participantes
        </div>
      </div>

      {esAdmin && (
        <div className="border-top border-secondary pt-3 mt-2 mb-3">
          <h6 className="text-warning mb-2">Controles de Administrador</h6>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <label className="form-label text-light m-0 small">Estado:</label>
            <select
              className="form-select form-select-sm bg-dark text-light border-secondary w-auto"
              value={torneo.estado}
              disabled={guardando}
              onChange={(e) => cambiarEstado(e.target.value)}
            >
              <option value="ABIERTO">ABIERTO</option>
              <option value="EN_CURSO">EN_CURSO</option>
              <option value="FINALIZADO">FINALIZADO</option>
            </select>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger ms-auto"
              disabled={guardando}
              onClick={borrar}
            >
              Eliminar torneo
            </button>
          </div>
        </div>
      )}

      <div className="d-flex flex-wrap gap-2 mt-3">
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={() => navigate('/torneos')}
        >
          Volver al catálogo
        </button>
        {estaAbierto && (
          <button
            type="button"
            className="btn boton-primario"
            onClick={() => navigate('/inscripcion', { state: { torneoId: torneo.id } })}
          >
            Inscribirse a este Torneo
          </button>
        )}
      </div>
    </div>
  )
}