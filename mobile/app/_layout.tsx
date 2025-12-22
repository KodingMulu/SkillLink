import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right' // Animasi perpindahan layar yang lebih smooth
      }}
    >
      {/* Rute Utama (Dashboard) */}
      <Stack.Screen name="index" />
      
      {/* Rute Proyek & Notifikasi */}
      <Stack.Screen name="proyek" />
      <Stack.Screen name="notifications" />
      
      {/* Rute Pesan & Chat */}
      <Stack.Screen name="messages" />
      <Stack.Screen name="chat/[id]" />
      
      {/* Rute Admin (Panel Manajemen) */}
      <Stack.Screen 
        name="admin" 
        options={{ 
          presentation: 'card', // Tampilan layar admin sebagai kartu
          gestureEnabled: true 
        }} 
      />
      
      {/* Grup Autentikasi (Jika ada) */}
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}