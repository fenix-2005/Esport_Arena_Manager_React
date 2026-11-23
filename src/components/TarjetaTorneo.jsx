import { LogosJuegos } from '../logica/datos'

const NOMBRES_JUEGOS = {
  1: 'Valorant',
  2: 'Counter-Strike 2',
  3: 'League of Legends',
}

function colorEstado(estado = '') {
  const e = estado.toUpperCase()
  if (e === 'ABIERTO') return 'bg-success'
  if (e === 'EN_CURSO' || e === 'EN CURSO') return 'bg-warning'
  return 'bg-danger'
}

function TarjetaTorneo({ torneo, onVerDetalle }) {
  const { nombre, juegoId, estado, cupoMaximo, modalidad } = torneo
  const nombreJuego = NOMBRES_JUEGOS[juegoId] || `Juego #${juegoId}`
  const imagen = LogosJuegos[nombreJuego] || LogosJuegos.Valorant

  return (
      <article className="col-12 col-md-4">
        <div className="card tarjeta h-100 border-secondary overflow-hidden">
          <img
              src={imagen}
              className="card-img-top p-3"
              alt={nombreJuego}
              style={{ maxHeight: 140, objectFit: 'contain', opacity: 0.9 }}
          />
          <div className="card-body text-center d-flex flex-column border-top border-secondary">
            <h5 className="card-title text-info mb-2">{nombre}</h5>
            <p className="mb-1 text-secondary">
              {nombreJuego} · {modalidad}
            </p>
            <p className="mb-2 text-light small">Cupo máximo: {cupoMaximo}</p>
            <p className="mb-3">
              <span className={`badge ${colorEstado(estado)} text-dark`}>{estado}</span>
            </p>
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