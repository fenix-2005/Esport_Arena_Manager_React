import { leerSesion, borrarSesion } from './session'

async function extraerErrorBackend(res, baseUrl) {
  const texto = await res.text().catch(() => '')
  if (!texto) return `Error ${res.status} del servidor.`

  const limpio = texto.trim()
  if (limpio.startsWith('<')) {
    return `El servidor (${baseUrl}) devolvió una página HTML (código ${res.status}) en lugar de datos. Es probable que la URL esté mal configurada o el servicio aún se esté iniciando.`
  }

  try {
    const cuerpo = JSON.parse(texto)
    if (typeof cuerpo === 'string') return cuerpo
    if (cuerpo.mensaje) return cuerpo.mensaje
    if (cuerpo.message) return cuerpo.message
    if (cuerpo.error && typeof cuerpo.error === 'string') return cuerpo.error

    const valores = Object.values(cuerpo).filter((v) => typeof v === 'string')
    if (valores.length > 0) return valores.join(' · ')
  } catch {
    return texto
  }

  return `Error ${res.status} del servidor.`
}

export async function solicitar(baseUrl, ruta, opciones = {}) {
  if (!baseUrl) {
    throw new Error(
      'No está configurada la URL del backend (falta definir la variable VITE_*_URL en Vercel o en .env.development).'
    )
  }

  const token = leerSesion()?.token
  const headers = { 'Content-Type': 'application/json' }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${baseUrl}${ruta}`, {
      ...opciones,
      headers: { ...headers, ...opciones.headers },
    })
  } catch {
    throw new Error(
      `No se pudo conectar con el servidor (${baseUrl}). Verifica que el backend esté encendido o espera a que despierte.`
    )
  }

  if (res.status === 401 && token) {
    borrarSesion()
    window.dispatchEvent(new Event('sesion-expirada'))
  }

  if (!res.ok) {
    const mensajeBackend = await extraerErrorBackend(res, baseUrl)
    throw new Error(mensajeBackend)
  }

  if (res.status === 204) return null

  const tipo = res.headers.get('content-type') || ''
  if (!tipo.includes('application/json')) {
    throw new Error(
      `El servidor (${baseUrl}) respondió con HTML en lugar de JSON. Revisa que la URL termine en /api/v1 y que la variable de entorno esté bien configurada.`
    )
  }

  return res.json()
}