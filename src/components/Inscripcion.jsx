import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { inscripcionesService } from '../services/inscripciones'
import { equiposService } from '../services/equipos'

function Inscripcion({ torneos = [] }) {
  const { usuario, esAdmin } = useAuth()
  const ubicacion = useLocation()
  const torneosAbiertos = torneos.filter((t) => t.estado?.toUpperCase() === 'ABIERTO')

  const [inscripciones, setInscripciones] = useState([])
  const [equipos, setEquipos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)

  const [form, setForm] = useState({
    torneoId: ubicacion.state?.torneoId ? String(ubicacion.state.torneoId) : '',
    tipoParticipante: 'INDIVIDUAL',
    equipoId: '',
  })
  const [errorForm, setErrorForm] = useState('')
  const [exito, setExito] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    Promise.all([inscripcionesService.listar(), equiposService.listar()])
      .then(([listaIns, listaEq]) => {
        setInscripciones(listaIns)
        setEquipos(listaEq)
      })
      .catch((e) => setErrorCarga(e.message))
      .finally(() => setCargando(false))
  }, [])

  const enviar = async (e) => {
    e.preventDefault()
    setErrorForm('')
    setExito('')

    if (!form.torneoId) {
      setErrorForm('Debes seleccionar un torneo abierto.')
      return
    }
    if (form.tipoParticipante === 'EQUIPO' && !form.equipoId) {
      setErrorForm('Debes seleccionar un equipo.')
      return
    }

    setEnviando(true)
    try {
      const hoy = new Date().toISOString().split('T')[0]
      const creada = await inscripcionesService.crear({
        torneoId: Number(form.torneoId),
        equipoId: form.tipoParticipante === 'EQUIPO' ? Number(form.equipoId) : null,
        jugadorId: usuario.id,
        tipoParticipante: form.tipoParticipante,
        estado: 'CONFIRMADA',
        fechaInscripcion: hoy,
      })
      setInscripciones([...inscripciones, creada])
      setExito('¡Inscripción registrada correctamente!')
      setForm({ torneoId: '', tipoParticipante: 'INDIVIDUAL', equipoId: '' })
    } catch (err) {
      setErrorForm(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta inscripción?')) return
    setErrorForm('')
    try {
      await inscripcionesService.eliminar(id)
      setInscripciones(inscripciones.filter((i) => i.id !== id))
    } catch (err) {
      setErrorForm(err.message)
    }
  }

  const nombreTorneo = (id) => torneos.find((t) => t.id === Number(id))?.nombre || `Torneo #${id}`

  return (
    <div className="row g-4">
      <div className="col-md-5">
        <div className="card tarjeta border-secondary p-4">
          <h4 className="text-info mb-3">Inscribirse a un Torneo</h4>

          {errorForm && <small className="alerta mb-3 d-block">{errorForm}</small>}
          {exito && <div className="alert alert-success py-2">{exito}</div>}

          {torneosAbiertos.length === 0 ? (
            <p className="text-secondary mb-0">
              No hay torneos abiertos disponibles para inscripción en este momento.
            </p>
          ) : (
            <form onSubmit={enviar}>
              <div className="mb-3">
                <label className="form-label text-light">Torneo (solo abiertos) *</label>
                <select
                  className="form-select bg-dark text-light border-secondary"
                  value={form.torneoId}
                  onChange={(e) => setForm({ ...form, torneoId: e.target.value })}
                >
                  <option value="">Selecciona un torneo...</option>
                  {torneosAbiertos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre} ({t.modalidad})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-light">Modalidad de participación *</label>
                <select
                  className="form-select bg-dark text-light border-secondary"
                  value={form.tipoParticipante}
                  onChange={(e) =>
                    setForm({ ...form, tipoParticipante: e.target.value, equipoId: '' })
                  }
                >
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="EQUIPO">Por Equipo</option>
                </select>
              </div>

              {form.tipoParticipante === 'EQUIPO' && (
                <div className="mb-3">
                  <label className="form-label text-light">Equipo *</label>
                  <select
                    className="form-select bg-dark text-light border-secondary"
                    value={form.equipoId}
                    onChange={(e) => setForm({ ...form, equipoId: e.target.value })}
                  >
                    <option value="">Selecciona un equipo...</option>
                    {equipos.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button type="submit" className="btn boton-primario w-100" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Confirmar Inscripción'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="col-md-7">
        <div className="card tarjeta border-secondary p-4">
          <h4 className="text-info mb-3">Inscripciones Registradas ({inscripciones.length})</h4>

          {cargando ? (
            <p className="text-secondary">Cargando inscripciones...</p>
          ) : errorCarga ? (
            <div className="alert alert-danger">{errorCarga}</div>
          ) : inscripciones.length === 0 ? (
            <p className="text-secondary">No hay inscripciones registradas aún.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle">
                <thead>
                  <tr>
                    <th>Torneo</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    {esAdmin && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {inscripciones.map((ins) => (
                    <tr key={ins.id}>
                      <td>{nombreTorneo(ins.torneoId)}</td>
                      <td>{ins.tipoParticipante}</td>
                      <td>{ins.fechaInscripcion}</td>
                      <td>{ins.estado}</td>
                      {esAdmin && (
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminar(ins.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
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

export default Inscripcion