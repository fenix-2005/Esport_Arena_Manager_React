import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { torneosService } from './services/torneos'
import Navbar from './components/Navbar'
import CargandoServidor from './components/CargandoServidor'
import Inicio from './components/Inicio'
import Torneos from './components/Torneos'
import DetalleTorneo from './components/DetalleTorneo'
import Inscripcion from './components/Inscripcion'
import Equipos from './components/Equipos'
import Perfil from './components/Perfil'
import Login from './components/Login'
import RutaProtegida from './auth/RutaProtegida'
import Registro from './components/Registro'
import NoEncontrado from './components/NoEncontrado'

function App() {
  const navigate = useNavigate()
  const [torneos, setTorneos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [lento, setLento] = useState(false)
  const [errorConexion, setErrorConexion] = useState(null)

  const cargarDatos = useCallback(() => {
    setCargando(true)
    setLento(false)
    setErrorConexion(null)

    const aviso = setTimeout(() => setLento(true), 4000)

    torneosService
      .listar()
      .then(setTorneos)
      .catch((e) => setErrorConexion(e.message))
      .finally(() => {
        clearTimeout(aviso)
        setCargando(false)
      })

    return () => clearTimeout(aviso)
  }, [])

  useEffect(() => {
    return cargarDatos()
  }, [cargarDatos])

  if (cargando || errorConexion) {
    return (
      <CargandoServidor
        lento={lento}
        error={errorConexion}
        onReintentar={cargarDatos}
      />
    )
  }

  const irADetalleTorneo = (torneo) => navigate(`/torneos/${torneo.id}`)

  const agregarTorneo = async (nuevo) => {
    const creado = await torneosService.crear(nuevo)
    setTorneos([...torneos, creado])
    return creado
  }

  const actualizarTorneo = async (id, datos) => {
    const actualizado = await torneosService.actualizar(id, datos)
    setTorneos(torneos.map((t) => (t.id === id ? actualizado : t)))
    return actualizado
  }

  const eliminarTorneo = async (id) => {
    await torneosService.eliminar(id)
    setTorneos(torneos.filter((t) => t.id !== id))
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="container my-5">
        <Routes>
          <Route
            path="/"
            element={<Inicio torneos={torneos} onIrADetalle={irADetalleTorneo} />}
          />
          <Route
            path="/torneos"
            element={<Torneos torneos={torneos} onSeleccionarDetalle={irADetalleTorneo} />}
          />
          <Route
            path="/torneos/:id"
            element={
              <DetalleTorneo
                torneos={torneos}
                onActualizarTorneo={actualizarTorneo}
                onEliminarTorneo={eliminarTorneo}
              />
            }
          />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/inscripcion"
            element={
              <RutaProtegida>
                <Inscripcion torneos={torneos} />
              </RutaProtegida>
            }
          />
          <Route
            path="/perfil"
            element={
              <RutaProtegida>
                <Perfil
                  torneos={torneos}
                  onAgregarTorneo={agregarTorneo}
                  onActualizarTorneo={actualizarTorneo}
                  onEliminarTorneo={eliminarTorneo}
                />
              </RutaProtegida>
            }
          />
          <Route
            path="/admin"
            element={
              <RutaProtegida rol="ADMIN">
                <Perfil
                  torneos={torneos}
                  onAgregarTorneo={agregarTorneo}
                  onActualizarTorneo={actualizarTorneo}
                  onEliminarTorneo={eliminarTorneo}
                />
              </RutaProtegida>
            }
          />
          <Route path="/registro" element={<Registro />} />
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>

      <footer className="py-4 mt-auto text-center">
        <p className="mb-0 text-secondary">
          © 2026 eSports Arena Manager. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}

export default App