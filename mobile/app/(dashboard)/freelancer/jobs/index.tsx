import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, 
  Modal, ActivityIndicator, RefreshControl, Dimensions 
} from 'react-native';
import { Search, Users, CheckCircle2, X, Briefcase } from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  tags: string[];
  companyName: string;
  applicantCount: number;
  createdAt: string;
  matchScore: number;
  isRecommended: boolean;
}

interface JobStats {
  applied: number;
  pending: number;
}

interface ApiResponse {
  message: string;
  code: number;
  data: {
    jobs: Job[];
    stats: JobStats;
  };
}

const { width } = Dimensions.get('window');

export default function FindJobsPage() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobStats>({ applied: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const categories = ['Semua', 'Web Development', 'UI/UX Design', 'Mobile App', 'Writing'];

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Baru saja';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} mnt lalu`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari lalu`;
  };

  const fetchJobs = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get<ApiResponse>(`${apiUrl}/user/freelancer/jobs`, {
        params: {
          q: searchQuery,
          category: activeTab
        },
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.code === 200) {
        setJobs(response.data.data.jobs);
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      fetchJobs();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeTab]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchJobs();
  }, []);

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const submitApplication = async () => {
    if (!selectedJob) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setIsSuccess(false);
        setSelectedJob(null);
      }, 2000);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Cari Pekerjaan</Text>
          <Text style={styles.subtitle}>Temukan proyek impianmu hari ini</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Lamaran Terkirim</Text>
            <Text style={styles.statValue}>{stats.applied}</Text>
          </View>
          <View style={[styles.statCard, styles.statCardBlue]}>
            <Text style={[styles.statLabel, styles.textWhite]}>Menunggu Respon</Text>
            <Text style={[styles.statValue, styles.textWhite]}>{stats.pending}</Text>
          </View>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color="#94A3B8" />
            <TextInput 
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cari judul atau skill..."
              placeholderTextColor="#94A3B8"
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat} 
                onPress={() => setActiveTab(cat)} 
                style={[
                  styles.categoryPill,
                  activeTab === cat && styles.activeCategoryPill
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  activeTab === cat && styles.activeCategoryText
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.jobList}>
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
          ) : jobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Briefcase size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>Tidak ada pekerjaan ditemukan.</Text>
            </View>
          ) : (
            jobs.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <View style={styles.tagsContainer}>
                    {job.tags.slice(0, 2).map((tag, idx) => (
                      <View key={idx} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                    {job.isRecommended && (
                      <View style={styles.recommendedTag}>
                        <Text style={styles.recommendedText}>Recommended</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <View style={styles.jobMeta}>
                    <Text style={styles.metaText}>{job.companyName}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.metaText}>{getRelativeTime(job.createdAt)}</Text>
                    <Text style={styles.dot}>•</Text>
                    <View style={styles.applicantMeta}>
                      <Users size={12} color="#64748B" />
                      <Text style={[styles.metaText, { marginLeft: 4 }]}>{job.applicantCount}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.jobDescription} numberOfLines={2}>{job.description}</Text>

                <View style={styles.jobFooter}>
                  <View>
                    <Text style={styles.budgetLabel}>Budget</Text>
                    <Text style={styles.budgetValue}>{formatRupiah(job.budget)}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => handleApplyClick(job)}
                    style={styles.applyButton}
                  >
                    <Text style={styles.applyButtonText}>Lamar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isApplyModalOpen}
        onRequestClose={() => setIsApplyModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!isSuccess ? (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Konfirmasi Lamaran</Text>
                  <TouchableOpacity onPress={() => setIsApplyModalOpen(false)}>
                    <X size={24} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                {selectedJob && (
                  <View style={styles.selectedJobPreview}>
                    <Text style={styles.previewLabel}>Pekerjaan</Text>
                    <Text style={styles.previewTitle} numberOfLines={1}>{selectedJob.title}</Text>
                    <Text style={styles.previewBudget}>{formatRupiah(selectedJob.budget)}</Text>
                  </View>
                )}

                <Text style={styles.modalDescription}>
                  Profil dan portofolio Anda akan dikirimkan ke <Text style={{ fontWeight: 'bold' }}>{selectedJob?.companyName}</Text> untuk ditinjau.
                </Text>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setIsApplyModalOpen(false)}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.cancelButtonText}>Batal</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.confirmButton}
                    onPress={submitApplication}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.confirmButtonText}>Kirim Lamaran</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.successView}>
                <View style={styles.successIcon}>
                  <CheckCircle2 size={40} color="#059669" />
                </View>
                <Text style={styles.successTitle}>Berhasil!</Text>
                <Text style={styles.successText}>Lamaran Anda telah terkirim.</Text>
              </View>
            )}
          </View>
        </View>
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
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statCardBlue: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  textWhite: {
    color: 'white',
  },
  searchSection: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  activeCategoryPill: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  activeCategoryText: {
    color: 'white',
  },
  jobList: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  jobHeader: {
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  recommendedTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
    textTransform: 'uppercase',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  dot: {
    fontSize: 12,
    color: '#CBD5E1',
    marginHorizontal: 6,
  },
  applicantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobDescription: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  budgetLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  applyButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  selectedJobPreview: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  previewBudget: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748B',
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successView: {
    alignItems: 'center',
    padding: 20,
  },
  successIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#ECFDF5',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  successText: {
    color: '#64748B',
    textAlign: 'center',
  },
});