import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@oxxo/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const rol = searchParams.get('rol')
  const tiendaId = searchParams.get('tiendaId')

  const estatus =
    rol === 'ASESOR' ? 'PENDIENTE_ASESOR' :
    rol === 'COMERCIAL' ? 'PENDIENTE_COMERCIAL' :
    undefined

  const solicitudes = await prisma.solicitud.findMany({
    where: {
      ...(estatus ? { estatus } : {}),
      ...(tiendaId ? { tiendaId } : {}),
    },
    include: { producto: true },
    orderBy: { creadoEn: 'desc' },
  })

  return NextResponse.json(solicitudes)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  
  // Soporte para múltiples ítems
  if (Array.isArray(body.items)) {
    const { items, justificacion, tiendaId, liderId } = body

    if (!items || !justificacion || !tiendaId || !liderId) {
      return NextResponse.json({ error: 'Campos obligatorios faltantes' }, { status: 400 })
    }

    // Crear múltiples solicitudes en una transacción
    const solicitudes = await Promise.all(
      items.map((item: any) => 
        prisma.solicitud.create({
          data: {
            productoId: item.productoId,
            cantidad: item.cantidad,
            justificacion,
            tiendaId,
            liderId,
            estatus: 'PENDIENTE_ASESOR',
          },
          include: { producto: true },
        })
      )
    )

    return NextResponse.json(solicitudes, { status: 201 })
  }

  // Caso de ítem único (anterior)
  const { productoId, cantidad, justificacion, tiendaId, liderId } = body

  if (!productoId || !cantidad || !justificacion || !tiendaId || !liderId) {
    return NextResponse.json({ error: 'Campos obligatorios faltantes' }, { status: 400 })
  }

  const solicitud = await prisma.solicitud.create({
    data: {
      productoId,
      cantidad,
      justificacion,
      tiendaId,
      liderId,
      estatus: 'PENDIENTE_ASESOR',
    },
    include: { producto: true },
  })

  return NextResponse.json(solicitud, { status: 201 })
}
