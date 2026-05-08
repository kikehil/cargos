import { NextResponse } from 'next/server'
import { PrismaClient } from '@oxxo/db'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: 'Faltan credenciales' }, { status: 400 })
    }

    const user = await prisma.usuario.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 })
    }

    // En un sistema real usaríamos bcrypt, aquí comparamos directo por simplicidad/demo
    if (user.password !== password) {
      return NextResponse.json({ message: 'Contraseña incorrecta' }, { status: 401 })
    }

    // Guardar sesión básica en cookie (demo)
    cookies().set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    })

    cookies().set('user_role', user.rol, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return NextResponse.json({ 
      message: 'Login exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        tiendaId: user.tiendaId
      }
    })

  } catch (error) {
    console.error('Error in login:', error)
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 })
  }
}
