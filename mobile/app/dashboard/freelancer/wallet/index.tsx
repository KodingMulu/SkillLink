import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Text, Card, Divider, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// --- DATA DUMMY ---
const DUMMY_WALLET = {
  balance: 2750000,
  bankName: "Bank Central Asia (BCA)",
  accountNumber: "8820991234",
  accountHolder: "ALEX JOHNSON",
  transactions: [
    { id: '1', type: 'PAYMENT_IN', amount: 1500000, status: 'COMPLETED', desc: 'Project Landing Page', date: '2023-10-24' },
    { id: '2', type: 'WITHDRAWAL', amount: 500000, status: 'PENDING', desc: 'Tarik Tunai ke BCA', date: '2023-10-23' },
    { id: '3', type: 'PAYMENT_IN', amount: 1250000, status: 'COMPLETED', desc: 'App Bug Fixing', date: '2023-10-20' },
  ]
};

export default function WalletPage() {
  const [wallet, setWallet] = useState(DUMMY_WALLET);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const ADMIN_FEE = 5000;

  const formatIDR = (val: number) => {
    return `Rp ${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const handleWithdraw = () => {
    const inputVal = Number(amount);
    if (inputVal <= 0) return Alert.alert("Error", "Masukkan nominal valid");
    if (inputVal + ADMIN_FEE > wallet.balance) return Alert.alert("Gagal", "Saldo tidak cukup");

    setLoading(true);
    // Simulasi API
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
      setAmount('');
      Alert.alert("Berhasil", "Permintaan penarikan sedang diproses");
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Dompet Saya</Text>
          <Text style={styles.subtitle}>Kelola pendapatan & penarikan dana</Text>
        </View>

        {/* SALDO CARD */}
        <LinearGradient colors={['#2563eb', '#1e40af']} style={styles.balanceCard}>
          <View>
            <Text style={styles.balanceLabel}>Total Saldo Aktif</Text>
            <Text style={styles.balanceAmount}>{formatIDR(wallet.balance)}</Text>
          </View>
          <TouchableOpacity style={styles.btnWithdraw} onPress={() => setIsModalOpen(true)}>
            <MaterialCommunityIcons name="download" size={20} color="#2563eb" />
            <Text style={styles.btnWithdrawText}>Tarik Dana</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* BANK INFO */}
        <Card style={styles.bankCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardSectionTitle}>Rekening Terhubung</Text>
            <MaterialCommunityIcons name="check-decagram" size={20} color="#10b981" />
          </View>
          <View style={styles.bankInfoRow}>
            <View style={styles.bankIconBg}>
              <MaterialCommunityIcons name="bank" size={24} color="#2563eb" />
            </View>
            <View>
              <Text style={styles.bankName}>{wallet.bankName}</Text>
              <Text style={styles.bankAcc}>{wallet.accountNumber}</Text>
              <Text style={styles.bankUser}>{wallet.accountHolder}</Text>
            </View>
          </View>
        </Card>

        {/* TRANSACTIONS */}
        <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>
        {wallet.transactions.map((item) => (
          <View key={item.id} style={styles.trxItem}>
            <View style={[styles.iconCircle, { backgroundColor: item.type === 'WITHDRAWAL' ? '#fef2f2' : '#ecfdf5' }]}>
              <MaterialCommunityIcons 
                name={item.type === 'WITHDRAWAL' ? "arrow-top-right" : "arrow-bottom-left"} 
                size={20} 
                color={item.type === 'WITHDRAWAL' ? "#ef4444" : "#10b981"} 
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.trxDesc}>{item.desc}</Text>
              <Text style={styles.trxDate}>{item.date}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.trxAmount, { color: item.type === 'WITHDRAWAL' ? '#0f172a' : '#10b981' }]}>
                {item.type === 'WITHDRAWAL' ? '-' : '+'} {formatIDR(item.amount)}
              </Text>
              <Text style={[styles.statusTag, item.status === 'PENDING' ? styles.statusPending : styles.statusSuccess]}>
                {item.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* MODAL TARIK DANA */}
      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nominal Penarikan</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.currencyPrefix}>Rp</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                autoFocus
              />
            </View>

            <View style={styles.feeInfo}>
              <Text style={styles.feeLabel}>Biaya Admin</Text>
              <Text style={styles.feeValue}>{formatIDR(ADMIN_FEE)}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.btnConfirm, (!amount || loading) && { opacity: 0.6 }]} 
              onPress={handleWithdraw}
              disabled={!amount || loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnConfirmText}>Konfirmasi Sekarang</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' } as TextStyle,
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 } as TextStyle,
  
  balanceCard: { padding: 24, borderRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, elevation: 8 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' } as TextStyle,
  balanceAmount: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 4 } as TextStyle,
  btnWithdraw: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  btnWithdrawText: { color: '#2563eb', fontWeight: 'bold', fontSize: 14 } as TextStyle,

  bankCard: { padding: 20, borderRadius: 20, backgroundColor: '#fff', elevation: 0, borderWidth: 1, borderColor: '#e2e8f0' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#64748b' } as TextStyle,
  bankInfoRow: { flexDirection: 'row', gap: 15 },
  bankIconBg: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },
  bankName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' } as TextStyle,
  bankAcc: { color: '#64748b', fontSize: 14, marginTop: 2, letterSpacing: 1 } as TextStyle,
  bankUser: { fontSize: 11, color: '#94a3b8', marginTop: 4, fontWeight: 'bold' } as TextStyle,

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginTop: 24, marginBottom: 16 } as TextStyle,
  trxItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  trxDesc: { fontSize: 15, fontWeight: '600', color: '#0f172a' } as TextStyle,
  trxDate: { fontSize: 12, color: '#94a3b8', marginTop: 2 } as TextStyle,
  trxAmount: { fontSize: 15, fontWeight: 'bold' } as TextStyle,
  statusTag: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4, overflow: 'hidden' } as TextStyle,
  statusPending: { backgroundColor: '#fefce8', color: '#a16207' },
  statusSuccess: { backgroundColor: '#f0fdf4', color: '#166534' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' } as TextStyle,
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#e2e8f0', marginBottom: 20 },
  currencyPrefix: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginRight: 8 } as TextStyle,
  input: { flex: 1, fontSize: 32, fontWeight: 'bold', color: '#0f172a', paddingVertical: 10 },
  feeInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  feeLabel: { color: '#64748b' } as TextStyle,
  feeValue: { fontWeight: 'bold', color: '#ef4444' } as TextStyle,
  btnConfirm: { backgroundColor: '#2563eb', padding: 18, borderRadius: 16, alignItems: 'center' },
  btnConfirmText: { color: '#fff', fontWeight: 'bold', fontSize: 16 } as TextStyle,
});