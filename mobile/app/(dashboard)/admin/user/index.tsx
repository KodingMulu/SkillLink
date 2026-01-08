import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, RefreshControl, ScrollView, Modal
} from 'react-native';
import {
  Users, UserPlus, Search, Filter,
  Mail, UserCheck, Ban, Edit2,
  ChevronLeft, ChevronRight, Download,
  CheckCircle2, Clock, X
} from 'lucide-react-native';
import axios from 'axios';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  projects: number;
  rating: number;
}

interface UserStatApi {
  type: "total_users" | "pending_verification" | "active_monthly";
  label: string;
  value: number;
  prefix?: string;
  icon: string;
  color: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserModal = ({ isOpen, onClose, onSuccess }: AddUserModalProps) => {
  const [formData, setFormData] = useState({ name: '', email: '', role: 'FREELANCER' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
      onClose();
    }, 1500);
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.modalContent}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Tambah User</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          <View style={s.formGroup}>
            <Text style={s.label}>Nama Lengkap</Text>
            <TextInput 
              style={s.input} 
              placeholder="Nama User" 
              value={formData.name}
              onChangeText={(t) => setFormData({...formData, name: t})}
            />
          </View>
          <View style={s.formGroup}>
            <Text style={s.label}>Email</Text>
            <TextInput 
              style={s.input} 
              placeholder="email@example.com" 
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(t) => setFormData({...formData, email: t})}
            />
          </View>
          <TouchableOpacity 
            style={s.submitBtn} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={s.submitBtnText}>Simpan</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function UserManagementScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, limit: 10, total: 0, totalPages: 1
  });
  const [stats, setStats] = useState<UserStatApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/admin/stats`, {
        withCredentials: true
      });
      setStats(res.data?.userStats || []);
    } catch (error) {
      console.error(error);
      setStats([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/admin/list-user`, {
        params: {
          page: pagination.page,
          limit: 10,
          search: searchTerm,
          status: statusFilter !== 'all' ? statusFilter : undefined
        },
        withCredentials: true
      });
      
      setUsers(res.data?.data || []);
      
      if (res.data?.pagination) {
        setPagination(prev => ({ ...prev, ...res.data.pagination }));
      }
    } catch (error) {
      console.error(error);
      setUsers([]);
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
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, pagination.page]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
    fetchUsers();
  }, []);

  const getIcon = (iconName: string, color: string) => {
    const props = { size: 24, color };
    switch (iconName) {
      case 'users': return <Users {...props} />;
      case 'clock': return <Clock {...props} />;
      case 'check': return <CheckCircle2 {...props} />;
      default: return <Users {...props} />;
    }
  };

  const getColor = (colorName: string) => {
    switch (colorName) {
      case 'blue': return { bg: '#EFF6FF', text: '#2563EB' };
      case 'orange': return { bg: '#FFF7ED', text: '#EA580C' };
      case 'emerald': return { bg: '#ECFDF5', text: '#059669' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return { bg: '#D1FAE5', text: '#047857' };
      case 'pending': return { bg: '#FFEDD5', text: '#C2410C' };
      case 'suspended': return { bg: '#FEE2E2', text: '#DC2626' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const renderStatCard = ({ item }: { item: UserStatApi }) => {
    const styles = getColor(item.color);
    return (
      <View style={s.statCard}>
        <View style={[s.statIcon, { backgroundColor: styles.bg }]}>
          {getIcon(item.icon, styles.text)}
        </View>
        <View>
          <Text style={s.statLabel}>{item.label}</Text>
          <Text style={s.statValue}>
            {item.prefix}{item.value.toLocaleString('id-ID')}
          </Text>
        </View>
      </View>
    );
  };

  const renderUserCard = ({ item }: { item: UserData }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <View style={s.card}>
        <View style={s.cardHeader}>
          <View style={s.userInfo}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.userName} numberOfLines={1}>{item.name}</Text>
              <Text style={s.userEmail} numberOfLines={1}>{item.email}</Text>
            </View>
          </View>
          <View style={[s.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[s.statusText, { color: statusStyle.text }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={s.cardBody}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Role</Text>
            <View style={[s.roleBadge, { backgroundColor: item.role === 'FREELANCER' ? '#FAF5FF' : '#EFF6FF' }]}>
              <Text style={[s.roleText, { color: item.role === 'FREELANCER' ? '#7E22CE' : '#1D4ED8' }]}>
                {item.role}
              </Text>
            </View>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Bergabung</Text>
            <Text style={s.infoValue}>
              {new Date(item.joined).toLocaleDateString('id-ID')}
            </Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Proyek</Text>
            <Text style={s.infoValue}>{item.projects}</Text>
          </View>
        </View>

        <View style={s.cardFooter}>
          {item.status === 'pending' && (
            <TouchableOpacity style={[s.actionBtn, { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5' }]}>
              <UserCheck size={16} color="#059669" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[s.actionBtn, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}>
            <Edit2 size={16} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' }]}>
            <Ban size={16} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Manajemen User</Text>
          <Text style={s.subtitle}>Kelola pengguna platform</Text>
        </View>
        <View style={s.headerActions}>
          <TouchableOpacity style={s.iconBtn}>
            <Download size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[s.iconBtn, { backgroundColor: '#2563EB', borderColor: '#2563EB' }]}
            onPress={() => setIsAddUserModalOpen(true)}
          >
            <UserPlus size={20} color="white" />
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
          ) : (
            (stats || []).map((stat, idx) => (
              <View key={idx} style={{ marginRight: 12 }}>
                {renderStatCard({ item: stat })}
              </View>
            ))
          )}
        </ScrollView>

        <View style={s.filterSection}>
          <View style={s.searchContainer}>
            <Search size={18} color="#94A3B8" />
            <TextInput
              style={s.searchInput}
              placeholder="Cari user..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll}>
            {['all', 'active', 'pending', 'suspended'].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setStatusFilter(status)}
                style={[
                  s.filterPill,
                  statusFilter === status && s.filterPillActive
                ]}
              >
                <Text style={[
                  s.filterText,
                  statusFilter === status && s.filterTextActive
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={s.listContainer}>
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
          ) : users.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={s.emptyText}>Tidak ada user ditemukan.</Text>
            </View>
          ) : (
            (users || []).map(item => (
              <View key={item.id} style={{ marginBottom: 12 }}>
                {renderUserCard({ item })}
              </View>
            ))
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

      <AddUserModal 
        isOpen={isAddUserModalOpen} 
        onClose={() => setIsAddUserModalOpen(false)} 
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
    minWidth: 160,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
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
    textTransform: 'capitalize',
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  avatarText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748B',
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0F172A',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});