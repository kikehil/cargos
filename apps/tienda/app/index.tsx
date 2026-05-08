import React from 'react'
import NuevaSolicitudScreen from '../src/screens/NuevaSolicitudScreen'
import { useAuth } from './_layout'

export default function Page() {
  const auth = useAuth()
  
  if (!auth?.user) return null
  
  return <NuevaSolicitudScreen user={auth.user} onLogout={auth.logout} />
}
