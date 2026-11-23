import { solicitar } from './api'

const URL = import.meta.env.VITE_REGISTRATIONS_URL

export const inscripcionesService = {
  listar: (opciones) => solicitar(URL, '/inscripciones', opciones),
  crear: (inscripcion) =>
    solicitar(URL, '/inscripciones', {
      method: 'POST',
      body: JSON.stringify(inscripcion),
    }),
  eliminar: (id) =>
    solicitar(URL, `/inscripciones/${id}`, {
      method: 'DELETE',
    }),
}