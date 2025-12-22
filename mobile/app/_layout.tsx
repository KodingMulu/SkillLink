// mobile/app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="messages" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="proyek" /> {/* TAMBAHKAN INI */}
      <Stack.Screen name="chat/[id]" />
      
      {/* Jika ada folder auth */}
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}