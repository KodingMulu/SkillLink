import { Tabs } from 'expo-router';
import { Briefcase, FolderKanban, LayoutDashboard, Wallet } from 'lucide-react-native';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

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
          tabBarIcon: ({ focused }) => (
            <LayoutDashboard
              size={20}
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
              color={focused ? '#2563EB' : '#94A3B8'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ focused }) => (
            <FolderKanban
              size={20}
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
              color={focused ? '#2563EB' : '#94A3B8'}
            />
          ),
        }}
      />

      <Tabs.Screen name="profile/index" options={{ href: null }} />
      <Tabs.Screen name="settings/index" options={{ href: null }} />
      <Tabs.Screen name="contracts/index" options={{ href: null }} />
    </Tabs>
  );
}
