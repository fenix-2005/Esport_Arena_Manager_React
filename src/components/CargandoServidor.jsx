export default function CargandoServidor({ lento, error, onReintentar }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-dark text-light text-center p-4">
      <h2 className="titulo-principal mb-4">eSports Arena Manager</h2>

      {error ? (
        <div className="card tarjeta border-danger p-4" style={{ maxWidth: 460 }}>
          <h5 className="text-danger mb-2">No se pudo conectar con el servidor</h5>
          <p className="text-light small mb-3">{error}</p>
          <button type="button" className="btn boton-primario w-100" onClick={onReintentar}>
            Reintentar conexión
          </button>
        </div>
      ) : (
        <>
          <div
            className="spinner-border text-warning mb-3"
            style={{ width: '3rem', height: '3rem' }}
            role="status"
          />
          <p className="fs-5 mb-1">Conectando con el servidor...</p>
          {lento && (
            <p className="text-warning small" style={{ maxWidth: 420 }}>
              El servidor en la nube se está activando (arranque en frío). Esto puede tardar hasta
              un minuto, por favor espera.
            </p>
          )}
        </>
      )}
    </div>
  )
}