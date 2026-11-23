import { solicitar } from '../services/api'

describe('Pruebas de servicio HTTP: api.js', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('17. lanza un error claro si falta la URL del backend (baseUrl vacía)', async () => {
    await expectAsync(solicitar(undefined, '/torneos')).toBeRejectedWithError(
      /No está configurada la URL del backend/
    )
  })

  it('18. explica el problema cuando el servidor devuelve HTML en lugar de JSON', async () => {
    spyOn(globalThis, 'fetch').and.returnValue(
      Promise.resolve(
        new Response('<!doctype html><html></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        })
      )
    )

    await expectAsync(solicitar('https://api.test/api/v1', '/torneos')).toBeRejectedWithError(
      /respondió con HTML en lugar de JSON/
    )
  })

  it('19. muestra el mensaje exacto enviado por el backend en un error 401/403', async () => {
    spyOn(globalThis, 'fetch').and.returnValue(
      Promise.resolve(
        new Response(JSON.stringify({ mensaje: 'Email o contraseña incorrectos' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    )

    await expectAsync(solicitar('https://api.test/api/v1', '/auth/login')).toBeRejectedWithError(
      'Email o contraseña incorrectos'
    )
  })

  it('20. une los mensajes de validación @Valid de Spring Boot', async () => {
    spyOn(globalThis, 'fetch').and.returnValue(
      Promise.resolve(
        new Response(
          JSON.stringify({
            nombre: 'El nombre es obligatorio',
            cupoMaximo: 'Debe ser mayor a 1',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      )
    )

    await expectAsync(solicitar('https://api.test/api/v1', '/torneos')).toBeRejectedWithError(
      'El nombre es obligatorio · Debe ser mayor a 1'
    )
  })

  it('21. avisa si el backend está caído o no responde', async () => {
    spyOn(globalThis, 'fetch').and.returnValue(Promise.reject(new TypeError('Failed to fetch')))

    await expectAsync(solicitar('https://api.test/api/v1', '/torneos')).toBeRejectedWithError(
      /No se pudo conectar con el servidor/
    )
  })

  it('22. devuelve el JSON correctamente cuando la respuesta es 200 OK', async () => {
    const mockTorneos = [{ id: 1, nombre: 'Copa Valorant' }]
    spyOn(globalThis, 'fetch').and.returnValue(
      Promise.resolve(
        new Response(JSON.stringify(mockTorneos), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    )

    const resultado = await solicitar('https://api.test/api/v1', '/torneos')
    expect(resultado).toEqual(mockTorneos)
  })
})