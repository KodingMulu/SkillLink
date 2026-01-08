import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <MainLayout />
      </PaperProvider>
    </AuthProvider>
  );
}

function MainLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inDashboardGroup = segments[0] === '(dashboard)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user) {
      if (inAuthGroup) {
        if (user.role === 'CLIENT') {
          router.replace('/(dashboard)/client');
        } else if (user.role === 'FREELANCER') {
          router.replace('/(dashboard)/freelancer');
        }
      }
      else if (inDashboardGroup) {
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