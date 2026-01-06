import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Modal
} from 'react-native';
import { Search, Bell, LogOut, User as UserIcon, Settings } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const rawRole = user?.role || 'Guest';
  const displayRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();

  const dashboardPath = user?.role === 'CLIENT' ? '/(dashboard)/client' : user?.role === 'ADMIN' ? '/(dashboard)/admin' : '/(dashboard)/freelancer';

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      await axios.post(`${apiUrl}/auth/logout`);
      await AsyncStorage.removeItem('token');
      router.replace('/login');
    } catch (error) {
      await AsyncStorage.removeItem('token');
      router.replace('/login');
    }
  };

  const navigateTo = (path: string) => {
    setIsMenuVisible(false);
    // @ts-ignore
    router.push(path);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            placeholder="Cari..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton}>
          <View style={styles.badgeContainer}>
            <Bell size={22} color="#64748B" />
            <View style={styles.badge} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => setIsMenuVisible(true)}
        >
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

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsMenuVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownEmail} numberOfLines={1}>{user?.email}</Text>
            </View>

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => navigateTo(`${dashboardPath}/profile`)}
            >
              <UserIcon size={16} color="#64748B" />
              <Text style={styles.dropdownText}>Profil Saya</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => navigateTo(`${dashboardPath}/settings`)}
            >
              <Settings size={16} color="#64748B" />
              <Text style={styles.dropdownText}>Pengaturan</Text>
            </TouchableOpacity>

            <View style={styles.dropdownDivider} />

            <TouchableOpacity
              style={[styles.dropdownItem, styles.logoutItem]}
              onPress={handleLogout}
            >
              <LogOut size={16} color="#EF4444" />
              <Text style={[styles.dropdownText, styles.logoutText]}>Keluar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
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
    zIndex: 50,
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
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 85,
    right: 16,
    width: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dropdownHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 4,
  },
  dropdownEmail: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  logoutItem: {
    marginTop: 2,
  },
  logoutText: {
    color: '#EF4444',
  },
});