const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001'

export async function buscarProducto(codigoBarras: string) {
  const res = await fetch(`${BASE_URL}/api/productos?codigo=${codigoBarras}`)
  if (!res.ok) return null
  return res.json()
}

export async function crearSolicitud(data: {
  items?: { productoId: string; cantidad: number }[]
  productoId?: string
  cantidad?: number
  justificacion: string
  tiendaId: string
  liderId: string
}) {
  const res = await fetch(`${BASE_URL}/api/solicitudes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear solicitud')
  return res.json()
}

export async function obtenerSolicitudes(tiendaId: string) {
  const res = await fetch(`${BASE_URL}/api/solicitudes?tiendaId=${tiendaId}`)
  if (!res.ok) return []
  return res.json()
}
export async function login(cr: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: cr, password }), // El backend usa 'email' pero le mandamos el 'CR'
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Error en el login')
  }
  return res.json()
}
