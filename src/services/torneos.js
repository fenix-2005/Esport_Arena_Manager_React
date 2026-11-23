import { solicitar } from './api'

const URL = import.meta.env.VITE_TOURNAMENTS_URL

export const torneosService = {
  listar: (opciones) => solicitar(URL, '/torneos', opciones),
  obtener: (id, opciones) => solicitar(URL, `/torneos/${id}`, opciones),
  crear: (torneo) =>
    solicitar(URL, '/torneos', {
      method: 'POST',
      body: JSON.stringify(torneo),
    }),
  eliminar: (id) =>
    solicitar(URL, `/torneos/${id}`, {
      method: 'DELETE',
    }),
}