import { useCallback, useEffect, useState } from 'react'
import { equiposService } from '../services/equipos'
import { inscripcionesService } from '../services/inscripciones'

const JUEGOS = [
  { id: 1, nombre: 'Valorant' },
  { id: 2, nombre: 'Counter-Strike 2' },
  { id: 3, nombre: 'League of Legends' },
]

const FORM_INICIAL = {
  nombre: '',
  juegoId: 1,
  fechaInicio: '2026-12-01',
  fechaFin: '2026-12-15',
  cupoMaximo: 16,
  estado: 'ABIERTO',
  modalidad: '5v5',
}

export default function AdminPanel({
  torneos,
  onAgregarTorneo,
  onActualizarTorneo,
  onEliminarTorneo,
  onRefrescar,
}) {
  const [totalEquipos, setTotalEquipos] = useState(0)
  const [totalInscripciones, setTotalInscripciones] = useState(0)
  const [refrescando, setRefrescando] = useState(false)

  const [form, setForm] = useState(FORM_INICIAL)
  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cargarMetricas = useCallback(async () => {
    try {
      const [equipos, inscripciones] = await Promise.all([
        equiposService.listar(),
        inscripcionesService.listar(),
      ])
      setTotalEquipos(equipos.length)
      setTotalInscripciones(inscripciones.length)
    } catch {
      // Si un servicio secundario está despertando, no bloquea el panel de torneos
    }
  }, [])

  useEffect(() => {
    cargarMetricas()
  }, [cargarMetricas])

  const refrescarTodo = async () => {
    setRefrescando(true)
    setError('')
    try {
      await Promise.all([onRefrescar(), cargarMetricas()])
    } catch (err) {
      setError(err.message)
    } finally {
      setRefrescando(false)
    }
  }

  const iniciarEdicion = (torneo) => {
    setEditandoId(torneo.id)
    setForm({
      nombre: torneo.nombre,
      juegoId: torneo.juegoId,
      fechaInicio: torneo.fechaInicio,
      fechaFin: torneo.fechaFin,
      cupoMaximo: torneo.cupoMaximo,
      estado: torneo.estado,
      modalidad: torneo.modalidad,
    })
    setError('')
    setExito('')
  }

  const cancelarEdicion = () => {
    setEditandoId(null)
    setForm(FORM_INICIAL)
    setError('')
  }

  const guardarTorneo = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')

    if (form.nombre.trim().length < 3) {
      setError('El nombre del torneo debe tener al menos 3 caracteres.')
      return
    }
    if (Number(form.cupoMaximo) < 2) {
      setError('El cupo máximo debe ser al menos 2.')
      return
    }
    if (form.fechaFin < form.fechaInicio) {
      setError('La fecha de término no puede ser anterior a la de inicio.')
      return
    }

    const payload = {
      nombre: form.nombre.trim(),
      juegoId: Number(form.juegoId),
      fechaInicio: form.fechaInicio,
      fechaFin: form.fechaFin,
      cupoMaximo: Number(form.cupoMaximo),
      estado: form.estado,
      modalidad: form.modalidad,
    }

    setEnviando(true)
    try {
      if (editandoId) {
        await onActualizarTorneo(editandoId, payload)
        setExito(`Torneo "${payload.nombre}" actualizado correctamente.`)
        setEditandoId(null)
      } else {
        await onAgregarTorneo(payload)
        setExito(`Torneo "${payload.nombre}" publicado correctamente.`)
      }
      setForm(FORM_INICIAL)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const cambiarEstado = async (torneo, nuevoEstado) => {
    setError('')
    setExito('')
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
      setExito(`Estado de "${torneo.nombre}" actualizado a ${nuevoEstado}.`)
    } catch (err) {
      setError(err.message)
    }
  }

  const borrarTorneo = async (torneo) => {
    if (!window.confirm(`¿Eliminar el torneo "${torneo.nombre}"?`)) return
    setError('')
    setExito('')
    try {
      await onEliminarTorneo(torneo.id)
      if (editandoId === torneo.id) cancelarEdicion()
      setExito(`Torneo "${torneo.nombre}" eliminado.`)
    } catch (err) {
      setError(err.message)
    }
  }

  const abiertos = torneos.filter((t) => t.estado?.toUpperCase() === 'ABIERTO').length
  const enCurso = torneos.filter((t) => t.estado?.toUpperCase() === 'EN_CURSO').length

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h2 className="text-warning m-0">Panel de Administración</h2>
        <button
          type="button"
          className="btn btn-outline-info btn-sm"
          disabled={refrescando}
          onClick={refrescarTodo}
        >
          {refrescando ? 'Actualizando...' : 'Refrescar datos'}
        </button>
      </div>

      {/* Dashboard de métricas */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card tarjeta border-success p-3 text-center">
            <span className="text-secondary small">Torneos Abiertos</span>
            <h3 className="text-success m-0 mt-1">{abiertos}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card tarjeta border-warning p-3 text-center">
            <span className="text-secondary small">En Curso</span>
            <h3 className="text-warning m-0 mt-1">{enCurso}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card tarjeta border-info p-3 text-center">
            <span className="text-secondary small">Equipos Registrados</span>
            <h3 className="text-info m-0 mt-1">{totalEquipos}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card tarjeta border-secondary p-3 text-center">
            <span className="text-secondary small">Inscripciones Totales</span>
            <h3 className="text-light m-0 mt-1">{totalInscripciones}</h3>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {exito && <div className="alert alert-success py-2">{exito}</div>}

      {/* Formulario Crear / Editar */}
      <div className="card tarjeta border-secondary p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-info m-0">
            {editandoId ? `Editando Torneo #${editandoId}` : 'Crear Nuevo Torneo'}
          </h5>
          {editandoId && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={cancelarEdicion}
            >
              Cancelar edición
            </button>
          )}
        </div>

        <form onSubmit={guardarTorneo}>
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label text-light small">Nombre *</label>
              <input
                className="form-control bg-dark text-light border-secondary"
                placeholder="Ej: Copa Invierno 2026"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label text-light small">Juego *</label>
              <select
                className="form-select bg-dark text-light border-secondary"
                value={form.juegoId}
                onChange={(e) => setForm({ ...form, juegoId: e.target.value })}
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
                value={form.modalidad}
                onChange={(e) => setForm({ ...form, modalidad: e.target.value })}
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
                value={form.fechaInicio}
                onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label text-light small">Término *</label>
              <input
                type="date"
                className="form-control bg-dark text-light border-secondary"
                value={form.fechaFin}
                onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label text-light small">Cupo máximo *</label>
              <input
                type="number"
                min="2"
                className="form-control bg-dark text-light border-secondary"
                value={form.cupoMaximo}
                onChange={(e) => setForm({ ...form, cupoMaximo: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label text-light small">Estado *</label>
              <select
                className="form-select bg-dark text-light border-secondary"
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
              >
                <option value="ABIERTO">ABIERTO</option>
                <option value="EN_CURSO">EN_CURSO</option>
                <option value="FINALIZADO">FINALIZADO</option>
              </select>
            </div>
            <div className="col-12 mt-3">
              <button type="submit" className="btn boton-primario w-100" disabled={enviando}>
                {enviando
                  ? 'Guardando...'
                  : editandoId
                    ? 'Guardar Cambios'
                    : 'Publicar Torneo'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Listado de gestión */}
      <div className="card tarjeta border-secondary p-4">
        <h5 className="text-light mb-3">Gestión de Torneos ({torneos.length})</h5>
        {torneos.length === 0 ? (
          <p className="text-secondary mb-0">No hay torneos registrados en la base de datos.</p>
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
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <select
                    className="form-select form-select-sm bg-dark text-light border-secondary w-auto"
                    value={t.estado}
                    onChange={(e) => cambiarEstado(t, e.target.value)}
                  >
                    <option value="ABIERTO">ABIERTO</option>
                    <option value="EN_CURSO">EN_CURSO</option>
                    <option value="FINALIZADO">FINALIZADO</option>
                  </select>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-info"
                    onClick={() => iniciarEdicion(t)}
                  >
                    Editar
                  </button>
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
    </div>
  )
}