import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import AccesoDenegado from '../components/AccesoDenegado'

export default function RutaProtegida({ children, rol }) {
  const { autenticado, usuario } = useAuth()
  const ubicacion = useLocation()

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }

  if (rol && usuario?.rol !== rol) {
    return <AccesoDenegado />
  }

  return children
}