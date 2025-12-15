import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { 
  User, 
  Settings, 
  FileText, 
  Bell, 
  HelpCircle, 
  LogOut 
} from 'lucide-react-native';

interface ProfileMenuProps {
  visible: boolean;
  onDismiss: () => void;
  role: 'client' | 'freelancer';
  userName: string;
  userEmail: string;
}

export default function ProfileMenu({ 
  visible, 
  onDismiss, 
  role,
  userName,
  userEmail 
}: ProfileMenuProps) {
  
  const handleMenuAction = (action: string) => {
    console.log(`Action: ${action}`);
    onDismiss();
    // Tambahkan navigasi atau aksi sesuai kebutuhan
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <View style={styles.menuContainer}>
          <View style={styles.menuContent}>
            {/* Header Profile */}
            <View style={styles.profileHeader}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userName}</Text>
                <Text style={styles.profileEmail}>{userEmail}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>
                    {role === 'freelancer' ? 'Freelancer' : 'Client'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Menu Items */}
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuAction('profile')}
            >
              <User size={18} color="#475569" style={styles.menuIcon} />
              <Text style={styles.menuText}>Lihat Profil</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuAction('settings')}
            >
              <Settings size={18} color="#475569" style={styles.menuIcon} />
              <Text style={styles.menuText}>Pengaturan</Text>
            </TouchableOpacity>

            {role === 'freelancer' && (
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuAction('portfolio')}
              >
                <FileText size={18} color="#475569" style={styles.menuIcon} />
                <Text style={styles.menuText}>Portfolio</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuAction('notifications')}
            >
              <Bell size={18} color="#475569" style={styles.menuIcon} />
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Notifikasi</Text>
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>3</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => handleMenuAction('help')}
            >
              <HelpCircle size={18} color="#475569" style={styles.menuIcon} />
              <Text style={styles.menuText}>Bantuan & Dukungan</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={[styles.menuItem, styles.logoutItem]}
              onPress={() => handleMenuAction('logout')}
            >
              <LogOut size={18} color="#EF4444" style={styles.menuIcon} />
              <Text style={[styles.menuText, styles.logoutText]}>Keluar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menuContainer: {
    marginTop: 8,
  },
  menuContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 8,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 12,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileAvatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  menuTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  notifBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logoutItem: {
    marginTop: 4,
  },
  logoutText: {
    color: '#EF4444',
  },
});