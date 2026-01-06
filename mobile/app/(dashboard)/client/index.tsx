import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  RefreshControl, ActivityIndicator, Modal, TextInput, Dimensions, KeyboardAvoidingView, Platform 
} from 'react-native';
import { 
  Users, FileText, DollarSign, Briefcase, ChevronRight, X, 
  MapPin, Clock, CheckCircle2, Star, TrendingUp 
} from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface DashboardStats {
  expenditure: string;
  activeJobs: number;
  newApplicants: number;
  completedContracts: number;
}

interface Applicant {
  id: number;
  name: string;
  role: string;
  appliedFor: string;
  date: string;
  match: number;
}

interface Activity {
  id: number;
  text: string;
  time: string;
  type: 'payment' | 'work';
}

export default function ClientDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  
  // Default values to prevent crash
  const [stats, setStats] = useState<DashboardStats>({
    expenditure: 'Rp 0',
    activeJobs: 0,
    newApplicants: 0,
    completedContracts: 0
  });
  
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    deadline: '',
  });

  const fetchData = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/user/client/dashboard`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.code === 200) {
        const data = response.data.data;
        // Gunakan fallback object kosong jika data.stats undefined
        const statsData = data.stats || {};
        
        setStats({
          expenditure: statsData.expenditure || 'Rp 0',
          activeJobs: statsData.activeJobs || 0,
          newApplicants: statsData.newApplicants || 0,
          completedContracts: statsData.completedContracts || 0
        });

        setApplicants(data.applicants || []);
        setActivities(data.activities || []);
      }
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

  const handlePostJob = async () => {
    setShowPostJobModal(false);
    alert("Pekerjaan berhasil diposting!");
  };

  // Safe string conversion to prevent "undefined reading toString"
  const statItems = [
    { 
      label: "Pengeluaran", 
      value: stats.expenditure, 
      icon: DollarSign, 
      color: "#059669", 
      bg: "#ECFDF5" 
    },
    { 
      label: "Lowongan", 
      value: (stats.activeJobs || 0).toString(), 
      icon: Briefcase, 
      color: "#2563EB", 
      bg: "#EFF6FF" 
    },
    { 
      label: "Pelamar", 
      value: (stats.newApplicants || 0).toString(), 
      icon: Users, 
      color: "#9333EA", 
      bg: "#FAF5FF" 
    },
    { 
      label: "Selesai", 
      value: (stats.completedContracts || 0).toString(), 
      icon: FileText, 
      color: "#475569", 
      bg: "#F1F5F9" 
    },
  ];

  if (loading) {
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
          <View>
            <Text style={styles.title}>Dashboard Klien</Text>
            <Text style={styles.subtitle}>Kelola proyek dan talenta.</Text>
          </View>
          <TouchableOpacity style={styles.postBtn} onPress={() => setShowPostJobModal(true)}>
            <Text style={styles.postBtnText}>+ Post Job</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          {statItems.map((item, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                <item.icon size={20} color={item.color} />
              </View>
              <View>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pelamar Terbaru</Text>
            <TouchableOpacity onPress={() => router.push('/(dashboard)/client/talents')}>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {applicants.length > 0 ? (
            applicants.map((applicant) => (
              <View key={applicant.id} style={styles.applicantCard}>
                <View style={styles.applicantRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{applicant.name ? applicant.name.charAt(0) : 'U'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.applicantName}>{applicant.name}</Text>
                    <Text style={styles.applicantRole}>{applicant.role}</Text>
                  </View>
                  <View style={[styles.matchBadge, { backgroundColor: applicant.match > 90 ? '#ECFDF5' : '#EFF6FF' }]}>
                    <Text style={[styles.matchText, { color: applicant.match > 90 ? '#059669' : '#2563EB' }]}>
                      {applicant.match}% Match
                    </Text>
                  </View>
                </View>
                <View style={styles.applicantFooter}>
                  <Text style={styles.appliedFor}>Melamar: {applicant.appliedFor}</Text>
                  <Text style={styles.dateText}>{applicant.date}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Belum ada pelamar baru.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kontrak Berjalan</Text>
          <View style={styles.contractCard}>
            <View style={styles.contractHeader}>
              <View style={styles.freelancerInfo}>
                <View style={styles.miniAvatar}>
                  <Text style={styles.miniAvatarText}>NZ</Text>
                </View>
                <Text style={styles.freelancerName}>Nazril Afandi</Text>
              </View>
              <View style={styles.escrowBadge}>
                <Text style={styles.escrowText}>Escrow Paid</Text>
              </View>
            </View>
            <Text style={styles.contractProject}>Project: Pembuatan Dashboard V2</Text>
            <View style={styles.progressRow}>
              <Text style={styles.milestoneText}>Milestone: Front-end</Text>
              <Text style={styles.progressText}>70%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '70%' }]} />
            </View>
            <View style={styles.contractFooter}>
              <Text style={styles.deadlineText}>Deadline: 20 Des</Text>
              <Text style={styles.budgetText}>Rp 5.000.000</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktivitas Terbaru</Text>
          <View style={styles.activityList}>
            {activities.length > 0 ? (
              activities.map((act) => (
                <View key={act.id} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    {act.type === 'payment' ? <CheckCircle2 size={16} color="#10B981" /> : <Clock size={16} color="#3B82F6" />}
                  </View>
                  <View>
                    <Text style={styles.activityText}>{act.text}</Text>
                    <Text style={styles.activityTime}>{act.time}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Belum ada aktivitas.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showPostJobModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPostJobModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Posting Pekerjaan</Text>
              <TouchableOpacity onPress={() => setShowPostJobModal(false)}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Judul Pekerjaan</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Contoh: UI/UX Designer" 
                  value={formData.title}
                  onChangeText={(t) => setFormData({...formData, title: t})}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Kategori</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="IT / Design"
                    value={formData.category}
                    onChangeText={(t) => setFormData({...formData, category: t})}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Budget (Rp)</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="5.000.000" 
                    keyboardType="numeric"
                    value={formData.budget}
                    onChangeText={(t) => setFormData({...formData, budget: t})}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Deskripsi</Text>
                <TextInput 
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
                  placeholder="Jelaskan detail pekerjaan..." 
                  multiline
                  value={formData.description}
                  onChangeText={(t) => setFormData({...formData, description: t})}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setShowPostJobModal(false)}
              >
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitBtn} 
                onPress={handlePostJob}
              >
                <Text style={styles.submitBtnText}>Posting</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  postBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  postBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    padding: 8,
    borderRadius: 10,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  applicantCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  applicantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#E2E8F0',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: 'bold',
    color: '#475569',
  },
  applicantName: {
    fontWeight: 'bold',
    color: '#0F172A',
    fontSize: 14,
  },
  applicantRole: {
    fontSize: 12,
    color: '#64748B',
  },
  matchBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  matchText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  applicantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  appliedFor: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  emptyText: {
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  contractCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  freelancerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniAvatar: {
    width: 24,
    height: 24,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatarText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  freelancerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  escrowBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  escrowText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
  },
  contractProject: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  milestoneText: {
    fontSize: 12,
    color: '#64748B',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  contractFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deadlineText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  budgetText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  activityList: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    gap: 12,
  },
  activityIcon: {
    marginTop: 2,
  },
  activityText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  modalForm: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  row: {
    flexDirection: 'row',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#64748B',
    fontWeight: 'bold',
  },
  submitBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  submitBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});