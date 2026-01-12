import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert, Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Eye, EyeOff, Mail, User, ArrowRight, Lock,
  Briefcase, UserCircle, Check
} from 'lucide-react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'FREELANCER'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const setRole = (role: string) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleRegister = async () => {
    if (!acceptTerms) {
      Alert.alert('Peringatan', 'Anda harus menyetujui syarat dan ketentuan');
      return;
    }
    if (!formData.fullName || !formData.email || !formData.password) {
      Alert.alert('Peringatan', 'Semua kolom harus diisi');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        email: formData.email,
        username: formData.fullName,
        password: formData.password,
        role: formData.role
      };

      const response = await axios.post(`${API_URL}/auth/register`, payload);

      if (response.status === 201) {
        Alert.alert('Sukses', 'Registrasi Berhasil! Cek email Anda.');
        router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Terjadi kesalahan pada server';
      Alert.alert('Gagal', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.container}
    >
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Background Decorations */}
        <View style={[s.blob, s.blobTop]} />
        <View style={[s.blob, s.blobBottom]} />

        <View style={s.card}>
          <View style={s.header}>
            <View style={s.iconWrapper}>
              <User size={24} color="white" />
            </View>
            <Text style={s.title}>Buat Akun</Text>
            <Text style={s.subtitle}>Mulai perjalanan Anda bersama kami</Text>
          </View>

          <View style={s.form}>
            {/* Role Switcher */}
            <View style={s.roleContainer}>
              <TouchableOpacity
                style={[s.roleBtn, formData.role === 'FREELANCER' && s.roleBtnActive]}
                onPress={() => setRole('FREELANCER')}
              >
                <Briefcase size={16} color={formData.role === 'FREELANCER' ? '#2563EB' : '#64748B'} />
                <Text style={[s.roleText, formData.role === 'FREELANCER' && s.roleTextActive]}>Freelancer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.roleBtn, formData.role === 'CLIENT' && s.roleBtnActive]}
                onPress={() => setRole('CLIENT')}
              >
                <UserCircle size={16} color={formData.role === 'CLIENT' ? '#2563EB' : '#64748B'} />
                <Text style={[s.roleText, formData.role === 'CLIENT' && s.roleTextActive]}>Client</Text>
              </TouchableOpacity>
            </View>

            {/* Username Input */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Username</Text>
              <View style={s.inputContainer}>
                <User size={20} color="#94A3B8" style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="cth. jhon_doe"
                  value={formData.fullName}
                  onChangeText={(t) => updateFormData('fullName', t)}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Email</Text>
              <View style={s.inputContainer}>
                <Mail size={20} color="#94A3B8" style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="nama@perusahaan.com"
                  value={formData.email}
                  onChangeText={(t) => updateFormData('email', t)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={s.inputGroup}>
              <Text style={s.label}>Password</Text>
              <View style={s.inputContainer}>
                <Lock size={20} color="#94A3B8" style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="Minimal 8 karakter"
                  value={formData.password}
                  onChangeText={(t) => updateFormData('password', t)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={s.eyeIcon}>
                  {showPassword ? (
                    <EyeOff size={20} color="#94A3B8" />
                  ) : (
                    <Eye size={20} color="#94A3B8" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms Checkbox */}
            <TouchableOpacity
              style={s.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
              activeOpacity={0.8}
            >
              <View style={[s.checkbox, acceptTerms && s.checkboxChecked]}>
                {acceptTerms && <Check size={12} color="white" />}
              </View>
              <Text style={s.termsText}>
                Saya menyetujui <Text style={s.linkText}>Syarat & Ketentuan</Text>.
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={s.submitBtn}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={s.btnContent}>
                  <Text style={s.submitBtnText}>Daftar Sekarang</Text>
                  <ArrowRight size={20} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={s.footer}>
            <Text style={s.footerText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={s.linkText}>Masuk disini</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.2,
  },
  blobTop: {
    backgroundColor: '#60A5FA',
    top: -100,
    left: -100,
  },
  blobBottom: {
    backgroundColor: '#A78BFA',
    bottom: -100,
    right: -100,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  form: {
    gap: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  roleBtnActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  roleTextActive: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#0F172A',
  },
  eyeIcon: {
    padding: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  termsText: {
    fontSize: 13,
    color: '#475569',
    flex: 1,
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
  linkText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: 'bold',
  },
});