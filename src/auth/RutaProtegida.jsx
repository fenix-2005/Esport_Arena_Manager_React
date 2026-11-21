import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function RutaProtegida({ children, rol }) {
  const { autenticado, usuario } = useAuth()
  const ubicacion = useLocation()

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }

  if (rol && usuario?.rol !== rol) {
    return (
      <div className="alert alert-danger mt-4">
        No tienes permiso para ver esta página.
      </div>
    )
  }

  return children
}