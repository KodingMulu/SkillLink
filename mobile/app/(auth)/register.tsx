import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Eye, EyeOff, Mail, User, ArrowRight, Lock, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api'; 

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!acceptTerms) { 
      Alert.alert('Peringatan', 'Anda harus menyetujui syarat dan ketentuan'); 
      return; 
    }
    
    setIsLoading(true);
    
    try {
      const payload = { 
        email: formData.email, 
        username: formData.fullName, 
        password: formData.password 
      };

      const response = await axios.post(`${API_URL}/auth/register`, payload);

      if (response.data.code === 200) {
        Alert.alert('Sukses', 'Registrasi Berhasil! Cek email Anda.', [
          { 
            text: 'OK', 
            onPress: () => router.push({
              pathname: '/auth/verify',
              params: { email: formData.email }
            }) 
          }
        ]);
      } else {
        Alert.alert('Gagal', 'Gagal Mendaftar');
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Error', error.response?.data?.message || 'Terjadi kesalahan pada server');
      } else {
        Alert.alert('Error', 'Terjadi kesalahan tak terduga');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.blob, styles.blobBlue]} />
      <View style={[styles.blob, styles.blobPurple]} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <User size={24} color="white" />
              </View>
              <Text style={styles.title}>Buat Akun</Text>
              <Text style={styles.subtitle}>Mulai perjalanan Anda bersama kami</Text>
            </View>

            <View style={styles.formSpace}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Username</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'fullName' && styles.inputFocused
                ]}>
                  <User size={20} color={focusedInput === 'fullName' ? '#2563EB' : '#94A3B8'} style={styles.inputIcon} />
                  <TextInput
                    value={formData.fullName}
                    onChangeText={(val) => handleChange('fullName', val)}
                    style={styles.input}
                    placeholder="cth. jhon_doe"
                    placeholderTextColor="#94A3B8"
                    onFocus={() => setFocusedInput('fullName')}
                    onBlur={() => setFocusedInput(null)}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'email' && styles.inputFocused
                ]}>
                  <Mail size={20} color={focusedInput === 'email' ? '#2563EB' : '#94A3B8'} style={styles.inputIcon} />
                  <TextInput
                    value={formData.email}
                    onChangeText={(val) => handleChange('email', val)}
                    style={styles.input}
                    placeholder="nama@perusahaan.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'password' && styles.inputFocused
                ]}>
                  <Lock size={20} color={focusedInput === 'password' ? '#2563EB' : '#94A3B8'} style={styles.inputIcon} />
                  <TextInput
                    value={formData.password}
                    onChangeText={(val) => handleChange('password', val)}
                    style={styles.input}
                    placeholder="Minimal 8 karakter"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    {showPassword ? (
                      <EyeOff size={20} color="#94A3B8" />
                    ) : (
                      <Eye size={20} color="#94A3B8" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.checkboxRow}>
                <TouchableOpacity 
                  style={[styles.checkbox, acceptTerms && styles.checkboxChecked]} 
                  onPress={() => setAcceptTerms(!acceptTerms)}
                >
                  {acceptTerms && <Check size={12} color="white" />}
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  Saya menyetujui <Text style={styles.linkText}>Syarat & Ketentuan</Text>.
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.8}
                style={[styles.button, isLoading && styles.buttonDisabled]}
              >
                {isLoading ? (
                  <View style={styles.loadingContent}>
                    <ActivityIndicator color="white" size="small" />
                    <Text style={styles.buttonText}>Memproses...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>Daftar Sekarang</Text>
                    <ArrowRight size={18} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Sudah punya akun?{' '}
                <Text 
                  onPress={() => router.push('/auth/login')}
                  style={styles.linkText}
                >
                  Masuk disini
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', 
  },
  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.2,
  },
  blobBlue: {
    backgroundColor: '#60A5FA',
    top: -50,
    left: -50,
  },
  blobPurple: {
    backgroundColor: '#C084FC',
    bottom: -50,
    right: -50,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
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
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  formSpace: {
    gap: 20,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 12,
  },
  inputFocused: {
    borderColor: '#2563EB',
    borderWidth: 1.5,
    backgroundColor: '#EFF6FF',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    marginRight: 8,
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
  },
  linkText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#475569',
  },
});