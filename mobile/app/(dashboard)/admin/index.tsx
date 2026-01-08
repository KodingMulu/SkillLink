import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, RefreshControl, Modal, Image 
} from 'react-native';
import { 
  Users, Briefcase, DollarSign, AlertTriangle, 
  Download, Eye, Ban, UserCheck, Filter, ArrowUp, ArrowDown 
} from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
  bg: string;
  detail: string;
}

interface ApiMainStat {
  type: "users" | "active_projects" | "revenue" | "pending";
  label: string;
  value: number;
  growth: number;
  subtext: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'suspended';
  joined: string;
  projects: number;
  rating: number;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPeriod: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ExportModal = ({ isOpen, onClose, selectedPeriod }: ExportModalProps) => {
  if (!isOpen) return null;
  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Export Data</Text>
          <Text style={styles.modalText}>Exporting data for period: {selectedPeriod}</Text>
          <TouchableOpacity onPress={onClose} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const AddUserModal = ({ isOpen, onClose, onSuccess }: AddUserModalProps) => {
  if (!isOpen) return null;
  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New User</Text>
          <TouchableOpacity 
            onPress={() => { onSuccess(); onClose(); }} 
            style={[styles.modalButton, { backgroundColor: '#2563EB' }]}
          >
            <Text style={[styles.modalButtonText, { color: 'white' }]}>Add User</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={[styles.modalButton, { marginTop: 10 }]}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const statConfig = {
    users: { icon: Users, color: "#2563EB", bg: "#EFF6FF" },
    active_projects: { icon: Briefcase, color: "#059669", bg: "#ECFDF5" },
    revenue: { icon: DollarSign, color: "#9333EA", bg: "#FAF5FF" },
    pending: { icon: AlertTriangle, color: "#EA580C", bg: "#FFF7ED" },
  };

  const fetchStats = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      
      const response = await axios.get(`${apiUrl}/user/admin/stats`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.recentUsers) {
        setRecentUsers(response.data.recentUsers);
      }

      if (response.data.mainStats) {
        const mappedStats: Stat[] = response.data.mainStats.map((item: ApiMainStat) => {
          const config = statConfig[item.type] || statConfig.users;
          let displayValue = item.value.toString();

          if (item.type === "revenue") {
            displayValue = new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0
            }).format(item.value);
          } else {
             displayValue = new Intl.NumberFormat("en-US").format(item.value);
          }

          return {
            label: item.label,
            value: displayValue,
            change: `${item.growth >= 0 ? "+" : ""}${item.growth}%`,
            trend: item.growth >= 0 ? "up" : "down",
            icon: config.icon,
            color: config.color,
            bg: config.bg,
            detail: item.subtext,
          };
        });
        setStats(mappedStats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, []);

  const getStatusStyle = (status: User['status']) => {
    switch (status) {
      case 'active': return { bg: '#D1FAE5', text: '#047857', label: 'AKTIF' };
      case 'pending': return { bg: '#FFEDD5', text: '#C2410C', label: 'PENDING' };
      case 'suspended': return { bg: '#FEE2E2', text: '#B91C1C', label: 'SUSPENDED' };
      default: return { bg: '#F1F5F9', text: '#475569', label: '-' };
    }
  };

  const handleUserAdded = () => {
    fetchStats();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard Admin</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.periodBtn}>
              <Text style={styles.periodText}>30 Hari Terakhir</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.exportBtn}
              onPress={() => setIsExportModalOpen(true)}
            >
              <Download size={16} color="white" />
              <Text style={styles.exportText}>Export</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Kelola dan pantau aktivitas platform secara real-time.</Text>
        </View>

        <View style={styles.statsGrid}>
          {stats.length === 0 ? (
             [1,2,3,4].map((i) => <View key={i} style={[styles.statCard, { height: 160 }]} />)
          ) : (
            stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.iconBox, { backgroundColor: stat.bg }]}>
                    <stat.icon size={20} color={stat.color} />
                  </View>
                  <View style={[
                    styles.trendBadge, 
                    { backgroundColor: stat.trend === 'up' ? '#D1FAE5' : '#FEE2E2' }
                  ]}>
                    {stat.trend === 'up' ? <ArrowUp size={12} color="#047857" /> : <ArrowDown size={12} color="#B91C1C" />}
                    <Text style={[
                      styles.trendText, 
                      { color: stat.trend === 'up' ? '#047857' : '#B91C1C' }
                    ]}>
                      {stat.change}
                    </Text>
                  </View>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statDetail}>{stat.detail}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.mainGrid}>
          <View style={styles.userSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Manajemen User Terbaru</Text>
                <Text style={styles.sectionSubtitle}>Daftar user yang baru bergabung</Text>
              </View>
              <TouchableOpacity style={styles.filterBtn}>
                <Filter size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            {recentUsers.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Belum ada data user terbaru.</Text>
              </View>
            ) : (
              recentUsers.map((user) => {
                const statusStyle = getStatusStyle(user.status);
                return (
                  <View key={user.id} style={styles.userCard}>
                    <View style={styles.userHeader}>
                      <View style={styles.userInfo}>
                        <View style={styles.avatar}>
                          <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
                        </View>
                        <View>
                          <Text style={styles.userName}>{user.name}</Text>
                          <Text style={styles.userEmail}>{user.email}</Text>
                          <View style={styles.userMeta}>
                            <Text style={styles.userRole}>{user.role}</Text>
                            <Text style={styles.dot}>•</Text>
                            <Text style={styles.joinedText}>
                              {new Date(user.joined).toLocaleDateString('id-ID')}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                          {statusStyle.label}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.userStats}>
                      <View style={styles.statItem}>
                        <Briefcase size={14} color="#64748B" />
                        <Text style={styles.statItemText}>{user.projects} proyek</Text>
                      </View>
                      {user.rating > 0 && (
                        <View style={styles.statItem}>
                          <Text style={{ fontSize: 12 }}>⭐</Text>
                          <Text style={styles.statItemText}>{user.rating}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#EFF6FF' }]}>
                        <Eye size={14} color="#2563EB" />
                        <Text style={[styles.actionBtnText, { color: '#2563EB' }]}>Detail</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ECFDF5' }]}>
                        <UserCheck size={14} color="#059669" />
                        <Text style={[styles.actionBtnText, { color: '#059669' }]}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FEF2F2' }]}>
                        <Ban size={14} color="#DC2626" />
                        <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>Suspend</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
            
            <TouchableOpacity style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>Lihat Semua User →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sidebar}>
            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionList}>
                <TouchableOpacity 
                  style={styles.quickActionItem}
                  onPress={() => setIsAddUserModalOpen(true)}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: '#DBEAFE' }]}>
                    <Users size={20} color="#2563EB" />
                  </View>
                  <Text style={styles.quickActionText}>Tambah User Baru</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.quickActionItem}>
                  <View style={[styles.quickActionIcon, { backgroundColor: '#FFEDD5' }]}>
                    <AlertTriangle size={20} color="#EA580C" />
                  </View>
                  <Text style={styles.quickActionText}>Kirim Broadcast</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.quickActionItem}>
                  <View style={[styles.quickActionIcon, { backgroundColor: '#D1FAE5' }]}>
                    <Briefcase size={20} color="#059669" />
                  </View>
                  <Text style={styles.quickActionText}>Monitor Proyek</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.activitySection}>
              <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
              <View style={styles.activityList}>
                <View style={styles.activityItem}>
                  <View style={[styles.dot, { backgroundColor: '#2563EB' }]} />
                  <View>
                    <Text style={styles.activityText}>User baru mendaftar</Text>
                    <Text style={styles.activityTime}>2 menit lalu</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={[styles.dot, { backgroundColor: '#059669' }]} />
                  <View>
                    <Text style={styles.activityText}>Proyek diselesaikan</Text>
                    <Text style={styles.activityTime}>15 menit lalu</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <View style={[styles.dot, { backgroundColor: '#EA580C' }]} />
                  <View>
                    <Text style={styles.activityText}>Laporan baru diterima</Text>
                    <Text style={styles.activityTime}>1 jam lalu</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <ExportModal 
          isOpen={isExportModalOpen} 
          onClose={() => setIsExportModalOpen(false)} 
          selectedPeriod={selectedPeriod} 
        />
        <AddUserModal 
          isOpen={isAddUserModalOpen} 
          onClose={() => setIsAddUserModalOpen(false)} 
          onSuccess={handleUserAdded} 
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  periodBtn: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  periodText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  exportText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%', 
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 12,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconBox: {
    padding: 10,
    borderRadius: 12,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  trendText: {
    fontSize: 10,
    fontWeight: 'bold',
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
    marginBottom: 2,
  },
  statDetail: {
    fontSize: 10,
    color: '#94A3B8',
  },
  mainGrid: {
    gap: 24,
  },
  userSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  filterBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  userCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  userHeader: {
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
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
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
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  userRole: {
    fontSize: 10,
    color: '#94A3B8',
  },
  dot: {
    fontSize: 10,
    color: '#CBD5E1',
    marginHorizontal: 4,
  },
  joinedText: {
    fontSize: 10,
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
  userStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statItemText: {
    fontSize: 12,
    color: '#64748B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  viewAllBtn: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  sidebar: {
    gap: 24,
  },
  quickActions: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionList: {
    marginTop: 12,
    gap: 12,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    gap: 12,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  activitySection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activityList: {
    marginTop: 12,
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    gap: 12,
  },
  activityText: {
    fontSize: 14,
    color: '#334155',
  },
  activityTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
});