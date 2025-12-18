import React, { useState, useRef } from 'react';
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
  NativeSyntheticEvent,
  TextInputKeyPressEventData
} from 'react-native';
import { ShieldCheck, RefreshCw } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpInputRefs = useRef<Array<TextInput | null>>([]);
  const [focusedInput, setFocusedInput] = useState<number | null>(null);

  const handleVerifyCode = async () => {
    const codeValue = otp.join('');
    if (codeValue.length < 4) {
      Alert.alert('Peringatan', 'Masukkan 4 digit kode');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/verify-email`, {
        email,
        code: codeValue
      });

      if (response.data.code === 200) {
        Alert.alert('Sukses', 'Email berhasil diverifikasi!', [
          { text: 'Login Sekarang', onPress: () => router.replace('/auth/login') }
        ]);
      } else {
        Alert.alert('Gagal', response.data.message);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Gagal', error.response?.data?.message || 'Kode salah atau kadaluwarsa');
      } else {
        Alert.alert('Error', 'Terjadi kesalahan server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/resend-verification`, {
        email
      });

      if (response.data.code === 200) {
        Alert.alert('Sukses', 'Kode verifikasi telah dikirim ulang ke email Anda');
        setOtp(['', '', '', '']);
        otpInputRefs.current[0]?.focus();
      } else {
        Alert.alert('Gagal', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim ulang kode');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
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
                <ShieldCheck size={32} color="white" strokeWidth={2.5} />
              </View>

              <Text style={styles.title}>Verifikasi Email</Text>

              <Text style={styles.subtitle}>
                Masukkan 4 digit kode yang dikirim ke{'\n'}
                <Text style={styles.emailText}>{email || 'email Anda'}</Text>
              </Text>
            </View>

            <View style={styles.formSpace}>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => otpInputRefs.current[index] = ref}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    style={[
                      styles.otpInput,
                      digit ? styles.otpFilled : null,
                      focusedInput === index ? styles.otpFocused : null
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    onFocus={() => setFocusedInput(index)}
                    onBlur={() => setFocusedInput(null)}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handleVerifyCode}
                disabled={isLoading}
                style={[styles.button, isLoading && styles.buttonDisabled]}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Memverifikasi...' : 'Verifikasi Akun'}
                </Text>
              </TouchableOpacity>

              <View style={styles.resendSection}>
                <Text style={styles.resendText}>Tidak menerima kode?</Text>
                <TouchableOpacity 
                  onPress={handleResendCode}
                  disabled={isLoading}
                  style={styles.resendButton}
                >
                  <RefreshCw size={14} color="#2563EB" />
                  <Text style={styles.resendButtonText}>Kirim Ulang Kode</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 72,
    height: 72,
    backgroundColor: '#2563EB',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  emailText: {
    fontWeight: '600',
    color: '#334155',
  },
  formSpace: {
    gap: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  otpInput: {
    width: 64,
    height: 64,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  otpFilled: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  otpFocused: {
    borderColor: '#2563EB',
    borderWidth: 2.5,
    backgroundColor: '#EFF6FF',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  resendSection: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
  },
  resendText: {
    fontSize: 14,
    color: '#64748B',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  resendButtonText: {
    fontSize: 15,
    color: '#2563EB',
    fontWeight: '600',
  },
});