import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Text, Card, Avatar, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

type TabType = 'profile' | 'security' | 'notifications' | 'payment';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [name, setName] = useState('Alex Johnson');
  const [title, setTitle] = useState('Senior Fullstack Developer');
  const [phone, setPhone] = useState('+62 812 3456 7890');
  const [location, setLocation] = useState('Bandung, Indonesia');
  const [bio, setBio] = useState('Professional developer focusing on React Native.');
  
  // Skills State
  const [skills, setSkills] = useState(['React Native', 'TypeScript', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');

  // Password State
  const [showPwd, setShowPwd] = useState(false);

  // Notification State
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('Sukses', 'Perubahan profil berhasil disimpan!');
    }, 1500);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.flex1}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Pengaturan</Text>
              <Text style={styles.headerSub}>Kelola akun dan preferensi Anda</Text>
            </View>
            <TouchableOpacity style={styles.viewProfileBtn}>
              <MaterialCommunityIcons name="eye-outline" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* TAB SELECTOR */}
          <View style={styles.tabWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
              {[
                { id: 'profile', icon: 'account-cog-outline', label: 'Profil' },
                { id: 'security', icon: 'shield-check-outline', label: 'Keamanan' },
                { id: 'notifications', icon: 'bell-outline', label: 'Notifikasi' },
                { id: 'payment', icon: 'credit-card-outline', label: 'Bayar' },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id as TabType)}
                  style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
                >
                  <MaterialCommunityIcons 
                    name={tab.icon as any} 
                    size={20} 
                    color={activeTab === tab.id ? '#fff' : '#64748b'} 
                  />
                  <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>{tab.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* CONTENT SECTION */}
          <View style={styles.content}>
            
            {activeTab === 'profile' && (
              <View>
                <Card style={styles.card}>
                  <View style={styles.avatarSection}>
                    <Avatar.Text size={80} label={name.charAt(0)} style={styles.avatar} color="#fff" />
                    <View style={styles.avatarInfo}>
                      <Text style={styles.avatarName}>{name}</Text>
                      <Text style={styles.avatarEmail}>alex.j@example.com</Text>
                    </View>
                  </View>
                  
                  <Divider style={styles.divider} />

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>NAMA LENGKAP</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>TITLE PROFESI</Text>
                    <TextInput style={styles.input} value={title} onChangeText={setTitle} />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>KEAHLIAN</Text>
                    <View style={styles.skillContainer}>
                      {skills.map((s, i) => (
                        <View key={i} style={styles.skillChip}>
                          <Text style={styles.skillChipText}>{s}</Text>
                          <TouchableOpacity onPress={() => removeSkill(s)}>
                            <MaterialCommunityIcons name="close" size={14} color="#2563eb" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                    <View style={styles.addSkillRow}>
                      <TextInput 
                        style={[styles.input, styles.flex1]} 
                        placeholder="Tambah skill..."
                        value={newSkill}
                        onChangeText={setNewSkill}
                      />
                      <TouchableOpacity style={styles.btnAddSkill} onPress={addSkill}>
                        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>BIO SINGKAT</Text>
                    <TextInput 
                      style={[styles.input, styles.textArea]} 
                      multiline 
                      numberOfLines={4} 
                      value={bio}
                      onChangeText={setBio}
                    />
                  </View>

                  <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
                        <Text style={styles.saveBtnText}>Simpan Perubahan</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </Card>
              </View>
            )}

            {activeTab === 'security' && (
              <Card style={styles.card}>
                <Text style={styles.cardHeaderTitle}>Ubah Password</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>PASSWORD SAAT INI</Text>
                  <View style={styles.passwordWrapper}>
                    <TextInput style={styles.pwdInput} secureTextEntry={!showPwd} />
                    <TouchableOpacity onPress={() => setShowPwd(!showPwd)}>
                      <MaterialCommunityIcons name={showPwd ? "eye-off" : "eye"} size={20} color="#94a3b8" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>Update Password</Text>
                </TouchableOpacity>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card style={styles.card}>
                <View style={styles.switchRow}>
                  <View style={styles.flex1}>
                    <Text style={styles.switchLabel}>Email Job Alerts</Text>
                    <Text style={styles.switchSub}>Terima info lowongan via email</Text>
                  </View>
                  <Switch value={notifEmail} onValueChange={setNotifEmail} trackColor={{ true: '#2563eb' }} />
                </View>
                <Divider style={styles.divider} />
                <View style={styles.switchRow}>
                  <View style={styles.flex1}>
                    <Text style={styles.switchLabel}>Push Notifications</Text>
                    <Text style={styles.switchSub}>Notifikasi langsung di HP</Text>
                  </View>
                  <Switch value={notifPush} onValueChange={setNotifPush} trackColor={{ true: '#2563eb' }} />
                </View>
              </Card>
            )}

            {activeTab === 'payment' && (
              <View>
                <LinearGradient colors={['#2563eb', '#1d4ed8']} style={styles.walletCard}>
                  <Text style={styles.walletLabel}>Saldo Aktif</Text>
                  <Text style={styles.walletAmount}>Rp 4.500.000</Text>
                  <TouchableOpacity style={styles.withdrawBtn}>
                    <Text style={styles.withdrawText}>Tarik Dana</Text>
                  </TouchableOpacity>
                </LinearGradient>
                
                <Card style={[styles.card, styles.mt16]}>
                  <Text style={styles.label}>REKENING PENERIMA</Text>
                  <View style={styles.bankInfo}>
                    <View style={styles.bankIcon}>
                      <MaterialCommunityIcons name="bank" size={24} color="#2563eb" />
                    </View>
                    <View>
                      <Text style={styles.bankName}>Bank Central Asia (BCA)</Text>
                      <Text style={styles.bankAcc}>**** 8829</Text>
                    </View>
                  </View>
                </Card>
              </View>
            )}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Terpisah untuk menghindari Type Mismatch
const styles = StyleSheet.create({
  flex1: { flex: 1 },
  mt16: { marginTop: 16 },
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: { padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a' } as TextStyle,
  headerSub: { fontSize: 14, color: '#64748b' } as TextStyle,
  
  viewProfileBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  
  tabWrapper: { marginBottom: 20 },
  tabScrollContent: { paddingHorizontal: 24 },
  tabItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#fff', marginRight: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  tabItemActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  tabLabel: { marginLeft: 8, fontSize: 13, fontWeight: 'bold', color: '#64748b' } as TextStyle,
  tabLabelActive: { color: '#fff' } as TextStyle,

  content: { paddingHorizontal: 24 },
  card: { padding: 20, borderRadius: 24, backgroundColor: '#fff', elevation: 0, borderWidth: 1, borderColor: '#f1f5f9' },
  cardHeaderTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#0f172a' } as TextStyle,
  
  avatarSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { backgroundColor: '#2563eb' },
  avatarInfo: { marginLeft: 16 },
  avatarName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' } as TextStyle,
  avatarEmail: { color: '#64748b', fontSize: 13 } as TextStyle,
  
  divider: { marginVertical: 20, backgroundColor: '#f1f5f9' },
  
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 10, fontWeight: '900', color: '#94a3b8', marginBottom: 8, letterSpacing: 1 } as TextStyle,
  input: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 14, fontSize: 15, borderWidth: 1, borderColor: '#e2e8f0', color: '#0f172a' },
  textArea: { height: 100, textAlignVertical: 'top' },
  
  skillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  skillChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#dbeafe' },
  skillChipText: { fontSize: 12, fontWeight: 'bold', color: '#2563eb', marginRight: 6 } as TextStyle,
  addSkillRow: { flexDirection: 'row', gap: 10 },
  btnAddSkill: { width: 50, backgroundColor: '#0f172a', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

  passwordWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 14 },
  pwdInput: { flex: 1, paddingVertical: 14, fontSize: 15, color: '#0f172a' },

  switchRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  switchLabel: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' } as TextStyle,
  switchSub: { fontSize: 12, color: '#64748b' } as TextStyle,

  walletCard: { padding: 24, borderRadius: 24, elevation: 8 },
  walletLabel: { color: '#bfdbfe', fontSize: 13, fontWeight: 'bold' } as TextStyle,
  walletAmount: { color: '#fff', fontSize: 32, fontWeight: '900', marginVertical: 8 } as TextStyle,
  withdrawBtn: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  withdrawText: { color: '#fff', fontWeight: 'bold', fontSize: 12 } as TextStyle,

  bankInfo: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 10 },
  bankIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },
  bankName: { fontWeight: 'bold', color: '#0f172a' } as TextStyle,
  bankAcc: { color: '#64748b', fontSize: 12 } as TextStyle,

  saveBtn: { backgroundColor: '#2563eb', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 } as TextStyle,
});