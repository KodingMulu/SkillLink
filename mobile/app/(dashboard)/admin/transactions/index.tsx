import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, RefreshControl, ScrollView
} from 'react-native';
import {
  DollarSign, Search, Filter, Download,
  ArrowUpRight, Clock, CheckCircle2, XCircle,
  MoreVertical, FileText, Landmark, Wallet, CreditCard
} from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaxReportModal from './components/TaxReportModal';

interface TransactionStatApi {
  type: "total_volume" | "success" | "pending" | "failed";
  label: string;
  value: number;
  growth?: number;
  color: "blue" | "emerald" | "orange" | "red";
}

const TRANSACTIONS_DATA = [
  { id: "TX-90210", user: "Budi Santoso", project: "Redesain Aplikasi Mobile", amount: "Rp 15.000.000", method: "Bank Transfer", status: "success", date: "2023-12-15 14:30" },
  { id: "TX-90211", user: "PT Digital Innovation", project: "Top Up Saldo", amount: "Rp 25.000.000", method: "Landmark", status: "pending", date: "2023-12-16 09:15" },
  { id: "TX-90212", user: "Sarah Wijaya", project: "Withdrawal", amount: "Rp 5.200.000", method: "Wallet", status: "success", date: "2023-12-16 10:45" },
  { id: "TX-90213", user: "Ahmad Rizki", project: "Audit Keamanan", amount: "Rp 40.000.000", method: "Bank Transfer", status: "failed", date: "2023-12-14 16:20" },
  { id: "TX-90214", user: "Indah Permata", project: "Landing Page", amount: "Rp 3.500.000", method: "Credit Card", status: "success", date: "2023-12-17 08:00" },
  { id: "TX-90215", user: "Rizky Fauzi", project: "API E-commerce", amount: "Rp 8.500.000", method: "Wallet", status: "pending", date: "2023-12-17 11:30" },
];

export default function TransactionManagementScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [stats, setStats] = useState<TransactionStatApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');
      // Simulasi API Stats, ganti dengan endpoint asli jika sudah ada
      // const res = await axios.get(`${apiUrl}/user/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
      // setStats(res.data.transactionStats);
      
      // Mock data sementara agar UI tampil
      setStats([
        { type: "total_volume", label: "Total Volume", value: 150000000, growth: 12.5, color: "blue" },
        { type: "success", label: "Berhasil", value: 124, growth: 5.2, color: "emerald" },
        { type: "pending", label: "Menunggu", value: 12, growth: -2.1, color: "orange" },
        { type: "failed", label: "Gagal", value: 5, growth: 0, color: "red" },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'success': return { bg: '#D1FAE5', text: '#047857', label: 'Success' };
      case 'pending': return { bg: '#FFEDD5', text: '#C2410C', label: 'Pending' };
      case 'failed': return { bg: '#FEE2E2', text: '#B91C1C', label: 'Failed' };
      default: return { bg: '#F1F5F9', text: '#475569', label: status };
    }
  };

  const getMethodIcon = (method: string) => {
    const props = { size: 14, color: '#475569' };
    switch (method) {
      case 'Bank Transfer': return <Landmark {...props} />;
      case 'Wallet': return <Wallet {...props} />;
      case 'Credit Card': return <CreditCard {...props} />;
      default: return <DollarSign {...props} />;
    }
  };

  const getStatIcon = (type: string, color: string) => {
    const props = { size: 24, color };
    switch (type) {
      case 'total_volume': return <ArrowUpRight {...props} />;
      case 'success': return <CheckCircle2 {...props} />;
      case 'pending': return <Clock {...props} />;
      case 'failed': return <XCircle {...props} />;
      default: return <DollarSign {...props} />;
    }
  };

  const filteredTransactions = TRANSACTIONS_DATA.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tx.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderStatCard = (item: TransactionStatApi) => {
    const iconColor = item.color === 'blue' ? '#2563EB' : item.color === 'emerald' ? '#059669' : item.color === 'orange' ? '#EA580C' : '#DC2626';
    const bgIcon = item.color === 'blue' ? '#EFF6FF' : item.color === 'emerald' ? '#ECFDF5' : item.color === 'orange' ? '#FFF7ED' : '#FEF2F2';

    let displayValue = item.value.toString();
    if (item.type === 'total_volume') {
      displayValue = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        notation: "compact", 
        maximumFractionDigits: 1
      }).format(item.value);
    } else {
      displayValue = item.value.toLocaleString('id-ID');
    }

    return (
      <View key={item.type} style={styles.statCard}>
        <View style={[styles.statHeader]}>
          <View style={[styles.statIconContainer, { backgroundColor: bgIcon }]}>
            {getStatIcon(item.type, iconColor)}
          </View>
          {item.growth !== undefined && (
            <View style={styles.trendBadge}>
              <Text style={styles.trendText}>
                {item.growth > 0 ? '+' : ''}{item.growth}%
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.statLabel}>{item.label}</Text>
        <Text style={styles.statValue}>{displayValue}</Text>
      </View>
    );
  };

  const renderTransactionItem = ({ item }: { item: typeof TRANSACTIONS_DATA[0] }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.txId}>{item.id}</Text>
            <Text style={styles.txDate}>{item.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <Text style={styles.userText}>{item.user}</Text>
          <Text style={styles.projectText}>{item.project}</Text>
          
          <View style={styles.cardFooter}>
            <View style={styles.methodBadge}>
              {getMethodIcon(item.method)}
              <Text style={styles.methodText}>{item.method}</Text>
            </View>
            <Text style={styles.amountText}>{item.amount}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Transaksi</Text>
          <Text style={styles.subtitle}>Pantau arus kas</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => setIsTaxModalOpen(true)}
          >
            <FileText size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      >
        {/* Stats Section */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          {loading ? (
             <ActivityIndicator size="small" color="#2563EB" />
          ) : stats.map(renderStatCard)}
        </ScrollView>

        {/* Filters */}
        <View style={styles.filterSection}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari transaksi..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {['all', 'success', 'pending', 'failed'].map((status) => (
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

        {/* List */}
        <View style={styles.listContainer}>
          {filteredTransactions.map(item => (
            <View key={item.id}>
              {renderTransactionItem({ item })}
            </View>
          ))}
          {filteredTransactions.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Tidak ada transaksi ditemukan.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Tax Report Modal */}
      <TaxReportModal 
        isOpen={isTaxModalOpen} 
        onClose={() => setIsTaxModalOpen(false)} 
        onSuccess={() => console.log("Report Generated")}
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
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
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
    minWidth: 150,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statIconContainer: {
    padding: 8,
    borderRadius: 10,
  },
  trendBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    justifyContent: 'center',
  },
  trendText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: 'bold',
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  txId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  txDate: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  userText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  projectText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  methodText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#64748B',
  }
});