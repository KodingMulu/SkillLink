import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput, ActivityIndicator, Alert, RefreshControl,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin, Calendar, Clock, Edit, Trash2, Users, X, Plus,
  Briefcase, DollarSign
} from 'lucide-react-native';
import axios from 'axios';

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

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function JobsScreen() {
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
      const response = await axios.get(`${API_URL}/user/client/jobs`, { withCredentials: true });

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

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
    setIsLoading(true);
    try {
      const endpoint = editingId
        ? `${API_URL}/user/client/jobs/${editingId}`
        : `${API_URL}/user/client/jobs`;

      const method = editingId ? 'put' : 'post';

      await axios[method](endpoint, formData, { withCredentials: true });

      Alert.alert("Sukses", `Pekerjaan berhasil ${editingId ? 'diperbarui' : 'diposting'}!`);
      closeModal();
      fetchJobs();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Konfirmasi",
      "Yakin hapus pekerjaan ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/user/client/jobs/${id}`, { withCredentials: true });
              fetchJobs();
            } catch (error) {
              Alert.alert("Gagal", "Gagal menghapus pekerjaan");
            }
          }
        }
      ]
    );
  };

  const getStatusStyle = (status: string) => {
    return status === 'active'
      ? { bg: '#D1FAE5', text: '#047857' }
      : { bg: '#F1F5F9', text: '#475569' };
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Posting Proyek</Text>
          <Text style={s.headerSubtitle}>Kelola lowongan pekerjaan</Text>
        </View>
        <TouchableOpacity
          style={s.addButton}
          onPress={() => setShowPostJobModal(true)}
        >
          <Plus size={20} color="white" />
          <Text style={s.addButtonText}>Baru</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      >
        <View style={s.listHeader}>
          <Text style={s.listTitle}>Daftar Lowongan</Text>
        </View>

        {isFetching ? (
          <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
        ) : jobs.length === 0 ? (
          <View style={s.emptyState}>
            <Text style={s.emptyText}>Belum ada pekerjaan yang diposting.</Text>
          </View>
        ) : (
          jobs.map((job) => {
            const statusStyle = getStatusStyle(job.status);
            return (
              <View key={job.id} style={s.card}>
                <View style={s.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={s.titleRow}>
                      <Text style={s.jobTitle} numberOfLines={1}>{job.title}</Text>
                      <View style={[s.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[s.statusText, { color: statusStyle.text }]}>
                          {job.status === 'active' ? 'Aktif' : 'Tutup'}
                        </Text>
                      </View>
                    </View>
                    <Text style={s.jobMeta}>{job.category} • {job.postedDate}</Text>
                  </View>

                  <View style={s.actions}>
                    <TouchableOpacity onPress={() => openEditModal(job)} style={s.iconBtn}>
                      <Edit size={18} color="#059669" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(job.id)} style={s.iconBtn}>
                      <Trash2 size={18} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={s.detailsGrid}>
                  <View style={s.detailItem}>
                    <Text style={s.detailValue}>{job.budget}</Text>
                  </View>
                  <View style={s.detailItem}>
                    <Calendar size={14} color="#94A3B8" />
                    <Text style={s.detailText}>{job.deadline}</Text>
                  </View>
                  <View style={s.detailItem}>
                    <MapPin size={14} color="#94A3B8" />
                    <Text style={s.detailText}>{job.location}</Text>
                  </View>
                  <View style={s.detailItem}>
                    <Clock size={14} color="#94A3B8" />
                    <Text style={s.detailText}>{job.duration}</Text>
                  </View>
                </View>

                <View style={s.cardFooter}>
                  <View style={s.applicants}>
                    <Users size={16} color="#64748B" />
                    <Text style={s.applicantsText}>{job.applicants} Pelamar</Text>
                  </View>
                  <TouchableOpacity onPress={() => router.push(`/client/jobs/${job.id}/applicants`)}>
                    <Text style={s.linkText}>Lihat Pelamar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal
        visible={showPostJobModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={s.modalOverlay}
        >
          <View style={s.modalContainer}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{editingId ? 'Edit Pekerjaan' : 'Posting Baru'}</Text>
              <TouchableOpacity onPress={closeModal}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={s.formScroll} showsVerticalScrollIndicator={false}>
              <View style={s.formGroup}>
                <Text style={s.label}>Judul Pekerjaan</Text>
                <TextInput
                  style={s.input}
                  value={formData.title}
                  onChangeText={(text) => handleInputChange('title', text)}
                  placeholder="Contoh: Frontend Developer"
                />
              </View>

              <View style={s.formGroup}>
                <Text style={s.label}>Kategori</Text>
                <TextInput
                  style={s.input}
                  value={formData.category}
                  onChangeText={(text) => handleInputChange('category', text)}
                  placeholder="Web / Mobile / Design"
                />
              </View>

              <View style={s.formGroup}>
                <Text style={s.label}>Deskripsi</Text>
                <TextInput
                  style={[s.input, s.textArea]}
                  value={formData.description}
                  onChangeText={(text) => handleInputChange('description', text)}
                  placeholder="Deskripsi pekerjaan..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={s.row}>
                <View style={[s.formGroup, { flex: 1 }]}>
                  <Text style={s.label}>Budget</Text>
                  <TextInput
                    style={s.input}
                    value={formData.budget}
                    onChangeText={(text) => handleInputChange('budget', text)}
                    placeholder="5000000"
                    keyboardType="numeric"
                  />
                </View>
                <View style={[s.formGroup, { flex: 1 }]}>
                  <Text style={s.label}>Deadline</Text>
                  <TextInput
                    style={s.input}
                    value={formData.deadline}
                    onChangeText={(text) => handleInputChange('deadline', text)}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
              </View>

              <View style={s.row}>
                <View style={[s.formGroup, { flex: 1 }]}>
                  <Text style={s.label}>Lokasi</Text>
                  <TextInput
                    style={s.input}
                    value={formData.location}
                    onChangeText={(text) => handleInputChange('location', text)}
                    placeholder="Remote / Jakarta"
                  />
                </View>
                <View style={[s.formGroup, { flex: 1 }]}>
                  <Text style={s.label}>Durasi</Text>
                  <TextInput
                    style={s.input}
                    value={formData.duration}
                    onChangeText={(text) => handleInputChange('duration', text)}
                    placeholder="3 Bulan"
                  />
                </View>
              </View>

              <View style={s.formGroup}>
                <Text style={s.label}>Skills (Pisahkan koma)</Text>
                <TextInput
                  style={s.input}
                  value={formData.skills}
                  onChangeText={(text) => handleInputChange('skills', text)}
                  placeholder="React, Typescript..."
                />
              </View>

              <View style={s.formGroup}>
                <Text style={s.label}>Level Pengalaman</Text>
                <View style={s.radioGroup}>
                  {['beginner', 'intermediate', 'expert'].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        s.radioBtn,
                        formData.experienceLevel === level && s.radioBtnActive
                      ]}
                      onPress={() => handleInputChange('experienceLevel', level)}
                    >
                      <Text style={[
                        s.radioText,
                        formData.experienceLevel === level && s.radioTextActive
                      ]}>{level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={s.modalFooter}>
              <TouchableOpacity onPress={closeModal} style={s.cancelBtn}>
                <Text style={s.cancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} style={s.submitBtn} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="white" /> : <Text style={s.submitText}>Simpan</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  listHeader: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  jobMeta: {
    fontSize: 12,
    color: '#64748B',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
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
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  detailText: {
    fontSize: 12,
    color: '#64748B',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  applicants: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  applicantsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  linkText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
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
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
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
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    height: 100,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  radioBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: 'white',
  },
  radioBtnActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  radioText: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'capitalize',
  },
  radioTextActive: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: 'white',
    fontWeight: 'bold',
  },
});