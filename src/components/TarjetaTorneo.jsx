function TarjetaTorneo({ torneo, onVerDetalle }) {
  const { nombre, juego, estado, color, imagen, cupos, cuposCriticos } = torneo
  const esCritico = cupos > 0 && cupos <= cuposCriticos

  return (
    <article className="col-12 col-md-4">
      <div className="card tarjeta h-100 border-secondary overflow-hidden">
        <img
          src={imagen}
          className="card-img-top p-3"
          alt={juego}
          style={{ maxHeight: 140, objectFit: 'contain', opacity: 0.9 }}
        />
        <div className="card-body text-center d-flex flex-column border-top border-secondary">
          <h5 className="card-title text-info mb-2">{nombre}</h5>
          <p className="mb-2 text-secondary">{juego}</p>
          <p className="mb-2">
            <span className={`badge ${color} text-dark`}>{estado}</span>
          </p>
          {esCritico && (
            <small className="alerta mb-2">¡Alerta! Quedan solo {cupos} cupos (Stock crítico)</small>
          )}
          <button
            type="button"
            className="btn boton-primario mt-auto w-100"
            onClick={() => onVerDetalle(torneo)}
          >
            Ver Detalle
          </button>
        </div>
      </div>
    </article>
  )
}

export default TarjetaTorneo