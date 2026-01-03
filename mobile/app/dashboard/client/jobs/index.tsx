import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Text, Card, Chip, FAB, Portal, PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- INTERFACES ---
interface Job {
  id: string;
  title: string;
  category: string;
  budget: string;
  applicants: number;
  status: 'active' | 'closed';
  postedDate: string;
  location: string;
  deadline: string;
}

// --- DATA DUMMY (Initial State) ---
const DUMMY_JOBS: Job[] = [
  {
    id: '1',
    title: "Frontend Developer (React Native)",
    category: "Mobile Development",
    budget: "Rp 7.500.000",
    applicants: 12,
    status: 'active',
    postedDate: "24 Okt 2023",
    location: "Remote",
    deadline: "30 Nov 2023"
  },
  {
    id: '2',
    title: "UI/UX Designer for Fintech",
    category: "UI/UX Design",
    budget: "Rp 5.000.000",
    applicants: 8,
    status: 'active',
    postedDate: "20 Okt 2023",
    location: "Jakarta",
    deadline: "15 Nov 2023"
  }
];

export default function JobsManagementPage() {
  const [jobs, setJobs] = useState<Job[]>(DUMMY_JOBS);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '', category: '', budget: '', location: '', deadline: ''
  });

  const handlePostJob = () => {
    if (!formData.title || !formData.budget) return Alert.alert("Error", "Isi data minimal Judul dan Budget");
    
    setLoading(true);
    setTimeout(() => {
      const newJob: Job = {
        id: Math.random().toString(),
        title: formData.title,
        category: formData.category || 'General',
        budget: `Rp ${Number(formData.budget).toLocaleString('id-ID')}`,
        applicants: 0,
        status: 'active',
        postedDate: "Hari ini",
        location: formData.location || 'Remote',
        deadline: formData.deadline || '-'
      };
      setJobs([newJob, ...jobs]);
      setLoading(false);
      setShowModal(false);
      setFormData({ title: '', category: '', budget: '', location: '', deadline: '' });
    }, 1000);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Hapus", "Yakin ingin menghapus lowongan ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => setJobs(jobs.filter(j => j.id !== id)) }
    ]);
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Posting Proyek</Text>
          <Text style={styles.headerSub}>Kelola semua lowongan pekerjaan Anda</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Daftar Lowongan ({jobs.length})</Text>
          
          {jobs.map((job) => (
            <Card key={job.id} style={styles.jobCard}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobMeta}>{job.category} • {job.postedDate}</Text>
                </View>
                <Chip 
                  textStyle={styles.statusText} 
                  style={[styles.statusBadge, { backgroundColor: job.status === 'active' ? '#ecfdf5' : '#f1f5f9' }]}
                >
                  {job.status === 'active' ? 'Aktif' : 'Tutup'}
                </Chip>
              </View>

              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="cash" size={16} color="#64748b" />
                  <Text style={styles.infoText}>{job.budget}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="calendar-clock" size={16} color="#64748b" />
                  <Text style={styles.infoText}>{job.deadline}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="map-marker" size={16} color="#64748b" />
                  <Text style={styles.infoText}>{job.location}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name="account-group" size={16} color="#64748b" />
                  <Text style={styles.infoText}>{job.applicants} Pelamar</Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.btnActionSecondary}>
                  <MaterialCommunityIcons name="pencil-outline" size={18} color="#059669" />
                  <Text style={styles.btnActionTextSecondary}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnActionDanger} onPress={() => handleDelete(job.id)}>
                  <MaterialCommunityIcons name="trash-can-outline" size={18} color="#dc2626" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnActionPrimary}>
                  <Text style={styles.btnActionTextPrimary}>Lihat Pelamar</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </ScrollView>

        {/* Floating Action Button (FAB) untuk Tambah Pekerjaan */}
        <FAB
          icon="plus"
          label="Posting Lowongan"
          style={styles.fab}
          color="#fff"
          onPress={() => setShowModal(true)}
        />

        {/* MODAL FORM */}
        <Modal visible={showModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Posting Pekerjaan Baru</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 500 }}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Judul Pekerjaan</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Contoh: Frontend Developer" 
                    value={formData.title}
                    onChangeText={(v) => setFormData({...formData, title: v})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Budget (Angka)</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Contoh: 5000000" 
                    keyboardType="numeric"
                    value={formData.budget}
                    onChangeText={(v) => setFormData({...formData, budget: v})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Lokasi</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Remote / Jakarta" 
                    value={formData.location}
                    onChangeText={(v) => setFormData({...formData, location: v})}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Deadline</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="YYYY-MM-DD" 
                    value={formData.deadline}
                    onChangeText={(v) => setFormData({...formData, deadline: v})}
                  />
                </View>
              </ScrollView>

              <TouchableOpacity style={styles.btnSubmit} onPress={handlePostJob} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSubmitText}>Posting Sekarang</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#fff' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' } as TextStyle,
  headerSub: { fontSize: 14, color: '#64748b', marginTop: 4 } as TextStyle,
  
  scrollContent: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#64748b', marginBottom: 16 } as TextStyle,
  
  jobCard: { padding: 16, borderRadius: 20, backgroundColor: '#fff', marginBottom: 16, elevation: 2, borderWidth: 1, borderColor: '#f1f5f9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  jobTitle: { fontSize: 17, fontWeight: 'bold', color: '#0f172a', flex: 1, marginRight: 8 } as TextStyle,
  jobMeta: { fontSize: 12, color: '#94a3b8', marginTop: 2 } as TextStyle,
  statusBadge: { height: 26, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold', color: '#059669' } as TextStyle,

  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f8fafc' },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6, width: '45%' },
  infoText: { fontSize: 12, color: '#475569', fontWeight: '500' } as TextStyle,

  cardActions: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 8 },
  btnActionSecondary: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#ecfdf5' },
  btnActionTextSecondary: { fontSize: 13, fontWeight: 'bold', color: '#059669' } as TextStyle,
  btnActionDanger: { padding: 8, borderRadius: 10, backgroundColor: '#fef2f2' },
  btnActionPrimary: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#2563eb', paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  btnActionTextPrimary: { fontSize: 13, fontWeight: 'bold', color: '#2563eb' } as TextStyle,

  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#2563eb', borderRadius: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' } as TextStyle,
  
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#475569', marginBottom: 8 } as TextStyle,
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, fontSize: 15, color: '#0f172a' },
  
  btnSubmit: { backgroundColor: '#2563eb', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  btnSubmitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 } as TextStyle,
});