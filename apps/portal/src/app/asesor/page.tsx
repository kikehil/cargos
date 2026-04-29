import { BandejaSolicitudes } from '@/components/BandejaSolicitudes'

export default function AsesorPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Portal Asesor</h1>
        <p className="text-gray-500">Validación de solicitudes de cargos</p>
      </header>
      <BandejaSolicitudes rol="ASESOR" />
    </main>
  )
}
