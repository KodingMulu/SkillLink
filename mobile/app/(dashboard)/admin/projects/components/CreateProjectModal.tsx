import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import {
  X, Briefcase, Calendar, DollarSign,
  FileText, Tag, Check, AlertCircle, Clock
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

interface FormErrors {
  title?: string;
  client?: string;
  budget?: string;
  deadline?: string;
  category?: string;
  description?: string;
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '', client: '', freelancer: '', budget: '',
    deadline: '', category: '', description: '', priority: 'medium'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Judul proyek wajib diisi';
    if (!formData.client.trim()) newErrors.client = 'Nama klien wajib diisi';
    if (!formData.budget.trim()) newErrors.budget = 'Anggaran wajib diisi';
    if (!formData.deadline) newErrors.deadline = 'Deadline wajib diisi';
    if (!formData.category) newErrors.category = 'Kategori wajib dipilih';
    if (!formData.description.trim()) newErrors.description = 'Deskripsi wajib diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

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
        setErrors({});
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    }, 2000);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: '', client: '', freelancer: '', budget: '',
        deadline: '', category: '', description: '', priority: 'medium'
      });
      setErrors({});
      setSubmitSuccess(false);
      onClose();
    }
  };

  return (
    <Modal visible={isOpen} transparent={true} animationType="fade" onRequestClose={handleClose}>
      <View style={s.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.keyboardView}>
          <View style={s.container}>
            
            {/* Header */}
            <View style={s.header}>
              <View style={s.headerTitle}>
                <View style={s.iconBox}>
                  <Briefcase size={20} color="white" />
                </View>
                <View>
                  <Text style={s.title}>Buat Proyek Baru</Text>
                  <Text style={s.subtitle}>Isi detail proyek</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleClose} disabled={isSubmitting}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {submitSuccess ? (
              <View style={s.successState}>
                <View style={s.successIcon}>
                  <Check size={40} color="#059669" />
                </View>
                <Text style={s.successTitle}>Proyek Berhasil Dibuat!</Text>
                <Text style={s.successDesc}>Proyek baru telah ditambahkan ke sistem.</Text>
              </View>
            ) : (
              <ScrollView style={s.content}>
                {/* Judul */}
                <View style={s.formGroup}>
                  <Text style={s.label}>Judul Proyek <Text style={s.required}>*</Text></Text>
                  <View style={[s.inputContainer, errors.title && s.inputError]}>
                    <Briefcase size={18} color="#94A3B8" />
                    <TextInput
                      style={s.input}
                      placeholder="Contoh: Redesain Aplikasi"
                      value={formData.title}
                      onChangeText={(t) => handleChange('title', t)}
                    />
                  </View>
                  {errors.title && <Text style={s.errorText}>{errors.title}</Text>}
                </View>

                {/* Klien & Freelancer */}
                <View style={s.row}>
                  <View style={[s.formGroup, { flex: 1 }]}>
                    <Text style={s.label}>Klien <Text style={s.required}>*</Text></Text>
                    <TextInput
                      style={[s.inputContainer, s.inputOnly, errors.client && s.inputError]}
                      placeholder="Nama Klien"
                      value={formData.client}
                      onChangeText={(t) => handleChange('client', t)}
                    />
                    {errors.client && <Text style={s.errorText}>{errors.client}</Text>}
                  </View>
                  <View style={[s.formGroup, { flex: 1 }]}>
                    <Text style={s.label}>Freelancer</Text>
                    <TextInput
                      style={[s.inputContainer, s.inputOnly]}
                      placeholder="Nama Freelancer"
                      value={formData.freelancer}
                      onChangeText={(t) => handleChange('freelancer', t)}
                    />
                  </View>
                </View>

                {/* Anggaran & Deadline */}
                <View style={s.row}>
                  <View style={[s.formGroup, { flex: 1 }]}>
                    <Text style={s.label}>Anggaran <Text style={s.required}>*</Text></Text>
                    <View style={[s.inputContainer, errors.budget && s.inputError]}>
                      <DollarSign size={18} color="#94A3B8" />
                      <TextInput
                        style={s.input}
                        placeholder="0"
                        keyboardType="numeric"
                        value={formData.budget}
                        onChangeText={(t) => handleChange('budget', t)}
                      />
                    </View>
                    {errors.budget && <Text style={s.errorText}>{errors.budget}</Text>}
                  </View>
                  <View style={[s.formGroup, { flex: 1 }]}>
                    <Text style={s.label}>Deadline <Text style={s.required}>*</Text></Text>
                    <View style={[s.inputContainer, errors.deadline && s.inputError]}>
                      <Calendar size={18} color="#94A3B8" />
                      <TextInput
                        style={s.input}
                        placeholder="YYYY-MM-DD"
                        value={formData.deadline}
                        onChangeText={(t) => handleChange('deadline', t)}
                      />
                    </View>
                    {errors.deadline && <Text style={s.errorText}>{errors.deadline}</Text>}
                  </View>
                </View>

                {/* Kategori & Prioritas */}
                <View style={s.row}>
                  <View style={[s.formGroup, { flex: 1 }]}>
                    <Text style={s.label}>Kategori <Text style={s.required}>*</Text></Text>
                    <View style={[s.inputContainer, errors.category && s.inputError]}>
                      <Tag size={18} color="#94A3B8" />
                      <TextInput
                        style={s.input}
                        placeholder="Web, Mobile..."
                        value={formData.category}
                        onChangeText={(t) => handleChange('category', t)}
                      />
                    </View>
                    {errors.category && <Text style={s.errorText}>{errors.category}</Text>}
                  </View>
                  <View style={[s.formGroup, { flex: 1 }]}>
                    <Text style={s.label}>Prioritas</Text>
                    <View style={s.inputContainer}>
                      <Clock size={18} color="#94A3B8" />
                      <TextInput
                        style={s.input}
                        placeholder="Low/Medium/High"
                        value={formData.priority}
                        onChangeText={(t) => handleChange('priority', t)}
                      />
                    </View>
                  </View>
                </View>

                {/* Deskripsi */}
                <View style={s.formGroup}>
                  <Text style={s.label}>Deskripsi <Text style={s.required}>*</Text></Text>
                  <View style={[s.inputContainer, { alignItems: 'flex-start', height: 100, paddingVertical: 12 }, errors.description && s.inputError]}>
                    <FileText size={18} color="#94A3B8" style={{ marginTop: 2 }} />
                    <TextInput
                      style={[s.input, { textAlignVertical: 'top', height: '100%' }]}
                      placeholder="Jelaskan detail proyek..."
                      multiline
                      value={formData.description}
                      onChangeText={(t) => handleChange('description', t)}
                    />
                  </View>
                  {errors.description && <Text style={s.errorText}>{errors.description}</Text>}
                </View>
              </ScrollView>
            )}

            {/* Footer */}
            {!submitSuccess && (
              <View style={s.footer}>
                <TouchableOpacity onPress={handleClose} style={s.cancelBtn}>
                  <Text style={s.cancelText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  style={[s.submitBtn, isSubmitting && s.disabledBtn]}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Briefcase size={18} color="white" style={{ marginRight: 8 }} />
                      <Text style={s.submitText}>Buat Proyek</Text>
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

const s = StyleSheet.create({
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
  inputOnly: {
    paddingLeft: 12,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F172A',
    height: '100%',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
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