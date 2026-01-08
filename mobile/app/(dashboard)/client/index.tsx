import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Modal, RefreshControl,
  KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import {
  Users, FileText, DollarSign, Briefcase, ChevronRight, X, Calendar
} from 'lucide-react-native';
import axios from 'axios';

interface DashboardData {
  stats: {
    totalSpent: number;
    openJobs: number;
    newApplicants: number;
    completedContracts: number;
  };
  recentApplicants: {
    name: string;
    role: string;
    appliedFor: string;
    date: string;
    match: number;
  }[];
  activeContracts: {
    freelancerName: string;
    projectTitle: string;
    progress: number;
    deadline: string;
    budget: number;
  }[];
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ClientDashboardScreen() {
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    deadline: '',
    experienceLevel: 'intermediate'
  });

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/client/dashboard`, {
        withCredentials: true
      });
      setDashboardData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboard();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/client/jobs/create`, formData, { withCredentials: true });
      Alert.alert('Sukses', 'Pekerjaan berhasil diposting!');
      setShowPostJobModal(false);
      fetchDashboard();
      setFormData({
        title: '', category: '', description: '', budget: '', deadline: '', experienceLevel: 'intermediate'
      });
    } catch (error) {
      Alert.alert('Error', 'Gagal memposting pekerjaan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(value);
  };

  const stats = [
    {
      label: "Total Pengeluaran",
      value: formatCurrency(dashboardData?.stats.totalSpent || 0),
      icon: DollarSign,
      color: "#059669",
      bg: "#ECFDF5"
    },
    { label: "Lowongan Aktif", value: dashboardData?.stats.openJobs || 0, icon: Briefcase, color: "#2563EB", bg: "#EFF6FF" },
    { label: "Pelamar Baru", value: dashboardData?.stats.newApplicants || 0, icon: Users, color: "#9333EA", bg: "#FAF5FF" },
    { label: "Kontrak Selesai", value: dashboardData?.stats.completedContracts || 0, icon: FileText, color: "#475569", bg: "#F1F5F9" },
  ];

  if (loading && !refreshing) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Dashboard Klien</Text>
          <Text style={s.headerSubtitle}>Kelola proyek & talenta</Text>
        </View>
        <TouchableOpacity
          style={s.postBtn}
          onPress={() => setShowPostJobModal(true)}
        >
          <Briefcase size={18} color="white" style={{ marginRight: 6 }} />
          <Text style={s.postBtnText}>Posting</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.statsScroll}>
          {stats.map((stat, index) => (
            <View key={index} style={s.statCard}>
              <View style={[s.statIcon, { backgroundColor: stat.bg }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={s.statLabel}>{stat.label}</Text>
              <Text style={s.statValue}>{stat.value}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Pelamar Terbaru</Text>
            <TouchableOpacity>
              <Text style={s.linkText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View style={s.card}>
            {(!dashboardData?.recentApplicants || dashboardData.recentApplicants.length === 0) ? (
              <View style={s.emptyState}>
                <Text style={s.emptyText}>Belum ada pelamar baru.</Text>
              </View>
            ) : (
              dashboardData.recentApplicants.map((applicant, idx) => (
                <View key={idx} style={[s.applicantItem, idx !== dashboardData.recentApplicants.length - 1 && s.borderBottom]}>
                  <View style={s.applicantRow}>
                    <View style={s.applicantAvatar}>
                      <Text style={s.avatarText}>{applicant.name.charAt(0)}</Text>
                    </View>
                    <View style={s.applicantInfo}>
                      <Text style={s.applicantName}>{applicant.name}</Text>
                      <Text style={s.applicantRole}>{applicant.role} • {applicant.date}</Text>
                    </View>
                    <View style={[s.matchBadge, { backgroundColor: applicant.match > 90 ? '#D1FAE5' : '#DBEAFE' }]}>
                      <Text style={[s.matchText, { color: applicant.match > 90 ? '#059669' : '#1D4ED8' }]}>
                        {applicant.match}% Match
                      </Text>
                    </View>
                  </View>
                  <Text style={s.appliedFor}>Melamar: {applicant.appliedFor}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Kontrak Berjalan</Text>
          {(!dashboardData?.activeContracts || dashboardData.activeContracts.length === 0) ? (
            <View style={[s.card, s.emptyState]}>
              <Text style={s.emptyText}>Tidak ada kontrak aktif.</Text>
            </View>
          ) : (
            dashboardData.activeContracts.map((contract, idx) => (
              <View key={idx} style={s.contractCard}>
                <View style={s.contractHeader}>
                  <View style={s.freelancerBadge}>
                    <View style={s.smallAvatar}>
                      <Text style={s.smallAvatarText}>{contract.freelancerName?.charAt(0) || 'F'}</Text>
                    </View>
                    <Text style={s.freelancerName}>{contract.freelancerName}</Text>
                  </View>
                  <View style={s.activeTag}>
                    <Text style={s.activeTagText}>Active</Text>
                  </View>
                </View>
                
                <Text style={s.projectTitle} numberOfLines={1}>{contract.projectTitle}</Text>
                
                <View style={s.progressRow}>
                  <Text style={s.progressLabel}>Progress</Text>
                  <Text style={s.progressValue}>{contract.progress}%</Text>
                </View>
                <View style={s.progressBarBg}>
                  <View style={[s.progressBarFill, { width: `${contract.progress}%` }]} />
                </View>

                <View style={s.contractFooter}>
                  <Text style={s.contractDate}>Deadline: {contract.deadline}</Text>
                  <Text style={s.contractBudget}>{formatCurrency(contract.budget)}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showPostJobModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPostJobModal(false)}
      >
        <View style={s.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.keyboardView}>
            <View style={s.modalContent}>
              <View style={s.modalHeader}>
                <View>
                  <Text style={s.modalTitle}>Posting Pekerjaan</Text>
                  <Text style={s.modalSubtitle}>Isi detail pekerjaan</Text>
                </View>
                <TouchableOpacity onPress={() => setShowPostJobModal(false)}>
                  <X size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={s.formScroll}>
                <View style={s.formGroup}>
                  <Text style={s.label}>Judul Pekerjaan</Text>
                  <TextInput
                    style={s.input}
                    placeholder="Contoh: UI/UX Designer"
                    value={formData.title}
                    onChangeText={(t) => handleInputChange('title', t)}
                  />
                </View>

                <View style={s.row}>
                  <View style={[s.formGroup, { flex: 1 }]}>
                    <Text style={s.label}>Kategori</Text>
                    <TextInput
                      style={s.input}
                      placeholder="Design/IT..."
                      value={formData.category}
                      onChangeText={(t) => handleInputChange('category', t)}
                    />
                  </View>
                  <View style={[s.formGroup, { flex: 1 }]}>
                    <Text style={s.label}>Anggaran (Rp)</Text>
                    <TextInput
                      style={s.input}
                      placeholder="5000000"
                      keyboardType="numeric"
                      value={formData.budget}
                      onChangeText={(t) => handleInputChange('budget', t)}
                    />
                  </View>
                </View>

                <View style={s.row}>
                  <View style={[s.formGroup, { flex: 1 }]}>
                    <Text style={s.label}>Deadline</Text>
                    <TextInput
                      style={s.input}
                      placeholder="YYYY-MM-DD"
                      value={formData.deadline}
                      onChangeText={(t) => handleInputChange('deadline', t)}
                    />
                  </View>
                  <View style={[s.formGroup, { flex: 1 }]}>
                    <Text style={s.label}>Level</Text>
                    <TextInput
                      style={s.input}
                      placeholder="entry/expert"
                      value={formData.experienceLevel}
                      onChangeText={(t) => handleInputChange('experienceLevel', t)}
                    />
                  </View>
                </View>

                <View style={s.formGroup}>
                  <Text style={s.label}>Deskripsi</Text>
                  <TextInput
                    style={[s.input, { height: 100, textAlignVertical: 'top' }]}
                    placeholder="Deskripsi pekerjaan..."
                    multiline
                    value={formData.description}
                    onChangeText={(t) => handleInputChange('description', t)}
                  />
                </View>
              </ScrollView>

              <View style={s.modalFooter}>
                <TouchableOpacity onPress={() => setShowPostJobModal(false)} style={s.cancelBtn}>
                  <Text style={s.cancelText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleSubmit} 
                  style={[s.submitBtn, isSubmitting && { opacity: 0.7 }]}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={s.submitText}>Posting</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  postBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  statsScroll: {
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    minWidth: 150,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  linkText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
  },
  applicantItem: {
    padding: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  applicantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  applicantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontWeight: 'bold',
    color: '#475569',
    fontSize: 16,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  applicantRole: {
    fontSize: 11,
    color: '#64748B',
  },
  matchBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  matchText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  appliedFor: {
    fontSize: 12,
    color: '#475569',
    marginLeft: 52,
  },
  contractCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  freelancerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  freelancerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  activeTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  activeTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
  },
  projectTitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  progressValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  contractFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contractDate: {
    fontSize: 10,
    color: '#94A3B8',
  },
  contractBudget: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  formScroll: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
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
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: 'bold',
    color: '#64748B',
  },
  submitBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  submitText: {
    fontWeight: 'bold',
    color: 'white',
  },
});