import { Tabs } from 'expo-router';
import { LayoutDashboard, Briefcase, Wallet, User } from 'lucide-react-native';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function FreelancerLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <DashboardHeader />,
        tabBarActiveTintColor: '#2563EB', 
        tabBarInactiveTintColor: '#94A3B8',
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
        name="index" 
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Lowongan', 
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
      
      <Tabs.Screen name="profile/index" options={{ href: null }} /> 
      <Tabs.Screen name="settings/index" options={{ href: null }} /> 
      <Tabs.Screen name="contracts/index" options={{ href: null }} /> 
    </Tabs>
  );
}