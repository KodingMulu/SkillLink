import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, RefreshControl, ScrollView, Image
} from 'react-native';
import {
  Plus, Search, Filter, Download, Briefcase,
  CheckCircle, Clock, Banknote, Calendar, User, Building
} from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateProjectModal from './components/CreateProjectModal';

interface Project {
  id: number;
  title: string;
  client: string;
  freelancer: string;
  budget: string;
  deadline: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  progress: number;
}

interface Stat {
  label: string;
  value: string;
  type: string;
  color: string;
  bg: string;
}

const PROJECTS_DATA: Project[] = [
  { id: 1, title: "Redesain Aplikasi Mobile", client: "PT Tech Solution", freelancer: "Nazril Afandi", budget: "Rp 15.000.000", deadline: "20/1/2024", status: "active", progress: 65 },
  { id: 2, title: "Pengembangan API E-commerce", client: "Budi Santoso", freelancer: "Siska Putri", budget: "Rp 8.500.000", deadline: "15/12/2023", status: "completed", progress: 100 },
  { id: 3, title: "Sistem Manajemen Inventori", client: "Global Mandiri", freelancer: "Ahmad Rivai", budget: "Rp 12.000.000", deadline: "10/2/2024", status: "pending", progress: 20 }
];

export default function ProjectManagementScreen() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');
      
      // Simulasi fetch stats, ganti dengan endpoint asli
      // const res = await axios.get(`${apiUrl}/user/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
      
      // Mock stats
      setStats([
        { label: "Total Proyek", value: "125", type: "total", color: "#2563EB", bg: "#EFF6FF" },
        { label: "Selesai", value: "84", type: "completed", color: "#059669", bg: "#ECFDF5" },
        { label: "Berjalan", value: "32", type: "in_progress", color: "#EA580C", bg: "#FFF7ED" },
        { label: "Nilai Proyek", value: "1.2M", type: "value", color: "#7E22CE", bg: "#FAF5FF" },
      ]);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const getStatusStyle = (status: Project['status']) => {
    switch (status) {
      case 'active': return { bg: '#DBEAFE', text: '#1D4ED8' };
      case 'completed': return { bg: '#D1FAE5', text: '#047857' };
      case 'pending': return { bg: '#FFEDD5', text: '#C2410C' };
      case 'cancelled': return { bg: '#FEE2E2', text: '#B91C1C' };
      default: return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  const getIcon = (type: string, color: string) => {
    const props = { size: 24, color };
    switch (type) {
      case 'total': return <Briefcase {...props} />;
      case 'completed': return <CheckCircle {...props} />;
      case 'in_progress': return <Clock {...props} />;
      case 'value': return <Banknote {...props} />;
      default: return <Briefcase {...props} />;
    }
  };

  const filteredProjects = PROJECTS_DATA.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderStatCard = (item: Stat) => (
    <View key={item.label} style={styles.statCard}>
      <View style={styles.statHeader}>
        <View style={[styles.statIconContainer, { backgroundColor: item.bg }]}>
          {getIcon(item.type, item.color)}
        </View>
      </View>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statLabel}>{item.label}</Text>
    </View>
  );

  const renderProjectCard = ({ item }: { item: Project }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Building size={14} color="#64748B" />
              <Text style={styles.metaText}>{item.client}</Text>
            </View>
            <View style={styles.metaItem}>
              <User size={14} color="#64748B" />
              <Text style={styles.metaText}>{item.freelancer}</Text>
            </View>
          </View>

          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Anggaran:</Text>
            <Text style={styles.budgetValue}>{item.budget}</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPercent}>{item.progress}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
            </View>
          </View>

          <View style={styles.dateRow}>
            <Clock size={14} color="#94A3B8" />
            <Text style={styles.dateText}>Deadline: {item.deadline}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Detail Proyek</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Proyek</Text>
          <Text style={styles.subtitle}>Kelola semua proyek</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Download size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setIsCreateModalOpen(true)}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          {loading ? <ActivityIndicator size="small" color="#2563EB" /> : stats.map(renderStatCard)}
        </ScrollView>

        <View style={styles.filterSection}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari proyek..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {['all', 'active', 'completed', 'pending', 'cancelled'].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setFilterStatus(status)}
                style={[
                  styles.filterPill,
                  filterStatus === status && styles.filterPillActive
                ]}
              >
                <Text style={[
                  styles.filterText,
                  filterStatus === status && styles.filterTextActive
                ]}>
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.listContainer}>
          {filteredProjects.map(item => (
            <View key={item.id}>
              {renderProjectCard({ item })}
            </View>
          ))}
          {filteredProjects.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Tidak ada proyek ditemukan.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <CreateProjectModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          console.log("Refresh list");
          fetchData();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statsScroll: {
    padding: 20,
    paddingBottom: 10,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statHeader: {
    marginBottom: 12,
  },
  statIconContainer: {
    padding: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  filterSection: {
    padding: 20,
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: 'white',
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  filterTextActive: {
    color: 'white',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardBody: {
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  budgetLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  budgetValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  progressContainer: {
    gap: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  cardFooter: {
    marginTop: 16,
  },
  detailButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#64748B',
  }
});