import React, { useState, useRef, useEffect } from 'react';
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
  NativeSyntheticEvent,
  TextInputKeyPressEventData
} from 'react-native';
import { ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const emailFromUrl = params.email as string;
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
        inputRefs.current[0]?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');

    if (verificationCode.length < 4) {
      Alert.alert('Peringatan', 'Silakan lengkapi kode verifikasi');
      return;
    }

    if (!emailFromUrl) {
      Alert.alert('Error', 'Email tidak ditemukan. Silakan daftar ulang atau login.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        email: emailFromUrl,
        code: verificationCode
      };

      const response = await axios.post(`${API_URL}/auth/verify`, payload);

      if (response.data.code === 200) {
        Alert.alert('Sukses', 'Verifikasi Berhasil! Silakan login.', [
            { text: 'Login', onPress: () => router.replace('/auth/login') }
        ]);
      } else {
        Alert.alert('Gagal', response.data.message || 'Verifikasi gagal');
      }

    } catch (error: any) {
      console.error('Verification error:', error);
      if (axios.isAxiosError(error)) {
        Alert.alert('Gagal', error.response?.data?.message || 'Kode verifikasi salah atau kedaluwarsa');
      } else {
        Alert.alert('Error', 'Terjadi kesalahan sistem');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    Alert.alert('Info', 'Fitur kirim ulang kode akan segera hadir.');
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
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <ShieldCheck size={28} color="white" />
              </View>
              <Text style={styles.title}>Verifikasi Email</Text>
              <Text style={styles.subtitle}>
                Masukkan 4 digit kode yang dikirim ke{'\n'}
                <Text style={styles.emailHighlight}>{emailFromUrl || 'email Anda'}</Text>
              </Text>
            </View>

            <View style={styles.formSpace}>
              <View style={styles.otpContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(el) => inputRefs.current[index] = el}
                    style={[
                      styles.otpInput,
                      digit ? styles.otpFilled : null, 
                      focusedIndex === index ? styles.otpFocused : null 
                    ]}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    selectTextOnFocus
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handleVerify}
                disabled={isLoading}
                activeOpacity={0.8}
                style={[styles.button, isLoading && styles.buttonDisabled]}
              >
                {isLoading ? (
                  <View style={styles.loadingContent}>
                    <ActivityIndicator color="white" size="small" />
                    <Text style={styles.buttonText}>Memvalidasi...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>Verifikasi Akun</Text>
                    <ArrowRight size={18} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Tidak menerima kode?</Text>
              <TouchableOpacity onPress={handleResendCode} style={styles.resendBtn}>
                <RotateCcw size={14} color="#2563EB" style={{ marginRight: 6 }} />
                <Text style={styles.resendText}>Kirim Ulang Kode</Text>
              </TouchableOpacity>
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
    right: -50,
  },
  blobPurple: {
    backgroundColor: '#C084FC', 
    bottom: -50,
    left: -50,
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
    width: 56,
    height: 56,
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
    textAlign: 'center',
    lineHeight: 20,
  },
  emailHighlight: {
    fontWeight: '600',
    color: '#334155', 
  },
  formSpace: {
    gap: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  otpInput: {
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1', 
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  otpFilled: {
    borderColor: '#2563EB',
    backgroundColor: '#F8FAFC',
  },
  otpFocused: {
    borderColor: '#2563EB', 
    borderWidth: 2,
    transform: [{ translateY: -2 }], 
  },
  button: {
    backgroundColor: '#2563EB',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 8,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
});