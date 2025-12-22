import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity, Animated, FlatList } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DrawerMenu from '../components/DrawerMenu';

export default function HomePage() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-300));

  // Data Dummy Notifikasi
  const notifications = [
    { id: '1', title: 'Proyek Baru', desc: 'TechStart Inc mengundang Anda.', time: '2m yang lalu' },
    { id: '2', title: 'Revisi Diterima', desc: 'UI/UX E-Wallet telah disetujui.', time: '1j yang lalu' },
  ];

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
        
        {/* Lonceng yang bisa diklik */}
        <TouchableOpacity 
          style={styles.notificationButton} 
          onPress={() => setNotificationsVisible(true)}
        >
          <MaterialCommunityIcons name="bell" size={26} color="#1a2533" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* --- MODAL NOTIFIKASI (Popup) --- */}
      <Modal
        visible={notificationsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNotificationsVisible(false)}
      >
        <TouchableOpacity 
          style={styles.notiOverlay} 
          activeOpacity={1} 
          onPress={() => setNotificationsVisible(false)}
        >
          <View style={styles.notificationPopup}>
            <View style={styles.popupHeader}>
              <Text style={styles.popupTitle}>Notifikasi</Text>
              <TouchableOpacity onPress={() => setNotificationsVisible(false)}>
                <MaterialCommunityIcons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            <Divider />
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.notiItem}>
                  <Text style={styles.notiTitle}>{item.title}</Text>
                  <Text style={styles.notiDesc}>{item.desc}</Text>
                  <Text style={styles.notiTime}>{item.time}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* --- MODAL DRAWER --- */}
      <Modal visible={drawerVisible} transparent animationType="none" onRequestClose={closeDrawer}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={closeDrawer} />
          <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: slideAnim }] }]}>
            <DrawerMenu visible={drawerVisible} onClose={closeDrawer} userName="Nazril" userEmail="nazril@skilllink.com" />
          </Animated.View>
        </View>
      </Modal>

      {/* --- MAIN CONTENT (KONTEN DASHBOARD) --- */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Halo, Nazril! 👋</Text>
          <Text style={styles.subtitle}>Berikut aktivitas terbaru proyekmu.</Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color="#94a3b8" />
          <Text style={styles.searchPlaceholder}>Cari proyek atau pesan...</Text>
        </TouchableOpacity>

        {/* Stats Cards */}
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

          <Card style={styles.statCard}>
            <Card.Content style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#dbeafe' }]}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.statLabel}>Proyek Aktif</Text>
              <Text style={styles.statValue}>3</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Running Projects Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Proyek Berjalan</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>Lihat Semua</Text></TouchableOpacity>
        </View>

        {/* Project Card */}
        <Card style={styles.projectCard}>
          <Card.Content>
            <View style={styles.projectHeader}>
              <Text style={styles.projectTitle}>Redesain UI/UX E-Wallet</Text>
              <View style={styles.revisionBadge}><Text style={styles.revisionText}>Revisi</Text></View>
            </View>
            <Text style={styles.projectClient}>FinTech Asia • 2 Hari lagi</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}><View style={[styles.progressFill, { width: '75%' }]} /></View>
              <Text style={styles.progressText}>75%</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
  // Style Notifikasi
  notiOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 60, paddingRight: 16 },
  notificationPopup: { width: 280, backgroundColor: '#fff', borderRadius: 12, padding: 12, elevation: 5 },
  popupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  popupTitle: { fontWeight: 'bold', fontSize: 16, color: '#1e293b' },
  notiItem: { paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#f1f5f9' },
  notiTitle: { fontWeight: '600', fontSize: 14, color: '#1e293b' },
  notiDesc: { fontSize: 12, color: '#64748b' },
  notiTime: { fontSize: 10, color: '#94a3b8', marginTop: 4 },
  
  // Drawer Styles
  modalOverlay: { flex: 1, flexDirection: 'row' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  drawerContainer: { width: '80%', maxWidth: 300, backgroundColor: '#fff', height: '100%' },

  // Dashboard Styles
  content: { flex: 1, padding: 16 },
  greeting: { marginBottom: 16 },
  greetingText: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0', gap: 10 },
  searchPlaceholder: { color: '#94a3b8' },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: '#fff', borderRadius: 12 },
  cardContent: { padding: 16 },
  iconContainer: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statLabel: { fontSize: 12, color: '#64748b' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  viewAllText: { color: '#3b82f6', fontWeight: '600' },
  projectCard: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12 },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  projectTitle: { fontSize: 16, fontWeight: '600' },
  revisionBadge: { backgroundColor: '#fee2e2', padding: 4, borderRadius: 6 },
  revisionText: { fontSize: 11, color: '#ef4444' },
  projectClient: { color: '#64748b', marginVertical: 8 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#e2e8f0', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: '#10b981' },
  progressText: { fontSize: 12 },
});