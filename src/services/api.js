import { leerSesion, borrarSesion } from './session'

async function extraerErrorBackend(res) {
  const texto = await res.text().catch(() => '')
  if (!texto) return `Error ${res.status} del servidor`

  try {
    const cuerpo = JSON.parse(texto)
    if (typeof cuerpo === 'string') return cuerpo
    if (cuerpo.mensaje) return cuerpo.mensaje
    if (cuerpo.message) return cuerpo.message
    if (cuerpo.error && typeof cuerpo.error === 'string') return cuerpo.error

    // Errores de validación @Valid de Spring Boot 
    const valores = Object.values(cuerpo).filter((v) => typeof v === 'string')
    if (valores.length > 0) return valores.join(' · ')
  } catch {
    if (!texto.trim().startsWith('<')) return texto
  }

  return `Error ${res.status} del servidor`
}

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
    const mensajeBackend = await extraerErrorBackend(res)
    throw new Error(mensajeBackend)
  }

  return res.status === 204 ? null : res.json()
}