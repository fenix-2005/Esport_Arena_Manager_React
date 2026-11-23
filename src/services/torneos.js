import { solicitar } from './api'

const TOURNAMENTS_URL = import.meta.env.VITE_TOURNAMENTS_URL

export const torneosService = {
  listar: () => solicitar(TOURNAMENTS_URL, '/torneos'),
  obtener: (id) => solicitar(TOURNAMENTS_URL, `/torneos/${id}`),
  crear: (datos) =>
    solicitar(TOURNAMENTS_URL, '/torneos', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),
  actualizar: (id, datos) =>
    solicitar(TOURNAMENTS_URL, `/torneos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),
  eliminar: (id) =>
    solicitar(TOURNAMENTS_URL, `/torneos/${id}`, {
      method: 'DELETE',
    }),
}