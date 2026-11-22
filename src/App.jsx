import { useState } from 'react'
import { torneosIniciales } from './logica/datos'
import Inicio from './components/Inicio'
import Torneos from './components/Torneos'
import Inscripcion from './components/Inscripcion'
import Equipos from './components/Equipos'
import Perfil from './components/Perfil'

const SECCIONES = [
  { id: 'inicio', titulo: 'Inicio' },
  { id: 'torneos', titulo: 'Torneos' },
  { id: 'inscripcion', titulo: 'Inscripción' },
  { id: 'equipos', titulo: 'Equipos' },
  { id: 'perfil', titulo: 'Perfil' },
]

function App() {
  const [activa, setActiva] = useState('inicio')
  const [torneos, setTorneos] = useState(torneosIniciales)
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null)

  const irADetalleTorneo = (torneo) => {
    setTorneoSeleccionado(torneo)
    setActiva('torneos')
  }

  const agregarTorneo = (nuevo) => {
    setTorneos([...torneos, nuevo])
  }

  const eliminarTorneo = (id) => {
    setTorneos(torneos.filter((t) => t.id !== id))
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="py-3 shadow-sm">
        <div className="container d-flex flex-wrap justify-content-between align-items-center">
          <h1 className="titulo-principal">eSports Arena Manager</h1>
          <nav>
            <ul className="nav gap-1">
              {SECCIONES.map((s) => (
                <li key={s.id} className="nav-item">
                  <button
                    type="button"
                    className={activa === s.id ? 'btn boton-primario' : 'btn btn-dark text-light'}
                    onClick={() => {
                      setTorneoSeleccionado(null)
                      setActiva(s.id)
                    }}
                  >
                    {s.titulo}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="container my-5">
        {activa === 'inicio' && (
          <Inicio torneos={torneos} onIrADetalle={irADetalleTorneo} />
        )}
        {activa === 'torneos' && (
          <Torneos
            torneos={torneos}
            torneoDetalle={torneoSeleccionado}
            onSeleccionarDetalle={setTorneoSeleccionado}
            onIrAInscripcion={() => setActiva('inscripcion')}
          />
        )}
        {activa === 'inscripcion' && <Inscripcion />}
        {activa === 'equipos' && <Equipos />}
        {activa === 'perfil' && (
          <Perfil
            torneos={torneos}
            onAgregarTorneo={agregarTorneo}
            onEliminarTorneo={eliminarTorneo}
          />
        )}
      </main>

      <footer className="py-4 mt-auto text-center">
        <p className="mb-0 text-secondary">© 2026 eSports Arena Manager. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default App
