import Image from 'next/image'

interface NavbarProps {
  rol: string
  usuario: string
}

export function Navbar({ rol, usuario }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="OXXO" 
                width={120} 
                height={40} 
                className="object-contain h-10 w-auto"
              />
              <div className="h-8 w-[2px] bg-oxxo-red/20 mx-2 hidden sm:block"></div>
              <span className="text-gray-900 font-black tracking-tight text-lg hidden sm:block uppercase">
                Portal {rol}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Usuario</p>
              <p className="text-sm font-black text-gray-900">{usuario}</p>
            </div>
            <a 
              href="/login" 
              className="bg-oxxo-red text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition shadow-md shadow-oxxo-red/20 active:scale-95"
            >
              Cerrar Sesión
            </a>
          </div>
        </div>
      </div>
      {/* Decorative bar */}
      <div className="h-1 w-full flex">
        <div className="h-full flex-1 bg-oxxo-red"></div>
        <div className="h-full w-24 bg-oxxo-yellow"></div>
      </div>
    </nav>
  )
}
