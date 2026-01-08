import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  ScrollView, ActivityIndicator
} from 'react-native';
import {
  X, FileText, Download, Check, AlertCircle, CheckCircle2
} from 'lucide-react-native';

interface TaxReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TaxReportModal({ isOpen, onClose, onSuccess }: TaxReportModalProps) {
  const [formData, setFormData] = useState({
    periodType: 'monthly',
    year: new Date().getFullYear().toString(),
    reportFormat: 'pdf',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulasi delay generate
    setTimeout(() => {
      setIsGenerating(false);
      setGenerateSuccess(true);
      
      setTimeout(() => {
        setGenerateSuccess(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <View style={styles.iconBox}>
                <FileText size={20} color="white" />
              </View>
              <View>
                <Text style={styles.title}>Laporan Pajak</Text>
                <Text style={styles.subtitle}>Periode pelaporan</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} disabled={isGenerating}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {generateSuccess ? (
              <View style={styles.successState}>
                <View style={styles.successIcon}>
                  <Check size={40} color="#059669" />
                </View>
                <Text style={styles.successTitle}>Laporan Siap!</Text>
                <Text style={styles.successDesc}>File Anda sedang diproses untuk diunduh.</Text>
              </View>
            ) : (
              <View style={styles.formContainer}>
                {/* Alert Info */}
                <View style={styles.alertBox}>
                  <AlertCircle size={20} color="#D97706" />
                  <Text style={styles.alertText}>
                    Pastikan data transaksi sudah diverifikasi sebelum generate laporan.
                  </Text>
                </View>

                {/* Period Type Buttons */}
                <Text style={styles.label}>Tipe Periode</Text>
                <View style={styles.periodGrid}>
                  {['monthly', 'quarterly', 'yearly', 'custom'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setFormData(prev => ({ ...prev, periodType: type }))}
                      style={[
                        styles.periodBtn,
                        formData.periodType === type && styles.periodBtnActive
                      ]}
                    >
                      <Text style={[
                        styles.periodText,
                        formData.periodType === type && styles.periodTextActive
                      ]}>
                        {type === 'monthly' ? 'Bulanan' : type === 'quarterly' ? 'Kuartal' : type === 'yearly' ? 'Tahunan' : 'Custom'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Format Selection */}
                <Text style={styles.label}>Format Output</Text>
                <View style={styles.formatRow}>
                  {['pdf', 'excel'].map(format => (
                    <TouchableOpacity
                      key={format}
                      style={styles.radioRow}
                      onPress={() => setFormData({...formData, reportFormat: format})}
                    >
                      <View style={[styles.radio, formData.reportFormat === format && styles.radioActive]}>
                        {formData.reportFormat === format && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.radioText}>{format.toUpperCase()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          {!generateSuccess && (
            <View style={styles.footer}>
              <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleGenerate}
                disabled={isGenerating}
                style={[styles.generateBtn, isGenerating && styles.disabledBtn]}
              >
                {isGenerating ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Download size={18} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.generateText}>Generate</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
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
  modalContainer: {
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
    backgroundColor: '#2563EB',
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
  formContainer: {
    gap: 16,
  },
  alertBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 8,
  },
  periodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  periodText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  periodTextActive: {
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
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
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
  footer: {
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
  cancelText: {
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
  disabledBtn: {
    opacity: 0.7,
  },
  generateText: {
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
  }
});