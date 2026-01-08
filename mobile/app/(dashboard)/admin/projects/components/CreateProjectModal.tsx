import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import {
  X, Briefcase, Calendar, DollarSign,
  FileText, Tag, Check, AlertCircle
} from 'lucide-react-native';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  title: string;
  client: string;
  freelancer: string;
  budget: string;
  deadline: string;
  category: string;
  description: string;
  priority: string;
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '', client: '', freelancer: '', budget: '',
    deadline: '', category: '', description: '', priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          title: '', client: '', freelancer: '', budget: '',
          deadline: '', category: '', description: '', priority: 'medium'
        });
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <Modal visible={isOpen} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.headerTitle}>
                <View style={styles.iconBox}>
                  <Briefcase size={20} color="white" />
                </View>
                <View>
                  <Text style={styles.title}>Buat Proyek</Text>
                  <Text style={styles.subtitle}>Isi detail proyek</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {submitSuccess ? (
              <View style={styles.successState}>
                <View style={styles.successIcon}>
                  <Check size={40} color="#059669" />
                </View>
                <Text style={styles.successTitle}>Berhasil!</Text>
                <Text style={styles.successDesc}>Proyek baru telah ditambahkan.</Text>
              </View>
            ) : (
              <ScrollView style={styles.content}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Judul Proyek <Text style={styles.required}>*</Text></Text>
                  <View style={styles.inputContainer}>
                    <Briefcase size={18} color="#94A3B8" />
                    <TextInput
                      style={styles.input}
                      placeholder="Contoh: Redesain Aplikasi"
                      value={formData.title}
                      onChangeText={(t) => handleChange('title', t)}
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Klien <Text style={styles.required}>*</Text></Text>
                    <TextInput
                      style={[styles.inputContainer, styles.input, { paddingLeft: 12 }]}
                      placeholder="Nama Klien"
                      value={formData.client}
                      onChangeText={(t) => handleChange('client', t)}
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Freelancer</Text>
                    <TextInput
                      style={[styles.inputContainer, styles.input, { paddingLeft: 12 }]}
                      placeholder="Nama"
                      value={formData.freelancer}
                      onChangeText={(t) => handleChange('freelancer', t)}
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Anggaran <Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputContainer}>
                      <DollarSign size={18} color="#94A3B8" />
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        keyboardType="numeric"
                        value={formData.budget}
                        onChangeText={(t) => handleChange('budget', t)}
                      />
                    </View>
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Deadline <Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputContainer}>
                      <Calendar size={18} color="#94A3B8" />
                      <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={formData.deadline}
                        onChangeText={(t) => handleChange('deadline', t)}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Deskripsi <Text style={styles.required}>*</Text></Text>
                  <View style={[styles.inputContainer, { alignItems: 'flex-start', height: 100, paddingVertical: 12 }]}>
                    <FileText size={18} color="#94A3B8" style={{ marginTop: 2 }} />
                    <TextInput
                      style={[styles.input, { textAlignVertical: 'top', height: '100%' }]}
                      placeholder="Jelaskan detail proyek..."
                      multiline
                      value={formData.description}
                      onChangeText={(t) => handleChange('description', t)}
                    />
                  </View>
                </View>
              </ScrollView>
            )}

            {!submitSuccess && (
              <View style={styles.footer}>
                <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                  <Text style={styles.cancelText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  style={[styles.submitBtn, isSubmitting && styles.disabledBtn]}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Briefcase size={18} color="white" style={{ marginRight: 8 }} />
                      <Text style={styles.submitText}>Buat Proyek</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    maxHeight: '90%',
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
  formGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F172A',
    height: '100%',
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: 'white',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  successState: {
    alignItems: 'center',
    paddingVertical: 60,
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