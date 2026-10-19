//1. Validar Correo: @duoc.cl, @profesor.duoc.cl y @gmail.com, máx 100 caracteres

export function validarCorreo(correo) {
  if (!correo || correo.trim() === '' || correo.length > 100) return false
  const limpio = correo.trim().toLowerCase()
  const dominios = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com']
  return dominios.some((dominio) => limpio.endsWith(dominio))
}

// 2. Validar Contraseña: entre 4 y 10 caracteres
export function validarContrasena(contrasena) {
  if (!contrasena) return false
  const limpia = contrasena.trim()
  return limpia.length >= 4 && limpia.length <= 10
}

// 3. Validar RUN chileno: sin puntos ni guion, 7 a 9 caracteres 
export function validarRun(run) {
  if (!run) return false
  const limpio = run.trim()
  if (limpio.length < 7 || limpio.length > 9) return false

  const formatoValido = /^[0-9]{6,8}[0-9kK]$/
  if (!formatoValido.test(limpio)) return false

  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1).toUpperCase()

  let suma = 0
  let multiplo = 2

  for (let i = 1; i <= cuerpo.length; i++) {
    const index = multiplo * Number(cuerpo.charAt(cuerpo.length - i))
    suma = suma + index
    multiplo = multiplo < 7 ? multiplo + 1 : 2
  }

  const dvEsperado = 11 - (suma % 11)
  let dvCalculado = String(dvEsperado)
  if (dvEsperado === 11) dvCalculado = '0'
  if (dvEsperado === 10) dvCalculado = 'K'

  return dvCalculado === dv
}

// 4. Validar Apodo (sin espacios y al menos 3 caracteres)
export function validarApodo(apodo) {
  if (!apodo) return false
  const limpio = apodo.trim()
  return limpio.length >= 3 && !limpio.includes(' ')
}
// 5. Validar Fechas de Torneo (fecha término no puede ser anterior a inicio)
export function validarRangoFechas(inicio, fin) {
  if (!inicio || !fin) return true
  return fin >= inicio
}

// 6. Validar Equipo Duplicado
export function existeEquipo(listaEquipos, nombreNuevo) {
  if (!nombreNuevo) return false
  const limpio = nombreNuevo.trim().toLowerCase()
  return listaEquipos.some((eq) => eq.nombre.toLowerCase() === limpio)
}

// 7. Validar Formulario de Inscripción 
export function validarInscripcion(datos) {
  const errores = {}
  if (!validarApodo(datos.apodo)) {
    errores.apodo = 'El apodo debe tener al menos 3 letras y no contener espacios'
  }
  if (!validarRun(datos.run)) {
    errores.run = 'RUN inválido (7 a 9 caracteres, sin puntos ni guion)'
  }
  if (!datos.nombre || datos.nombre.trim() === '') {
    errores.nombre = 'El nombre es obligatorio'
  }
  if (!datos.apellidos || datos.apellidos.trim() === '') {
    errores.apellidos = 'Los apellidos son obligatorios'
  }
  if (!validarCorreo(datos.correo)) {
    errores.correo = 'Solo se permite @duoc.cl, @profesor.duoc.cl o @gmail.com'
  }
  if (!validarContrasena(datos.contrasena)) {
    errores.contrasena = 'La contraseña debe tener entre 4 y 10 caracteres'
  }
  if (!datos.region) {
    errores.region = 'Seleccione una región'
  }
  if (!datos.comuna) {
    errores.comuna = 'Seleccione una comuna'
  }
  if (!datos.direccion || datos.direccion.trim() === '') {
    errores.direccion = 'La dirección es obligatoria'
  }
  return errores
}

export function guardarEnStorage(clave, datos, almacenamiento = localStorage) {
  almacenamiento.setItem(clave, JSON.stringify(datos))
  return datos.length
}