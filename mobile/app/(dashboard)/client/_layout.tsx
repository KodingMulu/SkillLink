import { Tabs } from 'expo-router';
import { Briefcase, LayoutDashboard, Users, Wallet } from 'lucide-react-native';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

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
          tabBarIcon: ({ focused }) => (
            <LayoutDashboard
              size={20}
              strokeWidth={2}
              color={focused ? '#2563EB' : '#94A3B8'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ focused }) => (
            <Briefcase
              size={20}
              strokeWidth={2}
              color={focused ? '#2563EB' : '#94A3B8'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="talents"
        options={{
          title: 'Talents',
          tabBarIcon: ({ focused }) => (
            <Users
              size={20}
              strokeWidth={2}
              color={focused ? '#2563EB' : '#94A3B8'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ focused }) => (
            <Wallet
              size={20}
              strokeWidth={2}
              color={focused ? '#2563EB' : '#94A3B8'}
            />
          ),
        }}
      />
      <Tabs.Screen name="settings/index" options={{ href: null }} />
      <Tabs.Screen name="contracts/[id]/index" options={{ href: null }} />
      <Tabs.Screen name="applicants/[id]/index" options={{ href: null }} />
    </Tabs>
  );
}
