import {
  validarRun,
  validarCorreo,
  validarContrasena,
  validarApodo,
  validarRangoFechas,
  existeEquipo,
  guardarEnStorage,
} from '../logica/validaciones'

describe('Pruebas de lógica: validaciones eSports', () => {
  it('1. aprueba un RUN válido sin puntos ni guion', () => {
    expect(validarRun('115719890')).toBeTrue()
  })

  it('2. rechaza un RUN con puntos, guion o dígito verificador incorrecto', () => {
    expect(validarRun('19.011.022-K')).toBeFalse()
    expect(validarRun('12345678-5')).toBeFalse()
  })

  it('3. acepta solo correos @duoc.cl, @profesor.duoc.cl y @gmail.com', () => {
    expect(validarCorreo('jugador@duoc.cl')).toBeTrue()
    expect(validarCorreo('profe@profesor.duoc.cl')).toBeTrue()
    expect(validarCorreo('gamer@gmail.com')).toBeTrue()
    expect(validarCorreo('otro@hotmail.com')).toBeFalse()
  })

  it('4. comprueba los casos límite de la contraseña (entre 4 y 10 caracteres)', () => {
    expect(validarContrasena('123')).toBeFalse()
    expect(validarContrasena('1234')).toBeTrue()
    expect(validarContrasena('1234567890')).toBeTrue()
    expect(validarContrasena('12345678901')).toBeFalse()
  })

  it('5. rechaza apodos que contengan espacios en blanco', () => {
    expect(validarApodo('FakerPro')).toBeTrue()
    expect(validarApodo('Faker Pro')).toBeFalse()
  })

  it('6. detecta nombres de equipos duplicados e invalida fechas invertidas', () => {
    const lista = [{ nombre: 'Leviatan' }]
    expect(existeEquipo(lista, 'leviatan')).toBeTrue()
    expect(validarRangoFechas('2026-11-15', '2026-11-01')).toBeFalse()
  })

  it('7. guarda en almacenamiento usando un espía (spy)', () => {
    const storageFalso = {
      setItem: jasmine.createSpy('setItem'),
    }
    const datos = [{ apodo: 'Faker' }]

    const total = guardarEnStorage('inscripciones_esports', datos, storageFalso)

    expect(total).toBe(1)
    expect(storageFalso.setItem).toHaveBeenCalledTimes(1)
    expect(storageFalso.setItem).toHaveBeenCalledWith(
      'inscripciones_esports',
      JSON.stringify(datos)
    )
  })
})