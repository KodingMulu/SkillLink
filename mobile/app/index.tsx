// File: app/index.tsx atau app/(tabs)/index.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity, Animated } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DrawerMenu from '../components/DrawerMenu';

export default function HomePage() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-300));

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setDrawerVisible(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <MaterialCommunityIcons name="menu" size={24} color="#1e293b" />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="briefcase" size={24} color="#3b82f6" />
          <Text style={styles.logoText}>SkillLink</Text>
        </View>
        
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialCommunityIcons name="bell" size={24} color="#1e293b" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Drawer Modal */}
      <Modal
        visible={drawerVisible}
        transparent
        animationType="none"
        onRequestClose={closeDrawer}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground} 
            activeOpacity={1} 
            onPress={closeDrawer}
          />
          <Animated.View 
            style={[
              styles.drawerContainer,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <DrawerMenu 
              visible={drawerVisible} 
              onClose={closeDrawer}
              userName="Nazril"
              userEmail="nazril@skilllink.com"
            />
          </Animated.View>
        </View>
      </Modal>

      {/* Main Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Halo, Nazril! 👋</Text>
          <Text style={styles.subtitle}>
            Berikut aktivitas terbaru proyekmu.
          </Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color="#94a3b8" />
          <Text style={styles.searchPlaceholder}>
            Cari proyek atau pesan...
          </Text>
        </TouchableOpacity>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {/* Income Card */}
          <Card style={styles.statCard}>
            <Card.Content style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#d1fae5' }]}>
                <MaterialCommunityIcons name="wallet" size={24} color="#10b981" />
              </View>
              <Text style={styles.statLabel}>Pendapatan</Text>
              <Text style={styles.statValue}>Rp 12.5jt</Text>
              <View style={styles.changeContainer}>
                <MaterialCommunityIcons name="arrow-up" size={16} color="#10b981" />
                <Text style={styles.changeText}>+12%</Text>
              </View>
            </Card.Content>
          </Card>

          {/* Active Projects Card */}
          <Card style={styles.statCard}>
            <Card.Content style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#dbeafe' }]}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.statLabel}>Proyek Aktif</Text>
              <Text style={styles.statValue}>3</Text>
            </Card.Content>
          </Card>

          {/* Completed Card */}
          <Card style={styles.statCard}>
            <Card.Content style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#ede9fe' }]}>
                <MaterialCommunityIcons name="check-circle" size={24} color="#8b5cf6" />
              </View>
              <Text style={styles.statLabel}>Selesai</Text>
              <Text style={styles.statValue}>12</Text>
            </Card.Content>
          </Card>

          {/* Rating Card */}
          <Card style={styles.statCard}>
            <Card.Content style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#fef3c7' }]}>
                <MaterialCommunityIcons name="star" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.statLabel}>Rating</Text>
              <Text style={styles.statValue}>4.9</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Running Projects Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Proyek Berjalan</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {/* Project Card */}
        <Card style={styles.projectCard}>
          <Card.Content>
            <View style={styles.projectHeader}>
              <Text style={styles.projectTitle}>Redesain UI/UX E-Wallet</Text>
              <View style={styles.revisionBadge}>
                <Text style={styles.revisionText}>Revisi</Text>
              </View>
            </View>
            <Text style={styles.projectClient}>FinTech Asia • 2 Hari lagi</Text>
            
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '75%' }]} />
              </View>
              <Text style={styles.progressText}>75%</Text>
            </View>

            {/* Action Icons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="message" size={20} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="file-document" size={20} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="dots-horizontal" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Another Project Card */}
        <Card style={styles.projectCard}>
          <Card.Content>
            <View style={styles.projectHeader}>
              <Text style={styles.projectTitle}>Logo Design Startup Tech</Text>
              <View style={[styles.revisionBadge, { backgroundColor: '#dbeafe' }]}>
                <Text style={[styles.revisionText, { color: '#3b82f6' }]}>Progress</Text>
              </View>
            </View>
            <Text style={styles.projectClient}>TechStart Inc • 5 Hari lagi</Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '45%', backgroundColor: '#3b82f6' }]} />
              </View>
              <Text style={styles.progressText}>45%</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="message" size={20} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="file-document" size={20} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="dots-horizontal" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
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
  menuButton: {
    padding: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    width: '80%',
    maxWidth: 300,
    backgroundColor: '#fff',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  greeting: {
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  searchPlaceholder: {
    color: '#94a3b8',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  revisionBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  revisionText: {
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '600',
  },
  projectClient: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    minWidth: 35,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionButton: {
    padding: 8,
  },
});