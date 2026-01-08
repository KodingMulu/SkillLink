import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ScrollView, RefreshControl
} from 'react-native';
import {
  Flag, Search, Filter, Download,
  AlertTriangle, CheckCircle, Clock,
  Eye, MoreVertical, ShieldAlert,
  User, Briefcase, MessageSquare
} from 'lucide-react-native';
import ModerationPolicyModal from './components/ModerationPolicyModal';

const REPORTS_DATA = [
  { id: "REP-001", reporter: "Budi Santoso", reportedItem: "Nazril Afandi", type: "User", reason: "Penipuan / Scam", date: "2023-12-17 14:30", priority: "high", status: "pending" },
  { id: "REP-002", reporter: "Siska Putri", reportedItem: "Project Landing Page", type: "Project", reason: "Konten Tidak Pantas", date: "2023-12-17 10:15", priority: "medium", status: "resolved" },
  { id: "REP-003", reporter: "Ahmad Rizki", reportedItem: "Chat ID #8821", type: "Message", reason: "Pelecehan / Harassment", date: "2023-12-16 16:45", priority: "high", status: "pending" },
  { id: "REP-004", reporter: "Indah Permata", reportedItem: "PT Startup Jaya", type: "User", reason: "Spam", date: "2023-12-16 09:20", priority: "low", status: "dismissed" },
  { id: "REP-005", reporter: "Rizky Fauzi", reportedItem: "Desain Logo V2", type: "Project", reason: "Pelanggaran Hak Cipta", date: "2023-12-15 11:30", priority: "high", status: "pending" },
  { id: "REP-006", reporter: "Sarah Wijaya", reportedItem: "Budi Santoso", type: "User", reason: "Profil Palsu", date: "2023-12-15 08:00", priority: "medium", status: "resolved" },
];

export default function ReportsManagementScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filteredReports = REPORTS_DATA.filter(report => {
    const matchesSearch = report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedItem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'resolved': return { bg: '#D1FAE5', text: '#047857', label: 'Resolved' };
      case 'pending': return { bg: '#FFEDD5', text: '#C2410C', label: 'Pending' };
      case 'dismissed': return { bg: '#F1F5F9', text: '#475569', label: 'Dismissed' };
      default: return { bg: '#F1F5F9', text: '#475569', label: status };
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return '#DC2626';
      case 'medium': return '#EA580C';
      case 'low': return '#2563EB';
      default: return '#64748B';
    }
  };

  const getTypeIcon = (type: string) => {
    const props = { size: 14, color: '#475569' };
    switch (type) {
      case 'User': return <User {...props} />;
      case 'Project': return <Briefcase {...props} />;
      case 'Message': return <MessageSquare {...props} />;
      default: return <Flag {...props} />;
    }
  };

  const renderStatCard = (icon: React.ReactNode, label: string, value: string, color: string) => {
    const colorMap: any = {
      red: '#FEF2F2',
      orange: '#FFF7ED',
      emerald: '#ECFDF5',
      slate: '#F8FAFC'
    };
    return (
      <View style={styles.statCard}>
        <View style={[styles.statIconContainer, { backgroundColor: colorMap[color] }]}>
          {icon}
        </View>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    );
  };

  const renderReportItem = ({ item }: { item: typeof REPORTS_DATA[0] }) => {
    const statusStyle = getStatusStyle(item.status);
    const priorityColor = getPriorityStyle(item.priority);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardId}>{item.id}</Text>
            <Text style={styles.cardDate}>{item.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.reporterRow}>
            <Text style={styles.label}>Pelapor:</Text>
            <Text style={styles.value}>{item.reporter}</Text>
          </View>
          
          <View style={styles.itemBox}>
            <View style={styles.typeBadge}>
              {getTypeIcon(item.type)}
              <Text style={styles.typeText}>{item.type}</Text>
            </View>
            <Text style={styles.itemText} numberOfLines={1}>{item.reportedItem}</Text>
          </View>

          <View style={styles.reasonRow}>
            <Text style={styles.reasonText}>{item.reason}</Text>
            <View style={styles.priorityBadge}>
              <AlertTriangle size={12} color={priorityColor} />
              <Text style={[styles.priorityText, { color: priorityColor }]}>
                {item.priority.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.actionButton}>
            <Eye size={18} color="#2563EB" />
            <Text style={styles.actionText}>Detail</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MoreVertical size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Laporan</Text>
          <Text style={styles.subtitle}>Tinjau laporan masuk</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.exportBtn}>
            <Download size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.policyBtn}
            onPress={() => setIsPolicyModalOpen(true)}
          >
            <ShieldAlert size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          {renderStatCard(<Flag size={20} color="#DC2626" />, "Total", "156", "red")}
          {renderStatCard(<AlertTriangle size={20} color="#EA580C" />, "Menunggu", "23", "orange")}
          {renderStatCard(<CheckCircle size={20} color="#059669" />, "Selesai", "128", "emerald")}
          {renderStatCard(<Clock size={20} color="#475569" />, "Respon", "4.2 Jam", "slate")}
        </ScrollView>

        <View style={styles.filterSection}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari laporan..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {['all', 'pending', 'resolved', 'dismissed'].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setStatusFilter(status)}
                style={[
                  styles.filterPill,
                  statusFilter === status && styles.filterPillActive
                ]}
              >
                <Text style={[
                  styles.filterText,
                  statusFilter === status && styles.filterTextActive
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.listContainer}>
          {filteredReports.map(item => (
            <View key={item.id}>
              {renderReportItem({ item })}
            </View>
          ))}
        </View>
      </ScrollView>

      <ModerationPolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  exportBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  policyBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statsScroll: {
    padding: 20,
    paddingBottom: 10,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  filterSection: {
    padding: 20,
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: 'white',
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  filterTextActive: {
    color: 'white',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  cardDate: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    height: 24,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 12,
    gap: 10,
  },
  reporterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    width: 60,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  itemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  itemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1E293B',
    flex: 1,
  },
  reasonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reasonText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  iconButton: {
    padding: 8,
  },
});