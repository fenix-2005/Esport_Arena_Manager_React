import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { torneosService } from './services/torneos'
import Navbar from './components/Navbar'
import Inicio from './components/Inicio'
import Torneos from './components/Torneos'
import Inscripcion from './components/Inscripcion'
import Equipos from './components/Equipos'
import Perfil from './components/Perfil'
import Login from './components/Login'
import RutaProtegida from './auth/RutaProtegida'

function App() {
  const navigate = useNavigate()
  const [torneos, setTorneos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [lento, setLento] = useState(false)
  const [error, setError] = useState(null)
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null)

  useEffect(() => {
    const aviso = setTimeout(() => setLento(true), 4000)

    torneosService
      .listar()
      .then(setTorneos)
      .catch((e) => setError(e.message))
      .finally(() => {
        clearTimeout(aviso)
        setCargando(false)
      })

    return () => clearTimeout(aviso)
  }, [])

  const irADetalleTorneo = (torneo) => {
    setTorneoSeleccionado(torneo)
    navigate('/torneos')
  }

  const agregarTorneo = async (nuevo) => {
    const creado = await torneosService.crear(nuevo)
    setTorneos([...torneos, creado])
  }

  const eliminarTorneo = async (id) => {
    await torneosService.eliminar(id)
    setTorneos(torneos.filter((t) => t.id !== id))
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="container my-5">
        {cargando ? (
          <div className="text-center py-5 text-light">
            <div className="spinner-border text-warning mb-3" role="status" />
            <p className="mb-1">Cargando torneos...</p>
            {lento && (
              <p className="text-warning small">
                El servidor se está activando: puede tardar un minuto.
              </p>
            )}
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={<Inicio torneos={torneos} onIrADetalle={irADetalleTorneo} />}
            />
            <Route
              path="/torneos"
              element={
                <Torneos
                  torneos={torneos}
                  torneoDetalle={torneoSeleccionado}
                  onSeleccionarDetalle={setTorneoSeleccionado}
                  onIrAInscripcion={() => navigate('/inscripcion')}
                />
              }
            />
            <Route path="/equipos" element={<Equipos />} />
            <Route path="/Login" element={<Login />} />
            <Route
              path="/inscripcion"
              element={
                <RutaProtegida>
                  <Inscripcion />
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
                    onEliminarTorneo={eliminarTorneo}
                  />
                </RutaProtegida>
              }
            />
          </Routes>
        )}
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