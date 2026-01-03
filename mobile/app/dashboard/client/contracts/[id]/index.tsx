import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// --- INTERFACE STYLES ---
interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  backText: TextStyle;
  titleRow: ViewStyle;
  contractTitle: TextStyle;
  freelancerName: TextStyle;
  actionRow: ViewStyle;
  btnChat: ViewStyle;
  btnFinish: ViewStyle;
  scrollContent: ViewStyle;
  escrowCard: ViewStyle;
  escrowBadge: ViewStyle;
  escrowLabel: TextStyle;
  escrowAmount: TextStyle;
  divider: ViewStyle;
  budgetRow: ViewStyle;
  budgetLabel: TextStyle;
  budgetValue: TextStyle;
  sectionTitle: TextStyle;
  milestoneCard: ViewStyle;
  milestoneItem: ViewStyle;
  milestoneIcon: ViewStyle;
  milestoneContent: ViewStyle;
  mTitle: TextStyle;
  mSub: TextStyle;
  mStatusTag: ViewStyle;
  mStatusText: TextStyle;
  btnApprove: ViewStyle;
  btnApproveText: TextStyle;
  deliverableCard: ViewStyle;
  fileBox: ViewStyle;
  fileIcon: ViewStyle;
  fileName: TextStyle;
  fileMeta: TextStyle;
  infoCard: ViewStyle;
  infoItem: ViewStyle;
  infoLabel: TextStyle;
  infoValue: TextStyle;
}

export default function ContractManagementPage() {
  const router = useRouter();

  const [milestones] = useState([
    { id: 1, title: "Riset & Wireframe", budget: "Rp 1.500.000", status: "completed", date: "12 Des 2025" },
    { id: 2, title: "Desain UI High-Fidelity", budget: "Rp 2.000.000", status: "in_review", date: "20 Des 2025" },
    { id: 3, title: "Final Handover & Asset", budget: "Rp 1.500.000", status: "pending", date: "28 Des 2025" },
  ]);

  const contract = {
    title: "Redesain Aplikasi Mobile E-Commerce",
    freelancer: "Nazril Afandi",
    totalBudget: "Rp 5.000.000",
    escrowBalance: "Rp 3.500.000",
    startDate: "01 Des 2025",
    deadline: "30 Des 2025",
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER & NAV */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#64748b" />
          <Text style={styles.backText}>Dashboard</Text>
        </TouchableOpacity>
        
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.contractTitle}>{contract.title}</Text>
            <Text style={styles.freelancerName}>Kontrak: <Text style={{ color: '#2563eb' }}>{contract.freelancer}</Text></Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.btnChat}>
            <MaterialCommunityIcons name="message-outline" size={18} color="#475569" />
            <Text style={{ fontWeight: 'bold', color: '#475569' }}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnFinish}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Selesaikan</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ESCROW CARD (DARK MODE STYLE) */}
        <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.escrowCard}>
          <View style={styles.escrowBadge}>
            <MaterialCommunityIcons name="shield-check" size={14} color="#10b981" />
            <Text style={{ color: '#94a3b8', fontSize: 10, fontWeight: 'bold', marginLeft: 4 }}>DANA ESCROW AMAN</Text>
          </View>
          <Text style={styles.escrowLabel}>Sisa Dana Terlindungi</Text>
          <Text style={styles.escrowAmount}>{contract.escrowBalance}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Total Kontrak</Text>
            <Text style={styles.budgetValue}>{contract.totalBudget}</Text>
          </View>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Sudah Dibayar</Text>
            <Text style={[styles.budgetValue, { color: '#10b981' }]}>Rp 1.500.000</Text>
          </View>
        </LinearGradient>

        {/* MILESTONES */}
        <Text style={styles.sectionTitle}>Milestone Proyek</Text>
        <Card style={styles.milestoneCard}>
          {milestones.map((m, idx) => (
            <View key={m.id} style={[styles.milestoneItem, idx === milestones.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={[styles.milestoneIcon, { backgroundColor: m.status === 'completed' ? '#ecfdf5' : m.status === 'in_review' ? '#fffbeb' : '#f1f5f9' }]}>
                <MaterialCommunityIcons 
                  name={m.status === 'completed' ? "check-circle" : "clock-outline"} 
                  size={20} 
                  color={m.status === 'completed' ? "#10b981" : m.status === 'in_review' ? "#f59e0b" : "#94a3b8"} 
                />
              </View>
              <View style={styles.milestoneContent}>
                <Text style={styles.mTitle}>{m.title}</Text>
                <Text style={styles.mSub}>{m.budget} • {m.date}</Text>
              </View>
              {m.status === 'in_review' ? (
                <TouchableOpacity style={styles.btnApprove}>
                  <Text style={styles.btnApproveText}>Bayar</Text>
                </TouchableOpacity>
              ) : (
                <View style={[styles.mStatusTag, { backgroundColor: m.status === 'completed' ? '#f0fdf4' : '#f8fafc' }]}>
                  <Text style={[styles.mStatusText, { color: m.status === 'completed' ? '#166534' : '#94a3b8' }]}>
                    {m.status.replace('_', ' ')}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </Card>

        {/* DELIVERABLES */}
        <Text style={styles.sectionTitle}>Hasil Kerja</Text>
        <View style={styles.deliverableCard}>
          <View style={styles.fileBox}>
            <View style={styles.fileIcon}>
              <MaterialCommunityIcons name="download" size={24} color="#2563eb" />
            </View>
            <Text style={styles.fileName}>v2-final-design-mobile.zip</Text>
            <Text style={styles.fileMeta}>Dikirim 2 jam yang lalu</Text>
            <TouchableOpacity style={{ marginTop: 12 }}>
              <Text style={{ color: '#2563eb', fontWeight: 'bold', fontSize: 14 }}>Unduh File</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CONTRACT INFO */}
        <Card style={styles.infoCard}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons name="calendar" size={18} color="#94a3b8" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.infoLabel}>TANGGAL MULAI</Text>
              <Text style={styles.infoValue}>{contract.startDate}</Text>
            </View>
          </View>
          <View style={[styles.infoItem, { marginTop: 16 }]}>
            <MaterialCommunityIcons name="clock-alert-outline" size={18} color="#94a3b8" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.infoLabel}>TENGGAT WAKTU</Text>
              <Text style={styles.infoValue}>{contract.deadline}</Text>
            </View>
          </View>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<Styles>({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#f1f5f9' },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backText: { color: '#64748b', fontSize: 14, fontWeight: '600', marginLeft: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start' },
  contractTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  freelancerName: { fontSize: 14, color: '#64748b', marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btnChat: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  btnFinish: { flex: 1, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', borderRadius: 12, paddingVertical: 10 },
  
  scrollContent: { padding: 20 },
  
  escrowCard: { padding: 24, borderRadius: 28, marginBottom: 24 },
  escrowBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  escrowLabel: { color: '#94a3b8', fontSize: 13 },
  escrowAmount: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 4 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 20 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  budgetLabel: { color: '#94a3b8', fontSize: 13 },
  budgetValue: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  milestoneCard: { borderRadius: 24, backgroundColor: '#fff', paddingVertical: 8, elevation: 0, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 24 },
  milestoneItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#f8fafc' },
  milestoneIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  milestoneContent: { flex: 1, marginLeft: 12 },
  mTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  mSub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  mStatusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  mStatusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  btnApprove: { backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  btnApproveText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  deliverableCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 24 },
  fileBox: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#f1f5f9', borderRadius: 20, padding: 24, alignItems: 'center' },
  fileIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  fileName: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  fileMeta: { fontSize: 12, color: '#94a3b8', marginTop: 4 },

  infoCard: { padding: 20, borderRadius: 24, backgroundColor: '#fff', elevation: 0, borderWidth: 1, borderColor: '#f1f5f9' },
  infoItem: { flexDirection: 'row', alignItems: 'center' },
  infoLabel: { fontSize: 10, color: '#94a3b8', fontWeight: 'bold' },
  infoValue: { fontSize: 14, color: '#0f172a', fontWeight: '600', marginTop: 2 },
});