import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');

    } else if (user && inAuthGroup) {
      if (user.role === 'CLIENT') {
        router.replace('/(dashboard)/client');
      } else if (user.role === 'FREELANCER') {
        router.replace('/(dashboard)/freelancer');
      } else {
        router.replace('/(dashboard)/admin');
      }
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}