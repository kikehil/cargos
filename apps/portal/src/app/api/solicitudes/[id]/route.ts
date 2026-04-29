import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@oxxo/db'

type Params = { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Params) {
  const { accion, motivo, usuarioId } = await req.json()

  const solicitud = await prisma.solicitud.findUnique({ where: { id: params.id } })
  if (!solicitud) {
    return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
  }

  const transiciones: Record<string, { aprobado: string; rechazado: string }> = {
    PENDIENTE_ASESOR:    { aprobado: 'PENDIENTE_COMERCIAL', rechazado: 'RECHAZADO_ASESOR' },
    PENDIENTE_COMERCIAL: { aprobado: 'APROBADO',            rechazado: 'RECHAZADO_COMERCIAL' },
  }

  const flujo = transiciones[solicitud.estatus]
  if (!flujo) {
    return NextResponse.json({ error: 'La solicitud no puede ser modificada en su estado actual' }, { status: 409 })
  }

  if (accion === 'RECHAZAR' && !motivo) {
    return NextResponse.json({ error: 'El motivo de rechazo es obligatorio' }, { status: 400 })
  }

  const nuevoEstatus = accion === 'APROBAR' ? flujo.aprobado : flujo.rechazado

  const actualizada = await prisma.solicitud.update({
    where: { id: params.id },
    data: {
      estatus: nuevoEstatus,
      ...(accion === 'RECHAZAR' ? { motivoRechazo: motivo } : {}),
    },
    include: { producto: true },
  })

  return NextResponse.json(actualizada)
}
