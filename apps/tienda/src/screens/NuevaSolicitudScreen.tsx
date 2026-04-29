import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, ActivityIndicator,
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { buscarProducto, crearSolicitud } from '../lib/api'

type Producto = { id: string; nombre: string; codigoBarras: string }

// IDs fijos para el MVP — en fases posteriores vendrán del login
const TIENDA_ID = 'tienda-demo'
const LIDER_ID = 'lider-demo'

export default function NuevaSolicitudScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [escaneando, setEscaneando] = useState(false)
  const [producto, setProducto] = useState<Producto | null>(null)
  const [cantidad, setCantidad] = useState('')
  const [justificacion, setJustificacion] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function onScan({ data }: { data: string }) {
    setEscaneando(false)
    const encontrado = await buscarProducto(data)
    if (!encontrado) {
      Alert.alert('Producto no encontrado', 'El código escaneado no está en el catálogo de tu tienda.')
      return
    }
    setProducto(encontrado)
  }

  async function enviar() {
    if (!producto) return
    const cant = parseInt(cantidad, 10)
    if (!cant || cant <= 0) {
      Alert.alert('Cantidad inválida', 'Ingresa una cantidad mayor a 0.')
      return
    }
    if (!justificacion.trim()) {
      Alert.alert('Justificación requerida', 'Explica el motivo del cargo.')
      return
    }
    setEnviando(true)
    try {
      await crearSolicitud({ productoId: producto.id, cantidad: cant, justificacion, tiendaId: TIENDA_ID, liderId: LIDER_ID })
      Alert.alert('Solicitud enviada', 'Tu solicitud fue enviada al asesor para revisión.')
      setProducto(null)
      setCantidad('')
      setJustificacion('')
    } catch {
      Alert.alert('Error', 'No se pudo enviar la solicitud. Intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  if (escaneando) {
    if (!permission?.granted) {
      return (
        <View style={styles.center}>
          <Text style={styles.texto}>Se necesita permiso de cámara</Text>
          <TouchableOpacity style={styles.botonRojo} onPress={requestPermission}>
            <Text style={styles.botonTexto}>Permitir cámara</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.scannerContainer}>
        <CameraView style={StyleSheet.absoluteFill} onBarcodeScanned={onScan} barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'code128'] }} />
        <TouchableOpacity style={styles.cancelarScan} onPress={() => setEscaneando(false)}>
          <Text style={styles.botonTexto}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Nueva Solicitud de Cargo</Text>

      {!producto ? (
        <TouchableOpacity style={styles.botonRojo} onPress={() => setEscaneando(true)}>
          <Text style={styles.botonTexto}>Escanear producto</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.card}>
          <Text style={styles.productoNombre}>{producto.nombre}</Text>
          <Text style={styles.productoCode}>{producto.codigoBarras}</Text>
          <TouchableOpacity onPress={() => setProducto(null)}>
            <Text style={styles.cambiar}>Cambiar producto</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.label}>Cantidad</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={cantidad}
        onChangeText={setCantidad}
        placeholder="Ej. 12"
      />

      <Text style={styles.label}>Justificación</Text>
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        multiline
        numberOfLines={4}
        value={justificacion}
        onChangeText={setJustificacion}
        placeholder="Explica el motivo del cargo..."
      />

      <TouchableOpacity
        style={[styles.botonRojo, (!producto || enviando) && styles.botonDisabled]}
        onPress={enviar}
        disabled={!producto || enviando}
      >
        {enviando
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botonTexto}>Enviar solicitud</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  scannerContainer: { flex: 1 },
  titulo: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff' },
  inputMultiline: { height: 100, textAlignVertical: 'top' },
  botonRojo: { backgroundColor: '#E2001A', borderRadius: 10, padding: 14, alignItems: 'center' },
  botonDisabled: { opacity: 0.5 },
  botonTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
  card: { backgroundColor: '#FEF2F2', borderRadius: 10, padding: 16, gap: 4 },
  productoNombre: { fontWeight: '700', fontSize: 16, color: '#111' },
  productoCode: { color: '#6B7280', fontSize: 13 },
  cambiar: { color: '#E2001A', fontSize: 13, marginTop: 6 },
  texto: { color: '#374151', fontSize: 16 },
  cancelarScan: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#111', borderRadius: 10, padding: 14 },
})
