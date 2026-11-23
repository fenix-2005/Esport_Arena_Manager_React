import { useEffect, useState } from 'react'
import { AuthContext } from './useAuth'
import { authService } from '../services/auth'
import { leerSesion, guardarSesion, borrarSesion } from '../services/session'

export default function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion)

  useEffect(() => {
    const alExpirar = () => setSesion(null)
    window.addEventListener('sesion-expirada', alExpirar)
    return () => window.removeEventListener('sesion-expirada', alExpirar)
  }, [])

  async function login(credenciales) {
    const datos = await authService.login(credenciales)
    guardarSesion(datos)
    setSesion(datos)
  }

  async function registrar(credenciales) {
    const datos = await authService.registro(credenciales)
    guardarSesion(datos)
    setSesion(datos)
  }

  function logout() {
    borrarSesion()
    setSesion(null)
  }

  const valor = {
    usuario: sesion?.usuario ?? null,
    autenticado: sesion !== null,
    esAdmin: sesion?.usuario?.rol === 'ADMIN',
    login,
    registrar,
    logout,
  }

  return <AuthContext value={valor}>{children}</AuthContext>
}