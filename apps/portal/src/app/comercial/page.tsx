import { BandejaSolicitudes } from '@/components/BandejaSolicitudes'
import { Navbar } from '@/components/Navbar'

export default function ComercialPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar rol="Comercial" usuario="Admin Comercial" />
      
      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        <header className="mb-10 mt-4 sm:mt-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/5 text-gray-800 text-xs font-black uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></span>
            Aprobación Estratégica
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Autorizaciones Finales</h2>
          <p className="text-gray-500 text-lg">Procesa los cargos que ya han sido validados por los asesores técnicos.</p>
        </header>
        
        <BandejaSolicitudes rol="COMERCIAL" />
      </div>
    </main>
  )
}
