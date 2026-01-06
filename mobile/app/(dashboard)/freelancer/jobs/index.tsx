import React, { useState, useEffect } from 'react';
import { 
  View, StyleSheet, ScrollView, TouchableOpacity, 
  FlatList, TextInput, Modal, ActivityIndicator 
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

// --- 1. Definisi Interfaces ---
interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  tags: string[];
  companyName: string;
  applicantCount: number;
  createdAt: string;
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

export default function FindJobsPage() {
  // --- 2. State dengan Typing yang Benar ---
  const [activeTab, setActiveTab] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<JobStats>({ applied: 0, pending: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const categories = ['Semua', 'Web Development', 'UI/UX Design', 'Mobile App', 'Writing'];

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeTab]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await axios.get<ApiResponse>(`${apiUrl}/user/freelancer/jobs`, {
        params: { q: searchQuery, category: activeTab }
      });
      
      if (response.data.code === 200) {
        setJobs(response.data.data.jobs);
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const submitApplication = () => {
    setIsSubmitting(true);
    // Simulasi API Call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setIsSuccess(false);
        setSelectedJob(null);
      }, 2000);
    }, 1500);
  };

  // --- 3. Render Item Function ---
  const renderJobItem = ({ item }: { item: Job }) => (
    <Card style={styles.jobCard}>
      <Card.Content>
        <View style={styles.tagRow}>
          {item.tags.slice(0, 2).map((tag, idx) => (
            <View key={idx} style={styles.tagBlue}>
              <Text style={styles.tagBlueText}>{tag.toUpperCase()}</Text>
            </View>
          ))}
          {item.isRecommended && (
            <View style={styles.tagGreen}>
              <Text style={styles.tagGreenText}>RECOMMENDED</Text>
            </View>
          )}
        </View>

        <Text style={styles.jobTitle}>{item.title}</Text>
        
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{item.companyName}</Text>
          <Text style={styles.metaDot}>•</Text>
          <View style={styles.applicantRow}>
            <MaterialCommunityIcons name="account-group-outline" size={14} color="#64748b" />
            <Text style={styles.metaText}> {item.applicantCount} Pelamar</Text>
          </View>
        </View>

        <Text style={styles.jobDesc} numberOfLines={2}>{item.description}</Text>

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.budgetText}>BUDGET</Text>
            <Text style={styles.priceText}>{formatRupiah(item.budget)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.applyBtn} 
            onPress={() => handleApply(item)}
          >
            <Text style={styles.applyBtnText}>Lamar</Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Cari Pekerjaan</Text>
        <Text style={styles.subtitle}>Temukan proyek impian Anda hari ini</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={22} color="#94a3b8" />
          <TextInput
            placeholder="Cari judul atau skill..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setActiveTab(cat)}
              style={[styles.catBtn, activeTab === cat && styles.catBtnActive]}
            >
              <Text style={[styles.catBtnText, activeTab === cat && styles.catBtnTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.statsBanner}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.applied}</Text>
          <Text style={styles.statLabel}>Lamaran Terkirim</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Menunggu Respon</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#0f172a" size="large" />
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Tidak ada pekerjaan yang ditemukan.</Text>
          }
        />
      )}

      {/* --- MODAL KONFIRMASI --- */}
      <Modal visible={isApplyModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!isSuccess ? (
              <>
                <Text style={styles.modalTitle}>Konfirmasi Lamaran</Text>
                <View style={styles.confirmBox}>
                  <Text style={styles.confirmLabel}>PEKERJAAN</Text>
                  <Text style={styles.confirmJobName}>{selectedJob?.title}</Text>
                  <Text style={styles.confirmPrice}>{formatRupiah(selectedJob?.budget || 0)}</Text>
                </View>
                <Text style={styles.modalInfo}>
                  Profil dan portofolio Anda akan dikirimkan ke <Text style={{ fontWeight: 'bold', color: '#0f172a' }}>{selectedJob?.companyName}</Text> untuk ditinjau.
                </Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsApplyModalOpen(false)}>
                    <Text style={styles.cancelBtnText}>Batal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.submitBtn} 
                    onPress={submitApplication} 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.submitBtnText}>Kirim Lamaran</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.successBox}>
                <View style={styles.checkCircle}>
                  <MaterialCommunityIcons name="check-bold" size={40} color="#10b981" />
                </View>
                <Text style={styles.successTitle}>Berhasil!</Text>
                <Text style={styles.successSub}>Lamaran Anda telah terkirim.</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20 },
  title: { fontSize: 26, fontWeight: '900', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  searchSection: { marginBottom: 16 },
  searchBar: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#fff', marginHorizontal: 20, 
    paddingHorizontal: 15, borderRadius: 16, 
    borderWidth: 1, borderColor: '#e2e8f0', height: 56 
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, fontWeight: '500' },
  catScroll: { paddingLeft: 20, marginTop: 15 },
  catBtn: { 
    paddingHorizontal: 20, paddingVertical: 10, 
    borderRadius: 12, backgroundColor: '#fff', 
    marginRight: 8, borderWidth: 1, borderColor: '#e2e8f0' 
  },
  catBtnActive: { backgroundColor: '#0f172a', borderColor: '#0f172a' },
  catBtnText: { fontSize: 13, fontWeight: 'bold', color: '#64748b' },
  catBtnTextActive: { color: '#fff' },
  statsBanner: { 
    flexDirection: 'row', backgroundColor: '#2563eb', 
    margin: 20, borderRadius: 24, padding: 20, 
    elevation: 4, shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 11, color: '#dbeafe', marginTop: 2 },
  statDivider: { width: 1, height: '80%', backgroundColor: 'rgba(255,255,255,0.2)' },
  listContent: { paddingHorizontal: 20, paddingBottom: 30 },
  jobCard: { borderRadius: 24, marginBottom: 16, backgroundColor: '#fff', elevation: 0, borderWidth: 1, borderColor: '#e2e8f0' },
  tagRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  tagBlue: { backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagBlueText: { fontSize: 10, fontWeight: '900', color: '#2563eb' },
  tagGreen: { backgroundColor: '#ecfdf5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagGreenText: { fontSize: 10, fontWeight: '900', color: '#059669' },
  jobTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  metaText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  metaDot: { marginHorizontal: 8, color: '#cbd5e1' },
  applicantRow: { flexDirection: 'row', alignItems: 'center' },
  jobDesc: { fontSize: 14, color: '#475569', lineHeight: 20, marginBottom: 20 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  budgetText: { fontSize: 10, fontWeight: '900', color: '#94a3b8', letterSpacing: 0.5 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  applyBtn: { backgroundColor: '#0f172a', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
  applyBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#94a3b8', fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.7)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: '#fff', borderRadius: 32, padding: 28 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#0f172a' },
  confirmBox: { backgroundColor: '#f8fafc', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  confirmLabel: { fontSize: 10, fontWeight: '900', color: '#94a3b8', marginBottom: 6 },
  confirmJobName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  confirmPrice: { fontSize: 14, color: '#2563eb', fontWeight: '600', marginTop: 4 },
  modalInfo: { fontSize: 14, color: '#64748b', marginBottom: 30, lineHeight: 22 },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  cancelBtnText: { fontWeight: 'bold', color: '#94a3b8', fontSize: 15 },
  submitBtn: { flex: 2, backgroundColor: '#2563eb', paddingVertical: 16, borderRadius: 18, alignItems: 'center', elevation: 4 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  successBox: { alignItems: 'center', paddingVertical: 30 },
  checkCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  successSub: { color: '#64748b', marginTop: 8, fontSize: 16 }
});