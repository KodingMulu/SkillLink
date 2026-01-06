import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
// Anggap Anda punya AuthContext atau tempat simpan state user
// import { useAuth } from '../context/AuthContext'; 

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  // CONTOH STATE (Nanti ganti pakai Context/Zustand/Redux)
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null); 
  // user object contoh: { name: 'Budi', role: 'freelancer' }

  useEffect(() => {
    // Simulasi cek login (ganti dengan logika real cek token/AsyncStorage)
    const checkLogin = async () => {
      // ... logika ambil token ...
      setIsLoading(false);
    };
    checkLogin();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    // 1. JIKA BELUM LOGIN
    if (!user && !inAuthGroup) {
      // Tendang ke halaman login
      router.replace('/(auth)/login');
    } 
    
    // 2. JIKA SUDAH LOGIN
    else if (user && inAuthGroup) {
      // User sudah login tapi masih di halaman login, pindahkan sesuai ROLE
      if (user.role === 'freelancer') {
        router.replace('/(dashboard)/freelancer');
      } else if (user.role === 'client') {
        router.replace('/(dashboard)/client');
      }
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />; // Slot ini akan merender child route (login atau dashboard)
}