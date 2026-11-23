import { Link } from 'react-router-dom'

export default function NoEncontrado() {
  return (
    <div className="row justify-content-center my-5">
      <div className="col-md-6">
        <div className="card tarjeta border-secondary p-5 text-center">
          <h1 className="display-4 text-warning fw-bold mb-2">404</h1>
          <h4 className="text-light mb-3">Página no encontrada</h4>
          <p className="text-secondary mb-4">
            La dirección que buscas no existe o fue movida.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link to="/" className="btn boton-primario">
              Volver al Inicio
            </Link>
            <Link to="/torneos" className="btn btn-outline-light">
              Ver Torneos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}