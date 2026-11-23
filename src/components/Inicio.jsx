import TarjetaTorneo from './TarjetaTorneo'

function Inicio({ torneos, onIrADetalle }) {
  return (
    <div>
      {/* 1. Video */}
      <section className="text-center seccion-video">
        <h4 className="text-info mb-4">La Experiencia eSports</h4>
        <div className="video-centrado ratio ratio-16x9">
          <iframe
            src="https://www.youtube.com/embed/e_E9W2vsRbQ?autoplay=0&rel=0"
            title="Presentación eSports Arena"
            allowFullScreen
          />
        </div>
      </section>

      <div className="text-center mb-4">
        <h2>Torneos Activos</h2>
        <p className="text-secondary">Inscríbete en las competiciones de la temporada.</p>
      </div>

      {torneos.length === 0 ? (
        <div className="card tarjeta border-secondary p-4 text-center">
          <p className="text-secondary mb-0">
            No hay torneos registrados en la base de datos todavía.
          </p>
        </div>
      ) : (
        <section className="row g-4">
          {torneos.map((t) => (
            <TarjetaTorneo key={t.id} torneo={t} onVerDetalle={onIrADetalle} />
          ))}
        </section>
      )}
    </div>
  )
}

export default Inicio