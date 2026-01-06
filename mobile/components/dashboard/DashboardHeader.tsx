import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Search, Bell } from 'lucide-react-native'; // Hapus import Menu
// Hapus import useNavigation dan DrawerActions
import { useAuth } from '../../context/AuthContext'; 

export default function DashboardHeader() {
  // const navigation = useNavigation(); <-- Hapus ini
  const { user } = useAuth();
  
  const rawRole = user?.role || 'Guest';
  const displayRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();

  // Hapus fungsi toggleDrawer

  return (
    <View style={styles.headerContainer}>
      {/* BAGIAN KIRI: Search Bar (Sekarang full width di kiri) */}
      <View style={styles.leftSection}>
        {/* Tombol Menu Dihapus */}
        
        <View style={styles.searchContainer}>
          <Search size={18} color="#94A3B8" />
          <TextInput 
            placeholder="Cari..." 
            placeholderTextColor="#94A3B8"
            style={styles.searchInput} 
          />
        </View>
      </View>

      {/* BAGIAN KANAN: Notifikasi & Profil */}
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton}>
          <View style={styles.badgeContainer}>
            <Bell size={22} color="#64748B" />
            <View style={styles.badge} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.username || user?.email || 'User'}
            </Text>
            <Text style={styles.userRole}>{displayRole}</Text>
          </View>

          <View style={styles.avatar}>
             <Text style={styles.avatarText}>
                {user?.username?.substring(0, 2).toUpperCase() || 'SL'}
             </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    height: 80, // Tinggi disesuaikan
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end', // Agar konten turun ke bawah (aman dari status bar)
    paddingBottom: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    flex: 1, // Search bar mengisi sisa ruang
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    color: '#334155',
    paddingVertical: 0, 
  },
  badgeContainer: {
    position: 'relative',
    marginRight: 4,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: 0,
    width: 9,
    height: 9,
    backgroundColor: '#EF4444',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, 
  },
  userInfo: {
    alignItems: 'flex-end', 
    maxWidth: 100, 
    display: 'flex', 
  },
  userName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  userRole: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#DBEAFE', 
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  avatarText: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: 'bold',
  },
});