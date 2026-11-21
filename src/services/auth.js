import { solicitar } from './api'

const AUTH_URL = import.meta.env.VITE_AUTH_URL

export const authService = {
  login: (credenciales) =>
    solicitar(AUTH_URL, '/auth/login', {
      method: 'POST',
      body: JSON.stringify(credenciales),
    }),
}