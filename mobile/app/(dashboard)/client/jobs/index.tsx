import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Modal, TextInput, ActivityIndicator, Alert, RefreshControl, 
  KeyboardAvoidingView, Platform 
} from 'react-native';
import { 
  MapPin, Calendar, Clock, Edit, Trash2, Users, X, Plus 
} from 'lucide-react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Job {
  id: string;
  title: string;
  category: string;
  budget: string;      
  budgetRaw: number;   
  deadline: string;    
  deadlineRaw: string; 
  location: string;
  duration: string;
  description: string;
  experienceLevel: string;
  applicants: number;
  status: 'active' | 'closed';
  postedDate: string;
  skills: string[];
}

interface ApiJob {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: number;      
  deadline: string | null;
  location: string | null;
  duration: string | null;
  experienceLevel: string | null;
  status: string;
  tags: string[];
  createdAt: string;
  _count?: { proposals: number };
}

export default function JobsPage() {
  const router = useRouter();
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '', category: '', description: '', budget: '', deadline: '',
    location: '', skills: '', duration: '', experienceLevel: 'intermediate'
  });

  const fetchJobs = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/user/client/jobs`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.code === 200 && response.data.data) {
        const mappedJobs: Job[] = response.data.data.map((item: ApiJob) => {
          const isValidDate = (d: string | null) => d && !isNaN(new Date(d).getTime());
          return {
            id: item.id,
            title: item.title,
            category: item.category,
            description: item.description,
            location: item.location || '-',
            duration: item.duration || '-',
            experienceLevel: item.experienceLevel || 'intermediate',
            skills: item.tags || [],
            applicants: item._count?.proposals || 0,
            status: (item.status === 'OPEN' || item.status === 'active') ? 'active' : 'closed',
            postedDate: isValidDate(item.createdAt) 
              ? new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) 
              : '-',
            budget: `Rp ${item.budget.toLocaleString('id-ID')}`,
            budgetRaw: item.budget, 
            deadline: isValidDate(item.deadline)
              ? new Date(item.deadline!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
              : '-',
            deadlineRaw: isValidDate(item.deadline)
              ? new Date(item.deadline!).toISOString().split('T')[0]
              : '',
          };
        });
        setJobs(mappedJobs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchJobs();
  }, []);

  const openEditModal = (job: Job) => {
    setEditingId(job.id);
    setFormData({
      title: job.title,
      category: job.category,
      description: job.description,
      budget: job.budgetRaw.toString(), 
      deadline: job.deadlineRaw,        
      location: job.location,
      skills: job.skills.join(', '),
      duration: job.duration,
      experienceLevel: job.experienceLevel
    });
    setShowPostJobModal(true);
  };

  const closeModal = () => {
    setShowPostJobModal(false);
    setEditingId(null);
    setFormData({
      title: '', category: '', description: '', budget: '', deadline: '',
      location: '', skills: '', duration: '', experienceLevel: 'intermediate'
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.budget || !formData.description) {
      Alert.alert('Error', 'Mohon lengkapi data wajib.');
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');
      
      const endpoint = editingId 
        ? `${apiUrl}/user/client/jobs/${editingId}`
        : `${apiUrl}/user/client/jobs`;

      const method = editingId ? 'put' : 'post';

      await axios[method](endpoint, formData, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      Alert.alert('Sukses', `Pekerjaan berhasil ${editingId ? 'diperbarui' : 'diposting'}!`);
      closeModal();
      fetchJobs();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Terjadi kesalahan pada server.";
      Alert.alert('Gagal', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Konfirmasi Hapus",
      "Apakah Anda yakin ingin menghapus pekerjaan ini?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive",
          onPress: async () => {
            try {
              const apiUrl = process.env.EXPO_PUBLIC_API_URL;
              const token = await AsyncStorage.getItem('token');
              
              await axios.delete(`${apiUrl}/user/client/jobs/${id}`, {
                headers: {
                  'Authorization': token ? `Bearer ${token}` : '',
                  'Content-Type': 'application/json'
                }
              });
              fetchJobs();
            } catch (error) {
              Alert.alert("Gagal", "Gagal menghapus pekerjaan");
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (s: string) => s === 'active' ? { bg: '#ECFDF5', text: '#047857' } : { bg: '#F1F5F9', text: '#334155' };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Posting Proyek</Text>
            <Text style={styles.subtitle}>Kelola semua lowongan Anda</Text>
          </View>
          <TouchableOpacity onPress={() => setShowPostJobModal(true)} style={styles.addBtn}>
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        {isFetching && !refreshing ? (
          <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
        ) : jobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Belum ada pekerjaan yang diposting.</Text>
          </View>
        ) : (
          jobs.map((job) => {
            const statusStyle = getStatusColor(job.status);
            return (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                      <Text style={styles.jobTitle}>{job.title}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                          {job.status === 'active' ? 'Aktif' : 'Tutup'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.metaText}>{job.category} • {job.postedDate}</Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={() => openEditModal(job)} style={[styles.iconBtn, { backgroundColor: '#ECFDF5' }]}>
                      <Edit size={16} color="#059669" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(job.id)} style={[styles.iconBtn, { backgroundColor: '#FEF2F2' }]}>
                      <Trash2 size={16} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.budgetAmount}>{job.budget}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Calendar size={14} color="#94A3B8" />
                    <Text style={styles.detailText}>{job.deadline}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <MapPin size={14} color="#94A3B8" />
                    <Text style={styles.detailText}>{job.location}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock size={14} color="#94A3B8" />
                    <Text style={styles.detailText}>{job.duration}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.applicantsInfo}>
                    <Users size={14} color="#64748B" />
                    <Text style={styles.applicantsText}>{job.applicants} Pelamar</Text>
                  </View>
                  <TouchableOpacity onPress={() => router.push(`/(dashboard)/client/jobs/${job.id}/applicants` as any)}>
                    <Text style={styles.viewApplicantsBtn}>Lihat Pelamar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal
        visible={showPostJobModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit Pekerjaan' : 'Posting Baru'}</Text>
              <TouchableOpacity onPress={closeModal}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Judul Pekerjaan</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Contoh: UI/UX Designer" 
                  value={formData.title}
                  onChangeText={(t) => setFormData({...formData, title: t})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Kategori</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Web Development / Design / Writing" 
                  value={formData.category}
                  onChangeText={(t) => setFormData({...formData, category: t})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Deskripsi</Text>
                <TextInput 
                  style={[styles.input, styles.textArea]} 
                  placeholder="Deskripsikan pekerjaan..." 
                  multiline
                  textAlignVertical="top"
                  value={formData.description}
                  onChangeText={(t) => setFormData({...formData, description: t})}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Budget (Rp)</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="5000000" 
                    keyboardType="numeric"
                    value={formData.budget}
                    onChangeText={(t) => setFormData({...formData, budget: t})}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Deadline</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="YYYY-MM-DD" 
                    value={formData.deadline}
                    onChangeText={(t) => setFormData({...formData, deadline: t})}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Lokasi</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Remote / Kota" 
                    value={formData.location}
                    onChangeText={(t) => setFormData({...formData, location: t})}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Durasi</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="3 Bulan" 
                    value={formData.duration}
                    onChangeText={(t) => setFormData({...formData, duration: t})}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Skills (Pisahkan koma)</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="React, Node.js, etc" 
                  value={formData.skills}
                  onChangeText={(t) => setFormData({...formData, skills: t})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Level Pengalaman</Text>
                <View style={styles.radioGroup}>
                  {['beginner', 'intermediate', 'expert'].map((level) => (
                    <TouchableOpacity 
                      key={level}
                      style={[
                        styles.radioBtn, 
                        formData.experienceLevel === level && styles.radioBtnActive
                      ]}
                      onPress={() => setFormData({...formData, experienceLevel: level})}
                    >
                      <Text style={[
                        styles.radioText,
                        formData.experienceLevel === level && styles.radioTextActive
                      ]}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitBtn} 
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>{editingId ? 'Simpan' : 'Posting'}</Text>
                )}
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
  addBtn: {
    backgroundColor: '#2563EB',
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#475569',
  },
  budgetAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 16,
    paddingTop: 16,
  },
  applicantsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  applicantsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  viewApplicantsBtn: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
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
    maxHeight: '90%',
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
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    height: 100,
  },
  row: {
    flexDirection: 'row',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  radioBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: 'white',
  },
  radioBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  radioText: {
    fontSize: 12,
    color: '#64748B',
  },
  radioTextActive: {
    color: '#2563EB',
    fontWeight: 'bold',
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