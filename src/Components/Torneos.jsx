import { useState } from 'react'
import TarjetaTorneo from './TarjetaTorneo'
import { validarRangoFechas } from '../logica/validaciones'

function Torneos({ torneos, torneoDetalle, onSeleccionarDetalle, onIrAInscripcion }) {
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

  
  if (torneoDetalle) {
    return (
      <div className="card tarjeta border-secondary p-4 mx-auto" style={{ maxWidth: 700 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="text-info m-0">{torneoDetalle.nombre}</h3>
          <span className={`badge ${torneoDetalle.color} text-dark`}>{torneoDetalle.estado}</span>
        </div>
        <p className="text-secondary mb-2"><strong>Juego:</strong> {torneoDetalle.juego}</p>
        <p className="mb-2"><strong>Fechas:</strong> {torneoDetalle.fechaInicio} al {torneoDetalle.fechaFin}</p>
        <p className="mb-2">
          <strong>Precio inscripción:</strong>{' '}
          {torneoDetalle.precio === 0 ? 'GRATIS ($0)' : `$${torneoDetalle.precio.toLocaleString('es-CL')}`}
        </p>
        <p className="mb-3"><strong>Cupos disponibles:</strong> {torneoDetalle.cupos}</p>
        <p className="border-top border-secondary pt-3">{torneoDetalle.descripcion}</p>

        <div className="d-flex gap-2 mt-4">
          <button
            type="button"
            className="btn btn-outline-light"
            onClick={() => onSeleccionarDetalle(null)}
          >
            Volver al listado
          </button>
          <button type="button" className="btn boton-primario" onClick={onIrAInscripcion}>
            Inscribirse a este Torneo
          </button>
        </div>
      </div>
    )
  }

  
  const texto = busqueda.toLowerCase()
  const fechasValidas = validarRangoFechas(fechaInicio, fechaFin)

  const filtrados = torneos.filter((t) => {
    const coincideTexto = t.nombre.toLowerCase().includes(texto)
    const coincideJuego = juegoFiltro === '' || t.juego === juegoFiltro
    const coincideInicio = !fechasValidas || !fechaInicio || t.fechaInicio >= fechaInicio
    const coincideFin = !fechasValidas || !fechaFin || t.fechaFin <= fechaFin
    return coincideTexto && coincideJuego && coincideInicio && coincideFin
  })

  return (
    <div>
      <h2 className="text-info text-center mb-4">Catálogo de Torneos</h2>

      <form className="card tarjeta border-secondary p-3 mb-4" onSubmit={aplicarFiltros}>
        {errorFiltro && <small className="alerta mb-2">{errorFiltro}</small>}
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
              <option value="Valorant">Valorant</option>
              <option value="Counter-Strike 2">Counter-Strike 2</option>
              <option value="League of Legends">League of Legends</option>
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
            <button type="submit" className="btn boton-primario w-100">Filtrar</button>
            <button type="button" className="btn btn-outline-secondary" onClick={limpiar}>Limpiar</button>
          </div>
        </div>
      </form>

      {filtrados.length === 0 ? (
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