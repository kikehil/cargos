import { PrismaClient, Rol } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seeding...')

  // 1. Limpiar base de datos
  await prisma.solicitud.deleteMany()
  await prisma.usuario.deleteMany()
  await prisma.producto.deleteMany()
  await prisma.tienda.deleteMany()

  // 2. Crear Tiendas Solicitadas
  const tiendasData = [
    { cr: '50TBI', nombre: 'TAMPAON', asesor: 'VICENTE BLASCO' },
    { cr: '50TUI', nombre: 'TAMUIN', asesor: 'ARCADIO NERI' },
  ]

  const passwordDefault = 'Cargos2026*'

  for (const tData of tiendasData) {
    const tienda = await prisma.tienda.create({
      data: {
        nombre: tData.nombre,
        cr: tData.cr,
        asesor: tData.asesor,
      }
    })

    // Crear usuario Líder para cada tienda usando el CR como login (email)
    await prisma.usuario.create({
      data: {
        nombre: `Líder ${tData.nombre}`,
        email: tData.cr, // El usuario para el login debe ser el CR
        password: passwordDefault,
        rol: Rol.LIDER,
        tiendaId: tienda.id,
      }
    })
  }

  // 3. Crear Usuarios Administrativos
  await prisma.usuario.create({
    data: {
      nombre: 'Ricardo Arturo (Asesor)',
      email: 'asesor@oxxo.com',
      password: passwordDefault,
      rol: Rol.ASESOR,
    }
  })

  await prisma.usuario.create({
    data: {
      nombre: 'Admin Comercial',
      email: 'comercial@oxxo.com',
      password: passwordDefault,
      rol: Rol.COMERCIAL,
    }
  })

  // 4. Crear Productos
  const productos = [
    { nombre: 'Coca Cola Pet 600 ml', codigoBarras: '75007614', descripcion: 'Refresco de cola' },
    { nombre: 'Sabritas Original 45g', codigoBarras: '7501011115606', descripcion: 'Papas fritas' },
    { nombre: 'Ruffles Queso 50g', codigoBarras: '7501011114524', descripcion: 'Papas fritas con queso' },
    { nombre: 'Vikingo Regular', codigoBarras: 'V001', descripcion: 'Hot dog clásico' },
    { nombre: 'Café Andatti Grande', codigoBarras: 'A002', descripcion: 'Café americano' },
    { nombre: 'Agua Epura 1L', codigoBarras: '7501031311682', descripcion: 'Agua purificada' },
  ]

  for (const p of productos) {
    await prisma.producto.create({ data: p })
  }

  console.log('Seeding completado con éxito.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
