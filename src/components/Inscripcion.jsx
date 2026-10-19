import { useState, useEffect } from 'react'
import { validarInscripcion } from '../logica/validaciones'
import { datosTerritoriales } from '../logica/datos'

const inicial = {
  apodo: '',
  run: '',
  fechaNac: '',
  nombre: '',
  apellidos: '',
  correo: '',
  contrasena: '',
  region: '',
  comuna: '',
  direccion: '',
  juego: 'Valorant',
}

const requisitosPorJuego = {
  Valorant: 'Requisito: Cuenta Riot activa y nivel mínimo 20.',
  'Counter-Strike 2': 'Requisito: Estado Prime activo en Steam.',
  'League of Legends': 'Requisito: Nivel de invocador 30 y 20 campeones.',
}

function Inscripcion() {
  const [datos, setDatos] = useState(inicial)
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  const [inscritos, setInscritos] = useState(
    () => JSON.parse(localStorage.getItem('inscripciones_esports')) ?? []
  )

  useEffect(() => {
    localStorage.setItem('inscripciones_esports', JSON.stringify(inscritos))
  }, [inscritos])

  const cambiar = (e) => {
    const { name, value } = e.target
    if (name === 'region') {
      setDatos({ ...datos, region: value, comuna: '' })
    } else {
      setDatos({ ...datos, [name]: value })
    }
  }

  const enviar = (e) => {
    e.preventDefault()
    setEnviado(false)

    const encontrados = validarInscripcion(datos)
    setErrores(encontrados)

    if (Object.keys(encontrados).length > 0) return

    const nuevo = { ...datos, id: crypto.randomUUID() }
    setInscritos([...inscritos, nuevo])
    setEnviado(true)
    setDatos(inicial)
  }

  const comunasDisponibles = datos.region ? datosTerritoriales[datos.region] : []

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-7">
        <div className="card tarjeta border-secondary p-4">
          <h3 className="text-info text-center mb-3">Inscripción de Jugador</h3>

          <div className="alert alert-secondary py-2 text-center">
            {requisitosPorJuego[datos.juego]}
          </div>

          {enviado && (
            <div className="alert alert-success">
              ¡Inscripción validada y guardada en LocalStorage! Total inscritos: {inscritos.length}
            </div>
          )}

          <form onSubmit={enviar} noValidate>
            <div className="row mb-3">
              <div className="col-md-6 mb-3">
                <label htmlFor="apodo" className="form-label text-light">Nombre Perfil o Apodo *</label>
                <input
                  id="apodo"
                  name="apodo"
                  value={datos.apodo}
                  onChange={cambiar}
                  className="form-control bg-dark text-light border-secondary"
                />
                {errores.apodo && <small className="alerta">{errores.apodo}</small>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="run" className="form-label text-light">RUN *</label>
                <input
                  id="run"
                  name="run"
                  placeholder="Sin puntos ni guion (Ej: 19011022K)"
                  value={datos.run}
                  onChange={cambiar}
                  className="form-control bg-dark text-light border-secondary"
                  maxLength={9}
                />
                {errores.run && <small className="alerta">{errores.run}</small>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="fechaNac" className="form-label text-light">Fecha Nacimiento (Opcional)</label>
                <input
                  id="fechaNac"
                  name="fechaNac"
                  type="date"
                  value={datos.fechaNac}
                  onChange={cambiar}
                  className="form-control bg-dark text-light border-secondary"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="juego" className="form-label text-light">Juego a Competir *</label>
                <select
                  id="juego"
                  name="juego"
                  value={datos.juego}
                  onChange={cambiar}
                  className="form-select bg-dark text-light border-secondary"
                >
                  <option value="Valorant">Valorant</option>
                  <option value="Counter-Strike 2">Counter-Strike 2</option>
                  <option value="League of Legends">League of Legends</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="nombre" className="form-label text-light">Nombres *</label>
                <input
                  id="nombre"
                  name="nombre"
                  value={datos.nombre}
                  onChange={cambiar}
                  className="form-control bg-dark text-light border-secondary"
                  maxLength={50}
                />
                {errores.nombre && <small className="alerta">{errores.nombre}</small>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="apellidos" className="form-label text-light">Apellidos *</label>
                <input
                  id="apellidos"
                  name="apellidos"
                  value={datos.apellidos}
                  onChange={cambiar}
                  className="form-control bg-dark text-light border-secondary"
                  maxLength={100}
                />
                {errores.apellidos && <small className="alerta">{errores.apellidos}</small>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="region" className="form-label text-light">Región *</label>
                <select
                  id="region"
                  name="region"
                  value={datos.region}
                  onChange={cambiar}
                  className="form-select bg-dark text-light border-secondary"
                >
                  <option value="">Seleccione región...</option>
                  {Object.keys(datosTerritoriales).map((reg) => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
                {errores.region && <small className="alerta">{errores.region}</small>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="comuna" className="form-label text-light">Comuna *</label>
                <select
                  id="comuna"
                  name="comuna"
                  value={datos.comuna}
                  onChange={cambiar}
                  disabled={!datos.region}
                  className="form-select bg-dark text-light border-secondary"
                >
                  <option value="">Seleccione comuna...</option>
                  {comunasDisponibles.map((com) => (
                    <option key={com} value={com}>{com}</option>
                  ))}
                </select>
                {errores.comuna && <small className="alerta">{errores.comuna}</small>}
              </div>

              <div className="col-md-12 mb-3">
                <label htmlFor="direccion" className="form-label text-light">Dirección *</label>
                <input
                  id="direccion"
                  name="direccion"
                  value={datos.direccion}
                  onChange={cambiar}
                  className="form-control bg-dark text-light border-secondary"
                  maxLength={300}
                />
                {errores.direccion && <small className="alerta">{errores.direccion}</small>}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="correo" className="form-label text-light">Correo Electrónico *</label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  placeholder="@duoc.cl o @gmail.com"
                  value={datos.correo}
                  onChange={cambiar}
                  className="form-control bg-dark text-light border-secondary"
                  maxLength={100}
                />
                {errores.correo && <small className="alerta">{errores.correo}</small>}
              </div>

              <div className="col-md-6 mb-4">
                <label htmlFor="contrasena" className="form-label text-light">Contraseña *</label>
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  placeholder="Entre 4 y 10 caracteres"
                  value={datos.contrasena}
                  onChange={cambiar}
                  className="form-control bg-dark text-light border-secondary"
                />
                {errores.contrasena && <small className="alerta">{errores.contrasena}</small>}
              </div>

              <div className="col-12">
                <button type="submit" className="btn boton-primario w-100">Crear Cuenta</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Inscripcion