import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity, Animated, FlatList } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DrawerMenu from '../components/DrawerMenu';

// Data Mockup: 10 Proyek Aktif
const PROJECTS_DATA = [
  { id: '1', title: 'Redesain UI/UX E-Wallet', client: 'FinTech Asia', progress: 0.75, status: 'Revisi', time: '2 Hari lagi', color: '#ef4444' },
  { id: '2', title: 'Mobile App SkillLink', client: 'Internal', progress: 0.45, status: 'Proses', time: '5 Hari lagi', color: '#3b82f6' },
  { id: '3', title: 'Dashboard Admin CMS', client: 'TechStart Inc', progress: 0.90, status: 'Proses', time: '1 Hari lagi', color: '#3b82f6' },
  { id: '4', title: 'Landing Page Kopi', client: 'Nusantara Brew', progress: 1.0, status: 'Selesai', time: 'Selesai', color: '#10b981' },
  { id: '5', title: 'API Integration', client: 'Data Logistic', progress: 0.20, status: 'Baru', time: '10 Hari lagi', color: '#f59e0b' },
  { id: '6', title: 'E-Commerce Web', client: 'Fashion Style', progress: 0.60, status: 'Proses', time: '4 Hari lagi', color: '#3b82f6' },
  { id: '7', title: 'Bug Fixing Payment', client: 'Pay-Lo', progress: 0.15, status: 'Revisi', time: '1 Hari lagi', color: '#ef4444' },
  { id: '8', title: 'Optimasi Database', client: 'Cloud System', progress: 0.85, status: 'Proses', time: '3 Hari lagi', color: '#3b82f6' },
  { id: '9', title: 'Slicing Figma to RN', client: 'Creative Dev', progress: 0.50, status: 'Proses', time: '6 Hari lagi', color: '#3b82f6' },
  { id: '10', title: 'Testing & QA', client: 'App Quality', progress: 0.30, status: 'Proses', time: '8 Hari lagi', color: '#3b82f6' },
];

export default function HomePage() {
  const router = useRouter();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-300));

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, { toValue: -300, duration: 300, useNativeDriver: true }).start(() => {
      setDrawerVisible(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- APP BAR --- */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <MaterialCommunityIcons name="menu" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="briefcase" size={24} color="#3b82f6" />
          <Text style={styles.logoText}>SkillLink</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/notifications')}>
          <MaterialCommunityIcons name="bell" size={26} color="#1a2533" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Halo, Nazril! 👋</Text>
          <Text style={styles.subtitle}>Berikut aktivitas terbaru proyekmu.</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#d1fae5' }]}>
                <MaterialCommunityIcons name="wallet" size={24} color="#10b981" />
              </View>
              <Text style={styles.statLabel}>Pendapatan</Text>
              <Text style={styles.statValue}>Rp 12.5jt</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard} onPress={() => router.push('/proyek')}>
            <Card.Content style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#dbeafe' }]}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.statLabel}>Proyek Aktif</Text>
              <Text style={styles.statValue}>10</Text> 
            </Card.Content>
          </Card>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Proyek Berjalan</Text>
          <TouchableOpacity onPress={() => router.push('/proyek')}>
            <Text style={styles.viewAllText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {/* List 10 Proyek */}
        {PROJECTS_DATA.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => router.push('/proyek')}>
            <Card style={styles.projectCard}>
              <Card.Content>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectTitle}>{item.title}</Text>
                  <View style={[styles.revisionBadge, { backgroundColor: item.color + '20' }]}>
                    <Text style={[styles.revisionText, { color: item.color }]}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.projectClient}>{item.client} • {item.time}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${item.progress * 100}%`, backgroundColor: item.color }]} />
                  </View>
                  <Text style={styles.progressText}>{item.progress * 100}%</Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* --- MODAL DRAWER --- */}
      <Modal visible={drawerVisible} transparent animationType="none" onRequestClose={closeDrawer}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={closeDrawer} />
          <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: slideAnim }] }]}>
            <DrawerMenu visible={drawerVisible} onClose={closeDrawer} />
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  menuButton: { padding: 8 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  notificationButton: { padding: 6, position: 'relative' },
  notificationDot: {
    position: 'absolute', top: 6, right: 8, width: 10, height: 10,
    borderRadius: 5, backgroundColor: '#ef4444', borderWidth: 1.5, borderColor: '#ffffff',
  },
  content: { flex: 1, padding: 16 },
  greeting: { marginBottom: 16 },
  greetingText: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b' },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, elevation: 2 },
  cardContent: { padding: 16 },
  iconContainer: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statLabel: { fontSize: 12, color: '#64748b' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  viewAllText: { color: '#3b82f6', fontWeight: '600' },
  projectCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, elevation: 1 },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  projectTitle: { fontSize: 16, fontWeight: '600', flex: 1 },
  revisionBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 },
  revisionText: { fontSize: 11, fontWeight: 'bold' },
  projectClient: { color: '#64748b', marginVertical: 8 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#e2e8f0', borderRadius: 3 },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 12, fontWeight: 'bold' },
  modalOverlay: { flex: 1, flexDirection: 'row' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  drawerContainer: { width: '80%', maxWidth: 300, backgroundColor: '#fff', height: '100%' },
});