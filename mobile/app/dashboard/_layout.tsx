import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import DrawerMenu from '../../components/DrawerMenu';

export default function DashboardLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <DrawerMenu 
            {...props} 
            visible={true} 
            onClose={() => props.navigation.closeDrawer()} 
          />
        )}
        screenOptions={{
          drawerPosition: 'left',
          headerShown: false,
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#1e293b',
          drawerStyle: { width: 300 },
        }}
      >
        <Drawer.Screen 
          name="index" 
          options={{ drawerLabel: 'Overview', headerTitle: 'Dashboard' }} 
        />
        <Drawer.Screen 
          name="wallet" 
          options={{ drawerLabel: 'Saldo Saya', headerTitle: 'Dompet' }} 
        />
        <Drawer.Screen 
          name="jobs" 
          options={{ drawerLabel: 'Cari Kerja', headerTitle: 'Lowongan' }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}