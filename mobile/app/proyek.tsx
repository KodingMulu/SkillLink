import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProjectListItem from '../components/ui/ProjectListItem';

export default function ProyekPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const projects = [
    { id: '1', title: 'Redesain UI/UX E-Wallet', client: 'FinTech Asia', deadline: '2 Hari lagi', progress: 0.75, status: 'Revisi' as const },
    { id: '2', title: 'Logo Design Startup Tech', client: 'TechStart Inc', deadline: '5 Hari lagi', progress: 0.45, status: 'Progress' as const },
    { id: '3', title: 'Mobile App Laundry', client: 'Clean Click', deadline: 'Selesai', progress: 1, status: 'Selesai' as const },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Proyek Saya</Text>
        <Text style={styles.headerSubtitle}>Kelola semua pekerjaan aktif Anda</Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Cari proyek..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ fontSize: 14 }}
        />
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {projects.map((item) => (
          <ProjectListItem key={item.id} {...item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  headerSubtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  searchContainer: { paddingHorizontal: 20, marginBottom: 16 },
  searchBar: { backgroundColor: '#fff', borderRadius: 10, elevation: 0, borderWidth: 1, borderColor: '#e2e8f0' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 }
});