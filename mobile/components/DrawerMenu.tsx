// File: app/components/DrawerMenu.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Text, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
}

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  badge?: string;
  onPress?: () => void;
}

export default function DrawerMenu({ 
  visible, 
  onClose, 
  userName = "Nazril",
  userEmail = "nazril@skilllink.com" 
}: DrawerMenuProps) {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.label}
      style={styles.menuItem}
      onPress={() => {
        if (item.route) {
          handleNavigation(item.route);
        } else if (item.onPress) {
          item.onPress();
        }
      }}
    >
      <View style={styles.menuItemContent}>
        <MaterialCommunityIcons 
          name={item.icon as any} 
          size={24} 
          color="#64748b" 
          style={styles.menuIcon}
        />
        <Text style={styles.menuLabel}>{item.label}</Text>
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const mainMenuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'view-dashboard', route: '/' },
    { label: 'Proyek Saya', icon: 'briefcase', route: '/projects' },
    { label: 'Pesan', icon: 'message', route: '/messages', badge: '3' },
    { label: 'Notifikasi', icon: 'bell', route: '/notifications' },
  ];

  const accountMenuItems: MenuItem[] = [
    { label: 'Profil', icon: 'account', route: '/profile' },
    { label: 'Pengaturan', icon: 'cog', route: '/settings' },
    { label: 'Riwayat Transaksi', icon: 'history', route: '/transactions' },
    { label: 'Dompet', icon: 'wallet', route: '/wallet' },
  ];

  const otherMenuItems: MenuItem[] = [
    { label: 'Bantuan & FAQ', icon: 'help-circle', route: '/help' },
    { label: 'Tentang Aplikasi', icon: 'information', route: '/about' },
    { label: 'Kebijakan Privasi', icon: 'shield-account', route: '/privacy' },
  ];

  return (
    <View style={styles.container}>
      {/* Header Profile */}
      <View style={styles.header}>
        <Avatar.Text 
          size={64} 
          label={userName.substring(0, 2).toUpperCase()} 
          style={styles.avatar}
          color="#ffffff"
        />
        <Text style={styles.userName}>
          {userName}
        </Text>
        <Text style={styles.userEmail}>
          {userEmail}
        </Text>
      </View>

      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {/* Main Menu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu Utama</Text>
          {mainMenuItems.map(renderMenuItem)}
        </View>

        <Divider style={styles.divider} />

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akun</Text>
          {accountMenuItems.map(renderMenuItem)}
        </View>

        <Divider style={styles.divider} />

        {/* Other Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lainnya</Text>
          {otherMenuItems.map(renderMenuItem)}
        </View>

        <Divider style={styles.divider} />

        {/* Logout */}
        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem]}
          onPress={() => {
            onClose();
            // Handle logout logic
            console.log('Logout');
          }}
        >
          <View style={styles.menuItemContent}>
            <MaterialCommunityIcons 
              name="logout" 
              size={24} 
              color="#ef4444" 
              style={styles.menuIcon}
            />
            <Text style={[styles.menuLabel, styles.logoutText]}>Keluar</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#3b82f6',
    padding: 20,
    paddingTop: 50,
    paddingBottom: 25,
    alignItems: 'flex-start',
  },
  avatar: {
    marginBottom: 12,
    backgroundColor: '#2563eb',
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  menuContainer: {
    flex: 1,
  },
  section: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingVertical: 8,
    letterSpacing: 0.5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
    width: 24,
  },
  menuLabel: {
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#e2e8f0',
  },
  logoutItem: {
    marginTop: 8,
    marginBottom: 20,
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});