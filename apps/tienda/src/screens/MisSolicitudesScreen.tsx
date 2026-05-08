import { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { obtenerSolicitudes } from '../lib/api'

type Estatus =
  | 'PENDIENTE_ASESOR'
  | 'PENDIENTE_COMERCIAL'
  | 'APROBADO'
  | 'RECHAZADO_ASESOR'
  | 'RECHAZADO_COMERCIAL'

type Solicitud = {
  id: string
  cantidad: number
  justificacion: string
  estatus: Estatus
  motivoRechazo: string | null
  creadoEn: string
  producto: { nombre: string }
}

const etiqueta: Record<Estatus, string> = {
  PENDIENTE_ASESOR: 'En revisión (asesor)',
  PENDIENTE_COMERCIAL: 'En revisión (comercial)',
  APROBADO: 'Aprobado ✓',
  RECHAZADO_ASESOR: 'Rechazado por asesor',
  RECHAZADO_COMERCIAL: 'Rechazado por comercial',
}

const color: Record<Estatus, string> = {
  PENDIENTE_ASESOR: '#FEF3C7',
  PENDIENTE_COMERCIAL: '#DBEAFE',
  APROBADO: '#DCFCE7',
  RECHAZADO_ASESOR: '#FEE2E2',
  RECHAZADO_COMERCIAL: '#FEE2E2',
}

interface Props {
  user: any
  onLogout: () => void
}

export default function MisSolicitudesScreen({ user, onLogout }: Props) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (user?.tiendaId) {
      obtenerSolicitudes(user.tiendaId).then((data) => { setSolicitudes(data); setCargando(false) })
    }
  }, [user])

  if (cargando) return <ActivityIndicator style={{ flex: 1 }} color="#E2001A" />

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.tiendaCr}>Tienda {user.email}</Text>
          <Text style={styles.tiendaNombre}>{user.nombre}</Text>
        </View>
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={styles.container}
        data={solicitudes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.vacio}>No tienes solicitudes aún.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: color[item.estatus] }]}>
            <Text style={styles.nombre}>{item.producto.nombre}</Text>
            <Text style={styles.info}>Cantidad: {item.cantidad}</Text>
            <Text style={styles.info}>{item.justificacion}</Text>
            <Text style={styles.estatus}>{etiqueta[item.estatus]}</Text>
            {item.motivoRechazo && (
              <Text style={styles.motivo}>Motivo: {item.motivoRechazo}</Text>
            )}
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 16, marginTop: 60, backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  tiendaCr: { fontSize: 12, color: '#666', fontWeight: '600' },
  tiendaNombre: { fontSize: 18, fontWeight: 'bold', color: '#E2001A' },
  logoutBtn: { backgroundColor: '#eee', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutText: { fontSize: 13, color: '#333', fontWeight: '600' },
  card: { borderRadius: 12, padding: 16, gap: 4 },
  nombre: { fontWeight: '700', fontSize: 16, color: '#111' },
  info: { color: '#374151', fontSize: 14 },
  estatus: { fontWeight: '600', fontSize: 13, marginTop: 6, color: '#111' },
  motivo: { color: '#B91C1C', fontSize: 13, fontStyle: 'italic' },
  vacio: { textAlign: 'center', color: '#9CA3AF', marginTop: 40, fontSize: 16 },
})
