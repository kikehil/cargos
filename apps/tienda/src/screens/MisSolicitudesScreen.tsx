import { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
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

const TIENDA_ID = 'tienda-demo'

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

export default function MisSolicitudesScreen() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerSolicitudes(TIENDA_ID).then((data) => { setSolicitudes(data); setCargando(false) })
  }, [])

  if (cargando) return <ActivityIndicator style={{ flex: 1 }} color="#E2001A" />

  return (
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
  )
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  card: { borderRadius: 12, padding: 16, gap: 4 },
  nombre: { fontWeight: '700', fontSize: 16, color: '#111' },
  info: { color: '#374151', fontSize: 14 },
  estatus: { fontWeight: '600', fontSize: 13, marginTop: 6, color: '#111' },
  motivo: { color: '#B91C1C', fontSize: 13, fontStyle: 'italic' },
  vacio: { textAlign: 'center', color: '#9CA3AF', marginTop: 40, fontSize: 16 },
})
