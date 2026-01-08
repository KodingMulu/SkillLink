import React from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  ScrollView, Dimensions
} from 'react-native';
import { ShieldAlert, X, AlertTriangle, CheckCircle2, UserX, MessageSquareWarning } from 'lucide-react-native';

interface ModerationPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModerationPolicyModal({ isOpen, onClose }: ModerationPolicyModalProps) {
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <View style={styles.iconBox}>
                <ShieldAlert size={20} color="white" />
              </View>
              <View>
                <Text style={styles.title}>Kebijakan Moderasi</Text>
                <Text style={styles.subtitle}>Panduan penanganan laporan</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content}>
            <View style={styles.introBox}>
              <Text style={styles.introText}>
                Moderator diharapkan untuk bertindak adil, objektif, dan sesuai dengan panduan komunitas SkillLink.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Kategori Pelanggaran</Text>
            
            <View style={styles.policyItem}>
              <View style={[styles.policyIcon, { backgroundColor: '#FEF2F2' }]}>
                <AlertTriangle size={18} color="#DC2626" />
              </View>
              <View style={styles.policyText}>
                <Text style={styles.policyHeader}>Penipuan / Scam</Text>
                <Text style={styles.policyDesc}>
                  Prioritas Tinggi. Tindakan: Suspend akun sementara, investigasi transaksi, banned permanen jika terbukti.
                </Text>
              </View>
            </View>

            <View style={styles.policyItem}>
              <View style={[styles.policyIcon, { backgroundColor: '#FFF7ED' }]}>
                <MessageSquareWarning size={18} color="#EA580C" />
              </View>
              <View style={styles.policyText}>
                <Text style={styles.policyHeader}>Pelecehan / Harassment</Text>
                <Text style={styles.policyDesc}>
                  Tindakan: Peringatan keras (Strike 1), Banned sementara (Strike 2).
                </Text>
              </View>
            </View>

            <View style={styles.policyItem}>
              <View style={[styles.policyIcon, { backgroundColor: '#EFF6FF' }]}>
                <UserX size={18} color="#2563EB" />
              </View>
              <View style={styles.policyText}>
                <Text style={styles.policyHeader}>Profil Palsu / Spam</Text>
                <Text style={styles.policyDesc}>
                  Tindakan: Verifikasi ulang identitas, penghapusan konten spam.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>SOP Penanganan</Text>
            <View style={styles.sopList}>
              <View style={styles.sopItem}>
                <CheckCircle2 size={16} color="#059669" style={{ marginTop: 2 }} />
                <Text style={styles.sopText}>Verifikasi bukti (screenshot chat, log transaksi).</Text>
              </View>
              <View style={styles.sopItem}>
                <CheckCircle2 size={16} color="#059669" style={{ marginTop: 2 }} />
                <Text style={styles.sopText}>Hubungi kedua belah pihak jika diperlukan mediasi.</Text>
              </View>
              <View style={styles.sopItem}>
                <CheckCircle2 size={16} color="#059669" style={{ marginTop: 2 }} />
                <Text style={styles.sopText}>Dokumentasikan alasan penutupan laporan.</Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  content: {
    padding: 20,
  },
  introBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  introText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
    marginTop: 8,
  },
  policyItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  policyIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  policyText: {
    flex: 1,
  },
  policyHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  policyDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  sopList: {
    gap: 12,
  },
  sopItem: {
    flexDirection: 'row',
    gap: 10,
  },
  sopText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: 'white',
  },
  closeBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
  },
});