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
      alert('Por favor, indica un motivo para el rechazo.')
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

  if (cargando) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-oxxo-red"></div>
    </div>
  )

  if (!solicitudes.length) return (
    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
      <div className="text-5xl mb-4">🎉</div>
      <h3 className="text-lg font-medium text-gray-900">¡Todo al día!</h3>
      <p className="text-gray-500">No hay solicitudes pendientes por procesar.</p>
    </div>
  )

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
      {solicitudes.map((s) => (
        <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                  {s.producto.nombre.toLowerCase().includes('coca') ? '🥤' : 
                   s.producto.nombre.toLowerCase().includes('café') ? '☕' : 
                   s.producto.nombre.toLowerCase().includes('ruffles') ? '🥔' : '📦'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{s.producto.nombre}</h3>
                  <p className="text-sm text-gray-400 font-mono">{s.producto.codigoBarras}</p>
                </div>
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${colorEstatus[s.estatus]}`}>
                {etiquetaEstatus[s.estatus]}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Cantidad</p>
                <p className="text-2xl font-black text-oxxo-red">{s.cantidad} <span className="text-sm font-normal text-gray-500">unidades</span></p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Motivo / Justificación</p>
                <p className="text-sm text-gray-700 italic">"{s.justificacion}"</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Escribe el motivo si vas a rechazar..."
                  value={motivoRechazo[s.id] ?? ''}
                  onChange={(e) => setMotivoRechazo((prev) => ({ ...prev, [s.id]: e.target.value }))}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-oxxo-red transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => accionar(s.id, 'RECHAZAR')}
                  className="px-6 py-3 bg-white border-2 border-oxxo-red text-oxxo-red font-bold text-sm rounded-xl hover:bg-red-50 transition shadow-sm"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => accionar(s.id, 'APROBAR')}
                  className="px-8 py-3 bg-green-600 text-white font-bold text-sm rounded-xl hover:bg-green-700 transition shadow-md hover:shadow-lg active:scale-95"
                >
                  Aprobar Solicitud
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
