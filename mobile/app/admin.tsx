import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Surface, DataTable } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Admin */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Panel Admin</Text>
        <MaterialCommunityIcons name="cog" size={24} color="#64748b" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ringkasan Platform */}
        <View style={styles.statsGrid}>
          <Surface style={[styles.statBox, { borderLeftColor: '#3b82f6' }]} elevation={1}>
            <Text style={styles.statLabel}>Total User</Text>
            <Text style={styles.statValue}>1,240</Text>
          </Surface>
          <Surface style={[styles.statBox, { borderLeftColor: '#10b981' }]} elevation={1}>
            <Text style={styles.statLabel}>Proyek Aktif</Text>
            <Text style={styles.statValue}>85</Text>
          </Surface>
        </View>

        {/* Tabel Manajemen Proyek Terkini */}
        <Text style={styles.sectionTitle}>Monitor Proyek</Text>
        <Card style={styles.tableCard}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Freelancer</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
              <DataTable.Title numeric>Nilai</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>Nazril</DataTable.Cell>
              <DataTable.Cell><Text style={{color: '#ef4444'}}>Revisi</Text></DataTable.Cell>
              <DataTable.Cell numeric>Rp 5jt</DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell>Andi</DataTable.Cell>
              <DataTable.Cell><Text style={{color: '#3b82f6'}}>Proses</Text></DataTable.Cell>
              <DataTable.Cell numeric>Rp 2jt</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
              <DataTable.Cell>Siti</DataTable.Cell>
              <DataTable.Cell><Text style={{color: '#10b981'}}>Selesai</Text></DataTable.Cell>
              <DataTable.Cell numeric>Rp 8jt</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Card>

        {/* Menu Kontrol Admin */}
        <Text style={styles.sectionTitle}>Kontrol Cepat</Text>
        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name="account-group" size={28} color="#3b82f6" />
            <Text style={styles.menuText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name="shield-check" size={28} color="#10b981" />
            <Text style={styles.menuText}>Verifikasi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name="alert-octagon" size={28} color="#ef4444" />
            <Text style={styles.menuText}>Laporan</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#fff' 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  content: { padding: 16 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    borderLeftWidth: 4 
  },
  statLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, marginTop: 8 },
  tableCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 24 },
  menuGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  menuItem: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  menuText: { marginTop: 8, fontSize: 12, fontWeight: '600', color: '#1e293b' }
});