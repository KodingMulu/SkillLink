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
  color?: string; // Menambahkan opsi warna custom untuk icon admin
}

export default function DrawerMenu({ 
  onClose, 
  userName = "Nazril",
  userEmail = "nazril@skilllink.com" 
}: DrawerMenuProps) {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    onClose();
    // Gunakan delay kecil agar animasi modal tertutup selesai sebelum navigasi
    setTimeout(() => {
      router.push(route as any);
    }, 150);
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
          color={item.color || "#64748b"} 
          style={styles.menuIcon}
        />
        <Text style={[styles.menuLabel, item.color ? { color: item.color } : {}]}>{item.label}</Text>
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
    { label: 'Pesan', icon: 'message', route: '/messages', badge: '3' }, 
    { label: 'Notifikasi', icon: 'bell', route: '/notifications' },
  ];

  // SEKSI BARU: Menu Khusus Admin
  const adminMenuItems: MenuItem[] = [
    { 
      label: 'Panel Admin', 
      icon: 'shield-account', 
      route: '/admin', // Menghubungkan ke mobile/app/admin.tsx
      color: '#3b82f6' // Warna biru agar terlihat berbeda
    },
  ];

  const accountMenuItems: MenuItem[] = [
    { label: 'Profil', icon: 'account', route: '/profile' },
    { label: 'Pengaturan', icon: 'cog', route: '/settings' },
    { label: 'Dompet', icon: 'wallet', route: '/wallet' },
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
        <View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>
      </View>

      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {/* Menu Utama */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu Utama</Text>
          {mainMenuItems.map(renderMenuItem)}
        </View>
        
        <Divider style={styles.divider} />

        {/* Seksi Admin yang Baru Ditambahkan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Administrator</Text>
          {adminMenuItems.map(renderMenuItem)}
        </View>

        <Divider style={styles.divider} />
        
        {/* Menu Akun */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akun</Text>
          {accountMenuItems.map(renderMenuItem)}
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Tombol Keluar */}
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
  header: { backgroundColor: '#3b82f6', padding: 20, paddingTop: 60, paddingBottom: 25 },
  avatar: { marginBottom: 12, backgroundColor: '#2563eb', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  userName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  userEmail: { color: '#fff', fontSize: 14, opacity: 0.9 },
  menuContainer: { flex: 1 },
  section: { paddingVertical: 8 },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', paddingHorizontal: 16, paddingVertical: 8, letterSpacing: 0.5 },
  menuItem: { paddingVertical: 12, paddingHorizontal: 16 },
  menuItemContent: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 16, width: 24 },
  menuLabel: { fontSize: 15, color: '#1e293b', flex: 1, fontWeight: '500' },
  badge: { backgroundColor: '#ef4444', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  divider: { marginVertical: 4, backgroundColor: '#f1f5f9', height: 1 },
  logoutItem: { marginTop: 8, marginBottom: 30 },
  logoutText: { color: '#ef4444', fontWeight: 'bold' },
});