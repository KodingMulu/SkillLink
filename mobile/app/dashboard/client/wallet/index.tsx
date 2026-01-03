import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Text, Card, Button, Avatar, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// --- DATA DUMMY ---
const DUMMY_WALLET = {
  balance: 1250000,
  transactions: [
    { id: '1', amount: 500000, type: 'DEPOSIT', status: 'COMPLETED', createdAt: '2023-10-24T10:00:00Z' },
    { id: '2', amount: 150000, type: 'PAYMENT_OUT', status: 'COMPLETED', createdAt: '2023-10-23T15:30:00Z' },
    { id: '3', amount: 100000, type: 'DEPOSIT', status: 'PENDING', createdAt: '2023-10-22T09:15:00Z' },
    { id: '4', amount: 250000, type: 'PAYMENT_OUT', status: 'FAILED', createdAt: '2023-10-21T14:20:00Z' },
  ]
};

const PRESET_AMOUNTS = [50000, 100000, 250000, 500000];

export default function WalletScreen() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const renderTransaction = ({ item }: any) => {
    const isDeposit = item.type === 'DEPOSIT';
    
    return (
      <View style={styles.transactionItem}>
        <View style={styles.trxLeft}>
          <Avatar.Icon 
            size={40} 
            icon={isDeposit ? "arrow-bottom-left" : "arrow-top-right"} 
            style={{ backgroundColor: isDeposit ? '#ecfdf5' : '#fef2f2' }}
            color={isDeposit ? '#10b981' : '#ef4444'}
          />
          <View style={styles.trxInfo}>
            <Text style={styles.trxTitle}>{isDeposit ? 'Top Up Saldo' : 'Pembayaran Keluar'}</Text>
            <Text style={styles.trxDate}>{new Date(item.createdAt).toLocaleDateString('id-ID')}</Text>
          </View>
        </View>
        <View style={styles.trxRight}>
          <Text style={[styles.trxAmount, { color: isDeposit ? '#10b981' : '#1e293b' }]}>
            {isDeposit ? '+' : '-'}{formatRupiah(item.amount)}
          </Text>
          <Text style={[styles.trxStatus, styles[item.status.toLowerCase() as keyof typeof styles]]}>
            {item.status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Saldo & Pembayaran</Text>
          <Card style={styles.balanceCard}>
            <View style={styles.balanceContent}>
              <View>
                <Text style={styles.balanceLabel}>Total Saldo Aktif</Text>
                <Text style={styles.balanceValue}>{formatRupiah(DUMMY_WALLET.balance)}</Text>
              </View>
              <MaterialCommunityIcons name="wallet-outline" size={48} color="rgba(255,255,255,0.2)" />
            </View>
          </Card>
        </View>

        {/* Top Up Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#2563eb" />
            <Text style={styles.sectionTitle}>Isi Saldo (Dummy)</Text>
          </View>
          
          <View style={styles.presetGrid}>
            {PRESET_AMOUNTS.map((amt) => (
              <TouchableOpacity
                key={amt}
                style={[styles.presetBtn, selectedAmount === amt && styles.presetBtnActive]}
                onPress={() => setSelectedAmount(amt)}
              >
                <Text style={[styles.presetText, selectedAmount === amt && styles.presetTextActive]}>
                  {formatRupiah(amt)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button 
            mode="contained" 
            style={styles.payBtn}
            contentStyle={{ paddingVertical: 8 }}
            onPress={() => alert(`Simulasi Bayar: ${formatRupiah(selectedAmount || 0)}`)}
            disabled={!selectedAmount}
          >
            Bayar Sekarang
          </Button>
        </View>

        {/* History Section */}
        <View style={styles.historySection}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons name="history" size={20} color="#64748b" />
            <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>
          </View>
          
          <Card style={styles.historyCard}>
            {DUMMY_WALLET.transactions.map((item, index) => (
              <View key={item.id}>
                {renderTransaction({ item })}
                {index !== DUMMY_WALLET.transactions.length - 1 && <Divider />}
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 20 },
  balanceCard: { backgroundColor: '#2563eb', borderRadius: 24, elevation: 8 },
  balanceContent: { padding: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { color: '#bfdbfe', fontSize: 14, marginBottom: 5 },
  balanceValue: { color: '#fff', fontSize: 28, fontWeight: 'bold' },

  section: { padding: 20, marginTop: 10 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 8, color: '#1e293b' },
  
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  presetBtn: { 
    width: (width - 50) / 2, 
    padding: 15, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    backgroundColor: '#fff',
    alignItems: 'center' 
  },
  presetBtnActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  presetText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  presetTextActive: { color: '#2563eb' },
  payBtn: { borderRadius: 12, backgroundColor: '#0f172a' },

  historySection: { padding: 20 },
  historyCard: { borderRadius: 16, backgroundColor: '#fff', padding: 5 },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15 },
  trxLeft: { flexDirection: 'row', alignItems: 'center' },
  trxInfo: { marginLeft: 12 },
  trxTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  trxDate: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  trxRight: { alignItems: 'flex-end' },
  trxAmount: { fontSize: 14, fontWeight: 'bold' },
  trxStatus: { fontSize: 10, fontWeight: 'bold', marginTop: 4 },
  
  // Status Colors
  completed: { color: '#10b981' },
  pending: { color: '#f59e0b' },
  failed: { color: '#ef4444' },
});