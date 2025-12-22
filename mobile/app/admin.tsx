import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card, Surface, DataTable, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Data Pendapatan Bulanan (Mockup)
const REVENUE_DATA = [
  { month: 'Jan', value: 45, color: '#e2e8f0' },
  { month: 'Feb', value: 60, color: '#e2e8f0' },
  { month: 'Mar', value: 85, color: '#3b82f6' }, // Bulan berjalan
  { month: 'Apr', value: 40, color: '#e2e8f0' },
  { month: 'Mei', value: 55, color: '#e2e8f0' },
];

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
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
        {/* --- STATS SUMMARY --- */}
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

        {/* --- GRAFIK PENDAPATAN CUSTOM --- */}
        <Text style={styles.sectionTitle}>Statistik Pendapatan Platform</Text>
        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <Text style={styles.chartSubtitle}>Target: Rp 50jt/bulan</Text>
              <Text style={styles.chartValue}>85% Tercapai</Text>
            </View>
            
            <View style={styles.barChartContainer}>
              {REVENUE_DATA.map((item, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View style={[styles.barFill, { height: item.value * 1.5, backgroundColor: item.color }]} />
                  <Text style={styles.barLabel}>{item.month}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* --- DAFTAR TRANSAKSI TERAKHIR --- */}
        <Text style={styles.sectionTitle}>Monitor Proyek & Transaksi</Text>
        <Card style={styles.tableCard}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Freelancer</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
              <DataTable.Title numeric>Profit</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>Nazril</DataTable.Cell>
              <DataTable.Cell><Text style={{color: '#ef4444', fontSize: 12, fontWeight: 'bold'}}>REVISI</Text></DataTable.Cell>
              <DataTable.Cell numeric>Rp 500k</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Andi</DataTable.Cell>
              <DataTable.Cell><Text style={{color: '#3b82f6', fontSize: 12, fontWeight: 'bold'}}>PROSES</Text></DataTable.Cell>
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
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, marginTop: 10, color: '#1e293b' },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, borderLeftWidth: 4 },
  statLabel: { fontSize: 12, color: '#64748b' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginVertical: 4 },
  statSubText: { fontSize: 10, color: '#3b82f6', fontWeight: '600' },
  
  // Chart Styles
  chartCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 20, paddingVertical: 10 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  chartSubtitle: { fontSize: 12, color: '#64748b' },
  chartValue: { fontSize: 12, fontWeight: 'bold', color: '#10b981' },
  barChartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 160 },
  barWrapper: { alignItems: 'center' },
  barFill: { width: 30, borderRadius: 6 },
  barLabel: { marginTop: 8, fontSize: 11, color: '#64748b', fontWeight: '600' },
  
  tableCard: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  viewMoreBtn: { padding: 15, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  viewMoreText: { color: '#3b82f6', fontWeight: 'bold', fontSize: 13 }
});