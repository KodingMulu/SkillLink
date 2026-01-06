// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // Secara default arahkan ke dashboard, 
  // nanti _layout.tsx yang akan mencegat kalau belum login.
  return <Redirect href="/(dashboard)/freelancer" />;
}