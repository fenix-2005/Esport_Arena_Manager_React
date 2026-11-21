import { leerSesion, borrarSesion } from './session'

export async function solicitar(baseUrl, ruta, opciones = {}) {
  const token = leerSesion()?.token
  const headers = { 'Content-Type': 'application/json' }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${baseUrl}${ruta}`, {
    ...opciones,
    headers: { ...headers, ...opciones.headers },
  })

  if (res.status === 401 && token) {
    borrarSesion()
    window.dispatchEvent(new Event('sesion-expirada'))
  }

  if (!res.ok) {
    const cuerpo = await res.json().catch(() => ({}))
    throw new Error(cuerpo.mensaje || cuerpo.error || `Error ${res.status}`)
  }

  return res.status === 204 ? null : res.json()
}