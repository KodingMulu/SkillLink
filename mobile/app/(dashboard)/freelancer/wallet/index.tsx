import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, TextInput, Modal, RefreshControl 
} from 'react-native';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, Building2, 
  Download, CreditCard, AlertCircle, MoreVertical 
} from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT_IN' | 'PAYMENT_OUT' | 'REFUND';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  description?: string;
  createdAt: string;
}

interface WalletData {
  balance: number;
  bankName: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  transactions: Transaction[];
}

export default function FreelancerWalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ADMIN_FEE = 5000;

  const fetchWalletData = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/user/freelancer/wallet`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      if (response.data.code === 200) {
        setWallet(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(
        `${apiUrl}/user/freelancer/wallet`,
        { amount: Number(withdrawAmount) },
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.code === 200) {
        alert("Penarikan berhasil!");
        setWallet(prev => prev ? { ...prev, balance: response.data.data.newBalance } : null);
        setIsWithdrawModalOpen(false);
        setWithdrawAmount('');
        fetchWalletData();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Penarikan gagal";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return { bg: '#D1FAE5', text: '#047857' };
      case 'PENDING': return { bg: '#FEF3C7', text: '#B45309' };
      case 'FAILED': return { bg: '#FEE2E2', text: '#B91C1C' };
      default: return { bg: '#F1F5F9', text: '#334155' };
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type === 'WITHDRAWAL' || type === 'PAYMENT_OUT') {
      return <ArrowUpRight size={20} color="#EF4444" />;
    }
    return <ArrowDownLeft size={20} color="#10B981" />;
  };

  const totalDeduction = Number(withdrawAmount) + ADMIN_FEE;
  const isBalanceSufficient = wallet ? wallet.balance >= totalDeduction : false;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dompet Saya</Text>
          <Text style={styles.headerSubtitle}>Kelola pendapatan dan penarikan dana Anda</Text>
        </View>

        {wallet && (
          <View style={styles.content}>
            <View style={styles.walletCard}>
              <View style={styles.walletDecor} />
              <View style={styles.walletContent}>
                <View style={styles.walletHeader}>
                  <Wallet size={20} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.walletLabel}>Total Saldo Aktif</Text>
                </View>
                <Text style={styles.walletBalance}>{formatRupiah(wallet.balance)}</Text>
                <TouchableOpacity 
                  style={styles.withdrawBtn}
                  onPress={() => setIsWithdrawModalOpen(true)}
                >
                  <Download size={16} color="#2563EB" />
                  <Text style={styles.withdrawBtnText}>Tarik Dana</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bankCard}>
              <View style={styles.bankHeader}>
                <View style={styles.bankTitleRow}>
                  <Building2 size={20} color="#64748B" />
                  <Text style={styles.bankTitle}>Akun Bank</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
                  <CreditCard size={14} color="#059669" />
                </View>
              </View>

              {wallet.bankName ? (
                <View style={styles.bankInfoBox}>
                  <Text style={styles.bankLabel}>Bank Terdaftar</Text>
                  <Text style={styles.bankName}>{wallet.bankName}</Text>
                  <Text style={styles.accountNumber}>{wallet.accountNumber}</Text>
                  <Text style={styles.accountHolder}>{wallet.accountHolder}</Text>
                </View>
              ) : (
                <View style={styles.emptyBank}>
                  <Text style={styles.emptyBankText}>Belum ada rekening terhubung</Text>
                </View>
              )}
            </View>

            <View style={styles.transactionsCard}>
              <View style={styles.transactionsHeader}>
                <Text style={styles.transactionsTitle}>Riwayat Transaksi</Text>
                <TouchableOpacity style={styles.filterBtn}>
                  <Text style={styles.filterText}>Filter</Text>
                  <MoreVertical size={16} color="#64748B" />
                </TouchableOpacity>
              </View>

              {wallet.transactions.length > 0 ? (
                wallet.transactions.map((trx) => {
                  const statusColors = getStatusColor(trx.status);
                  return (
                    <View key={trx.id} style={styles.transactionItem}>
                      <View style={styles.transactionLeft}>
                        <View style={[
                          styles.transactionIcon, 
                          { backgroundColor: trx.type === 'WITHDRAWAL' ? '#FEF2F2' : '#ECFDF5' }
                        ]}>
                          {getTransactionIcon(trx.type)}
                        </View>
                        <View>
                          <Text style={styles.transactionType}>
                            {trx.type === 'PAYMENT_IN' ? 'Terima Pembayaran' :
                             trx.type === 'WITHDRAWAL' ? 'Penarikan Dana' : trx.type}
                          </Text>
                          <Text style={styles.transactionDate}>
                            {new Date(trx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.transactionRight}>
                        <Text style={[
                          styles.transactionAmount,
                          { color: trx.type === 'WITHDRAWAL' || trx.type === 'PAYMENT_OUT' ? '#0F172A' : '#059669' }
                        ]}>
                          {trx.type === 'WITHDRAWAL' || trx.type === 'PAYMENT_OUT' ? '-' : '+'}
                          {formatRupiah(trx.amount)}
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                          <Text style={[styles.statusText, { color: statusColors.text }]}>
                            {trx.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={styles.emptyTransactions}>
                  <Text style={styles.emptyText}>Belum ada transaksi.</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isWithdrawModalOpen}
        onRequestClose={() => setIsWithdrawModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tarik Dana</Text>
            
            <View style={styles.balanceInfo}>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Saldo Anda</Text>
                <Text style={styles.balanceValue}>{wallet ? formatRupiah(wallet.balance) : 0}</Text>
              </View>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Biaya Admin</Text>
                <Text style={styles.adminFee}>-{formatRupiah(ADMIN_FEE)}</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Jumlah Penarikan (IDR)</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencyPrefix}>Rp</Text>
                <TextInput
                  style={styles.amountInput}
                  value={withdrawAmount}
                  onChangeText={setWithdrawAmount}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              
              {withdrawAmount !== '' && (
                <View style={styles.summaryContainer}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Pengurangan:</Text>
                    <Text style={[styles.summaryValue, !isBalanceSufficient && styles.textRed]}>
                      {formatRupiah(totalDeduction)}
                    </Text>
                  </View>
                  {!isBalanceSufficient && (
                    <View style={styles.errorRow}>
                      <AlertCircle size={12} color="#EF4444" />
                      <Text style={styles.errorText}>Saldo tidak mencukupi</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelBtn}
                onPress={() => setIsWithdrawModalOpen(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, (!withdrawAmount || !isBalanceSufficient) && styles.disabledBtn]}
                onPress={handleWithdraw}
                disabled={isSubmitting || !withdrawAmount || !isBalanceSufficient}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.confirmText}>Konfirmasi</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  walletCard: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  walletDecor: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  walletContent: {
    padding: 24,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  walletLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  walletBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 24,
  },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 8,
  },
  withdrawBtnText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bankCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bankTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bankTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
  },
  bankInfoBox: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bankLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  bankName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#334155',
    letterSpacing: 1,
  },
  accountHolder: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  emptyBank: {
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptyBankText: {
    color: '#64748B',
    fontSize: 12,
  },
  transactionsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterText: {
    fontSize: 12,
    color: '#64748B',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  transactionDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyTransactions: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 20,
  },
  balanceInfo: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#475569',
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  adminFee: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748B',
  },
  amountInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  summaryContainer: {
    marginTop: 12,
    gap: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  textRed: {
    color: '#DC2626',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: 'bold',
    color: '#64748B',
  },
  confirmBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  confirmText: {
    fontWeight: 'bold',
    color: 'white',
  },
});