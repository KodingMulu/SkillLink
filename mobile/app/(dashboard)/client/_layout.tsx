import { Tabs } from 'expo-router';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Icon } from 'react-native-paper';

export default function ClientLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <DashboardHeader />,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: 120,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => (
            <Icon source="view-dashboard-outline" color={color} size={20} />
          ),
        }}
      />

      <Tabs.Screen
        name="jobs/index"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color }) => (
            <Icon source="briefcase-outline" color={color} size={20} />
          ),
        }}
      />

      <Tabs.Screen
        name="talents/index"
        options={{
          title: 'Talents',
          tabBarIcon: ({ color }) => (
            <Icon source="account-group-outline" color={color} size={20} />
          ),
        }}
      />

      <Tabs.Screen
        name="wallet/index"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => (
            <Icon source="wallet-outline" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen name="settings/index" options={{ href: null }} />
      <Tabs.Screen name="contracts/[id]/index" options={{ href: null }} />
      <Tabs.Screen name="applicants/[id]/index" options={{ href: null }} />
    </Tabs>
  );
}
