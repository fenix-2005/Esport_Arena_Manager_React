import { useState } from 'react'
import { validarApodo } from '../logica/validaciones'
import { LogosJuegos } from '../logica/datos'

function Perfil({ torneos, onAgregarTorneo, onEliminarTorneo }) {
  const [rol, setRol] = useState('Visitante')
  const [apodoActual, setApodoActual] = useState('JugadorPro99')
  const [nuevoApodo, setNuevoApodo] = useState('')
  const [errorApodo, setErrorApodo] = useState('')

  const [nuevoTorneo, setNuevoTorneo] = useState({
    nombre: '',
    juego: 'Valorant',
    cupos: 16,
    precio: 0,
  })
  const [errorAdmin, setErrorAdmin] = useState('')

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

  const crearTorneoAdmin = (e) => {
    e.preventDefault()
    if (nuevoTorneo.nombre.trim().length < 3) {
      setErrorAdmin('El nombre del torneo debe tener al menos 3 caracteres.')
      return
    }
    if (Number(nuevoTorneo.cupos) < 0 || Number(nuevoTorneo.precio) < 0) {
      setErrorAdmin('Los cupos y el precio no pueden ser negativos.')
      return
    }
    onAgregarTorneo({
      id: crypto.randomUUID(),
      nombre: nuevoTorneo.nombre.trim(),
      juego: nuevoTorneo.juego,
      estado: 'Abierto',
      color: 'bg-success',
      fechaInicio: '2026-12-01',
      fechaFin: '2026-12-15',
      cupos: Number(nuevoTorneo.cupos),
      cuposCriticos: 3,
      precio: Number(nuevoTorneo.precio),
      descripcion: 'Torneo creado desde el panel de administración.',
      imagen: LogosJuegos[nuevoTorneo.juego] ?? LogosJuegos['Valorant'],
    })
    setNuevoTorneo({ nombre: '', juego: 'Valorant', cupos: 16, precio: 0 })
    setErrorAdmin('')
  }

  return (
    <div className="row g-4">
      <div className="col-md-4">
        <div className="card tarjeta border-secondary p-4">
          <h4 className="text-info mb-2">{apodoActual}</h4>
          <p className="text-secondary mb-3">Rol activo: <strong className="text-light">{rol}</strong></p>

          <label className="form-label text-light">Simular Rol del Sistema</label>
          <select
            className="form-select bg-dark text-light border-secondary mb-4"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="Visitante">Cliente / Visitante</option>
            <option value="Organizador">Vendedor / Organizador</option>
            <option value="Administrador">Administrador</option>
          </select>

          <form onSubmit={actualizarApodo} className="border-top border-secondary pt-3">
            <label className="form-label text-light">Actualizar Apodo (Sin espacios)</label>
            <input
              className="form-control bg-dark text-light border-secondary mb-2"
              value={nuevoApodo}
              onChange={(e) => setNuevoApodo(e.target.value)}
              placeholder="NuevoApodo"
            />
            {errorApodo && <small className="alerta mb-2">{errorApodo}</small>}
            <button type="submit" className="btn boton-primario w-100">Guardar Apodo</button>
          </form>
        </div>
      </div>

      <div className="col-md-8">
        <div className="card tarjeta border-secondary p-4">
          <h4 className="text-info mb-3">Panel de {rol}</h4>

          {rol === 'Visitante' && (
            <p>Como visitante puedes explorar el catálogo de torneos e inscribirte en las competencias abiertas.</p>
          )}

          {(rol === 'Organizador' || rol === 'Administrador') && (
            <div className="mb-4">
              <h5 className="text-light">Resumen de Competiciones Activas</h5>
              <ul className="list-group list-group-flush">
                {torneos.map((t) => (
                  <li key={t.id} className="list-group-item bg-dark text-light d-flex justify-content-between align-items-center border-secondary">
                    <span>
                      <strong>{t.nombre}</strong> ({t.juego}) — Cupos: {t.cupos}
                    </span>
                    {rol === 'Administrador' && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onEliminarTorneo(t.id)}
                      >
                        Eliminar
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {rol === 'Administrador' && (
            <form onSubmit={crearTorneoAdmin} className="border-top border-secondary pt-3">
              <h5 className="text-info mb-3">Mantenedor: Crear Nuevo Torneo</h5>
              {errorAdmin && <small className="alerta mb-2">{errorAdmin}</small>}
              <div className="row g-2">
                <div className="col-md-5">
                  <input
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="Nombre del torneo"
                    value={nuevoTorneo.nombre}
                    onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, nombre: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select bg-dark text-light border-secondary"
                    value={nuevoTorneo.juego}
                    onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, juego: e.target.value })}
                  >
                    <option value="Valorant">Valorant</option>
                    <option value="Counter-Strike 2">Counter-Strike 2</option>
                    <option value="League of Legends">League of Legends</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="Cupos"
                    value={nuevoTorneo.cupos}
                    onChange={(e) => setNuevoTorneo({ ...nuevoTorneo, cupos: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <button type="submit" className="btn boton-primario w-100">Crear</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Perfil