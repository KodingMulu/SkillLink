import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, RefreshControl, Modal, Image
} from 'react-native';
import {
  Users, Search, Filter, Mail, UserCheck, Ban, Edit2,
  ChevronLeft, ChevronRight, Plus, Download, Clock, CheckCircle2
} from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function UserManagementScreen() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<UserStatApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, limit: 10, total: 0, totalPages: 1
  });

  const getIcon = (iconName: string, color: string) => {
    const props = { size: 20, color };
    switch (iconName) {
      case 'users': return <Users {...props} />;
      case 'clock': return <Clock {...props} />;
      case 'check': return <CheckCircle2 {...props} />;
      default: return <Users {...props} />;
    }
  };

  const fetchData = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const statsRes = await axios.get(`${apiUrl}/user/admin/stats`, { headers });
      setStats(statsRes.data.userStats);

      const usersRes = await axios.get(`${apiUrl}/user/admin/list-user`, {
        headers,
        params: {
          page: pagination.page,
          limit: 10,
          search: searchTerm,
          status: statusFilter !== 'all' ? statusFilter : undefined
        }
      });
      
      setUsers(usersRes.data.data);
      setPagination(prev => ({ ...prev, ...usersRes.data.pagination }));

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, searchTerm, statusFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return { bg: '#D1FAE5', text: '#047857', label: 'Aktif' };
      case 'pending': return { bg: '#FFEDD5', text: '#C2410C', label: 'Pending' };
      case 'suspended': return { bg: '#FEE2E2', text: '#B91C1C', label: 'Suspended' };
      default: return { bg: '#F1F5F9', text: '#475569', label: status };
    }
  };

  const renderStatCard = ({ item }: { item: UserStatApi }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: item.color === 'blue' ? '#EFF6FF' : item.color === 'orange' ? '#FFF7ED' : '#ECFDF5' }]}>
        {getIcon(item.icon, item.color === 'blue' ? '#2563EB' : item.color === 'orange' ? '#EA580C' : '#059669')}
      </View>
      <View>
        <Text style={styles.statLabel}>{item.label}</Text>
        <Text style={styles.statValue}>{item.prefix}{item.value.toLocaleString('id-ID')}</Text>
      </View>
    </View>
  );

  const renderUserCard = ({ item }: { item: UserData }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <View style={styles.userCard}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role:</Text>
            <View style={[
              styles.roleBadge, 
              { backgroundColor: item.role === 'FREELANCER' ? '#FAF5FF' : '#EFF6FF' }
            ]}>
              <Text style={[
                styles.roleText,
                { color: item.role === 'FREELANCER' ? '#7E22CE' : '#1D4ED8' }
              ]}>{item.role}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bergabung:</Text>
            <Text style={styles.infoValue}>
              {new Date(item.joined).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Proyek:</Text>
            <Text style={styles.infoValue}>{item.projects} Proyek</Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          {item.status === 'pending' && (
            <TouchableOpacity style={[styles.actionBtn, styles.btnApprove]}>
              <UserCheck size={16} color="#059669" />
              <Text style={[styles.actionText, { color: '#059669' }]}>Verifikasi</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.actionBtn, styles.btnEdit]}>
            <Edit2 size={16} color="#2563EB" />
            <Text style={[styles.actionText, { color: '#2563EB' }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.btnSuspend]}>
            <Ban size={16} color="#DC2626" />
            <Text style={[styles.actionText, { color: '#DC2626' }]}>Suspend</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Manajemen User</Text>
          <Text style={styles.subtitle}>Kelola pengguna platform</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <FlatList
          horizontal
          data={stats}
          renderItem={renderStatCard}
          keyExtractor={(item) => item.type}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}
        />
      </View>

      <View style={styles.filterSection}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari user..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={18} color="#64748B" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Tidak ada user ditemukan.</Text>
            </View>
          }
          ListFooterComponent={
            users.length > 0 ? (
              <View style={styles.pagination}>
                <TouchableOpacity
                  disabled={pagination.page <= 1}
                  onPress={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  style={[styles.pageBtn, pagination.page <= 1 && styles.pageBtnDisabled]}
                >
                  <ChevronLeft size={20} color={pagination.page <= 1 ? "#CBD5E1" : "#1E293B"} />
                </TouchableOpacity>
                <Text style={styles.pageText}>
                  Hal {pagination.page} dari {pagination.totalPages}
                </Text>
                <TouchableOpacity
                  disabled={pagination.page >= pagination.totalPages}
                  onPress={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  style={[styles.pageBtn, pagination.page >= pagination.totalPages && styles.pageBtnDisabled]}
                >
                  <ChevronRight size={20} color={pagination.page >= pagination.totalPages ? "#CBD5E1" : "#1E293B"} />
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      )}
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
    justifyContent: 'space-between',
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
  addButton: {
    backgroundColor: '#2563EB',
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginTop: 16,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 160,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  filterBtn: {
    width: 44,
    height: 44,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
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
  userInfo: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
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
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 12,
    gap: 8,
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
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
  },
  btnApprove: {
    backgroundColor: '#ECFDF5',
    borderColor: '#D1FAE5',
  },
  btnEdit: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  btnSuspend: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#64748B',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
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