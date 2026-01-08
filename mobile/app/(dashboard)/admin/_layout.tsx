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
        name="projects/index"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color }) => (
            <Icon source="briefcase-outline" color={color} size={20} />
          ),
        }}
      />

      <Tabs.Screen
        name="reports/index"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => (
            <Icon source="book" color={color} size={20} />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions/index"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => (
            <Icon source="cog-transfer-outline" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="user/index"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => (
            <Icon source="account-group-outline" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen name="transactions/components/TaxReportModal" options={{ href: null }} />
      <Tabs.Screen name="reports/components/ModerationPolicyModal" options={{ href: null }} />
      <Tabs.Screen name="projects/components/CreateProjectModal" options={{ href: null }} />
    </Tabs>
  );
}
