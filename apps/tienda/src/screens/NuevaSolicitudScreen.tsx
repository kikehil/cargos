import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, ActivityIndicator,
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { buscarProducto, crearSolicitud } from '../lib/api'

type Producto = { id: string; nombre: string; codigoBarras: string }

import * as SecureStore from '../lib/storage'

interface Props {
  user: any
  onLogout: () => void
}

export default function NuevaSolicitudScreen({ user, onLogout }: Props) {
  const [permission, requestPermission] = useCameraPermissions()
  const [escaneando, setEscaneando] = useState(false)
  const [producto, setProducto] = useState<Producto | null>(null)
  const [cantidad, setCantidad] = useState('')
  const [justificacion, setJustificacion] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [codigoManual, setCodigoManual] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [listaItems, setListaItems] = useState<{ producto: Producto, cantidad: number }[]>([])

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('user')
    } catch (e) {}
    onLogout()
  }

  async function onScan({ data }: { data: string }) {
    setEscaneando(false)
    const encontrado = await buscarProducto(data)
    if (!encontrado) {
      Alert.alert('Producto no encontrado', 'El código escaneado no está en el catálogo de tu tienda.')
      return
    }
    setProducto(encontrado)
  }

  async function buscarManual() {
    if (!codigoManual.trim()) return
    setBuscando(true)
    const encontrado = await buscarProducto(codigoManual)
    setBuscando(false)
    if (!encontrado) {
      Alert.alert('Producto no encontrado', 'El código ingresado no está en el catálogo de tu tienda.')
      return
    }
    setProducto(encontrado)
    setCodigoManual('')
  }

  function agregarALista() {
    if (!producto) return
    const cant = parseInt(cantidad, 10)
    if (!cant || cant <= 0) {
      Alert.alert('Cantidad inválida', 'Ingresa una cantidad mayor a 0.')
      return
    }
    
    // Verificar si ya está en la lista
    const index = listaItems.findIndex(item => item.producto.id === producto.id)
    if (index >= 0) {
      const nuevaLista = [...listaItems]
      nuevaLista[index].cantidad += cant
      setListaItems(nuevaLista)
    } else {
      setListaItems([...listaItems, { producto, cantidad: cant }])
    }

    setProducto(null)
    setCantidad('')
  }

  function eliminarDeLista(index: number) {
    const nuevaLista = [...listaItems]
    nuevaLista.splice(index, 1)
    setListaItems(nuevaLista)
  }

  async function enviarTodo() {
    if (listaItems.length === 0) {
      Alert.alert('Lista vacía', 'Agrega al menos un producto antes de enviar.')
      return
    }
    if (!justificacion.trim()) {
      Alert.alert('Justificación requerida', 'Explica el motivo del cargo.')
      return
    }

    setEnviando(true)
    try {
      await crearSolicitud({ 
        items: listaItems.map(item => ({ 
          productoId: item.producto.id, 
          cantidad: item.cantidad 
        })),
        justificacion, 
        tiendaId: user.tiendaId, 
        liderId: user.id 
      })
      Alert.alert('Solicitud enviada', 'Tu solicitud con ' + listaItems.length + ' artículos fue enviada con éxito.')
      setListaItems([])
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
      <View style={styles.header}>
        <View>
          <Text style={styles.tiendaCr}>Tienda {user.email}</Text>
          <Text style={styles.tiendaNombre}>{user.nombre}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>Nueva Solicitud de Cargo</Text>

      {/* Selector de Producto */}
      {!producto ? (
        <View style={styles.scanSection}>
          <TouchableOpacity style={styles.botonRojo} onPress={() => setEscaneando(true)}>
            <Text style={styles.botonTexto}>📷 Escanear producto</Text>
          </TouchableOpacity>

          <Text style={styles.oTexto}>— o ingresa el código manual —</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.flex1]}
              keyboardType="numeric"
              value={codigoManual}
              onChangeText={setCodigoManual}
              placeholder="Código de barras"
            />
            <TouchableOpacity 
              style={[styles.botonSecundario, buscando && styles.botonDisabled]} 
              onPress={buscarManual} 
              disabled={buscando}
            >
              {buscando ? <ActivityIndicator color="#111" /> : <Text style={styles.botonSecundarioTexto}>Buscar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.flex1}>
              <Text style={styles.productoNombre}>{producto.nombre}</Text>
              <Text style={styles.productoCode}>{producto.codigoBarras}</Text>
            </View>
            <TouchableOpacity onPress={() => setProducto(null)}>
              <Text style={styles.cambiar}>Cambiar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.row, { marginTop: 12 }]}>
            <TextInput
              style={[styles.input, styles.flex1]}
              keyboardType="numeric"
              value={cantidad}
              onChangeText={setCantidad}
              placeholder="Cantidad"
              autoFocus
            />
            <TouchableOpacity style={styles.botonRojo} onPress={agregarALista}>
              <Text style={styles.botonTexto}>Añadir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Lista de Artículos */}
      {listaItems.length > 0 && (
        <View style={styles.listaContainer}>
          <Text style={styles.label}>Artículos en la solicitud ({listaItems.length})</Text>
          {listaItems.map((item, idx) => (
            <View key={idx} style={styles.itemFila}>
              <View style={styles.flex1}>
                <Text style={styles.itemNombre}>{item.producto.nombre}</Text>
                <Text style={styles.itemCantidad}>{item.cantidad} unidades</Text>
              </View>
              <TouchableOpacity onPress={() => eliminarDeLista(idx)}>
                <Text style={styles.eliminar}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.label}>Justificación General</Text>
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        multiline
        numberOfLines={4}
        value={justificacion}
        onChangeText={setJustificacion}
        placeholder="Motivo de estos cargos..."
      />

      <TouchableOpacity
        style={[styles.botonRojo, (listaItems.length === 0 || enviando) && styles.botonDisabled]}
        onPress={enviarTodo}
        disabled={listaItems.length === 0 || enviando}
      >
        {enviando
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botonTexto}>Enviar Solicitud Completa</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 12, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, backgroundColor: '#f9f9f9', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  tiendaCr: { fontSize: 12, color: '#666', fontWeight: '600' },
  tiendaNombre: { fontSize: 18, fontWeight: 'bold', color: '#E2001A' },
  logoutBtn: { backgroundColor: '#eee', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutText: { fontSize: 13, color: '#333', fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  scannerContainer: { flex: 1 },
  titulo: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff' },
  inputMultiline: { height: 100, textAlignVertical: 'top' },
  botonRojo: { backgroundColor: '#E2001A', borderRadius: 10, padding: 14, alignItems: 'center' },
  botonSecundario: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  botonSecundarioTexto: { color: '#111', fontWeight: '600', fontSize: 16 },
  botonDisabled: { opacity: 0.5 },
  botonTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
  row: { flexDirection: 'row', gap: 8 },
  flex1: { flex: 1 },
  scanSection: { gap: 16, backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  oTexto: { textAlign: 'center', color: '#9CA3AF', fontSize: 14 },
  card: { backgroundColor: '#FEF2F2', borderRadius: 10, padding: 16, gap: 4 },
  productoNombre: { fontWeight: '700', fontSize: 16, color: '#111' },
  productoCode: { color: '#6B7280', fontSize: 13 },
  cambiar: { color: '#E2001A', fontSize: 13, marginTop: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listaContainer: { gap: 8, marginTop: 10, padding: 12, backgroundColor: '#f3f4f6', borderRadius: 12 },
  itemFila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  itemNombre: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  itemCantidad: { fontSize: 12, color: '#6B7280' },
  eliminar: { fontSize: 24, color: '#9CA3AF', paddingHorizontal: 8 },
  texto: { color: '#374151', fontSize: 16 },
  cancelarScan: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#111', borderRadius: 10, padding: 14 },
})
