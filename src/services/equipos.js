import { solicitar } from './api'

const URL = import.meta.env.VITE_TEAMS_URL

export const equiposService = {
  listar: (opciones) => solicitar(URL, '/equipos', opciones),
  crear: (equipo) =>
    solicitar(URL, '/equipos', {
      method: 'POST',
      body: JSON.stringify(equipo),
    }),
  eliminar: (id) =>
    solicitar(URL, `/equipos/${id}`, {
      method: 'DELETE',
    }),
}