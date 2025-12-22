import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card, Surface, DataTable, Button, Badge, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Data Mockup
const PENDING_USERS = [
  { id: '1', name: 'Budi Santoso', role: 'UI Designer', date: '23 Des' },
  { id: '2', name: 'Rina Amelia', role: 'Web Developer', date: '22 Des' },
];

const REVENUE_DATA = [
  { month: 'Jan', value: 45, color: '#e2e8f0' },
  { month: 'Feb', value: 60, color: '#e2e8f0' },
  { month: 'Mar', value: 85, color: '#3b82f6' },
  { month: 'Apr', value: 40, color: '#e2e8f0' },
  { month: 'Mei', value: 55, color: '#e2e8f0' },
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
        <TouchableOpacity>
          <MaterialCommunityIcons name="filter-variant" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* --- 1. SEKSI VERIFIKASI USER (TAMBAHAN BARU) --- */}
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
                <Button 
                  mode="contained" 
                  onPress={() => handleVerify(user.id)}
                  loading={verifying === user.id}
                  style={styles.verifyBtn}
                  labelStyle={styles.verifyBtnLabel}
                >
                  Setujui
                </Button>
                <TouchableOpacity style={styles.rejectBtn}>
                  <MaterialCommunityIcons name="close-circle-outline" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        ))}

        <Divider style={styles.sectionDivider} />

        {/* --- 2. STATS SUMMARY (TAMPILAN SEBELUMNYA) --- */}
        <View style={styles.statsGrid}>
          <Surface style={[styles.statBox, { borderLeftColor: '#3b82f6' }]} elevation={1}>
            <Text style={styles.statLabel}>Total User</Text>
            <Text style={styles.statValue}>1,240</Text>
            <Text style={styles.statSubText}>+12% bulan ini</Text>
          </Surface>
          <Surface style={[styles.statBox, { borderLeftColor: '#10b981' }]} elevation={1}>
            <Text style={styles.statLabel}>Revenue</Text>
            <Text style={styles.statValue}>Rp 42jt</Text>
            <Text style={[styles.statSubText, { color: '#10b981' }]}>Stabil</Text>
          </Surface>
        </View>

        {/* --- 3. GRAFIK PENDAPATAN (TAMPILAN SEBELUMNYA) --- */}
        <Text style={styles.sectionTitle}>Statistik Pendapatan</Text>
        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <Text style={styles.chartSubtitle}>Target: Rp 50jt/bulan</Text>
              <Text style={styles.chartValue}>85% Tercapai</Text>
            </View>
            <View style={styles.barChartContainer}>
              {REVENUE_DATA.map((item, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View style={[styles.barFill, { height: item.value * 1.2, backgroundColor: item.color }]} />
                  <Text style={styles.barLabel}>{item.month}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* --- 4. TABEL TRANSAKSI (TAMPILAN SEBELUMNYA) --- */}
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
              <DataTable.Cell><Text style={{color: '#ef4444', fontSize: 11, fontWeight: 'bold'}}>REVISI</Text></DataTable.Cell>
              <DataTable.Cell numeric>Rp 500k</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Andi</DataTable.Cell>
              <DataTable.Cell><Text style={{color: '#3b82f6', fontSize: 11, fontWeight: 'bold'}}>PROSES</Text></DataTable.Cell>
              <DataTable.Cell numeric>Rp 200k</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
          <TouchableOpacity style={styles.viewMoreBtn}>
            <Text style={styles.viewMoreText}>Lihat Laporan Lengkap</Text>
          </TouchableOpacity>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  content: { padding: 16 },
  
  // Section Verifikasi
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
  countBadge: { backgroundColor: '#ef4444', fontWeight: 'bold', marginBottom: 8 },
  verifyCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 10, elevation: 1 },
  verifyContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfo: { flex: 1 },
  userNameText: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
  userRoleText: { fontSize: 12, color: '#64748b', marginTop: 2 },
  actionGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  verifyBtn: { backgroundColor: '#10b981', borderRadius: 8 },
  verifyBtnLabel: { fontSize: 11, fontWeight: 'bold' },
  rejectBtn: { padding: 4 },
  sectionDivider: { marginVertical: 20, backgroundColor: '#e2e8f0' },

  // Styles Sebelumnya
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, borderLeftWidth: 4 },
  statLabel: { fontSize: 12, color: '#64748b' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginVertical: 4 },
  statSubText: { fontSize: 10, color: '#3b82f6', fontWeight: '600' },
  chartCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 20 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  chartSubtitle: { fontSize: 12, color: '#64748b' },
  chartValue: { fontSize: 12, fontWeight: 'bold', color: '#10b981' },
  barChartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 120 },
  barWrapper: { alignItems: 'center' },
  barFill: { width: 25, borderRadius: 4 },
  barLabel: { marginTop: 8, fontSize: 10, color: '#64748b' },
  tableCard: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  viewMoreBtn: { padding: 12, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  viewMoreText: { color: '#3b82f6', fontWeight: 'bold', fontSize: 12 }
});