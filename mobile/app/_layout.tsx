import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import DrawerMenu from '../components/DrawerMenu';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        // Menggunakan konten kustom dari DrawerMenu.tsx Anda
        drawerContent={(props) => (
          <DrawerMenu 
            {...props} 
            visible={true} 
            onClose={() => props.navigation.closeDrawer()} 
          />
        )}
        screenOptions={{
          // --- POSISI DIUBAH KE KIRI ---
          drawerPosition: 'left', 
          // -----------------------------
          headerShown: true,
          headerTitle: "SkillLink",
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#1e293b',
          drawerStyle: {
            width: '80%',
          },
        }}
      >
        {/* Rute Utama (Dashboard) */}
        <Drawer.Screen 
          name="index" 
          options={{ 
            drawerLabel: 'Dashboard',
            headerTitle: 'Dashboard' 
          }} 
        />
        
        {/* Rute Admin (Panel Manajemen) */}
        <Drawer.Screen 
          name="admin/index" 
          options={{ 
            drawerLabel: 'Panel Admin',
            headerTitle: 'Admin Management' 
          }} 
        />

        {/* Tambahkan rute lainnya di sini jika ingin muncul di menu */}
        <Drawer.Screen name="proyek" options={{ drawerLabel: 'Proyek Saya' }} />
        <Drawer.Screen name="messages" options={{ drawerLabel: 'Pesan' }} />
        <Drawer.Screen name="notifications" options={{ drawerLabel: 'Notifikasi' }} />
        
        {/* Sembunyikan rute yang tidak perlu muncul di list menu drawer secara manual */}
        <Drawer.Screen 
          name="auth" 
          options={{ 
            drawerItemStyle: { display: 'none' },
            headerShown: false 
          }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}