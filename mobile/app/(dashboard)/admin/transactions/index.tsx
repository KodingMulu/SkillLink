import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, RefreshControl, ScrollView, Modal,
  Dimensions
} from 'react-native';
import {
  DollarSign, Search, Filter, Download,
  ArrowUpRight, Clock, CheckCircle2, XCircle,
  MoreVertical, ChevronLeft, ChevronRight, FileText,
  CreditCard, Wallet, Landmark, Calendar, Check, AlertCircle, X
} from 'lucide-react-native';
import axios from 'axios';

interface TransactionStatApi {
  type: "total_volume" | "success" | "pending" | "failed";
  label: string;
  value: number;
  growth?: number;
  color: "blue" | "emerald" | "orange" | "red";
  icon?: string;
}

interface TransactionRow {
  id: string;
  user: string;
  project: string;
  amount: string;
  method: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface TaxReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const TaxReportModal = ({ isOpen, onClose, onSuccess }: TaxReportModalProps) => {
  const [formData, setFormData] = useState({
    periodType: 'monthly',
    month: '',
    year: new Date().getFullYear().toString(),
    reportFormat: 'pdf'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={s.modalContent}>
          <View style={s.modalHeader}>
            <View style={s.modalHeaderLeft}>
              <View style={[s.iconBox, { backgroundColor: '#2563EB' }]}>
                <FileText size={20} color="white" />
              </View>
              <View>
                <Text style={s.modalTitle}>Laporan Pajak</Text>
                <Text style={s.modalSubtitle}>Periode pelaporan arus kas</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          {success ? (
            <View style={s.successState}>
              <View style={s.successIcon}>
                <Check size={40} color="#059669" />
              </View>
              <Text style={s.successTitle}>Laporan Siap!</Text>
              <Text style={s.successDesc}>File Anda sedang diproses.</Text>
            </View>
          ) : (
            <ScrollView style={s.modalBody}>
              <View style={s.alertBox}>
                <AlertCircle size={16} color="#B45309" />
                <Text style={s.alertText}>
                  Pastikan data transaksi sudah diverifikasi sebelum generate laporan.
                </Text>
              </View>

              <Text style={s.formLabel}>Tipe Periode</Text>
              <View style={s.periodGrid}>
                {['monthly', 'quarterly', 'yearly', 'custom'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[s.periodBtn, formData.periodType === type && s.periodBtnActive]}
                    onPress={() => setFormData({...formData, periodType: type})}
                  >
                    <Text style={[s.periodBtnText, formData.periodType === type && s.periodBtnTextActive]}>
                      {type === 'monthly' ? 'Bulanan' : type === 'quarterly' ? 'Kuartal' : type === 'yearly' ? 'Tahunan' : 'Custom'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={s.formLabel}>Format Output</Text>
              <View style={s.formatRow}>
                {['pdf', 'excel'].map((format) => (
                  <TouchableOpacity 
                    key={format} 
                    style={s.radioRow}
                    onPress={() => setFormData({...formData, reportFormat: format})}
                  >
                    <View style={[s.radioOuter, formData.reportFormat === format && s.radioOuterActive]}>
                      {formData.reportFormat === format && <View style={s.radioInner} />}
                    </View>
                    <Text style={s.radioText}>{format.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {!success && (
            <View style={s.modalFooter}>
              <TouchableOpacity onPress={onClose} style={s.cancelBtn}>
                <Text style={s.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[s.generateBtn, loading && { opacity: 0.7 }]}
                onPress={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Download size={16} color="white" style={{ marginRight: 8 }} />
                    <Text style={s.generateBtnText}>Generate</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default function TransactionManagementScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const [stats, setStats] = useState<TransactionStatApi[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, limit: 10, total: 0, totalPages: 1
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/admin/stats`, {
        withCredentials: true
      });
      setStats(res.data?.transactionStats || []);
    } catch (error) {
      console.error(error);
      setStats([]);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/admin/transactions`, {
        params: {
          page: pagination.page,
          limit: 10,
          search: searchTerm,
          status: statusFilter
        },
        withCredentials: true
      });
      setTransactions(res.data?.data || []);
      if (res.data?.pagination) {
        setPagination(prev => ({ ...prev, ...res.data.pagination }));
      }
    } catch (error) {
      console.error(error);
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, pagination.page]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
    fetchTransactions();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'success': return { bg: '#D1FAE5', text: '#047857', label: 'Success' };
      case 'pending': return { bg: '#FFEDD5', text: '#C2410C', label: 'Pending' };
      case 'failed': return { bg: '#FEE2E2', text: '#DC2626', label: 'Failed' };
      default: return { bg: '#F1F5F9', text: '#64748B', label: status };
    }
  };

  const getMethodIcon = (method: string) => {
    const normalized = method.toLowerCase();
    const props = { size: 14, color: '#475569' };
    if (normalized.includes('bank') || normalized.includes('landmark')) return <Landmark {...props} />;
    if (normalized.includes('card')) return <CreditCard {...props} />;
    return <Wallet {...props} />;
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

  const getColor = (colorName: string) => {
    switch (colorName) {
      case 'blue': return { bg: '#EFF6FF', text: '#2563EB' };
      case 'orange': return { bg: '#FFF7ED', text: '#EA580C' };
      case 'emerald': return { bg: '#ECFDF5', text: '#059669' };
      case 'red': return { bg: '#FEF2F2', text: '#DC2626' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const renderStatCard = ({ item }: { item: TransactionStatApi }) => {
    const styles = getColor(item.color);
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
      <View style={s.statCard}>
        <View style={s.statHeader}>
          <View style={[s.statIcon, { backgroundColor: styles.bg }]}>
            {getStatIcon(item.type, styles.text)}
          </View>
          {item.growth !== undefined && (
            <View style={s.trendBadge}>
              <Text style={s.trendText}>
                {item.growth > 0 ? '+' : ''}{item.growth}%
              </Text>
            </View>
          )}
        </View>
        <Text style={s.statLabel}>{item.label}</Text>
        <Text style={s.statValue}>{displayValue}</Text>
      </View>
    );
  };

  const renderTransactionItem = ({ item }: { item: TransactionRow }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <View style={s.card}>
        <View style={s.cardHeader}>
          <View>
            <Text style={s.cardId}>{item.id}</Text>
            <Text style={s.cardDate}>{item.date}</Text>
          </View>
          <View style={[s.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[s.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
          </View>
        </View>

        <View style={s.cardBody}>
          <Text style={s.userName}>{item.user}</Text>
          <Text style={s.projectName} numberOfLines={1}>{item.project}</Text>
          
          <View style={s.cardFooter}>
            <View style={s.methodBadge}>
              {getMethodIcon(item.method)}
              <Text style={s.methodText}>{item.method}</Text>
            </View>
            <Text style={s.amountText}>{item.amount}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Transaksi</Text>
          <Text style={s.subtitle}>Pantau arus kas</Text>
        </View>
        <View style={s.headerActions}>
          <TouchableOpacity style={s.iconBtn}>
            <Download size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[s.iconBtn, { backgroundColor: '#2563EB', borderColor: '#2563EB' }]}
            onPress={() => setIsTaxModalOpen(true)}
          >
            <FileText size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={s.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.statsContainer}>
          {loading && !refreshing ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            (stats || []).map((stat, idx) => (
              <View key={idx} style={{ marginRight: 12 }}>
                {renderStatCard({ item: stat })}
              </View>
            ))
          )}
        </ScrollView>

        <View style={s.filterSection}>
          <View style={s.searchContainer}>
            <Search size={18} color="#94A3B8" />
            <TextInput
              style={s.searchInput}
              placeholder="Cari ID atau User..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll}>
            {['all', 'success', 'pending', 'failed'].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setStatusFilter(status)}
                style={[
                  s.filterPill,
                  statusFilter === status && s.filterPillActive
                ]}
              >
                <Text style={[
                  s.filterText,
                  statusFilter === status && s.filterTextActive
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={s.listContainer}>
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
          ) : transactions.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={s.emptyText}>Tidak ada transaksi ditemukan.</Text>
            </View>
          ) : (
            (transactions || []).map(item => (
              <View key={item.id} style={{ marginBottom: 12 }}>
                {renderTransactionItem({ item })}
              </View>
            ))
          )}
        </View>

        <View style={s.pagination}>
          <TouchableOpacity
            disabled={pagination.page <= 1}
            onPress={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            style={[s.pageBtn, pagination.page <= 1 && s.pageBtnDisabled]}
          >
            <ChevronLeft size={20} color={pagination.page <= 1 ? "#CBD5E1" : "#1E293B"} />
          </TouchableOpacity>
          <Text style={s.pageText}>
            Hal {pagination.page} dari {pagination.totalPages}
          </Text>
          <TouchableOpacity
            disabled={pagination.page >= pagination.totalPages}
            onPress={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            style={[s.pageBtn, pagination.page >= pagination.totalPages && s.pageBtnDisabled]}
          >
            <ChevronRight size={20} color={pagination.page >= pagination.totalPages ? "#CBD5E1" : "#1E293B"} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TaxReportModal 
        isOpen={isTaxModalOpen} 
        onClose={() => setIsTaxModalOpen(false)} 
        onSuccess={() => { console.log('Generated') }}
      />
    </View>
  );
}

const s = StyleSheet.create({
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
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statsContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 160,
    marginBottom: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    justifyContent: 'center',
  },
  trendText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
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
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
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
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  cardBody: {
    gap: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  projectName: {
    fontSize: 12,
    color: '#64748B',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    padding: 40,
  },
  emptyText: {
    color: '#64748B',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  pageBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pageBtnDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  pageText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  modalBody: {
    padding: 20,
  },
  alertBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 20,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 12,
    marginTop: 8,
  },
  periodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  periodBtn: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  periodBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  periodBtnText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  periodBtnTextActive: {
    color: '#2563EB',
  },
  formatRow: {
    flexDirection: 'row',
    gap: 24,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#2563EB',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  radioText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    backgroundColor: '#F8FAFC',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  generateBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  successState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#D1FAE5',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  successDesc: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
});