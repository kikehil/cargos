import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="flex flex-col items-center justify-center gap-3 mb-6">
          <Image 
            src="/logo.png" 
            alt="OXXO Plaza Cd. Valles" 
            width={250} 
            height={250} 
            className="object-contain"
            priority
          />
        </div>
        <p className="text-gray-500 text-lg">Sistema de solicitud y aprobación de cargos</p>
        <div className="mt-10 flex flex-col gap-4 justify-center items-center">
          <a
            href="/login"
            className="w-64 px-6 py-3 bg-oxxo-red text-white rounded-lg font-bold text-center hover:bg-red-700 transition shadow-lg"
          >
            Entrar al Portal
          </a>
          <p className="text-gray-400 text-sm mt-4">Demo: lider@oxxo.com / asesor@oxxo.com / comercial@oxxo.com</p>
          <p className="text-gray-400 text-xs">Contraseña: 1234</p>
        </div>
      </div>
    </main>
  )
}
