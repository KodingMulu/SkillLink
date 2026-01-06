import { Tabs } from 'expo-router';
import { LayoutDashboard, Briefcase, Wallet, User } from 'lucide-react-native';
import DashboardHeader from '../../../components/dashboard/DashboardHeader'; // Import Header Custom

export default function FreelancerLayout() {
  return (
    <Tabs
      screenOptions={{
        // 1. Ganti Header Bawaan Tabs dengan Header Custom Kita
        header: () => <DashboardHeader />,
        
        // 2. Styling Tab Bar Bawah
        tabBarActiveTintColor: '#2563EB', // Warna Biru saat aktif
        tabBarInactiveTintColor: '#94A3B8', // Warna abu saat tidak aktif
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        }
      }}
    >
      <Tabs.Screen
        name="index" // Dashboard Utama
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Lowongan', // Cari Kerja
          tabBarIcon: ({ color }) => <Briefcase size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Saldo',
          tabBarIcon: ({ color }) => <Wallet size={24} color={color} />,
        }}
      />
      
      {/* Sembunyikan route lain yang tidak perlu muncul di menu bawah */}
      <Tabs.Screen name="profile/index" options={{ href: null }} /> 
      <Tabs.Screen name="settings/index" options={{ href: null }} /> 
      <Tabs.Screen name="contracts/index" options={{ href: null }} /> 
    </Tabs>
  );
}