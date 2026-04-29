'use client'

import { useEffect, useState } from 'react'

type Estatus =
  | 'PENDIENTE_ASESOR'
  | 'PENDIENTE_COMERCIAL'
  | 'APROBADO'
  | 'RECHAZADO_ASESOR'
  | 'RECHAZADO_COMERCIAL'

type Solicitud = {
  id: string
  cantidad: number
  justificacion: string
  estatus: Estatus
  motivoRechazo: string | null
  creadoEn: string
  producto: { nombre: string; codigoBarras: string }
}

const etiquetaEstatus: Record<Estatus, string> = {
  PENDIENTE_ASESOR: 'Pendiente asesor',
  PENDIENTE_COMERCIAL: 'Pendiente comercial',
  APROBADO: 'Aprobado',
  RECHAZADO_ASESOR: 'Rechazado por asesor',
  RECHAZADO_COMERCIAL: 'Rechazado por comercial',
}

const colorEstatus: Record<Estatus, string> = {
  PENDIENTE_ASESOR: 'bg-yellow-100 text-yellow-800',
  PENDIENTE_COMERCIAL: 'bg-blue-100 text-blue-800',
  APROBADO: 'bg-green-100 text-green-800',
  RECHAZADO_ASESOR: 'bg-red-100 text-red-800',
  RECHAZADO_COMERCIAL: 'bg-red-100 text-red-800',
}

export function BandejaSolicitudes({ rol }: { rol: 'ASESOR' | 'COMERCIAL' }) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [cargando, setCargando] = useState(true)
  const [motivoRechazo, setMotivoRechazo] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch(`/api/solicitudes?rol=${rol}`)
      .then((r) => r.json())
      .then((data) => { setSolicitudes(data); setCargando(false) })
  }, [rol])

  async function accionar(id: string, accion: 'APROBAR' | 'RECHAZAR') {
    const motivo = motivoRechazo[id]
    if (accion === 'RECHAZAR' && !motivo?.trim()) {
      alert('El motivo de rechazo es obligatorio')
      return
    }
    const res = await fetch(`/api/solicitudes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion, motivo }),
    })
    if (res.ok) {
      setSolicitudes((prev) => prev.filter((s) => s.id !== id))
    }
  }

  if (cargando) return <p className="text-gray-400">Cargando solicitudes...</p>
  if (!solicitudes.length) return <p className="text-gray-400">No hay solicitudes pendientes.</p>

  return (
    <div className="space-y-4">
      {solicitudes.map((s) => (
        <div key={s.id} className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-semibold text-gray-900">{s.producto.nombre}</p>
              <p className="text-xs text-gray-400">{s.producto.codigoBarras}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${colorEstatus[s.estatus]}`}>
              {etiquetaEstatus[s.estatus]}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Cantidad:</span> {s.cantidad}</p>
          <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Justificación:</span> {s.justificacion}</p>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => accionar(s.id, 'APROBAR')}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
            >
              Aprobar
            </button>
            <input
              type="text"
              placeholder="Motivo de rechazo"
              value={motivoRechazo[s.id] ?? ''}
              onChange={(e) => setMotivoRechazo((prev) => ({ ...prev, [s.id]: e.target.value }))}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={() => accionar(s.id, 'RECHAZAR')}
              className="px-4 py-2 bg-oxxo-red text-white text-sm rounded-lg hover:bg-red-700 transition"
            >
              Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
