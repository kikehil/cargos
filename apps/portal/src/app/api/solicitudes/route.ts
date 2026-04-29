import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@oxxo/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const rol = searchParams.get('rol')

  const estatus =
    rol === 'ASESOR' ? 'PENDIENTE_ASESOR' :
    rol === 'COMERCIAL' ? 'PENDIENTE_COMERCIAL' :
    undefined

  const solicitudes = await prisma.solicitud.findMany({
    where: estatus ? { estatus } : undefined,
    include: { producto: true },
    orderBy: { creadoEn: 'desc' },
  })

  return NextResponse.json(solicitudes)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { productoId, cantidad, justificacion, tiendaId, liderId } = body

  if (!productoId || !cantidad || !justificacion || !tiendaId || !liderId) {
    return NextResponse.json({ error: 'Campos obligatorios faltantes' }, { status: 400 })
  }

  if (cantidad <= 0) {
    return NextResponse.json({ error: 'La cantidad debe ser mayor a 0' }, { status: 400 })
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
