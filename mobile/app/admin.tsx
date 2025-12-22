import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Switch } from 'react-native';
import { Text, Card, Surface, Button, Badge, Divider, List, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- DATA MOCKUP ---
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
  { month: 'Jan', value: 45, color: '#94a3b8' },
  { month: 'Feb', value: 65, color: '#94a3b8' },
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
  const [isMaintenance, setIsMaintenance] = useState(false); // State baru
  const [searchQuery, setSearchQuery] = useState('');
  const [verifying, setVerifying] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const theme = {
    bg: isDark ? '#0f172a' : '#f8fafc',
    surface: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#1e293b',
    subText: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#f1f5f9',
  };

  const handleVerify = (id: string) => {
    setVerifying(id);
    setTimeout(() => {
      setVerifying(null);
      setModalVisible(false);
      alert("User berhasil diverifikasi!");
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* --- HEADER --- */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Dashboard Admin</Text>
        <TouchableOpacity onPress={() => setIsDark(!isDark)}>
          <MaterialCommunityIcons 
            name={isDark ? "weather-sunny" : "weather-night"} 
            size={24} 
            color={isDark ? "#f59e0b" : "#64748b"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* --- 1. SEARCH BAR --- */}
        <View style={styles.searchSection}>
          <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.subText} />
            <TextInput 
              placeholder="Cari user atau proyek..." 
              placeholderTextColor={theme.subText}
              style={[styles.searchInput, { color: theme.text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={[styles.filterBtn, { backgroundColor: isDark ? '#334155' : '#eff6ff' }]}>
            <MaterialCommunityIcons name="tune-variant" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />

        {/* --- 2. BANNER QUICK INSIGHTS --- */}
        <Surface style={[styles.insightBanner, { backgroundColor: isDark ? '#1e293b' : '#fff', borderColor: isDark ? '#334155' : '#fef3c7' }]} elevation={0}>
          <View style={styles.insightIconBg}><MaterialCommunityIcons name="lightning-bolt" size={20} color="#f59e0b" /></View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.insightTitle, { color: isDark ? '#fbbf24' : '#92400e' }]}>Ringkasan Hari Ini</Text>
            <Text style={[styles.insightDesc, { color: isDark ? '#94a3b8' : '#b45309' }]}>Performa sistem stabil pada 98.4%.</Text>
          </View>
        </Surface>

        <View style={{ height: 20 }} />

        {/* --- FITUR BARU: QUICK SYSTEM ACTIONS --- */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Kontrol Sistem</Text>
        </View>
        <Surface style={[styles.systemControl, { backgroundColor: theme.surface }]} elevation={1}>
          <View style={styles.controlRow}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 14 }}>Mode Perawatan</Text>
              <Text style={{ color: theme.subText, fontSize: 11 }}>Batasi akses user sementara</Text>
            </View>
            <Switch 
              value={isMaintenance} 
              onValueChange={setIsMaintenance}
              trackColor={{ false: '#cbd5e1', true: '#f87171' }}
            />
          </View>
          <Divider style={{ marginVertical: 12, backgroundColor: theme.border }} />
          <TouchableOpacity style={styles.broadcastBtn}>
            <MaterialCommunityIcons name="bullhorn-variant" size={18} color="#fff" />
            <Text style={styles.broadcastText}>Kirim Notifikasi Massal</Text>
          </TouchableOpacity>
        </Surface>

        <View style={{ height: 25 }} />

        {/* --- 3. NOTIFIKASI --- */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifikasi Aktivitas</Text>
        </View>
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          {ADMIN_NOTIFICATIONS.map((item, index) => (
            <React.Fragment key={item.id}>
              <List.Item
                title={item.title}
                titleStyle={{ color: theme.text }}
                description={item.desc}
                descriptionStyle={{ color: theme.subText }}
                left={p => <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} style={styles.listIcon} />}
                right={p => <Text style={styles.notiTime}>{item.time}</Text>}
              />
              {index < ADMIN_NOTIFICATIONS.length - 1 && <Divider style={{ backgroundColor: theme.border }} />}
            </React.Fragment>
          ))}
        </Card>

        <View style={{ height: 25 }} />

        {/* --- 4. ACTION GRID --- */}
        <View style={styles.actionGrid}>
          {['bullhorn-outline', 'account-plus-outline', 'file-pdf-box', 'shield-lock-outline'].map((icon, i) => (
            <TouchableOpacity key={i} style={[styles.actionItem, { backgroundColor: theme.surface }]}>
              <View style={[styles.actionIconCircle, { backgroundColor: isDark ? '#334155' : '#f1f5f9' }]}>
                <MaterialCommunityIcons name={icon as any} size={22} color="#3b82f6" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 25 }} />

        {/* --- 5. VERIFIKASI USER --- */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Verifikasi User</Text>
          <Badge style={styles.countBadge}>{PENDING_USERS.length}</Badge>
        </View>
        {PENDING_USERS.map((user) => (
          <TouchableOpacity key={user.id} onPress={() => { setSelectedUser(user); setModalVisible(true); }}>
            <Card style={[styles.card, { backgroundColor: theme.surface, marginBottom: 8 }]}>
              <Card.Content style={styles.verifyContent}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.userNameText, { color: theme.text }]}>{user.name}</Text>
                  <Text style={[styles.userRoleText, { color: theme.subText }]}>{user.role}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subText} />
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}

        <View style={{ height: 25 }} />

        {/* --- 6. PROYEK PRIORITAS --- */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Proyek Prioritas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
          {FEATURED_PROJECTS.map((project) => (
            <Card key={project.id} style={[styles.projectCard, { backgroundColor: theme.surface }]}>
              <View style={[styles.priorityTag, { backgroundColor: project.color }]}><Text style={styles.priorityText}>{project.priority}</Text></View>
              <Text style={[styles.projectTitle, { color: theme.text }]}>{project.title}</Text>
              <Text style={[styles.projectClient, { color: theme.subText }]}>{project.client}</Text>
              <Divider style={{ marginVertical: 10, backgroundColor: theme.border }} />
              <View style={styles.projectFooter}>
                <Text style={styles.projectBudget}>{project.budget}</Text>
                <MaterialCommunityIcons name="arrow-right-circle" size={20} color="#3b82f6" />
              </View>
            </Card>
          ))}
        </ScrollView>

        <View style={{ height: 25 }} />

        {/* --- 7. DISTRIBUSI STATUS --- */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Distribusi Status</Text>
        <View style={styles.statusGrid}>
          {PROJECT_STATUS_STATS.map((item, index) => (
            <Surface key={index} style={[styles.statusBox, { backgroundColor: theme.surface }]} elevation={1}>
              <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
              <Text style={[styles.statusCount, { color: theme.text }]}>{item.count}</Text>
              <Text style={[styles.statusLabel, { color: theme.subText }]}>{item.label}</Text>
            </Surface>
          ))}
        </View>

        <View style={{ height: 25 }} />

        {/* --- 8. STATS UTAMA --- */}
        <View style={styles.statsGrid}>
          <Surface style={[styles.statBox, { backgroundColor: theme.surface, borderLeftColor: '#3b82f6' }]} elevation={1}>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Total User</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>1,240</Text>
          </Surface>
          <Surface style={[styles.statBox, { backgroundColor: theme.surface, borderLeftColor: '#10b981' }]} elevation={1}>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Revenue</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>Rp 42jt</Text>
          </Surface>
        </View>

        <View style={{ height: 25 }} />

        {/* --- 9. GRAFIK PENDAPATAN --- */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Performa Bulanan</Text>
        <Surface style={[styles.chartContainer, { backgroundColor: theme.surface }]} elevation={1}>
          <View style={styles.barGrid}>
            {REVENUE_DATA.map((data, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={[styles.bar, { height: data.value, backgroundColor: data.color }]} />
                <Text style={[styles.barLabel, { color: theme.subText }]}>{data.month}</Text>
              </View>
            ))}
          </View>
        </Surface>

        <View style={{ height: 25 }} />

        {/* --- 10. RINGKASAN KEUANGAN --- */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Ringkasan Keuangan</Text>
        <View style={{ gap: 10 }}>
          {REVENUE_SUMMARY.map((stat, index) => (
            <Card key={index} style={[styles.revenueCard, { backgroundColor: theme.surface }]}>
              <View style={styles.revenueRow}>
                <View style={[styles.revenueIconBg, { backgroundColor: stat.color + '15' }]}>
                  <MaterialCommunityIcons name={stat.icon as any} size={22} color={stat.color} />
                </View>
                <View>
                  <Text style={[styles.revenueLabel, { color: theme.subText }]}>{stat.label}</Text>
                  <Text style={[styles.revenueValue, { color: theme.text }]}>{stat.value}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={{ height: 25 }} />

        {/* --- 11. FREELANCER ONLINE --- */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Freelancer Online</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
          {ONLINE_FREELANCERS.map((item) => (
            <View key={item.id} style={{ alignItems: 'center', marginRight: 15 }}>
              <View>
                <Avatar.Text size={50} label={item.name.substring(0, 1)} style={{ backgroundColor: item.color }} />
                <View style={[styles.onlineStatusDot, { borderColor: theme.surface }]} />
              </View>
              <Text style={{ color: theme.text, fontSize: 12, marginTop: 5 }}>{item.name}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={{ height: 25 }} />

        {/* --- 12. PEMBAYARAN TERBARU --- */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Pembayaran Terbaru</Text>
        <Card style={[styles.card, { backgroundColor: theme.surface }]}>
          {PAYOUT_LOGS.map((log, index) => (
            <React.Fragment key={log.id}>
              <List.Item
                title={log.name}
                titleStyle={{ color: theme.text, fontWeight: 'bold' }}
                description={`${log.amount} • ${log.time}`}
                descriptionStyle={{ color: theme.subText }}
                left={p => <Avatar.Text size={35} label={log.name.substring(0,1)} style={{ alignSelf: 'center', marginLeft: 10, backgroundColor: log.color }} />}
                right={p => (
                  <View style={styles.logStatusWrapper}>
                    <Text style={[styles.logStatusText, { color: log.color }]}>{log.status}</Text>
                  </View>
                )}
              />
              {index < PAYOUT_LOGS.length - 1 && <Divider style={{ backgroundColor: theme.border }} />}
            </React.Fragment>
          ))}
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* --- MODAL DETAIL USER --- */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            {selectedUser && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>Review Profil</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}><MaterialCommunityIcons name="close" size={24} color={theme.subText} /></TouchableOpacity>
                </View>
                <View style={styles.profileHeader}>
                  <Avatar.Text size={60} label={selectedUser.name.substring(0, 2)} style={{ backgroundColor: '#3b82f6' }} />
                  <Text style={[styles.profileName, { color: theme.text }]}>{selectedUser.name}</Text>
                  <Text style={[styles.profileRole, { color: theme.subText }]}>{selectedUser.role}</Text>
                </View>
                <View style={styles.modalActions}>
                  <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.btnReject} textColor="#ef4444">Tolak</Button>
                  <Button mode="contained" onPress={() => handleVerify(selectedUser.id)} loading={verifying === selectedUser.id} style={styles.btnApprove}>Verifikasi</Button>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 16 },
  
  searchSection: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: 12, height: 45, borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14 },
  filterBtn: { width: 45, height: 45, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  insightBanner: { flexDirection: 'row', padding: 16, borderRadius: 16, alignItems: 'center', gap: 12, borderWidth: 1 },
  insightIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fffbeb', alignItems: 'center', justifyContent: 'center' },
  insightTitle: { fontSize: 14, fontWeight: 'bold' },
  insightDesc: { fontSize: 12, marginTop: 2 },

  // STYLE BARU SYSTEM CONTROL
  systemControl: { padding: 16, borderRadius: 16 },
  controlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  broadcastBtn: { backgroundColor: '#3b82f6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, gap: 8 },
  broadcastText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  card: { borderRadius: 12, elevation: 1 },
  listIcon: { alignSelf: 'center', marginLeft: 10 },
  notiTime: { fontSize: 10, color: '#94a3b8', alignSelf: 'center', marginRight: 10 },

  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  actionItem: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', elevation: 1 },
  actionIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  countBadge: { backgroundColor: '#ef4444' },
  verifyContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userNameText: { fontSize: 15, fontWeight: 'bold' },
  userRoleText: { fontSize: 12 },

  projectCard: { width: 200, padding: 16, borderRadius: 16, marginRight: 12, elevation: 2 },
  priorityTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 8 },
  priorityText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
  projectTitle: { fontSize: 14, fontWeight: 'bold' },
  projectClient: { fontSize: 12, marginTop: 2 },
  projectFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  projectBudget: { fontSize: 13, fontWeight: 'bold', color: '#10b981' },

  statusGrid: { flexDirection: 'row', gap: 10 },
  statusBox: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center' },
  statusCount: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  statusLabel: { fontSize: 10 },

  statsGrid: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, padding: 16, borderRadius: 12, borderLeftWidth: 4 },
  statLabel: { fontSize: 12 },
  statValue: { fontSize: 20, fontWeight: 'bold' },

  chartContainer: { padding: 20, borderRadius: 16, height: 160, justifyContent: 'flex-end' },
  barGrid: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 100 },
  barWrapper: { alignItems: 'center' },
  bar: { width: 30, borderRadius: 6 },
  barLabel: { fontSize: 10, marginTop: 8, fontWeight: 'bold' },

  revenueCard: { padding: 12, borderRadius: 12, elevation: 1 },
  revenueRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  revenueIconBg: { width: 45, height: 45, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  revenueLabel: { fontSize: 11 },
  revenueValue: { fontSize: 18, fontWeight: 'bold' },

  onlineStatusDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#10b981', borderWidth: 2 },
  logStatusWrapper: { alignSelf: 'center', marginRight: 10 },
  logStatusText: { fontSize: 12, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  profileName: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  profileRole: { fontSize: 14 },
  modalActions: { flexDirection: 'row', gap: 12 },
  btnReject: { flex: 1, borderColor: '#ef4444' },
  btnApprove: { flex: 1, backgroundColor: '#10b981' }
});