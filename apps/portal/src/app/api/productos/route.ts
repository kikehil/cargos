import { NextResponse } from 'next/server'
import { PrismaClient } from '@oxxo/db'

// Instancia global de Prisma
const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const codigo = searchParams.get('codigo')

  if (!codigo) {
    return NextResponse.json({ error: 'Falta código de barras' }, { status: 400 })
  }

  try {
    // Intentar buscar por código de barras primero
    let producto = await prisma.producto.findUnique({
      where: { codigoBarras: codigo }
    })

    // Si no encuentra por código, intentar buscar por nombre (búsqueda parcial)
    if (!producto) {
      producto = await prisma.producto.findFirst({
        where: {
          nombre: {
            contains: codigo,
            mode: 'insensitive'
          }
        }
      })
    }

    if (!producto) {
      return NextResponse.json(null, { status: 404 })
    }

    return NextResponse.json(producto)
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
