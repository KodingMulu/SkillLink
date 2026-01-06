import { Tabs } from 'expo-router';
import { LayoutDashboard } from 'lucide-react-native';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';

export default function ClientLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <DashboardHeader />,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
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

      <Tabs.Screen name="jobs" options={{ href: null }} />
      <Tabs.Screen name="wallet" options={{ href: null }} />
      <Tabs.Screen name="talents" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="contracts" options={{ href: null }} />
      <Tabs.Screen name="applicants" options={{ href: null }} />
    </Tabs>
  );
}