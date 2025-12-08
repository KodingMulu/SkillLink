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
  ActivityIndicator
} from 'react-native';
import { Eye, EyeOff, Mail, ArrowRight, Lock, LogIn, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

// Konfigurasi API URL (Gunakan IP komputer Anda jika di emulator: 10.0.2.2 untuk Android)
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api';

export default function LoginScreen() {
  const router = useRouter();

  // State Management
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // State untuk efek UI (Focus border style)
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Handle Input Change
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle Submit (Logika sama persis dengan Web)
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      if (response.data.code === 200) {
        Alert.alert('Sukses', 'Login berhasil! Selamat datang kembali.', [
          { 
            text: 'OK', 
            onPress: () => router.push('/user/dashboard') // Sesuaikan route dashboard Anda
          }
        ]);
      } else {
        Alert.alert('Gagal', 'Login Gagal');
      }

    } catch (error: any) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        Alert.alert('Gagal', error.response?.data?.message || 'Email atau password salah');
      } else {
        Alert.alert('Error', 'Terjadi kesalahan pada server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Blobs (Efek Visual seperti Web) */}
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
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <LogIn size={24} color="white" />
              </View>
              <Text style={styles.title}>Selamat Datang</Text>
              <Text style={styles.subtitle}>Masuk ke akun Anda untuk melanjutkan</Text>
            </View>

            {/* Form */}
            <View style={styles.formSpace}>
              
              {/* Email Input */}
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
                    placeholder="nama@email.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              {/* Password Input */}
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
                    placeholder="••••••••"
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

              {/* Options Row (Remember Me & Forgot Password) */}
              <View style={styles.optionsRow}>
                <View style={styles.rememberContainer}>
                  <TouchableOpacity 
                    style={[styles.checkbox, rememberMe && styles.checkboxChecked]} 
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && <Check size={12} color="white" />}
                  </TouchableOpacity>
                  <Text style={styles.rememberText} onPress={() => setRememberMe(!rememberMe)}>
                    Ingat saya
                  </Text>
                </View>
                
                <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
                  <Text style={styles.forgotLink}>Lupa password?</Text>
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
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
                    <Text style={styles.buttonText}>Masuk</Text>
                    <ArrowRight size={18} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Belum punya akun?{' '}
                <Text 
                  onPress={() => router.push('/auth/register')}
                  style={styles.linkText}
                >
                  Daftar sekarang
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
    backgroundColor: '#F8FAFC', // slate-50
  },
  // Efek Blob Background
  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.2,
  },
  blobBlue: {
    backgroundColor: '#60A5FA', // blue-400
    top: -50,
    left: -50,
  },
  blobPurple: {
    backgroundColor: '#C084FC', // purple-400
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
    borderColor: '#E2E8F0', // slate-200
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
    backgroundColor: '#2563EB', // blue-600
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
    color: '#0F172A', // slate-900
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B', // slate-500
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
    color: '#334155', // slate-700
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1', // slate-300
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 12,
  },
  inputFocused: {
    borderColor: '#2563EB', // blue-600
    borderWidth: 1.5,
    backgroundColor: '#EFF6FF', // optional tint
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
  // Options Row Styling
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  rememberText: {
    fontSize: 13,
    color: '#475569', // slate-600
  },
  forgotLink: {
    fontSize: 13,
    color: '#2563EB', // blue-600
    fontWeight: '500',
  },
  // Button Styling
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
  // Footer Styling
  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9', // slate-100 equivalent
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#475569',
  },
  linkText: {
    color: '#2563EB',
    fontWeight: '600',
  },
});