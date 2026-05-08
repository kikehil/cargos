import React from 'react'
import MisSolicitudesScreen from '../src/screens/MisSolicitudesScreen'
import { useAuth } from './_layout'

export default function Page() {
  const auth = useAuth()
  
  if (!auth?.user) return null
  
  return <MisSolicitudesScreen user={auth.user} onLogout={auth.logout} />
}
