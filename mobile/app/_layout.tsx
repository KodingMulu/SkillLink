import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext'; // 1. Import AuthProvider

// 2. Export default HANYA membungkus Provider
export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

// 3. Pindahkan semua logika routing ke komponen child (MainLayout)
//    agar bisa menggunakan 'useAuth' (karena sekarang sudah di dalam Provider)
function MainLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inDashboardGroup = segments[0] === '(dashboard)';

    // === LOGIKA CEK LOGIN & ROLE ===
    if (!user && !inAuthGroup) {
      // Jika belum login, tendang ke login
      router.replace('/(auth)/login');
    } else if (user) {
      // Jika sudah login
      if (inAuthGroup) {
        // Redirect user dari halaman login ke dashboard masing-masing
        if (user.role === 'CLIENT') {
          router.replace('/(dashboard)/client');
        } else if (user.role === 'FREELANCER') {
          router.replace('/(dashboard)/freelancer');
        }
      } 
      else if (inDashboardGroup) {
         // Cek Cross-Role (Cegah Freelancer masuk folder Client)
         const specificGroup = segments[1];
         if (specificGroup === 'client' && user.role !== 'CLIENT') {
             router.replace('/(dashboard)/freelancer');
         } else if (specificGroup === 'freelancer' && user.role !== 'FREELANCER') {
             router.replace('/(dashboard)/client');
         }
      }
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return <Slot />;
}