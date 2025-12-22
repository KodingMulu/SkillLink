import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card, Surface, DataTable, Button, Badge, Divider, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// DATA MOCKUP SEMUA FITUR
const ADMIN_NOTIFICATIONS = [
  { id: '1', title: 'Pendaftaran Baru', desc: 'Siti Aminah mendaftar sebagai Mobile Dev', time: '5m lalu', icon: 'account-plus', color: '#3b82f6' },
  { id: '2', title: 'Laporan Proyek', desc: 'Nazril memperbarui status proyek E-Wallet', time: '20m lalu', icon: 'file-check', color: '#10b981' },
];

const PENDING_USERS = [
  { id: '1', name: 'Budi Santoso', role: 'UI Designer', date: '23 Des' },
  { id: '2', name: 'Rina Amelia', role: 'Web Developer', date: '22 Des' },
];

const REVENUE_DATA = [
  { month: 'Jan', value: 45, color: '#e2e8f0' },
  { month: 'Feb', value: 60, color: '#e2e8f0' },
  { month: 'Mar', value: 85, color: '#3b82f6' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [verifying, setVerifying] = useState<string | null>(null);

  const handleVerify = (id: string) => {
    setVerifying(id);
    setTimeout(() => {
      setVerifying(null);
      alert("User berhasil diverifikasi!");
    }, 1000);
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
        
        {/* --- 1. TAMPILAN BARU: NOTIFIKASI AKTIVITAS --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notifikasi Aktivitas</Text>
          <TouchableOpacity><Text style={styles.clearText}>Tandai Dibaca</Text></TouchableOpacity>
        </View>
        <Card style={styles.notiCard}>
          {ADMIN_NOTIFICATIONS.map((item, index) => (
            <React.Fragment key={item.id}>
              <List.Item
                title={item.title}
                description={item.desc}
                left={props => <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} style={{alignSelf: 'center', marginLeft: 10}} />}
                right={props => <Text style={styles.notiTime}>{item.time}</Text>}
              />
              {index < ADMIN_NOTIFICATIONS.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card>

        <View style={{ height: 20 }} />

        {/* --- 2. FITUR BARU: QUICK ACTION GRID --- */}
        <Text style={styles.sectionTitle}>Aksi Cepat Admin</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionItem} onPress={() => alert("Siaran Terkirim")}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#eff6ff' }]}>
              <MaterialCommunityIcons name="bullhorn-outline" size={22} color="#3b82f6" />
            </View>
            <Text style={styles.actionLabel}>Siaran</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => alert("Tambah User Baru")}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#ecfdf5' }]}>
              <MaterialCommunityIcons name="account-plus-outline" size={22} color="#10b981" />
            </View>
            <Text style={styles.actionLabel}>User Baru</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => alert("Laporan PDF Diunduh")}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#fff7ed' }]}>
              <MaterialCommunityIcons name="file-pdf-box" size={22} color="#f59e0b" />
            </View>
            <Text style={styles.actionLabel}>Laporan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={() => alert("Keamanan Sistem OK")}>
            <View style={[styles.actionIconCircle, { backgroundColor: '#fef2f2' }]}>
              <MaterialCommunityIcons name="shield-lock-outline" size={22} color="#ef4444" />
            </View>
            <Text style={styles.actionLabel}>Keamanan</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />

        {/* --- 3. TAMPILAN LAMA: VERIFIKASI USER --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Verifikasi Pengguna Baru</Text>
          <Badge style={styles.countBadge}>{PENDING_USERS.length}</Badge>
        </View>
        {PENDING_USERS.map((user) => (
          <Card key={user.id} style={styles.verifyCard}>
            <Card.Content style={styles.verifyContent}>
              <View style={styles.userInfo}>
                <Text style={styles.userNameText}>{user.name}</Text>
                <Text style={styles.userRoleText}>{user.role} • {user.date}</Text>
              </View>
              <View style={styles.actionGroup}>
                <Button mode="contained" onPress={() => handleVerify(user.id)} loading={verifying === user.id} style={styles.verifyBtn} labelStyle={{fontSize: 10}}>Setujui</Button>
                <MaterialCommunityIcons name="close-circle-outline" size={24} color="#ef4444" />
              </View>
            </Card.Content>
          </Card>
        ))}

        <View style={{ height: 20 }} />

        {/* --- 4. TAMPILAN LAMA: STATS & GRAFIK --- */}
        <View style={styles.statsGrid}>
          <Surface style={[styles.statBox, { borderLeftColor: '#3b82f6' }]} elevation={1}>
            <Text style={styles.statLabel}>Total User</Text>
            <Text style={styles.statValue}>1,240</Text>
          </Surface>
          <Surface style={[styles.statBox, { borderLeftColor: '#10b981' }]} elevation={1}>
            <Text style={styles.statLabel}>Revenue</Text>
            <Text style={styles.statValue}>Rp 42jt</Text>
          </Surface>
        </View>

        <Text style={styles.sectionTitle}>Statistik Pendapatan</Text>
        <Card style={styles.chartCard}>
          <View style={styles.barChartContainer}>
            {REVENUE_DATA.map((item, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={[styles.barFill, { height: item.value, backgroundColor: item.color }]} />
                <Text style={styles.barLabel}>{item.month}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={{ height: 20 }} />

        {/* --- 5. TAMPILAN LAMA: TABEL MONITOR --- */}
        <Text style={styles.sectionTitle}>Monitor Proyek</Text>
        <Card style={styles.tableCard}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Freelancer</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
              <DataTable.Title numeric>Profit</DataTable.Title>
            </DataTable.Header>
            <DataTable.Row>
              <DataTable.Cell>Nazril</DataTable.Cell>
              <DataTable.Cell><Text style={{color: '#ef4444', fontWeight: 'bold', fontSize: 10}}>REVISI</Text></DataTable.Cell>
              <DataTable.Cell numeric>Rp 500k</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  content: { padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  clearText: { fontSize: 12, color: '#3b82f6', fontWeight: '600' },
  notiCard: { backgroundColor: '#fff', borderRadius: 12, elevation: 1 },
  notiTime: { fontSize: 10, color: '#94a3b8', alignSelf: 'center', marginRight: 10 },
  
  // Quick Action Styles
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  actionItem: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 12, alignItems: 'center', elevation: 1 },
  actionIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  actionLabel: { fontSize: 10, fontWeight: '700', color: '#1e293b' },

  countBadge: { backgroundColor: '#ef4444' },
  verifyCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 10 },
  verifyContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfo: { flex: 1 },
  userNameText: { fontSize: 15, fontWeight: 'bold' },
  userRoleText: { fontSize: 12, color: '#64748b' },
  actionGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  verifyBtn: { backgroundColor: '#10b981' },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, borderLeftWidth: 4 },
  statLabel: { fontSize: 12, color: '#64748b' },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  chartCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  barChartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 100 },
  barWrapper: { alignItems: 'center' },
  barFill: { width: 25, borderRadius: 4 },
  barLabel: { marginTop: 8, fontSize: 10 },
  tableCard: { backgroundColor: '#fff', borderRadius: 12 },
});