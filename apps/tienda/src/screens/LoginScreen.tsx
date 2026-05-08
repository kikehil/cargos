import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { login } from '../lib/api'
import * as SecureStore from '../lib/storage'

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [cr, setCr] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!cr || !password) {
      Alert.alert('Error', 'Por favor ingresa el CR y la contraseña')
      return
    }

    setLoading(true)
    try {
      const data = await login(cr, password)
      // Guardar sesión básica (para demo usamos SecureStore si estuviera disponible, 
      // pero por ahora solo pasamos el usuario al componente padre)
      try {
        await SecureStore.setItemAsync('user', JSON.stringify(data.user))
      } catch (e) {
        console.log('SecureStore no disponible en web/entorno actual')
      }
      
      onLoginSuccess(data.user)
    } catch (error: any) {
      Alert.alert('Error de Login', error.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>OXXO</Text>
          </View>
          <Text style={styles.title}>Cargos y Ajustes</Text>
          <Text style={styles.subtitle}>Acceso Tiendas</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>CR de Tienda</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 50TBI"
            value={cr}
            onChangeText={setCr}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© 2026 OXXO - Gestión de Inventarios</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoBadge: {
    backgroundColor: '#E6192E', // Rojo OXXO
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  logoText: {
    color: '#FFD400', // Amarillo OXXO
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#E6192E',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 40,
  },
})
