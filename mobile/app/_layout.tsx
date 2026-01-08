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

    const group = segments[0];
    const subGroup = segments[1];

    if (!user) {
      if (group !== '(auth)') {
        router.replace('/(auth)/login');
      }
      return;
    }

    if (group === '(auth)') {
      if (user.role === 'CLIENT') {
        router.replace('/(dashboard)/client');
      } else if (user.role === 'FREELANCER') {
        router.replace('/(dashboard)/freelancer');
      } else if (user.role === 'ADMIN') {
        router.replace('/(dashboard)/admin');
      }
      return;
    }

    if (group === '(dashboard)') {
      if (user.role === 'CLIENT' && subGroup !== 'client') {
        router.replace('/(dashboard)/client');
      }

      if (user.role === 'FREELANCER' && subGroup !== 'freelancer') {
        router.replace('/(dashboard)/freelancer');
      }

      if (user.role === 'ADMIN' && subGroup !== 'admin') {
        router.replace('/(dashboard)/admin');
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return <Slot />;
}