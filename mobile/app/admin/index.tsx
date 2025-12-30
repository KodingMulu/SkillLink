import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Switch, Dimensions } from 'react-native';
import { Text, Card, Surface, Button, Badge, Divider, List, Avatar, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// --- DATA MOCKUP (Tetap sama) ---
const ADMIN_NOTIFICATIONS = [
  { id: '1', title: 'Pendaftaran Baru', desc: 'Siti Aminah mendaftar sebagai Mobile Dev', time: '5m lalu', icon: 'account-plus', color: '#3b82f6' },
  { id: '2', title: 'Laporan Proyek', desc: 'Nazril memperbarui status proyek E-Wallet', time: '20m lalu', icon: 'file-check', color: '#10b981' },
];

const PENDING_USERS = [
  { id: '1', name: 'Budi Santoso', role: 'UI Designer', date: '23 Des', email: 'budi@design.com', skill: 'Figma, Adobe XD', exp: '3 Tahun' },
  { id: '2', name: 'Rina Amelia', role: 'Web Developer', date: '22 Des', email: 'rina@dev.id', skill: 'React, Node.js', exp: '2 Tahun' },
];

const FEATURED_PROJECTS = [
  { id: '1', title: 'E-Commerce App', client: 'PT. Maju Jaya', budget: 'Rp 15jt', priority: 'High', color: '#ef4444' },
  { id: '2', title: 'Sistem POS Resto', client: 'Cafe Kopi', budget: 'Rp 8jt', priority: 'Medium', color: '#f59e0b' },
];

const PROJECT_STATUS_STATS = [
  { label: 'Selesai', count: '124', icon: 'check-circle', color: '#10b981' },
  { label: 'Berjalan', count: '45', icon: 'progress-clock', color: '#3b82f6' },
  { label: 'Batal', count: '12', icon: 'close-circle', color: '#ef4444' },
];

const PAYOUT_LOGS = [
  { id: '1', name: 'Nazril', amount: 'Rp 750.000', time: '12m lalu', status: 'Selesai', color: '#10b981' },
  { id: '2', name: 'Budi', amount: 'Rp 1.200.000', time: '1j lalu', status: 'Proses', color: '#3b82f6' },
  { id: '3', name: 'Siti', amount: 'Rp 2.100.000', time: '3j lalu', status: 'Selesai', color: '#10b981' },
];

const REVENUE_DATA = [
  { month: 'Jan', value: 45, color: '#64748b' },
  { month: 'Feb', value: 65, color: '#64748b' },
  { month: 'Mar', value: 95, color: '#3b82f6' },
];

const ONLINE_FREELANCERS = [
  { id: '1', name: 'Siti', color: '#ec4899' },
  { id: '2', name: 'Nazril', color: '#8b5cf6' },
  { id: '3', name: 'Dewi', color: '#10b981' },
  { id: '4', name: 'Aris', color: '#f59e0b' },
  { id: '5', name: 'Raka', color: '#3b82f6' },
];

const REVENUE_SUMMARY = [
  { label: 'Total Payouts', value: 'Rp 28.5M', icon: 'cash-fast', color: '#10b981' },
  { label: 'Platform Fees', value: 'Rp 4.2M', icon: 'clippy', color: '#3b82f6' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifying, setVerifying] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const today = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const theme = {
    bg: isDark ? '#0f172a' : '#f8fafc',
    surface: isDark ? '#1e293b' : '#ffffff',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#1e293b',
    subText: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#e2e8f0',
    accent: '#3b82f6'
  };

  const handleVerify = (id: string) => {
    setVerifying(id);
    setTimeout(() => {
      setVerifying(null);
      setModalVisible(false);
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* --- MODERN HEADER --- */}
      <Surface style={[styles.header, { backgroundColor: theme.surface }]} elevation={1}>
        <IconButton icon="chevron-left" size={24} iconColor={theme.text} onPress={() => router.back()} />
        <Text variant="titleMedium" style={[styles.headerTitle, { color: theme.text }]}>Management Console</Text>
        <IconButton 
          icon={isDark ? "weather-sunny" : "weather-night"} 
          iconColor={isDark ? "#f59e0b" : "#64748b"} 
          onPress={() => setIsDark(!isDark)} 
        />
      </Surface>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* --- WELCOME SECTION --- */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, { color: theme.text }]}>Halo, Admin 👋</Text>
          <Text style={[styles.dateText, { color: theme.subText }]}>{today}</Text>
        </View>

        {/* --- SEARCH & FILTER --- */}
        <View style={styles.searchSection}>
          <Surface style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]} elevation={0}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.subText} />
            <TextInput 
              placeholder="Cari user, proyek, atau invoice..." 
              placeholderTextColor={theme.subText}
              style={[styles.searchInput, { color: theme.text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Surface>
          <TouchableOpacity style={[styles.filterBtn, { backgroundColor: theme.accent }]}>
            <MaterialCommunityIcons name="tune-variant" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* --- QUICK INSIGHT BANNER --- */}
        <Surface style={[styles.insightBanner, { backgroundColor: isDark ? '#1e293b' : '#fffbeb', borderColor: isDark ? '#334155' : '#fef3c7' }]} elevation={0}>
          <View style={[styles.insightIconBg, { backgroundColor: isDark ? '#334155' : '#fff' }]}>
            <MaterialCommunityIcons name="shield-check-outline" size={20} color="#f59e0b" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.insightTitle, { color: isDark ? '#fbbf24' : '#92400e' }]}>Status Infrastruktur</Text>
            <Text style={[styles.insightDesc, { color: theme.subText }]}>Semua sistem berjalan normal (98.4%).</Text>
          </View>
        </Surface>

        {/* --- SYSTEM CONTROLS --- */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Core Controls</Text>
        <Surface style={[styles.systemControl, { backgroundColor: theme.surface }]} elevation={1}>
          <View style={styles.controlRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.boldLabel, { color: theme.text }]}>Maintenance Mode</Text>
              <Text style={{ color: theme.subText, fontSize: 11 }}>Kunci akses publik untuk pemeliharaan</Text>
            </View>
            <Switch 
              value={isMaintenance} 
              onValueChange={setIsMaintenance}
              thumbColor={isMaintenance ? '#fff' : '#f4f3f4'}
              trackColor={{ false: '#cbd5e1', true: '#ef4444' }}
            />
          </View>
          <Divider style={styles.divider} />
          <Button 
            mode="contained" 
            icon="bullhorn-variant" 
            style={styles.broadcastBtn}
            labelStyle={styles.broadcastLabel}
            onPress={() => {}}
          >
            Broadcast Announcement
          </Button>
        </Surface>

        {/* --- ACTIVITY NOTIFICATIONS --- */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Aktivitas Terbaru</Text>
          <TouchableOpacity><Text style={{ color: theme.accent, fontSize: 12 }}>Lihat Semua</Text></TouchableOpacity>
        </View>
        <Card style={[styles.card, { backgroundColor: theme.card }]}>
          {ADMIN_NOTIFICATIONS.map((item, index) => (
            <View key={item.id}>
              <List.Item
                title={item.title}
                titleStyle={{ color: theme.text, fontWeight: '600', fontSize: 14 }}
                description={item.desc}
                descriptionStyle={{ color: theme.subText, fontSize: 12 }}
                left={() => (
                  <View style={[styles.notiIconWrapper, { backgroundColor: item.color + '15' }]}>
                    <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
                  </View>
                )}
                right={() => <Text style={styles.notiTime}>{item.time}</Text>}
              />
              {index < ADMIN_NOTIFICATIONS.length - 1 && <Divider style={{ backgroundColor: theme.border, marginHorizontal: 15 }} />}
            </View>
          ))}
        </Card>

        {/* --- USER VERIFICATION --- */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Pending Verifications</Text>
          <Badge style={styles.countBadge}>{PENDING_USERS.length}</Badge>
        </View>
        <View style={styles.verifyGrid}>
          {PENDING_USERS.map((user) => (
            <TouchableOpacity key={user.id} onPress={() => { setSelectedUser(user); setModalVisible(true); }}>
              <Surface style={[styles.verifyCard, { backgroundColor: theme.surface }]} elevation={1}>
                <Avatar.Text size={40} label={user.name.substring(0, 1)} style={{ backgroundColor: theme.accent }} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.userNameText, { color: theme.text }]} numberOfLines={1}>{user.name}</Text>
                  <Text style={[styles.userRoleText, { color: theme.subText }]}>{user.role}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subText} />
              </Surface>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- PRIORITY PROJECTS --- */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>High Priority Projects</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
          {FEATURED_PROJECTS.map((project) => (
            <Surface key={project.id} style={[styles.projectCard, { backgroundColor: theme.surface }]} elevation={2}>
              <View style={[styles.priorityTag, { backgroundColor: project.color + '20' }]}>
                <View style={[styles.dot, { backgroundColor: project.color }]} />
                <Text style={[styles.priorityText, { color: project.color }]}>{project.priority}</Text>
              </View>
              <Text style={[styles.projectTitle, { color: theme.text }]} numberOfLines={1}>{project.title}</Text>
              <Text style={[styles.projectClient, { color: theme.subText }]}>{project.client}</Text>
              <View style={styles.projectFooter}>
                <Text style={styles.projectBudget}>{project.budget}</Text>
                <IconButton icon="arrow-right" size={16} containerColor={theme.accent + '15'} iconColor={theme.accent} />
              </View>
            </Surface>
          ))}
        </ScrollView>

        {/* --- PERFORMANCE CHART --- */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Financial Performance</Text>
        <Surface style={[styles.chartContainer, { backgroundColor: theme.surface }]} elevation={1}>
          <View style={styles.barGrid}>
            {REVENUE_DATA.map((data, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={[styles.bar, { height: data.value, backgroundColor: data.color }]} />
                <Text style={[styles.barLabel, { color: theme.subText }]}>{data.month}</Text>
              </View>
            ))}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: theme.accent }]} />
              <Text style={{ fontSize: 10, color: theme.subText }}>Revenue Target Reached</Text>
            </View>
          </View>
        </Surface>

        {/* --- FINANCIAL SUMMARY --- */}
        <View style={styles.revenueGrid}>
          {REVENUE_SUMMARY.map((stat, index) => (
            <Surface key={index} style={[styles.revenueBox, { backgroundColor: theme.surface }]} elevation={1}>
               <View style={[styles.revIconCircle, { backgroundColor: stat.color + '15' }]}>
                  <MaterialCommunityIcons name={stat.icon as any} size={20} color={stat.color} />
               </View>
               <Text style={[styles.revenueLabel, { color: theme.subText }]}>{stat.label}</Text>
               <Text style={[styles.revenueValue, { color: theme.text }]}>{stat.value}</Text>
            </Surface>
          ))}
        </View>

        {/* --- ONLINE TALENTS --- */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Active Talents</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 5 }}>
          {ONLINE_FREELANCERS.map((item) => (
            <View key={item.id} style={styles.avatarContainer}>
              <View>
                <Avatar.Text size={52} label={item.name.substring(0, 1)} style={{ backgroundColor: item.color }} labelStyle={{ fontWeight: '700' }} />
                <View style={[styles.onlineStatusDot, { borderColor: theme.surface }]} />
              </View>
              <Text style={[styles.avatarName, { color: theme.text }]}>{item.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* --- RECENT PAYOUTS --- */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Payouts</Text>
        <Card style={[styles.card, { backgroundColor: theme.card }]}>
          {PAYOUT_LOGS.map((log, index) => (
            <View key={log.id}>
              <List.Item
                title={log.name}
                titleStyle={{ color: theme.text, fontWeight: '700', fontSize: 14 }}
                description={`${log.amount} • ${log.time}`}
                descriptionStyle={{ color: theme.subText, fontSize: 12 }}
                left={() => <Avatar.Text size={36} label={log.name.substring(0,1)} style={{ alignSelf: 'center', marginLeft: 10, backgroundColor: log.color }} />}
                right={() => (
                  <View style={[styles.statusBadge, { backgroundColor: log.color + '15' }]}>
                    <Text style={[styles.statusBadgeText, { color: log.color }]}>{log.status}</Text>
                  </View>
                )}
              />
              {index < PAYOUT_LOGS.length - 1 && <Divider style={{ backgroundColor: theme.border, marginHorizontal: 15 }} />}
            </View>
          ))}
        </Card>

      </ScrollView>

      {/* --- REFINED MODAL --- */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <Surface style={[styles.modalContent, { backgroundColor: theme.surface }]} elevation={5}>
            {selectedUser && (
              <>
                <View style={styles.modalIndicator} />
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>Verify Professional</Text>
                  <IconButton icon="close" size={20} onPress={() => setModalVisible(false)} />
                </View>
                <View style={styles.profileHeader}>
                  <Avatar.Text size={80} label={selectedUser.name.substring(0, 2)} style={{ backgroundColor: theme.accent }} />
                  <Text style={[styles.profileName, { color: theme.text }]}>{selectedUser.name}</Text>
                  <Text style={[styles.profileRole, { color: theme.subText }]}>{selectedUser.role}</Text>
                  
                  <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Experience</Text>
                      <Text style={[styles.infoVal, { color: theme.text }]}>{selectedUser.exp}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Skills</Text>
                      <Text style={[styles.infoVal, { color: theme.text }]}>{selectedUser.skill}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.modalActions}>
                  <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.btnReject} textColor="#ef4444">Decline</Button>
                  <Button mode="contained" onPress={() => handleVerify(selectedUser.id)} loading={verifying === selectedUser.id} style={styles.btnApprove}>Verify Account</Button>
                </View>
              </>
            )}
          </Surface>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 0,
  },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5 },
  content: { padding: 20 },
  welcomeSection: { marginBottom: 20 },
  welcomeText: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  dateText: { fontSize: 13, fontWeight: '500' },
  
  searchSection: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderRadius: 15, height: 50, borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, fontWeight: '500' },
  filterBtn: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center', elevation: 2 },

  insightBanner: { flexDirection: 'row', padding: 16, borderRadius: 20, alignItems: 'center', gap: 15, borderWidth: 1, marginBottom: 10 },
  insightIconBg: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', elevation: 1 },
  insightTitle: { fontSize: 15, fontWeight: '800' },
  insightDesc: { fontSize: 12, marginTop: 2, fontWeight: '500' },

  systemControl: { padding: 20, borderRadius: 24, marginBottom: 10 },
  controlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  boldLabel: { fontWeight: '800', fontSize: 15 },
  divider: { marginVertical: 15, opacity: 0.5 },
  broadcastBtn: { borderRadius: 12, backgroundColor: '#3b82f6', paddingVertical: 4 },
  broadcastLabel: { fontWeight: '700', fontSize: 13, letterSpacing: 0 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5, marginTop: 25, marginBottom: 15 },
  card: { borderRadius: 20, overflow: 'hidden', elevation: 2 },
  notiIconWrapper: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  notiTime: { fontSize: 10, color: '#94a3b8', fontWeight: '700', marginRight: 10 },

  verifyGrid: { gap: 10 },
  verifyCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 18, paddingRight: 15 },
  userNameText: { fontSize: 15, fontWeight: '800' },
  userRoleText: { fontSize: 11, fontWeight: '600' },
  countBadge: { backgroundColor: '#ef4444', fontWeight: 'bold' },

  projectCard: { width: width * 0.6, padding: 20, borderRadius: 24, marginRight: 15, marginBottom: 10 },
  priorityTag: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  priorityText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  projectTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  projectClient: { fontSize: 12, fontWeight: '600', marginBottom: 15 },
  projectFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  projectBudget: { fontSize: 15, fontWeight: '900', color: '#10b981' },

  chartContainer: { padding: 25, borderRadius: 24, marginBottom: 10 },
  barGrid: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 100 },
  barWrapper: { alignItems: 'center' },
  bar: { width: 34, borderRadius: 8 },
  barLabel: { fontSize: 11, marginTop: 10, fontWeight: '800' },
  chartLegend: { marginTop: 15, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },

  revenueGrid: { flexDirection: 'row', gap: 12 },
  revenueBox: { flex: 1, padding: 16, borderRadius: 20, alignItems: 'flex-start' },
  revIconCircle: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  revenueLabel: { fontSize: 11, fontWeight: '700' },
  revenueValue: { fontSize: 18, fontWeight: '900', marginTop: 2 },

  avatarContainer: { alignItems: 'center', marginRight: 20 },
  avatarName: { fontSize: 11, fontWeight: '700', marginTop: 8 },
  onlineStatusDot: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#10b981', borderWidth: 3 },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 10 },
  statusBadgeText: { fontSize: 11, fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  modalIndicator: { width: 40, height: 5, backgroundColor: '#e2e8f0', borderRadius: 10, alignSelf: 'center', marginBottom: 15 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900' },
  profileHeader: { alignItems: 'center' },
  profileName: { fontSize: 24, fontWeight: '900', marginTop: 12 },
  profileRole: { fontSize: 14, fontWeight: '600', marginBottom: 20 },
  infoGrid: { width: '100%', backgroundColor: '#f8fafc20', padding: 20, borderRadius: 20, marginVertical: 20 },
  infoItem: { marginBottom: 12 },
  infoLabel: { fontSize: 10, textTransform: 'uppercase', color: '#94a3b8', fontWeight: '800', marginBottom: 4 },
  infoVal: { fontSize: 14, fontWeight: '700' },
  modalActions: { flexDirection: 'row', gap: 15 },
  btnReject: { flex: 1, borderRadius: 14, borderWidth: 1.5 },
  btnApprove: { flex: 1, borderRadius: 14, backgroundColor: '#10b981' }
});