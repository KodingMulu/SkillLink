import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert, Dimensions
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const emailFromUrl = params.email as string;

  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      const newCode = [...code];
      text.split('').slice(0, 4).forEach((char, i) => {
        if (index + i < 4) newCode[index + i] = char;
      });
      setCode(newCode);
      const lastIndex = Math.min(index + text.length, 3);
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
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
          { text: 'OK', onPress: () => router.replace('/login') }
        ]);
      } else {
        Alert.alert('Gagal', response.data.message);
      }

    } catch (error: any) {
      const message = error.response?.data?.message || 'Kode verifikasi salah atau kedaluwarsa';
      Alert.alert('Gagal', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    Alert.alert('Info', 'Fitur kirim ulang kode akan segera hadir.');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.container}
    >
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[s.blob, s.blobTop]} />
        <View style={[s.blob, s.blobBottom]} />

        <View style={s.card}>
          <View style={s.header}>
            <View style={s.iconWrapper}>
              <ShieldCheck size={32} color="white" />
            </View>
            <Text style={s.title}>Verifikasi Email</Text>
            <Text style={s.subtitle}>
              Masukkan 4 digit kode yang dikirim ke
            </Text>
            <Text style={s.emailText}>{emailFromUrl || 'email Anda'}</Text>
          </View>

          <View style={s.form}>
            <View style={s.otpContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref }}
                  style={[s.otpInput, digit ? s.otpFilled : null]}
                  value={digit}
                  onChangeText={(val) => handleOtpChange(val, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={4}
                  textAlign="center"
                  selectTextOnFocus
                />
              ))}
            </View>

            <TouchableOpacity
              style={s.submitBtn}
              onPress={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={s.btnContent}>
                  <ActivityIndicator color="white" style={s.loadingIcon} />
                  <Text style={s.submitBtnText}>Memvalidasi...</Text>
                </View>
              ) : (
                <View style={s.btnContent}>
                  <Text style={s.submitBtnText}>Verifikasi Akun</Text>
                  <ArrowRight size={20} color="white" style={{ marginLeft: 8 }} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={s.footer}>
            <Text style={s.footerText}>Tidak menerima kode?</Text>
            <TouchableOpacity onPress={handleResendCode} style={s.resendBtn}>
              <RotateCcw size={14} color="#2563EB" style={{ marginRight: 6 }} />
              <Text style={s.linkText}>Kirim Ulang Kode</Text>
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
    right: -50,
  },
  blobBottom: {
    backgroundColor: '#A78BFA',
    bottom: -100,
    left: -50,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
    width: 64,
    height: 64,
    backgroundColor: '#2563EB',
    borderRadius: 16,
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  emailText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  form: {
    gap: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  otpFilled: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingIcon: {
    marginRight: 8,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    color: '#64748B',
    marginBottom: 12,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: 'bold',
  },
});