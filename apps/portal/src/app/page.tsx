export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-oxxo-red rounded-full" />
          <h1 className="text-4xl font-bold text-gray-900">OXXO Cargos</h1>
        </div>
        <p className="text-gray-500 text-lg">Sistema de solicitud y aprobación de cargos</p>
        <div className="mt-10 flex gap-4 justify-center">
          <a
            href="/asesor"
            className="px-6 py-3 bg-oxxo-red text-white rounded-lg font-medium hover:bg-red-700 transition"
          >
            Portal Asesor
          </a>
          <a
            href="/comercial"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition"
          >
            Portal Comercial
          </a>
        </div>
      </div>
    </main>
  )
}
