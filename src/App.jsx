import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { torneosIniciales } from './logica/datos'
import Navbar from './components/navbar'
import Inicio from './components/Inicio'
import Torneos from './components/Torneos'
import Inscripcion from './components/Inscripcion'
import Equipos from './components/Equipos'
import Perfil from './components/Perfil'
import Login from './pages/Login'
import RutaProtegida from './auth/RutaProtegida'

function App() {
  const navigate = useNavigate()
  const [torneos, setTorneos] = useState(torneosIniciales)
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null)

  const irADetalleTorneo = (torneo) => {
    setTorneoSeleccionado(torneo)
    navigate('/torneos')
  }

  const agregarTorneo = (nuevo) => {
    setTorneos([...torneos, nuevo])
  }

  const eliminarTorneo = (id) => {
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
          <Route path="/login" element={<Login />} />
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