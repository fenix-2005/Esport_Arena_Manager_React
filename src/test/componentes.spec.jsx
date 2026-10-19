import { act } from 'react'
import { createRoot } from 'react-dom/client'
import Inscripcion from '../components/Inscripcion'
import TarjetaTorneo from '../components/TarjetaTorneo'
import val_logo from'../assets/val_log.jpg'

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

  const clicEn = (boton) =>
    act(() => boton.dispatchEvent(new MouseEvent('click', { bubbles: true })))

  it('8. muestra el formulario de Inscripción de Jugador al montar', () => {
    act(() => raiz.render(<Inscripcion />))
    expect(contenedor.textContent).toContain('Inscripción de Jugador')
  })

  it('9. muestra alertas de validación al enviar el formulario vacío', () => {
    act(() => raiz.render(<Inscripcion />))
    const boton = contenedor.querySelector('button[type="submit"]')
    clicEn(boton)
    expect(contenedor.textContent).toContain('RUN inválido')
    expect(contenedor.textContent).toContain('El nombre es obligatorio')
  })

  it('10. muestra los datos de TarjetaTorneo y ejecuta el espía al hacer clic', () => {
    const torneo = {
      id: 1,
      nombre: 'Copa Valorant 2026',
      juego: 'Valorant',
      estado: 'Abierto',
      color: 'bg-success',
      cupos: 2,
      cuposCriticos: 3,
      imagen: val_logo,
    }
    const espiaDetalle = jasmine.createSpy('onVerDetalle')

    act(() =>
      raiz.render(<TarjetaTorneo torneo={torneo} onVerDetalle={espiaDetalle} />)
    )

    expect(contenedor.textContent).toContain('Copa Valorant 2026')
    expect(contenedor.textContent).toContain('Stock crítico')

    const boton = contenedor.querySelector('button')
    clicEn(boton)
    expect(espiaDetalle).toHaveBeenCalledWith(torneo)
  })
})