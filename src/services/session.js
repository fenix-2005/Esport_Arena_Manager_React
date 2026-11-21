const CLAVE = 'sesion'

function vencida(sesion) {
  try {
    const parte = sesion.token.split('.')[1]
    const base64 = parte.replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(base64))
    return exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function leerSesion() {
  const texto = localStorage.getItem(CLAVE)
  if (!texto) return null
  try {
    const sesion = JSON.parse(texto)
    if (sesion && vencida(sesion)) {
      borrarSesion()
      return null
    }
    return sesion
  } catch {
    borrarSesion()
    return null
  }
}

export function guardarSesion(sesion) {
  localStorage.setItem(CLAVE, JSON.stringify(sesion))
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE)
}