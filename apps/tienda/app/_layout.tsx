import { Tabs } from 'expo-router'
import React, { useState, useEffect, createContext, useContext } from 'react'
import LoginScreen from '../src/screens/LoginScreen'
import * as SecureStore from '../src/lib/storage'
import { View, ActivityIndicator } from 'react-native'

const AuthContext = createContext<{
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
} | null>(null);

export const useAuth = () => useContext(AuthContext);

export default function Layout() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const storedUser = await SecureStore.getItemAsync('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (e) {
        console.log('SecureStore not available')
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('user')
    } catch (e) {}
    setUser(null)
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E6192E" />
      </View>
    )
  }

  if (!user) {
    return <LoginScreen onLoginSuccess={(u) => setUser(u)} />
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      <Tabs 
        screenOptions={{ 
          tabBarActiveTintColor: '#E2001A', 
          headerShown: false 
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Nueva' }} />
        <Tabs.Screen name="mis-solicitudes" options={{ title: 'Historial' }} />
      </Tabs>
    </AuthContext.Provider>
  )
}
