import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Image,
  TextStyle,
} from 'react-native';
import { Text, Avatar, Divider, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type TabType = 'profile' | 'notifications' | 'security' | 'payment';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showPassword, setShowPassword] = useState(false);

  // State untuk Notifikasi (Switch)
  const [emailMatch, setEmailMatch] = useState(true);
  const [pushMessage, setPushMessage] = useState(true);

  const handleSave = () => {
    Alert.alert("Sukses", "Pengaturan Anda telah diperbarui!");
  };

  const renderProfile = () => (
    <View style={styles.section}>
      <View style={styles.avatarContainer}>
        <Avatar.Text size={80} label="NA" style={styles.avatar} color="#fff" />
        <TouchableOpacity style={styles.cameraBtn}>
          <MaterialCommunityIcons name="camera" size={20} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.userName}>Nazril Afandi</Text>
        <Text style={styles.userEmail}>nazril@example.com</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput style={styles.input} defaultValue="Nazril Afandi" />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nomor Telepon</Text>
        <TextInput style={styles.input} defaultValue="+62 812-3456-7890" keyboardType="phone-pad" />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nama Perusahaan</Text>
        <TextInput style={styles.input} defaultValue="PT Digital Innovation" />
      </View>
    </View>
  );

  const renderNotifications = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Preferensi Notifikasi</Text>
      
      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>Freelancer Baru Cocok</Text>
          <Text style={styles.switchSub}>Via email jika ada kandidat pas</Text>
        </View>
        <Switch value={emailMatch} onValueChange={setEmailMatch} trackColor={{ true: '#2563eb' }} />
      </View>

      <Divider style={styles.divider} />

      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>Pesan Masuk</Text>
          <Text style={styles.switchSub}>Push notification pesan baru</Text>
        </View>
        <Switch value={pushMessage} onValueChange={setPushMessage} trackColor={{ true: '#2563eb' }} />
      </View>
    </View>
  );

  const renderSecurity = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Ubah Password</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password Lama</Text>
        <View style={styles.passwordWrapper}>
          <TextInput 
            style={[styles.input, { flex: 1, borderBottomWidth: 0 }]} 
            secureTextEntry={!showPassword} 
            placeholder="••••••••"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <MaterialCommunityIcons name={showPassword ? "eye-off" : "eye"} size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
      <Button mode="outlined" style={styles.btnSecurity}>Aktifkan 2FA</Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Navigation (Scrollable horizontally) */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {[
            { id: 'profile', label: 'Profil', icon: 'account' },
            { id: 'notifications', label: 'Notifikasi', icon: 'bell' },
            { id: 'security', label: 'Keamanan', icon: 'shield-lock' },
            { id: 'payment', label: 'Bayar', icon: 'credit-card' },
          ].map((tab) => (
            <TouchableOpacity 
              key={tab.id} 
              onPress={() => setActiveTab(tab.id as TabType)}
              style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
            >
              <MaterialCommunityIcons 
                name={tab.icon as any} 
                size={18} 
                color={activeTab === tab.id ? '#fff' : '#64748b'} 
              />
              <Text style={[styles.tabText, { color: activeTab === tab.id ? '#fff' : '#64748b' }]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'payment' && (
           <View style={styles.emptyState}>
              <MaterialCommunityIcons name="credit-card-off" size={60} color="#cbd5e1" />
              <Text style={{ marginTop: 10, color: '#64748b' }}>Belum ada metode pembayaran</Text>
           </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabContainer: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  tabItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginRight: 8, backgroundColor: '#f8fafc', gap: 6 },
  tabItemActive: { backgroundColor: '#2563eb' },
  tabText: { fontSize: 13, fontWeight: 'bold' } as TextStyle,

  scrollContent: { padding: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 20 } as TextStyle,

  avatarContainer: { alignItems: 'center', marginBottom: 30 },
  avatar: { backgroundColor: '#3b82f6' },
  cameraBtn: { position: 'absolute', right: '38%', bottom: 60, backgroundColor: '#fff', padding: 6, borderRadius: 20, elevation: 3 },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginTop: 15 } as TextStyle,
  userEmail: { fontSize: 14, color: '#64748b' } as TextStyle,

  formGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 8 } as TextStyle,
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, fontSize: 15 },
  
  passwordWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12 },
  eyeIcon: { padding: 10 },

  switchRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  switchLabel: { fontSize: 15, fontWeight: '600', color: '#0f172a' } as TextStyle,
  switchSub: { fontSize: 12, color: '#64748b', marginTop: 2 } as TextStyle,
  divider: { marginVertical: 10, backgroundColor: '#f1f5f9' },

  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  saveButton: { backgroundColor: '#2563eb', paddingVertical: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#2563eb', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 } as TextStyle,
  btnSecurity: { marginTop: 10, borderRadius: 12 },
  emptyState: { alignItems: 'center', marginTop: 50 }
});