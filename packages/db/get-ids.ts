import { prisma } from './src/index'

async function main() {
  const tienda = await prisma.tienda.findFirst({ where: { clave: '10VALL' } })
  const lider = await prisma.usuario.findFirst({ where: { email: 'lider@oxxo.com' } })
  console.log('TIENDA_ID:', tienda?.id)
  console.log('LIDER_ID:', lider?.id)
}

main()
