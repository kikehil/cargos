import { BandejaSolicitudes } from '@/components/BandejaSolicitudes'

export default function ComercialPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Portal Comercial</h1>
        <p className="text-gray-500">Aprobación final de solicitudes</p>
      </header>
      <BandejaSolicitudes rol="COMERCIAL" />
    </main>
  )
}
