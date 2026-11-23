import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { equiposService } from '../services/equipos'

const JUEGOS = [
  { id: 1, nombre: 'Valorant' },
  { id: 2, nombre: 'Counter-Strike 2' },
  { id: 3, nombre: 'League of Legends' },
]

function Equipos() {
  const { autenticado, usuario, esAdmin } = useAuth()
  const [equipos, setEquipos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [lento, setLento] = useState(false)
  const [refrescando, setRefrescando] = useState(false)
  const [errorCarga, setErrorCarga] = useState(null)

  const [form, setForm] = useState({ nombre: '', juegoPrincipalId: 1 })
  const [errorForm, setErrorForm] = useState('')
  const [exito, setExito] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cargarEquipos = useCallback(async () => {
    setErrorCarga(null)
    try {
      const lista = await equiposService.listar()
      setEquipos(lista)
    } catch (e) {
      setErrorCarga(e.message)
    }
  }, [])

  useEffect(() => {
    const aviso = setTimeout(() => setLento(true), 4000)
    cargarEquipos().finally(() => {
      clearTimeout(aviso)
      setCargando(false)
    })
    return () => clearTimeout(aviso)
  }, [cargarEquipos])

  const refrescar = async () => {
    setRefrescando(true)
    try {
      await cargarEquipos()
    } finally {
      setRefrescando(false)
    }
  }

  const nombreJuego = (id) => JUEGOS.find((j) => j.id === Number(id))?.nombre || `Juego #${id}`

  const registrarEquipo = async (e) => {
    e.preventDefault()
    setErrorForm('')
    setExito('')

    if (!form.nombre.trim()) {
      setErrorForm('El nombre del equipo es obligatorio.')
      return
    }

    setEnviando(true)
    try {
      const nuevo = await equiposService.crear({
        nombre: form.nombre.trim(),
        capitanId: usuario.id,
        juegoPrincipalId: Number(form.juegoPrincipalId),
        estado: 'ACTIVO',
      })
      setEquipos([...equipos, nuevo])
      setExito(`Equipo "${nuevo.nombre}" registrado exitosamente.`)
      setForm({ nombre: '', juegoPrincipalId: 1 })
    } catch (err) {
      setErrorForm(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const eliminarEquipo = async (equipo) => {
    if (!window.confirm(`¿Eliminar el equipo "${equipo.nombre}"?`)) return
    setErrorForm('')
    try {
      await equiposService.eliminar(equipo.id)
      setEquipos(equipos.filter((eq) => eq.id !== equipo.id))
    } catch (err) {
      setErrorForm(err.message)
    }
  }

  const texto = busqueda.toLowerCase()
  const equiposFiltrados = equipos.filter(
    (eq) =>
      eq.nombre.toLowerCase().includes(texto) ||
      nombreJuego(eq.juegoPrincipalId).toLowerCase().includes(texto)
  )

  return (
    <div className="row g-4">
      <div className="col-md-5">
        <div className="card tarjeta border-secondary p-4">
          <h4 className="text-info mb-3">Registrar Escuadra</h4>

          {!autenticado ? (
            <p className="text-secondary mb-0">
              Inicia sesión para registrar un equipo en la plataforma.
            </p>
          ) : (
            <>
              {errorForm && <small className="alerta mb-3 d-block">{errorForm}</small>}
              {exito && <p className="ok mb-3">{exito}</p>}

              <form onSubmit={registrarEquipo}>
                <div className="mb-3">
                  <label htmlFor="equipo-nombre" className="form-label text-light">
                    Nombre del Equipo *
                  </label>
                  <input
                    id="equipo-nombre"
                    name="nombre"
                    autoComplete="organization"
                    list="sugerencias-equipos"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="Ej: T1 Esports"
                    required
                  />
                  <datalist id="sugerencias-equipos">
                    <option value="KRU Esports" />
                    <option value="Leviatan" />
                    <option value="Movistar R7" />
                    <option value="T1 Esports" />
                  </datalist>
                </div>

                <div className="mb-3">
                  <label htmlFor="equipo-juego" className="form-label text-light">
                    Juego Principal *
                  </label>
                  <select
                    id="equipo-juego"
                    name="juegoPrincipalId"
                    value={form.juegoPrincipalId}
                    onChange={(e) => setForm({ ...form, juegoPrincipalId: e.target.value })}
                    className="form-select bg-dark text-light border-secondary"
                  >
                    {JUEGOS.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn boton-primario w-100" disabled={enviando}>
                  {enviando ? 'Registrando...' : 'Registrar Equipo'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <div className="col-md-7">
        <div className="card tarjeta border-secondary p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h4 className="text-info m-0">Equipos Registrados ({equiposFiltrados.length})</h4>
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="equipo-buscar" className="visually-hidden">
                Buscar equipo
              </label>
              <input
                id="equipo-buscar"
                type="search"
                autoComplete="off"
                className="form-control form-control-sm bg-dark text-light border-secondary w-auto"
                placeholder="Buscar por nombre o juego..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-info btn-sm"
                disabled={refrescando}
                onClick={refrescar}
              >
                {refrescando ? '...' : 'Refrescar'}
              </button>
            </div>
          </div>

          {cargando ? (
            <div className="text-center py-4 text-light">
              <div className="spinner-border text-warning mb-2" role="status" />
              <p className="mb-1">Cargando equipos...</p>
              {lento && (
                <p className="text-warning small">
                  El servidor se está activando: puede tardar un minuto.
                </p>
              )}
            </div>
          ) : errorCarga ? (
            <div className="alert alert-danger">{errorCarga}</div>
          ) : equiposFiltrados.length === 0 ? (
            <p className="text-secondary">No se encontraron equipos.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle">
                <thead>
                  <tr>
                    <th>Escuadra</th>
                    <th>Juego</th>
                    <th>Estado</th>
                    {esAdmin && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {equiposFiltrados.map((eq) => (
                    <tr key={eq.id}>
                      <td className="fw-bold text-info">{eq.nombre}</td>
                      <td>{nombreJuego(eq.juegoPrincipalId)}</td>
                      <td>{eq.estado}</td>
                      {esAdmin && (
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarEquipo(eq)}
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

export default Equipos