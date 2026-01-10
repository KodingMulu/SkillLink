import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  ScrollView, Modal, TextInput, ActivityIndicator,
  Alert, Dimensions, KeyboardAvoidingView, Platform
} from 'react-native';
import {
  Plus, ExternalLink, Trash2, Edit3, Image as ImageIcon,
  X, Loader2, Briefcase
} from 'lucide-react-native';
import axios from 'axios';

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const { width } = Dimensions.get('window');

export default function PortfolioScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Semua');

  const categories = ['Semua', 'Web Development', 'UI/UX Design', 'Graphic Design'];

  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    image: '',
    description: ''
  });

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/user/freelancer/portfolio`, { withCredentials: true });
      setProjects(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.image) {
      Alert.alert("Error", "Judul dan URL Gambar wajib diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/portfolio`, formData, { withCredentials: true });
      await fetchProjects();
      setIsModalOpen(false);
      setFormData({ title: '', category: 'Web Development', image: '', description: '' });
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan portfolio");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = activeFilter === 'Semua'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.headerTextContainer}>
          <Text style={s.headerTitle}>Portofolio Saya</Text>
          <Text style={s.headerSubtitle}>Pamerkan hasil kerja terbaik Anda</Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsModalOpen(true)}
          style={s.addButton}
        >
          <Plus size={20} color="white" />
          <Text style={s.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <View style={s.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveFilter(cat)}
              style={[
                s.filterBadge,
                activeFilter === cat ? s.filterBadgeActive : s.filterBadgeInactive
              ]}
            >
              <Text style={[
                s.filterText,
                activeFilter === cat ? s.filterTextActive : s.filterTextInactive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={s.loaderContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          <View style={s.grid}>
            {filteredProjects.map((project) => (
              <View key={project.id} style={s.card}>
                <View style={s.imageContainer}>
                  <Image
                    source={{ uri: project.image || "https://via.placeholder.com/500?text=No+Image" }}
                    style={s.cardImage}
                    resizeMode="cover"
                  />
                  <View style={s.imageOverlay}>
                    <TouchableOpacity style={s.overlayBtn}>
                      <Edit3 size={16} color="#1E293B" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.overlayBtn, s.deleteBtn]}>
                      <Trash2 size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={s.cardContent}>
                  <View style={s.categoryBadge}>
                    <Text style={s.categoryBadgeText}>{project.category}</Text>
                  </View>
                  <Text style={s.cardTitle} numberOfLines={1}>{project.title}</Text>

                  <View style={s.cardDivider} />

                  <TouchableOpacity style={s.detailBtn}>
                    <ExternalLink size={14} color="#64748B" />
                    <Text style={s.detailBtnText}>Lihat Detail</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={s.addNewCard}
              onPress={() => setIsModalOpen(true)}
            >
              <View style={s.addNewIconCircle}>
                <Plus size={32} color="#2563EB" />
              </View>
              <Text style={s.addNewText}>Tambah Karya Baru</Text>
              <Text style={s.addNewSubtext}>Format: JPG, PNG</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={s.modalOverlay}
        >
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Tambah Proyek</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={s.formScroll}>
              <View style={s.formGroup}>
                <Text style={s.label}>Nama Proyek</Text>
                <TextInput
                  style={s.input}
                  placeholder="Masukkan judul karya..."
                  value={formData.title}
                  onChangeText={(t) => handleInputChange('title', t)}
                />
              </View>

              <View style={s.formGroup}>
                <Text style={s.label}>Kategori</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catSelectScroll}>
                  {categories.filter(c => c !== 'Semua').map(c => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => handleInputChange('category', c)}
                      style={[
                        s.catSelectBadge,
                        formData.category === c && s.catSelectBadgeActive
                      ]}
                    >
                      <Text style={[
                        s.catSelectText,
                        formData.category === c && s.catSelectTextActive
                      ]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={s.formGroup}>
                <Text style={s.label}>URL Gambar</Text>
                <View style={s.inputIconContainer}>
                  <TextInput
                    style={[s.input, s.inputWithIcon]}
                    placeholder="https://..."
                    value={formData.image}
                    onChangeText={(t) => handleInputChange('image', t)}
                  />
                  <ImageIcon size={20} color="#94A3B8" style={s.inputIcon} />
                </View>
              </View>

              <View style={s.formGroup}>
                <Text style={s.label}>Deskripsi</Text>
                <TextInput
                  style={[s.input, s.textArea]}
                  placeholder="Deskripsi singkat..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={formData.description}
                  onChangeText={(t) => handleInputChange('description', t)}
                />
              </View>
            </ScrollView>

            <View style={s.modalFooter}>
              <TouchableOpacity
                style={s.cancelButton}
                onPress={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                <Text style={s.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.submitButton}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={s.submitButtonText}>Simpan Karya</Text>
                )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
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
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  filterContainer: {
    paddingVertical: 16,
  },
  filterScroll: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
  },
  filterBadgeActive: {
    backgroundColor: 'white',
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterBadgeInactive: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: '#2563EB',
  },
  filterTextInactive: {
    color: '#64748B',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  loaderContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 48 - 12) / 2,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    height: 120,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
  },
  overlayBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
  },
  cardContent: {
    padding: 12,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  addNewCard: {
    width: (width - 48 - 12) / 2,
    height: 240,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  addNewIconCircle: {
    width: 64,
    height: 64,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addNewText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  addNewSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  formScroll: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  inputIconContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputWithIcon: {
    paddingLeft: 44,
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
  },
  textArea: {
    height: 100,
  },
  catSelectScroll: {
    flexDirection: 'row',
  },
  catSelectBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginRight: 8,
  },
  catSelectBadgeActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  catSelectText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  catSelectTextActive: {
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
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'white',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748B',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});