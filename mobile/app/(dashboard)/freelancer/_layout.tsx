import { Tabs } from 'expo-router';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Icon } from 'react-native-paper';

export default function FreelancerLayout() {
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
        tabBarItemStyle: {
          paddingVertical: 4,
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
            <Icon source="view-dashboard-outline" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="jobs/index"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color }) => (
            <Icon source="briefcase-outline" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="portfolio/index"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color }) => (
            <Icon source="folder-account-outline" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="wallet/index"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => (
            <Icon source="wallet-outline" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="profile/index" options={{ href: null }} />
      <Tabs.Screen name="settings/index" options={{ href: null }} />
      <Tabs.Screen name="contracts/index" options={{ href: null }} />
    </Tabs>
  );
}
