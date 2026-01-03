import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: "E-Commerce Re-design",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&q=80",
  },
  {
    id: 2,
    title: "Mobile Banking App",
    category: "UI/UX Design",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&q=80",
  },
  {
    id: 3,
    title: "Brand Identity - TechFlow",
    category: "Graphic Design",
    image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=500&q=80",
  }
];

export default function PortfolioPage() {
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['Semua', 'Web Development', 'UI/UX Design', 'Graphic Design'];

  const filteredProjects = activeFilter === 'Semua' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  const renderProjectItem = ({ item }: { item: Project }) => (
    <Card style={styles.projectCard}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.projectImage} />
        <View style={styles.imageOverlay}>
          <TouchableOpacity style={styles.editIconBtn}>
            <MaterialCommunityIcons name="pencil" size={18} color="#0f172a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteIconBtn}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Card.Content style={styles.cardInfo}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category.toUpperCase()}</Text>
        </View>
        <Text style={styles.projectTitle}>{item.title}</Text>
        
        <View style={styles.cardDivider} />
        
        <TouchableOpacity style={styles.detailBtn}>
          {/* PERBAIKAN: name diubah dari 'external-link' menjadi 'open-in-new' */}
          <MaterialCommunityIcons name="open-in-new" size={16} color="#94a3b8" />
          <Text style={styles.detailBtnText}>Lihat Detail Proyek</Text>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.mainTitle}>Portofolio Saya</Text>
          <Text style={styles.mainSubtitle}>Pamerkan hasil kerja terbaik Anda</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalOpen(true)}>
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setActiveFilter(cat)}
              style={[styles.filterBtn, activeFilter === cat && styles.filterBtnActive]}
            >
              <Text style={[styles.filterBtnText, activeFilter === cat && styles.filterBtnTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProjects}
        renderItem={renderProjectItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listPadding}
        ListFooterComponent={
          <TouchableOpacity style={styles.addQuickCard} onPress={() => setIsModalOpen(true)}>
            <View style={styles.addQuickIcon}>
              <MaterialCommunityIcons name="plus" size={32} color="#2563eb" />
            </View>
            <Text style={styles.addQuickText}>Tambah Karya Baru</Text>
          </TouchableOpacity>
        }
      />

      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tambah Proyek</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NAMA PROYEK</Text>
                <TextInput style={styles.textInput} placeholder="Masukkan judul..." placeholderTextColor="#cbd5e1" />
              </View>
              <TouchableOpacity style={styles.uploadBox}>
                <MaterialCommunityIcons name="image-outline" size={40} color="#cbd5e1" />
                <Text style={styles.uploadLabel}>UPLOAD GAMBAR</Text>
              </TouchableOpacity>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Simpan Karya</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20 },
  mainTitle: { fontSize: 26, fontWeight: '900', color: '#0f172a' },
  mainSubtitle: { fontSize: 14, color: '#64748b' },
  addButton: { width: 52, height: 52, borderRadius: 18, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  filterContainer: { marginTop: 20 },
  filterScroll: { paddingHorizontal: 24 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 10 },
  filterBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  filterBtnText: { fontSize: 13, fontWeight: 'bold', color: '#64748b' },
  filterBtnTextActive: { color: '#fff' },
  listPadding: { padding: 24, paddingBottom: 40 },
  projectCard: { borderRadius: 28, backgroundColor: '#fff', marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' },
  imageWrapper: { height: 200, backgroundColor: '#f1f5f9' },
  projectImage: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', top: 12, right: 12, flexDirection: 'row' },
  editIconBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  deleteIconBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(239, 68, 68, 0.9)', justifyContent: 'center', alignItems: 'center' },
  cardInfo: { padding: 20 },
  categoryBadge: { backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10 },
  categoryBadgeText: { fontSize: 10, fontWeight: '900', color: '#2563eb' },
  projectTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  cardDivider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 15 },
  detailBtn: { flexDirection: 'row', alignItems: 'center' },
  detailBtnText: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginLeft: 6 },
  addQuickCard: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#cbd5e1', borderRadius: 28, padding: 40, alignItems: 'center', backgroundColor: '#fff' },
  addQuickIcon: { width: 60, height: 60, borderRadius: 18, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  addQuickText: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  modalBody: { padding: 24 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 10, fontWeight: '900', color: '#94a3b8', marginBottom: 8 },
  textInput: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, fontSize: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  uploadBox: { height: 150, borderWidth: 2, borderStyle: 'dashed', borderColor: '#cbd5e1', borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  uploadLabel: { fontSize: 11, fontWeight: '900', color: '#94a3b8', marginTop: 10 },
  modalFooter: { paddingHorizontal: 24 },
  saveBtn: { backgroundColor: '#2563eb', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' }
});