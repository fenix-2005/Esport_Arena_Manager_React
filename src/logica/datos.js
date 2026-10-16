import heroImg from '../assets/hero.png'

export const torneosIniciales = [
  {
    id: 1,
    nombre: 'Copa Valorant 2026',
    juego: 'Valorant',
    estado: 'Abierto',
    color: 'bg-success',
    fechaInicio: '2026-11-01',
    fechaFin: '2026-11-15',
    cupos: 16,
    cuposCriticos: 3,
    precio: 0,
    descripcion: 'Torneo oficial universitario 5v5 en modalidad eliminación directa.',
    imagen: heroImg,
  },
  {
    id: 2,
    nombre: 'Torneo Abierto CS2',
    juego: 'Counter-Strike 2',
    estado: 'En curso',
    color: 'bg-warning',
    fechaInicio: '2026-10-10',
    fechaFin: '2026-10-25',
    cupos: 2,
    cuposCriticos: 4,
    precio: 5000,
    descripcion: 'Competencia táctica por equipos con fase de grupos y gran final.',
    imagen: heroImg,
  },
{
    id: 3,
    nombre: 'Liga LoL Apertura',
    juego: 'League of Legends',
    estado: 'Finalizado',
    color: 'bg-danger',
    fechaInicio: '2026-08-01',
    fechaFin: '2026-08-30',
    cupos: 0,
    cuposCriticos: 2,
    precio: 2500,
    descripcion: 'La grieta del invocador reúne a las mejores escuadras de la región.',
    imagen: heroImg,
  },
]

export const datosTerritoriales = {
  Valparaíso: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana'],
  Metropolitana: ['Santiago', 'Puente Alto', 'Maipú', 'Providencia'],
  Ñuble: ['Chillán', 'Las condes', 'Bulnes', 'Coihueco'],
}

export const equiposIniciales = [
  { id: 1, nombre: 'KRU Esports', juego: 'Valorant', capitan: 'Claus', miembros: 5 },
  { id: 2, nombre: 'Leviatan', juego: 'Valorant', capitan: 'King', miembros: 5 },
  { id: 3, nombre: 'Movistar R7', juego: 'League of Legends', capitan: 'Ode', miembros: 5 },
]