import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from '../auth/useAuth'
import TarjetaTorneo from '../components/TarjetaTorneo'
import Torneos from '../components/Torneos'
import CargandoServidor from '../components/CargandoServidor'
import NoEncontrado from '../components/NoEncontrado'
import RutaProtegida from '../auth/RutaProtegida'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('Pruebas de componentes DOM: eSports Arena', () => {
  let contenedor
  let raiz

  beforeEach(() => {
    contenedor = document.createElement('div')
    document.body.appendChild(contenedor)
    raiz = createRoot(contenedor)
  })

  afterEach(() => {
    act(() => raiz.unmount())
    contenedor.remove()
  })

  const clicEn = (el) =>
    act(() => el.dispatchEvent(new MouseEvent('click', { bubbles: true })))

  const renderConAuth = (ui, auth = { autenticado: false, usuario: null, esAdmin: false }, ruta = '/') => {
    act(() =>
      raiz.render(
        <MemoryRouter initialEntries={[ruta]}>
          <AuthContext value={auth}>{ui}</AuthContext>
        </MemoryRouter>
      )
    )
  }

  it('8. TarjetaTorneo muestra los datos reales del DTO y dispara onVerDetalle', () => {
    const torneo = {
      id: 1,
      nombre: 'Copa Valorant 2026',
      juegoId: 1,
      estado: 'ABIERTO',
      cupoMaximo: 16,
      modalidad: '5v5',
    }
    const espiaDetalle = jasmine.createSpy('onVerDetalle')

    act(() => raiz.render(<TarjetaTorneo torneo={torneo} onVerDetalle={espiaDetalle} />))

    expect(contenedor.textContent).toContain('Copa Valorant 2026')
    expect(contenedor.textContent).toContain('Valorant')
    expect(contenedor.textContent).toContain('5v5')
    expect(contenedor.textContent).toContain('Cupo máximo: 16')
    expect(contenedor.textContent).toContain('ABIERTO')

    clicEn(contenedor.querySelector('button'))
    expect(espiaDetalle).toHaveBeenCalledWith(torneo)
  })

  it('9. Torneos muestra mensaje cuando no hay torneos en la base de datos', () => {
    act(() => raiz.render(<Torneos torneos={[]} onSeleccionarDetalle={() => {}} />))
    expect(contenedor.textContent).toContain('No hay torneos registrados en la base de datos')
  })

  it('10. Torneos ejecuta onRefrescar al presionar el botón Refrescar', () => {
    const espiaRefrescar = jasmine.createSpy('onRefrescar').and.returnValue(Promise.resolve())
    act(() =>
      raiz.render(
        <Torneos torneos={[]} onSeleccionarDetalle={() => {}} onRefrescar={espiaRefrescar} />
      )
    )

    const botonRefrescar = Array.from(contenedor.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Refrescar')
    )
    clicEn(botonRefrescar)
    expect(espiaRefrescar).toHaveBeenCalledTimes(1)
  })

  it('11. CargandoServidor muestra aviso de arranque en frío cuando lento es true', () => {
    act(() => raiz.render(<CargandoServidor lento={true} error={null} onReintentar={() => {}} />))
    expect(contenedor.textContent).toContain('Conectando con el servidor...')
    expect(contenedor.textContent).toContain('arranque en frío')
  })

  it('12. CargandoServidor muestra el error y ejecuta onReintentar al hacer clic', () => {
    const espiaReintentar = jasmine.createSpy('onReintentar')
    act(() =>
      raiz.render(
        <CargandoServidor
          lento={false}
          error="No se pudo conectar con el servidor"
          onReintentar={espiaReintentar}
        />
      )
    )

    expect(contenedor.textContent).toContain('No se pudo conectar con el servidor')
    clicEn(contenedor.querySelector('button'))
    expect(espiaReintentar).toHaveBeenCalledTimes(1)
  })

  it('13. RutaProtegida redirige a /login si el usuario no está autenticado', () => {
    renderConAuth(
      <Routes>
        <Route path="/login" element={<div>Pantalla de Login</div>} />
        <Route
          path="/admin"
          element={
            <RutaProtegida rol="ADMIN">
              <div>Zona Admin</div>
            </RutaProtegida>
          }
        />
      </Routes>,
      { autenticado: false, usuario: null, esAdmin: false },
      '/admin'
    )

    expect(contenedor.textContent).toContain('Pantalla de Login')
    expect(contenedor.textContent).not.toContain('Zona Admin')
  })

  it('14. RutaProtegida muestra error 403 Acceso Denegado si un JUGADOR entra a /admin', () => {
    renderConAuth(
      <Routes>
        <Route
          path="/admin"
          element={
            <RutaProtegida rol="ADMIN">
              <div>Zona Admin</div>
            </RutaProtegida>
          }
        />
      </Routes>,
      {
        autenticado: true,
        usuario: { id: 2, email: 'jugador@esports.cl', rol: 'JUGADOR' },
        esAdmin: false,
      },
      '/admin'
    )

    expect(contenedor.textContent).toContain('403')
    expect(contenedor.textContent).toContain('Acceso Denegado')
    expect(contenedor.textContent).not.toContain('Zona Admin')
  })

  it('15. RutaProtegida permite el acceso a /admin cuando el rol es ADMIN', () => {
    renderConAuth(
      <Routes>
        <Route
          path="/admin"
          element={
            <RutaProtegida rol="ADMIN">
              <div>Zona Admin</div>
            </RutaProtegida>
          }
        />
      </Routes>,
      {
        autenticado: true,
        usuario: { id: 1, email: 'admin@esports.cl', rol: 'ADMIN' },
        esAdmin: true,
      },
      '/admin'
    )

    expect(contenedor.textContent).toContain('Zona Admin')
  })

  it('16. NoEncontrado muestra la página 404 correctamente', () => {
    renderConAuth(<NoEncontrado />)
    expect(contenedor.textContent).toContain('404')
    expect(contenedor.textContent).toContain('Página no encontrada')
  })
})