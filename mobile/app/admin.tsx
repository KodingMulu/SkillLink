import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { Text, Card, Surface, DataTable, Button, Badge, Divider, List, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// DATA MOCKUP LAMA
const ADMIN_NOTIFICATIONS = [
  { id: '1', title: 'Pendaftaran Baru', desc: 'Siti Aminah mendaftar sebagai Mobile Dev', time: '5m lalu', icon: 'account-plus', color: '#3b82f6' },
  { id: '2', title: 'Laporan Proyek', desc: 'Nazril memperbarui status proyek E-Wallet', time: '20m lalu', icon: 'file-check', color: '#10b981' },
];

const PENDING_USERS = [
  { id: '1', name: 'Budi Santoso', role: 'UI Designer', date: '23 Des', email: 'budi@design.com', skill: 'Figma, Adobe XD', exp: '3 Tahun' },
  { id: '2', name: 'Rina Amelia', role: 'Web Developer', date: '22 Des', email: 'rina@dev.id', skill: 'React, Node.js', exp: '2 Tahun' },
];

// DATA MOCKUP BARU: FEATURED PROJECTS
const FEATURED_PROJECTS = [
  { id: '1', title: 'E-Commerce App', client: 'PT. Maju Jaya', budget: 'Rp 15jt', priority: 'High', color: '#ef4444' },
  { id: '2', title: 'Sistem POS Resto', client: 'Cafe Kopi', budget: 'Rp 8jt', priority: 'Medium', color: '#f59e0b' },
];

const PAYOUT_LOGS = [
  { id: '1', name: 'Nazril', amount: 'Rp 750.000', time: '12m lalu', status: 'Selesai' },
  { id: '2', name: 'Budi', amount: 'Rp 1.200.000', time: '1j lalu', status: 'Proses' },
];

const REVENUE_DATA = [
  { month: 'Jan', value: 45, color: '#e2e8f0' },
  { month: 'Feb', value: 60, color: '#e2e8f0' },
  { month: 'Mar', value: 85, color: '#3b82f6' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [verifying, setVerifying] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openUserDetail = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
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
    <SafeAreaView style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard Admin</Text>
        <MaterialCommunityIcons name="cog-outline" size={24} color="#64748b" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* --- 1. BANNER QUICK INSIGHTS --- */}
        <Surface style={styles.insightBanner} elevation={0}>
          <View style={styles.insightIconBg}><MaterialCommunityIcons name="lightning-bolt" size={20} color="#f59e0b" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.insightTitle}>Ringkasan Hari Ini</Text>
            <Text style={styles.insightDesc}>Tinjau pendaftar dan proyek prioritas hari ini.</Text>
          </View>
        </Surface>

        <View style={{ height: 20 }} />

        {/* --- 2. NOTIFIKASI AKTIVITAS --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notifikasi Aktivitas</Text>
          <TouchableOpacity><Text style={styles.clearText}>Tandai Dibaca</Text></TouchableOpacity>
        </View>
        <Card style={styles.notiCard}>
          {ADMIN_NOTIFICATIONS.map((item, index) => (
            <React.Fragment key={item.id}>
              <List.Item title={item.title} description={item.desc} 
                left={p => <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} style={{alignSelf: 'center', marginLeft: 10}} />}
                right={p => <Text style={styles.notiTime}>{item.time}</Text>}
              />
              {index < ADMIN_NOTIFICATIONS.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card>

        <View style={{ height: 20 }} />

        {/* --- 3. QUICK ACTION GRID --- */}
        <Text style={styles.sectionTitle}>Aksi Cepat Admin</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionItem}><View style={[styles.actionIconCircle, { backgroundColor: '#eff6ff' }]}><MaterialCommunityIcons name="bullhorn-outline" size={22} color="#3b82f6" /></View><Text style={styles.actionLabel}>Siaran</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}><View style={[styles.actionIconCircle, { backgroundColor: '#ecfdf5' }]}><MaterialCommunityIcons name="account-plus-outline" size={22} color="#10b981" /></View><Text style={styles.actionLabel}>User Baru</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}><View style={[styles.actionIconCircle, { backgroundColor: '#fff7ed' }]}><MaterialCommunityIcons name="file-pdf-box" size={22} color="#f59e0b" /></View><Text style={styles.actionLabel}>Laporan</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}><View style={[styles.actionIconCircle, { backgroundColor: '#fef2f2' }]}><MaterialCommunityIcons name="shield-lock-outline" size={22} color="#ef4444" /></View><Text style={styles.actionLabel}>Keamanan</Text></TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />

        {/* --- 4. VERIFIKASI USER --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Verifikasi Pengguna Baru</Text>
          <Badge style={styles.countBadge}>{PENDING_USERS.length}</Badge>
        </View>
        {PENDING_USERS.map((user) => (
          <TouchableOpacity key={user.id} onPress={() => openUserDetail(user)}>
            <Card style={styles.verifyCard}>
              <Card.Content style={styles.verifyContent}>
                <View style={styles.userInfo}>
                  <Text style={styles.userNameText}>{user.name}</Text>
                  <Text style={styles.userRoleText}>{user.role} • {user.date}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#94a3b8" />
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />

        {/* --- 5. FITUR BARU: MANAJEMEN PROJECT TERATAS --- */}
        <Text style={styles.sectionTitle}>Proyek Prioritas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginHorizontal: -4}}>
          {FEATURED_PROJECTS.map((project) => (
            <Card key={project.id} style={styles.projectCard}>
              <View style={[styles.priorityTag, { backgroundColor: project.color }]}>
                <Text style={styles.priorityText}>{project.priority}</Text>
              </View>
              <Text style={styles.projectTitle}>{project.title}</Text>
              <Text style={styles.projectClient}>{project.client}</Text>
              <Divider style={{marginVertical: 10}} />
              <View style={styles.projectFooter}>
                <Text style={styles.projectBudget}>{project.budget}</Text>
                <MaterialCommunityIcons name="arrow-right-circle" size={20} color="#3b82f6" />
              </View>
            </Card>
          ))}
        </ScrollView>

        <View style={{ height: 20 }} />

        {/* --- 6. LOG PENARIKAN DANA --- */}
        <Text style={styles.sectionTitle}>Penarikan Terbaru</Text>
        <Card style={styles.payoutCard}>
          {PAYOUT_LOGS.map((payout, index) => (
            <React.Fragment key={payout.id}><View style={styles.payoutRow}><View style={styles.payoutIconBg}><MaterialCommunityIcons name="bank-transfer-out" size={20} color="#10b981" /></View><View style={{ flex: 1 }}><Text style={styles.payoutText}><Text style={{fontWeight: 'bold'}}>{payout.name}</Text> mencairkan <Text style={{color: '#10b981', fontWeight: 'bold'}}>{payout.amount}</Text></Text><Text style={styles.payoutTime}>{payout.time}</Text></View></View>{index < PAYOUT_LOGS.length - 1 && <Divider />}</React.Fragment>
          ))}
        </Card>

        <View style={{ height: 20 }} />

        {/* --- 7. STATS & GRAFIK --- */}
        <View style={styles.statsGrid}>
          <Surface style={[styles.statBox, { borderLeftColor: '#3b82f6' }]} elevation={1}><Text style={styles.statLabel}>Total User</Text><Text style={styles.statValue}>1,240</Text></Surface>
          <Surface style={[styles.statBox, { borderLeftColor: '#10b981' }]} elevation={1}><Text style={styles.statLabel}>Revenue</Text><Text style={styles.statValue}>Rp 42jt</Text></Surface>
        </View>

        <Text style={styles.sectionTitle}>Statistik Pendapatan</Text>
        <Card style={styles.chartCard}>
          <View style={styles.barChartContainer}>
            {REVENUE_DATA.map((item, index) => (
              <View key={index} style={styles.barWrapper}><View style={[styles.barFill, { height: item.value, backgroundColor: item.color }]} /><Text style={styles.barLabel}>{item.month}</Text></View>
            ))}
          </View>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* --- MODAL DETAIL USER --- */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <View style={styles.modalHeader}><Text style={styles.modalTitle}>Review Profil</Text><TouchableOpacity onPress={() => setModalVisible(false)}><MaterialCommunityIcons name="close" size={24} color="#64748b" /></TouchableOpacity></View>
                <View style={styles.profileHeader}><Avatar.Text size={60} label={selectedUser.name.substring(0, 2)} style={{backgroundColor: '#3b82f6'}} /><Text style={styles.profileName}>{selectedUser.name}</Text><Text style={styles.profileRole}>{selectedUser.role}</Text></View>
                <View style={styles.detailList}><List.Item title="Email" description={selectedUser.email} left={p => <List.Icon {...p} icon="email-outline" />} /><List.Item title="Keahlian" description={selectedUser.skill} left={p => <List.Icon {...p} icon="star-outline" />} /><List.Item title="Pengalaman" description={selectedUser.exp} left={p => <List.Icon {...p} icon="briefcase-outline" />} /></View>
                <View style={styles.modalActions}><Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.btnReject} textColor="#ef4444">Tolak</Button><Button mode="contained" onPress={() => handleVerify(selectedUser.id)} loading={verifying === selectedUser.id} style={styles.btnApprove}>Verifikasi</Button></View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  content: { padding: 16 },

  insightBanner: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 16, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#fef3c7' },
  insightIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fffbeb', alignItems: 'center', justifyContent: 'center' },
  insightTitle: { fontSize: 14, fontWeight: 'bold', color: '#92400e' },
  insightDesc: { fontSize: 12, color: '#b45309', marginTop: 2 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  clearText: { fontSize: 12, color: '#3b82f6', fontWeight: '600' },
  notiCard: { backgroundColor: '#fff', borderRadius: 12, elevation: 1 },
  notiTime: { fontSize: 10, color: '#94a3b8', alignSelf: 'center', marginRight: 10 },
  
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  actionItem: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 12, alignItems: 'center', elevation: 1 },
  actionIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  actionLabel: { fontSize: 10, fontWeight: '700', color: '#1e293b' },

  countBadge: { backgroundColor: '#ef4444' },
  verifyCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 8, elevation: 1 },
  verifyContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfo: { flex: 1 },
  userNameText: { fontSize: 15, fontWeight: 'bold' },
  userRoleText: { fontSize: 12, color: '#64748b' },

  // Project Card Styles Baru
  projectCard: { width: 200, backgroundColor: '#fff', padding: 16, borderRadius: 16, marginRight: 12, marginBottom: 5, elevation: 2 },
  priorityTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 8 },
  priorityText: { fontSize: 10, color: '#fff', fontWeight: 'bold' },
  projectTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  projectClient: { fontSize: 12, color: '#64748b', marginTop: 2 },
  projectFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  projectBudget: { fontSize: 13, fontWeight: 'bold', color: '#10b981' },

  payoutCard: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, elevation: 1 },
  payoutRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  payoutIconBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center' },
  payoutText: { fontSize: 13, color: '#1e293b' },
  payoutTime: { fontSize: 11, color: '#94a3b8', marginTop: 2 },

  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, borderLeftWidth: 4 },
  statLabel: { fontSize: 12, color: '#64748b' },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  chartCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  barChartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 100 },
  barWrapper: { alignItems: 'center' },
  barFill: { width: 25, borderRadius: 4 },
  barLabel: { marginTop: 8, fontSize: 10 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 450 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  profileName: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  profileRole: { fontSize: 14, color: '#64748b' },
  detailList: { marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12 },
  btnReject: { flex: 1, borderColor: '#ef4444' },
  btnApprove: { flex: 1, backgroundColor: '#10b981' }
});