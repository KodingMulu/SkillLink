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
  onClose, 
  userName = "Nazril",
  userEmail = "nazril@skilllink.com" 
}: DrawerMenuProps) {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    onClose();
    // Gunakan push atau replace sesuai kebutuhan flow aplikasi
    setTimeout(() => {
      router.push(route as any);
    }, 100); // Delay 100ms biasanya cukup untuk menutup modal dengan smooth
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
    { label: 'Proyek Saya', icon: 'briefcase', route: '/proyek' },
    // Pastikan route ini sesuai dengan nama file: messages.tsx
    { label: 'Pesan', icon: 'message', route: '/messages', badge: '3' }, 
    { label: 'Notifikasi', icon: 'bell', route: '/notifications' },
  ];

  const accountMenuItems: MenuItem[] = [
    { label: 'Profil', icon: 'account', route: '/profile' },
    { label: 'Pengaturan', icon: 'cog', route: '/settings' },
    { label: 'Riwayat Transaksi', icon: 'history', route: '/transactions' },
    { label: 'Dompet', icon: 'wallet', route: '/wallet' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text 
          size={64} 
          label={userName.substring(0, 2).toUpperCase()} 
          style={styles.avatar}
          color="#ffffff"
        />
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>

      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu Utama</Text>
          {mainMenuItems.map(renderMenuItem)}
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akun</Text>
          {accountMenuItems.map(renderMenuItem)}
        </View>
        
        <Divider style={styles.divider} />
        
        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutItem]} 
          onPress={() => {
            onClose();
            console.log('Logout dipicu');
          }}
        >
          <View style={styles.menuItemContent}>
            <MaterialCommunityIcons name="logout" size={24} color="#ef4444" style={styles.menuIcon} />
            <Text style={[styles.menuLabel, styles.logoutText]}>Keluar</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#3b82f6', padding: 20, paddingTop: 50, paddingBottom: 25 },
  avatar: { marginBottom: 12, backgroundColor: '#2563eb', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  userName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  userEmail: { color: '#fff', fontSize: 14, opacity: 0.9 },
  menuContainer: { flex: 1 },
  section: { paddingVertical: 8 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', paddingHorizontal: 16, paddingVertical: 8 },
  menuItem: { paddingVertical: 12, paddingHorizontal: 16 },
  menuItemContent: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 16, width: 24 },
  menuLabel: { fontSize: 16, color: '#1e293b', flex: 1 },
  badge: { backgroundColor: '#ef4444', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  divider: { marginVertical: 8, backgroundColor: '#e2e8f0' },
  logoutItem: { marginTop: 8, marginBottom: 20 },
  logoutText: { color: '#ef4444', fontWeight: '600' },
});