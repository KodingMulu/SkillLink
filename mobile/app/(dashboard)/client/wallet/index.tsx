import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  ActivityIndicator, TextInput, Alert, Linking, RefreshControl 
} from 'react-native';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, Plus, 
  CreditCard, History 
} from 'lucide-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT_IN' | 'PAYMENT_OUT' | 'REFUND';
  status: string;
  createdAt: string;
}

interface WalletData {
  id: string;
  balance: number;
  transactions: Transaction[];
}

export default function ClientWalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState<string>('');
  
  const presetAmounts = [50000, 100000, 250000, 500000, 1000000];

  const fetchWallet = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/user/client/wallet`, {
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
    fetchWallet();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWallet();
  };

  const handleTopUp = async () => {
    if (!amount || parseFloat(amount) < 10000) {
      Alert.alert("Error", "Minimal top up Rp 10.000");
      return;
    }

    setIsProcessing(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(
        `${apiUrl}/user/client/wallet`,
        { amount: parseFloat(amount) },
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        }
      );

      const { token: snapToken, redirect_url } = response.data.data;

      const paymentUrl = redirect_url || `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snapToken}`;

      const supported = await Linking.canOpenURL(paymentUrl);
      
      if (supported) {
        await Linking.openURL(paymentUrl);
        setAmount('');
        Alert.alert(
          "Pembayaran",
          "Silakan selesaikan pembayaran di browser. Setelah selesai, refresh halaman ini.",
          [{ text: "OK", onPress: () => fetchWallet() }]
        );
      } else {
        Alert.alert("Error", "Tidak dapat membuka link pembayaran");
      }

    } catch (error) {
      Alert.alert("Gagal", "Gagal memproses pembayaran");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return { bg: '#D1FAE5', text: '#059669' };
      case 'PENDING': return { bg: '#FEF3C7', text: '#D97706' };
      case 'FAILED': return { bg: '#FEE2E2', text: '#DC2626' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saldo & Pembayaran</Text>
        <Text style={styles.headerSubtitle}>Kelola saldo akun Anda</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.balanceCard}>
          <View style={styles.cardDecor} />
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Wallet size={24} color="rgba(255,255,255,0.8)" />
              <Text style={styles.cardLabel}>Total Saldo Aktif</Text>
            </View>
            <Text style={styles.balanceText}>
              {wallet ? formatRupiah(wallet.balance) : 'Rp 0'}
            </Text>
          </View>
        </View>

        <View style={styles.topUpCard}>
          <View style={styles.topUpHeader}>
            <View style={styles.iconContainer}>
              <Plus size={20} color="#2563EB" />
            </View>
            <Text style={styles.topUpTitle}>Isi Saldo (Top Up)</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nominal Top Up</Text>
            <View style={styles.amountInputWrapper}>
              <Text style={styles.currency}>Rp</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.presetsContainer}>
            <Text style={styles.presetLabel}>Pilihan Cepat</Text>
            <View style={styles.presetGrid}>
              {presetAmounts.map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.presetBtn,
                    amount === val.toString() && styles.presetBtnActive
                  ]}
                  onPress={() => setAmount(val.toString())}
                >
                  <Text style={[
                    styles.presetText,
                    amount === val.toString() && styles.presetTextActive
                  ]}>
                    {formatRupiah(val)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.payBtn, (isProcessing || isLoading) && styles.payBtnDisabled]}
            onPress={handleTopUp}
            disabled={isProcessing || isLoading}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <CreditCard size={18} color="white" />
                <Text style={styles.payBtnText}>Bayar Sekarang</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <History size={20} color="#64748B" />
            <Text style={styles.historyTitle}>Riwayat Transaksi</Text>
          </View>

          {wallet?.transactions && wallet.transactions.length > 0 ? (
            wallet.transactions.map((trx) => {
              const statusColors = getStatusColor(trx.status);
              return (
                <View key={trx.id} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <View style={[
                      styles.transactionIcon,
                      { backgroundColor: trx.type === 'DEPOSIT' ? '#ECFDF5' : '#FEF2F2' }
                    ]}>
                      {trx.type === 'DEPOSIT' ? 
                        <ArrowDownLeft size={18} color="#059669" /> : 
                        <ArrowUpRight size={18} color="#DC2626" />
                      }
                    </View>
                    <View>
                      <Text style={styles.transactionType}>
                        {trx.type === 'DEPOSIT' ? 'Top Up' : 'Keluar'}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {formatDate(trx.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={[
                      styles.transactionAmount,
                      { color: trx.type === 'DEPOSIT' ? '#059669' : '#0F172A' }
                    ]}>
                      {trx.type === 'DEPOSIT' ? '+' : '-'}{formatRupiah(trx.amount)}
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
            <Text style={styles.emptyText}>Belum ada transaksi</Text>
          )}
        </View>
      </View>
    </ScrollView>
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
  balanceCard: {
    backgroundColor: '#2563EB',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    padding: 24,
  },
  cardDecor: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardContent: {
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardLabel: {
    color: '#DBEAFE',
    fontWeight: '500',
    fontSize: 14,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  topUpCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topUpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  iconContainer: {
    padding: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
  },
  topUpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currency: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748B',
  },
  amountInput: {
    flex: 1,
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  presetsContainer: {
    marginBottom: 20,
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: 'white',
  },
  presetBtnActive: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  presetTextActive: {
    color: 'white',
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  payBtnDisabled: {
    opacity: 0.7,
  },
  payBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
    fontWeight: 'bold',
    color: '#0F172A',
  },
  transactionDate: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    textTransform: 'uppercase',
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
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontStyle: 'italic',
    padding: 20,
  },
});