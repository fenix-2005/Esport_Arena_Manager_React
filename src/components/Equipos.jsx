import { useState } from 'react'
import { equiposIniciales } from '../logica/datos'
import { existeEquipo } from '../logica/validaciones'

function Equipos() {
  const [equipos, setEquipos] = useState(equiposIniciales)
  const [form, setForm] = useState({ nombre: '', juego: 'Valorant', capitan: '' })
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const cambiar = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const registrarEquipo = (e) => {
    e.preventDefault()
    setError('')
    setExito('')

    if (!form.nombre.trim() || !form.capitan.trim()) {
      setError('Todos los campos del equipo son obligatorios.')
      return
    }

    if (existeEquipo(equipos, form.nombre)) {
      setError('Ya existe un equipo registrado con ese nombre.')
      return
    }

    const nuevo = {
      id: crypto.randomUUID(),
      nombre: form.nombre.trim(),
      juego: form.juego,
      capitan: form.capitan.trim(),
      miembros: 5,
    }

    setEquipos([...equipos, nuevo])
    setExito(`Equipo "${nuevo.nombre}" registrado exitosamente.`)
    setForm({ nombre: '', juego: 'Valorant', capitan: '' })
  }

  return (
    <div className="row g-4">
      <div className="col-md-5">
        <div className="card tarjeta border-secondary p-4">
          <h4 className="text-info mb-3">Registrar Escuadra</h4>
          {error && <small className="alerta mb-3">{error}</small>}
          {exito && <p className="ok mb-3">{exito}</p>}

          <form onSubmit={registrarEquipo}>
            <div className="mb-3">
              <label className="form-label text-light">Nombre del Equipo *</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={cambiar}
                className="form-control bg-dark text-light border-secondary"
                placeholder="Ej: T1 Esports"
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-light">Juego Principal *</label>
              <select
                name="juego"
                value={form.juego}
                onChange={cambiar}
                className="form-select bg-dark text-light border-secondary"
              >
                <option value="Valorant">Valorant</option>
                <option value="Counter-Strike 2">Counter-Strike 2</option>
                <option value="League of Legends">League of Legends</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label text-light">Apodo del Capitán *</label>
              <input
                name="capitan"
                value={form.capitan}
                onChange={cambiar}
                className="form-control bg-dark text-light border-secondary"
              />
            </div>
            <button type="submit" className="btn boton-primario w-100">Registrar Equipo</button>
          </form>
        </div>
      </div>

      <div className="col-md-7">
        <div className="card tarjeta border-secondary p-4">
          <h4 className="text-info mb-3">Equipos Registrados ({equipos.length})</h4>
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle">
              <thead>
                <tr>
                  <th>Escuadra</th>
                  <th>Juego</th>
                  <th>Capitán</th>
                  <th>Titulares</th>
                </tr>
              </thead>
              <tbody>
                {equipos.map((eq) => (
                  <tr key={eq.id}>
                    <td className="fw-bold text-info">{eq.nombre}</td>
                    <td>{eq.juego}</td>
                    <td>{eq.capitan}</td>
                    <td>{eq.miembros}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Equipos