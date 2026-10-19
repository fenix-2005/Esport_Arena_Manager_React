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

      {/* 2. Torneos  */}
      <div className="text-center mb-4">
        <h2>Torneos </h2>
        <p className="text-secondary">Inscríbete en las competiciones de la temporada.</p>
      </div>

      <section className="row g-4">
        {torneos.map((t) => (
          <TarjetaTorneo key={t.id} torneo={t} onVerDetalle={onIrADetalle} />
        ))}
      </section>
    </div>
  )
}

export default Inicio