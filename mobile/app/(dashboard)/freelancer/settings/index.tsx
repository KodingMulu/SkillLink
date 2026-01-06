import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, 
  Switch, Alert, ActivityIndicator, Dimensions 
} from 'react-native';
import { 
  User, Bell, CreditCard, Shield, Check, X, ExternalLink, 
  MapPin, Phone, Eye, EyeOff, Save, Wallet, Plus 
} from 'lucide-react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    title: '',
    bio: '',
    phone: '',
    location: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  
  const [walletData, setWalletData] = useState({
    balance: 0,
    bankName: '-',
    accountNumber: '-',
    accountHolder: '-'
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailJobAlerts: true,
    emailMessages: true,
    pushNewProject: false,
    pushPayment: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/user/freelancer/settings`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.code === 200) {
        const data = response.data.data;
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          title: data.title || '',
          bio: data.bio || '',
          phone: data.phone || '',
          location: data.location || ''
        });
        setSkills(data.skills || []);
        if (data.wallet) {
          setWalletData(data.wallet);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleProfileUpdate = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');
      
      await axios.put(`${apiUrl}/user/freelancer/settings`, {
        name: profileData.name,
        title: profileData.title,
        bio: profileData.bio,
        phone: profileData.phone,
        location: profileData.location,
        skills: skills
      }, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      Alert.alert('Sukses', 'Profil berhasil diperbarui');
    } catch (error) {
      Alert.alert('Gagal', 'Gagal menyimpan perubahan profil');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'Konfirmasi password tidak cocok');
      return;
    }

    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');

      const response = await axios.patch(`${apiUrl}/user/freelancer/settings`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.code === 200) {
        Alert.alert('Sukses', 'Password berhasil diubah');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        Alert.alert('Gagal', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengubah password');
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informasi Profil</Text>
            
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {profileData.name.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profileData.name}</Text>
                <Text style={styles.profileEmail}>{profileData.email}</Text>
                {profileData.location !== '' && (
                  <View style={styles.locationRow}>
                    <MapPin size={12} color="#94A3B8" />
                    <Text style={styles.locationText}>{profileData.location}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <TextInput 
                style={styles.input} 
                value={profileData.name}
                onChangeText={(text) => setProfileData({...profileData, name: text})}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Profesi / Title</Text>
              <TextInput 
                style={styles.input} 
                value={profileData.title}
                onChangeText={(text) => setProfileData({...profileData, title: text})}
                placeholder="Contoh: Frontend Developer"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Nomor Telepon</Text>
                <View style={styles.inputWithIcon}>
                  <Phone size={16} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.inputIconField} 
                    value={profileData.phone}
                    onChangeText={(text) => setProfileData({...profileData, phone: text})}
                    placeholder="+62..."
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Lokasi</Text>
                <View style={styles.inputWithIcon}>
                  <MapPin size={16} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput 
                    style={styles.inputIconField} 
                    value={profileData.location}
                    onChangeText={(text) => setProfileData({...profileData, location: text})}
                    placeholder="Kota, Negara"
                  />
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.labelSmall}>KEAHLIAN (SKILLS)</Text>
              <View style={styles.skillsContainer}>
                {skills.map((skill) => (
                  <View key={skill} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill}</Text>
                    <TouchableOpacity onPress={() => removeSkill(skill)}>
                      <X size={14} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={styles.addSkillRow}>
                <TextInput 
                  style={[styles.input, { flex: 1, marginBottom: 0 }]} 
                  value={newSkill}
                  onChangeText={setNewSkill}
                  placeholder="Tambah skill..."
                />
                <TouchableOpacity style={styles.addSkillBtn} onPress={addSkill}>
                  <Text style={styles.addSkillBtnText}>Tambah</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Bio Singkat</Text>
              <TextInput 
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
                value={profileData.bio}
                onChangeText={(text) => setProfileData({...profileData, bio: text})}
                placeholder="Ceritakan pengalaman Anda..."
                multiline
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleProfileUpdate}>
              <Save size={18} color="white" />
              <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'security':
        return (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Shield size={24} color="#2563EB" />
              <Text style={styles.sectionTitle}>Keamanan Akun</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password Saat Ini</Text>
              <View style={styles.passwordContainer}>
                <TextInput 
                  style={styles.passwordInput}
                  value={passwordData.currentPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)} style={styles.eyeIcon}>
                  {showCurrentPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password Baru</Text>
              <View style={styles.passwordContainer}>
                <TextInput 
                  style={styles.passwordInput}
                  value={passwordData.newPassword}
                  onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                  {showNewPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Konfirmasi Password Baru</Text>
              <TextInput 
                style={styles.input}
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handlePasswordChange}>
              <Text style={styles.saveButtonText}>Ubah Password</Text>
            </TouchableOpacity>
          </View>
        );

      case 'notifications':
        return (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Bell size={24} color="#2563EB" />
              <Text style={styles.sectionTitle}>Preferensi Notifikasi</Text>
            </View>

            <View style={styles.notificationList}>
              {[
                { id: 'emailJobAlerts', label: 'Email Lowongan', desc: 'Info lowongan via email.' },
                { id: 'emailMessages', label: 'Email Pesan', desc: 'Notif saat ada pesan masuk.' },
                { id: 'pushNewProject', label: 'Push Proyek Baru', desc: 'Notif di HP untuk proyek baru.' },
                { id: 'pushPayment', label: 'Notifikasi Pembayaran', desc: 'Info dana masuk/keluar.' },
              ].map((item) => (
                <View key={item.id} style={styles.notificationItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notifLabel}>{item.label}</Text>
                    <Text style={styles.notifDesc}>{item.desc}</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
                    thumbColor={'#FFFFFF'}
                    value={notifications[item.id as keyof typeof notifications]}
                    onValueChange={() => setNotifications({
                      ...notifications, 
                      [item.id]: !notifications[item.id as keyof typeof notifications]
                    })}
                  />
                </View>
              ))}
            </View>
          </View>
        );

      case 'payment':
        return (
          <View style={styles.tabContent}>
            <View style={styles.walletCard}>
              <Text style={styles.walletLabel}>Total Saldo Aktif</Text>
              <Text style={styles.walletBalance}>{formatRupiah(walletData.balance)}</Text>
              <View style={styles.walletActions}>
                <TouchableOpacity style={styles.withdrawBtn}>
                  <Text style={styles.withdrawText}>Tarik Dana</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.historyBtn}>
                  <Text style={styles.historyText}>Riwayat</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Wallet size={20} color="#64748B" />
                <Text style={styles.sectionTitle}>Akun Penerima</Text>
              </View>
              
              <View style={styles.bankAccountCard}>
                <View style={styles.bankInfo}>
                  <View style={styles.bankIcon}>
                    <Text style={styles.bankIconText}>{walletData.bankName?.charAt(0) || 'B'}</Text>
                  </View>
                  <View>
                    <Text style={styles.bankName}>{walletData.bankName}</Text>
                    <Text style={styles.accountNumber}>{walletData.accountNumber}</Text>
                    <Text style={styles.accountHolder}>{walletData.accountHolder}</Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Text style={styles.editLink}>Ubah</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Pengaturan</Text>
          <Text style={styles.headerSubtitle}>Kelola akun dan preferensi Anda</Text>
        </View>
        <TouchableOpacity 
          style={styles.publicProfileBtn}
          onPress={() => router.push('/(dashboard)/freelancer/profile')}
        >
          <ExternalLink size={14} color="#334155" />
          <Text style={styles.publicProfileText}>Lihat Profil</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {[
          { id: 'profile', label: 'Profil', icon: User },
          { id: 'security', label: 'Keamanan', icon: Shield },
          { id: 'notifications', label: 'Notifikasi', icon: Bell },
          { id: 'payment', label: 'Pembayaran', icon: CreditCard },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.tabBtn, activeTab === tab.id && styles.activeTabBtn]}
          >
            <tab.icon 
              size={16} 
              color={activeTab === tab.id ? 'white' : '#334155'} 
            />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  publicProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  publicProfileText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  tabsContainer: {
    maxHeight: 60,
  },
  tabsContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 10,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeTabBtn: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  activeTabText: {
    color: 'white',
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  tabContent: {
    gap: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748B',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  row: {
    flexDirection: 'row',
  },
  inputWithIcon: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  inputIconField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    paddingLeft: 36,
    fontSize: 14,
    color: '#0F172A',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  skillText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  addSkillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addSkillBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 10,
  },
  addSkillBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    paddingRight: 40,
    fontSize: 14,
    color: '#0F172A',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  notificationList: {
    gap: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  notifLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  notifDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    maxWidth: '80%',
  },
  walletCard: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  walletLabel: {
    color: '#DBEAFE',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  walletBalance: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
  },
  withdrawBtn: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  withdrawText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 12,
  },
  historyBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  historyText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  bankAccountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bankIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#DBEAFE',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankIconText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 18,
  },
  bankName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  accountNumber: {
    fontSize: 12,
    color: '#64748B',
  },
  accountHolder: {
    fontSize: 10,
    color: '#94A3B8',
  },
  editLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
  },
});