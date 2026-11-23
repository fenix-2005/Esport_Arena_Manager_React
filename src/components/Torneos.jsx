import { useState } from 'react'
import TarjetaTorneo from './TarjetaTorneo'
import { validarRangoFechas } from '../logica/validaciones'

function Torneos({ torneos, onSeleccionarDetalle }) {
  const [busqueda, setBusqueda] = useState('')
  const [juegoFiltro, setJuegoFiltro] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [errorFiltro, setErrorFiltro] = useState('')

  const aplicarFiltros = (e) => {
    e.preventDefault()
    if (!busqueda.trim() && !juegoFiltro && !fechaInicio && !fechaFin) {
      setErrorFiltro('Debes ingresar al menos un criterio para filtrar.')
      return
    }
    if (!validarRangoFechas(fechaInicio, fechaFin)) {
      setErrorFiltro('La fecha de término no puede ser anterior a la fecha de inicio.')
      return
    }
    setErrorFiltro('')
  }

  const limpiar = () => {
    setBusqueda('')
    setJuegoFiltro('')
    setFechaInicio('')
    setFechaFin('')
    setErrorFiltro('')
  }

  const texto = busqueda.toLowerCase()
  const fechasValidas = validarRangoFechas(fechaInicio, fechaFin)

  const filtrados = torneos.filter((t) => {
    const coincideTexto = t.nombre.toLowerCase().includes(texto)
    const coincideJuego = juegoFiltro === '' || String(t.juegoId) === juegoFiltro
    const coincideInicio = !fechasValidas || !fechaInicio || t.fechaInicio >= fechaInicio
    const coincideFin = !fechasValidas || !fechaFin || t.fechaFin <= fechaFin
    return coincideTexto && coincideJuego && coincideInicio && coincideFin
  })

  return (
    <div>
      <h2 className="text-info text-center mb-4">Catálogo de Torneos</h2>

      <form className="card tarjeta border-secondary p-3 mb-4" onSubmit={aplicarFiltros}>
        {errorFiltro && <small className="alerta mb-2 d-block">{errorFiltro}</small>}
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label text-light">Nombre del Torneo</label>
            <input
              className="form-control bg-dark text-light border-secondary"
              placeholder="Ej: Copa Valorant"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label text-light">Juego</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              value={juegoFiltro}
              onChange={(e) => setJuegoFiltro(e.target.value)}
            >
              <option value="">Todos los juegos</option>
              <option value="1">Valorant</option>
              <option value="2">Counter-Strike 2</option>
              <option value="3">League of Legends</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label text-light">Desde</label>
            <input
              type="date"
              className="form-control bg-dark text-light border-secondary"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label text-light">Hasta</label>
            <input
              type="date"
              className="form-control bg-dark text-light border-secondary"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
          <div className="col-md-2 d-flex gap-2">
            <button type="submit" className="btn boton-primario w-100">
              Filtrar
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={limpiar}>
              Limpiar
            </button>
          </div>
        </div>
      </form>

      {torneos.length === 0 ? (
        <p className="text-secondary text-center">
          No hay torneos registrados en la base de datos todavía.
        </p>
      ) : filtrados.length === 0 ? (
        <p className="alerta text-center">No se encontraron torneos con esos criterios.</p>
      ) : (
        <div className="row g-4">
          {filtrados.map((t) => (
            <TarjetaTorneo key={t.id} torneo={t} onVerDetalle={onSeleccionarDetalle} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Torneos