import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Text, Card, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Data yang sama dengan Dashboard agar sinkron
const ALL_PROJECTS = [
  { id: '1', title: 'Redesain UI/UX E-Wallet', client: 'FinTech Asia', progress: 0.75, status: 'Revisi', time: '2 Hari lagi', color: '#ef4444' },
  { id: '2', title: 'Mobile App SkillLink', client: 'Internal', progress: 0.45, status: 'Proses', time: '5 Hari lagi', color: '#3b82f6' },
  { id: '3', title: 'Dashboard Admin CMS', client: 'TechStart Inc', progress: 0.90, status: 'Proses', time: '1 Hari lagi', color: '#3b82f6' },
  { id: '4', title: 'Landing Page Kopi', client: 'Nusantara Brew', progress: 1.0, status: 'Selesai', time: 'Selesai', color: '#10b981' },
  { id: '5', title: 'API Integration', client: 'Data Logistic', progress: 0.20, status: 'Baru', time: '10 Hari lagi', color: '#f59e0b' },
];

export default function ProyekPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const renderItem = ({ item }: { item: typeof ALL_PROJECTS[0] }) => (
    <Card style={styles.projectCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.projectTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.color + '20' }]}>
            <Text style={[styles.statusText, { color: item.color }]}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.projectClient}>{item.client} • {item.time}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${item.progress * 100}%`, backgroundColor: item.color }]} />
          </View>
          <Text style={styles.progressText}>{item.progress * 100}%</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.btnAction} onPress={() => router.push('/messages')}>
            <MaterialCommunityIcons name="chat-outline" size={18} color="#64748b" />
            <Text style={styles.btnText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnAction}>
            <MaterialCommunityIcons name="file-document-outline" size={18} color="#64748b" />
            <Text style={styles.btnText}>Detail</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Halaman */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Proyek Saya</Text>
          <Text style={styles.headerSubtitle}>Kelola semua pekerjaan aktif Anda</Text>
        </View>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <Surface style={styles.searchBar} elevation={1}>
          <MaterialCommunityIcons name="magnify" size={20} color="#94a3b8" />
          <TextInput
            placeholder="Cari proyek..."
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Surface>
      </View>

      <FlatList
        data={ALL_PROJECTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  headerSubtitle: { fontSize: 12, color: '#64748b' },
  searchSection: { padding: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: 45,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: { flex: 1, marginLeft: 8, fontSize: 14 },
  listContent: { padding: 16, paddingBottom: 30 },
  projectCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  projectTitle: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  projectClient: { color: '#64748b', marginVertical: 8 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  progressBar: { flex: 1, height: 8, backgroundColor: '#e2e8f0', borderRadius: 4 },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 12, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12, gap: 16 },
  btnAction: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnText: { fontSize: 14, color: '#64748b', fontWeight: '500' },
});