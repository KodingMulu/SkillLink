import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList 
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- 1. Definisi Interface ---
interface Contract {
  id: string;
  title: string;
  client: string;
  budget: string;
  deadline: string;
  status: 'in_progress' | 'review' | 'completed';
  progress: number;
  nextMilestone: string;
}

export default function FreelancerContractsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  // --- 2. Data Dummy ---
  const contracts: Contract[] = [
    {
      id: "CON-7829",
      title: "Modern E-Commerce Redesign",
      client: "Global Retail Co.",
      budget: "Rp 12.500.000",
      deadline: "15 Jan 2026",
      status: "in_progress",
      progress: 65,
      nextMilestone: "Integrasi Payment Gateway"
    },
    {
      id: "CON-7830",
      title: "SaaS Dashboard Analytics",
      client: "DataViz Startup",
      budget: "Rp 8.000.000",
      deadline: "28 Des 2025",
      status: "review",
      progress: 100,
      nextMilestone: "Final Feedback"
    },
    {
      id: "CON-7812",
      title: "Mobile App Bug Fixing",
      client: "Tech Solutions",
      budget: "Rp 3.500.000",
      deadline: "10 Des 2025",
      status: "completed",
      progress: 100,
      nextMilestone: "Proyek Selesai"
    }
  ];

  // --- 3. Fungsi Helper untuk Status ---
  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'in_progress': 
        return { label: 'In Progress', bg: '#eff6ff', text: '#2563eb', border: '#dbeafe' };
      case 'review': 
        return { label: 'Review', bg: '#fffbeb', text: '#d97706', border: '#fef3c7' };
      case 'completed': 
        return { label: 'Completed', bg: '#ecfdf5', text: '#059669', border: '#d1fae5' };
      default: 
        return { label: status, bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' };
    }
  };

  // --- 4. Komponen Render Proyek ---
  const renderContractItem = ({ item }: { item: Contract }) => {
    const status = getStatusConfig(item.status);

    return (
      <Card style={styles.contractCard}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={[styles.statusBadge, { backgroundColor: status.bg, borderColor: status.border }]}>
              <Text style={[styles.statusText, { color: status.text }]}>{status.label.toUpperCase()}</Text>
            </View>
            <Text style={styles.idText}>ID: {item.id}</Text>
          </View>

          <Text style={styles.contractTitle}>{item.title}</Text>
          
          <View style={styles.clientInfo}>
            <MaterialCommunityIcons name="briefcase-outline" size={16} color="#94a3b8" />
            <Text style={styles.infoText}>{item.client}</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#94a3b8" />
            <Text style={styles.infoText}>{item.deadline}</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={styles.labelSmall}>NEXT MILESTONE</Text>
                <Text style={styles.milestoneText}>{item.nextMilestone}</Text>
              </View>
              <Text style={styles.percentageText}>{item.progress}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${item.progress}%` }]} />
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.labelSmall}>TOTAL BUDGET</Text>
              <Text style={styles.budgetText}>{item.budget}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.chatBtn}>
                <MaterialCommunityIcons name="message-text-outline" size={20} color="#475569" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.manageBtn}>
                <Text style={styles.manageBtnText}>Kelola</Text>
                <MaterialCommunityIcons name="chevron-right" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Manajemen Kontrak</Text>
        <Text style={styles.mainSubtitle}>Kelola pekerjaan aktif Anda</Text>
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tabWrapper}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'active' && styles.tabButtonActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>Aktif (2)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'history' && styles.tabButtonActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>Riwayat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={contracts}
        renderItem={renderContractItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// --- 5. Stylesheet (Sudah Diperbaiki) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
  mainTitle: { fontSize: 28, fontWeight: '900', color: '#0f172a', letterSpacing: -0.5 },
  mainSubtitle: { fontSize: 14, color: '#64748b', marginTop: 4, fontWeight: '500' },
  tabContainer: { paddingHorizontal: 24, marginVertical: 20 },
  tabWrapper: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 6, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 16 },
  tabButtonActive: { backgroundColor: '#2563eb' },
  tabText: { fontSize: 14, fontWeight: 'bold', color: '#64748b' },
  tabTextActive: { color: '#fff' },
  listPadding: { paddingHorizontal: 24, paddingBottom: 40 },
  contractCard: { 
    borderRadius: 32, 
    backgroundColor: '#fff', 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    elevation: 0 
  },
  cardContent: { padding: 24 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statusBadge: { 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 100, 
    borderWidth: 1 
  },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  idText: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8' },
  contractTitle: { fontSize: 20, fontWeight: '900', color: '#0f172a', marginBottom: 8 },
  clientInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  infoText: { fontSize: 13, color: '#64748b', fontWeight: '600', marginLeft: 6 },
  dotSeparator: { marginHorizontal: 10, color: '#cbd5e1' },
  progressContainer: { 
    backgroundColor: '#f8fafc', 
    padding: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#f1f5f9',
    marginBottom: 24
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  labelSmall: { fontSize: 9, fontWeight: '900', color: '#94a3b8', letterSpacing: 1, marginBottom: 4 },
  milestoneText: { fontSize: 13, fontWeight: 'bold', color: '#475569' },
  percentageText: { fontSize: 14, fontWeight: '900', color: '#2563eb' },
  progressBarBg: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#2563eb', borderRadius: 4 },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9'
  },
  budgetText: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  actionButtons: { flexDirection: 'row', gap: 10 },
  chatBtn: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    backgroundColor: '#f8fafc', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  manageBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#2563eb', 
    paddingHorizontal: 20, 
    height: 48, 
    borderRadius: 14,
    elevation: 4
  },
  manageBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginRight: 4 }
});