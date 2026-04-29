import { Tabs } from 'expo-router'

export default function Layout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#E2001A', headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Nueva solicitud' }} />
      <Tabs.Screen name="mis-solicitudes" options={{ title: 'Mis solicitudes' }} />
    </Tabs>
  )
}
