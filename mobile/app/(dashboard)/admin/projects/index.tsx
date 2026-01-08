import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, RefreshControl, ScrollView,
  Dimensions
} from 'react-native';
import {
  Plus, Search, Filter, Download, Briefcase,
  CheckCircle, Clock, Banknote, ChevronLeft, ChevronRight,
  Building, User
} from 'lucide-react-native';
import axios from 'axios';
import CreateProjectModal from './components/CreateProjectModal';

interface Project {
  id: string;
  title: string;
  client: string;
  freelancer: string;
  budget: number;
  deadline: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  progress: number;
}

interface Stat {
  label: string;
  value: string;
  icon: any;
  color: string;
  bg: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ProjectManagementScreen() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState<Stat[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, limit: 10, total: 0, totalPages: 1
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return { bg: '#DBEAFE', text: '#1D4ED8' };
      case 'completed': return { bg: '#D1FAE5', text: '#047857' };
      case 'pending': return { bg: '#FFEDD5', text: '#C2410C' };
      case 'cancelled': return { bg: '#FEE2E2', text: '#DC2626' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
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

  const getColorStyles = (colorName: string) => {
    switch (colorName) {
      case 'blue': return { color: "#2563EB", bg: "#EFF6FF" };
      case 'emerald': return { color: "#059669", bg: "#ECFDF5" };
      case 'orange': return { color: "#EA580C", bg: "#FFF7ED" };
      case 'purple': return { color: "#7E22CE", bg: "#FAF5FF" };
      default: return { color: "#64748B", bg: "#F8FAFC" };
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/admin/stats`, {
        withCredentials: true
      });
      
      const mappedStats = (res.data.projectStats || []).map((item: any) => {
        const styles = getColorStyles(item.color);
        let displayValue = item.value.toString();
        
        if (item.type === 'value') {
          displayValue = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            notation: "compact",
            maximumFractionDigits: 1
          }).format(item.value);
        }

        return {
          label: item.label,
          value: displayValue,
          icon: item.type,
          color: styles.color,
          bg: styles.bg
        };
      });
      setStats(mappedStats);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/admin/projects`, {
        params: {
          page: pagination.page,
          limit: 10,
          search: searchQuery,
          status: filterStatus
        },
        withCredentials: true
      });
      setProjects(res.data.data || []);
      if (res.data.pagination) {
        setPagination(prev => ({ ...prev, ...res.data.pagination }));
      }
    } catch (error) {
      console.error(error);
      setProjects([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, filterStatus, pagination.page]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
    fetchProjects();
  }, []);

  const renderStatCard = (item: Stat, index: number) => (
    <View key={index} style={s.statCard}>
      <View style={s.statHeader}>
        <View style={[s.statIcon, { backgroundColor: item.bg }]}>
          {getIcon(item.icon, item.color)}
        </View>
      </View>
      <Text style={s.statValue}>{item.value}</Text>
      <Text style={s.statLabel}>{item.label}</Text>
    </View>
  );

  const renderProjectCard = (item: Project) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <View key={item.id} style={s.card}>
        <View style={s.cardHeader}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={s.cardTitle} numberOfLines={1}>{item.title}</Text>
            <View style={s.dateRow}>
              <Clock size={12} color="#94A3B8" />
              <Text style={s.dateText}>Deadline: {new Date(item.deadline).toLocaleDateString('id-ID')}</Text>
            </View>
          </View>
          <View style={[s.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[s.statusText, { color: statusStyle.text }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={s.cardBody}>
          <View style={s.metaContainer}>
            <View style={s.metaItem}>
              <Building size={14} color="#64748B" />
              <Text style={s.metaText} numberOfLines={1}>{item.client}</Text>
            </View>
            <View style={s.metaItem}>
              <User size={14} color="#64748B" />
              <Text style={s.metaText} numberOfLines={1}>{item.freelancer}</Text>
            </View>
          </View>

          <View style={s.budgetContainer}>
            <Text style={s.budgetLabel}>Anggaran</Text>
            <Text style={s.budgetValue}>
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.budget)}
            </Text>
          </View>

          <View style={s.progressContainer}>
            <View style={s.progressLabelRow}>
              <Text style={s.progressLabel}>Progress</Text>
              <Text style={s.progressValue}>{item.progress}%</Text>
            </View>
            <View style={s.progressBarBg}>
              <View style={[s.progressBarFill, { width: `${item.progress}%` }]} />
            </View>
          </View>
        </View>

        <View style={s.cardFooter}>
          <TouchableOpacity style={s.detailBtn}>
            <Text style={s.detailBtnText}>Detail</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Proyek</Text>
          <Text style={s.subtitle}>Monitor status proyek</Text>
        </View>
        <View style={s.headerActions}>
          <TouchableOpacity style={s.iconBtn}>
            <Download size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[s.iconBtn, { backgroundColor: '#2563EB', borderColor: '#2563EB' }]}
            onPress={() => setIsCreateModalOpen(true)}
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={s.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.statsContainer}>
          {loading && !refreshing ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : stats.map((stat, idx) => (
            <View key={idx} style={{ marginRight: 12 }}>
              {renderStatCard(stat, idx)}
            </View>
          ))}
        </ScrollView>

        <View style={s.filterSection}>
          <View style={s.searchContainer}>
            <Search size={18} color="#94A3B8" />
            <TextInput
              style={s.searchInput}
              placeholder="Cari proyek atau klien..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll}>
            {['all', 'active', 'completed', 'pending', 'cancelled'].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setFilterStatus(status)}
                style={[
                  s.filterPill,
                  filterStatus === status && s.filterPillActive
                ]}
              >
                <Text style={[
                  s.filterText,
                  filterStatus === status && s.filterTextActive
                ]}>
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={s.listContainer}>
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
          ) : projects.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={s.emptyText}>Tidak ada proyek ditemukan.</Text>
            </View>
          ) : (
            projects.map(renderProjectCard)
          )}
        </View>

        <View style={s.pagination}>
          <TouchableOpacity
            disabled={pagination.page <= 1}
            onPress={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            style={[s.pageBtn, pagination.page <= 1 && s.pageBtnDisabled]}
          >
            <ChevronLeft size={20} color={pagination.page <= 1 ? "#CBD5E1" : "#1E293B"} />
          </TouchableOpacity>
          <Text style={s.pageText}>
            Hal {pagination.page} dari {pagination.totalPages}
          </Text>
          <TouchableOpacity
            disabled={pagination.page >= pagination.totalPages}
            onPress={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            style={[s.pageBtn, pagination.page >= pagination.totalPages && s.pageBtnDisabled]}
          >
            <ChevronRight size={20} color={pagination.page >= pagination.totalPages ? "#CBD5E1" : "#1E293B"} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={() => { onRefresh(); }}
      />
    </View>
  );
}

const s = StyleSheet.create({
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
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statsContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 150,
  },
  statHeader: {
    marginBottom: 12,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
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
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
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
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '48%',
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
  },
  budgetContainer: {
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
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  progressValue: {
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
  cardFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detailBtn: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  detailBtnText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#64748B',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  pageBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pageBtnDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  pageText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
});