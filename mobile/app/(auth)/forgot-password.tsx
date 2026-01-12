import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert, Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, ArrowLeft, KeyRound, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleSendEmail = async () => {
    if (!email) return Alert.alert('Error', 'Email wajib diisi');
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      if (response.data.code === 200) {
        setStep(2);
      } else {
        Alert.alert('Gagal', response.data.message);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Email tidak ditemukan';
      Alert.alert('Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const codeValue = otp.join('');
    if (codeValue.length < 4) return Alert.alert('Error', 'Masukkan 4 digit kode');

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/verify-reset-code`, {
        email,
        code: codeValue
      });
      if (response.data.code === 200) {
        setStep(3);
      } else {
        Alert.alert('Gagal', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Kode salah atau kadaluwarsa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (passwords.new !== passwords.confirm) return Alert.alert('Error', 'Password tidak cocok');
    if (passwords.new.length < 8) return Alert.alert('Error', 'Password minimal 8 karakter');

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/change-password`, {
        email,
        password: passwords.new
      });
      if (response.data.code === 200) {
        Alert.alert('Sukses', 'Password berhasil diubah! Silakan login.', [
          { text: 'OK', onPress: () => router.push('/login') }
        ]);
      } else {
        Alert.alert('Gagal', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengubah password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.container}
    >
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Decorator Blobs */}
        <View style={[s.blob, s.blobTop]} />
        <View style={[s.blob, s.blobBottom]} />

        <View style={s.card}>
          <View style={s.header}>
            <View style={s.iconWrapper}>
              {step === 1 && <KeyRound size={28} color="white" />}
              {step === 2 && <Mail size={28} color="white" />}
              {step === 3 && <CheckCircle2 size={28} color="white" />}
            </View>
            <Text style={s.title}>
              {step === 1 && 'Lupa Password?'}
              {step === 2 && 'Cek Email Anda'}
              {step === 3 && 'Password Baru'}
            </Text>
            <Text style={s.subtitle}>
              {step === 1 && 'Masukkan email Anda untuk menerima kode reset.'}
              {step === 2 && `Kami telah mengirim kode 4 digit ke ${email}`}
              {step === 3 && 'Buat password baru yang aman untuk akun Anda.'}
            </Text>
          </View>

          <View style={s.form}>
            {step === 1 && (
              <>
                <View style={s.inputGroup}>
                  <Text style={s.label}>Email</Text>
                  <View style={s.inputContainer}>
                    <Mail size={20} color="#94A3B8" style={s.inputIcon} />
                    <TextInput
                      style={s.input}
                      placeholder="nama@email.com"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                <TouchableOpacity style={s.submitBtn} onPress={handleSendEmail} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={s.submitBtnText}>Kirim Kode</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {step === 2 && (
              <>
                <View style={s.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => { inputRefs.current[index] = ref }}
                      style={[s.otpInput, digit ? s.otpFilled : null]}
                      value={digit}
                      onChangeText={(val) => handleOtpChange(index, val)}
                      onKeyPress={(e) => handleOtpKeyPress(index, e)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                    />
                  ))}
                </View>
                <TouchableOpacity style={s.submitBtn} onPress={handleVerifyCode} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={s.submitBtnText}>Lanjut</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStep(1)} style={s.textLinkBtn}>
                  <Text style={s.textLink}>Salah email? Kembali</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 3 && (
              <>
                <View style={s.inputGroup}>
                  <Text style={s.label}>Password Baru</Text>
                  <View style={s.inputContainer}>
                    <Lock size={20} color="#94A3B8" style={s.inputIcon} />
                    <TextInput
                      style={s.input}
                      placeholder="Minimal 8 karakter"
                      value={passwords.new}
                      onChangeText={(t) => setPasswords(p => ({ ...p, new: t }))}
                      secureTextEntry={!showPassword}
                    />
                  </View>
                </View>
                <View style={s.inputGroup}>
                  <Text style={s.label}>Konfirmasi Password</Text>
                  <View style={s.inputContainer}>
                    <Lock size={20} color="#94A3B8" style={s.inputIcon} />
                    <TextInput
                      style={s.input}
                      placeholder="Ulangi password"
                      value={passwords.confirm}
                      onChangeText={(t) => setPasswords(p => ({ ...p, confirm: t }))}
                      secureTextEntry={!showPassword}
                    />
                  </View>
                </View>
                <TouchableOpacity style={s.showPassToggle} onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} color="#2563EB" /> : <Eye size={18} color="#94A3B8" />}
                  <Text style={s.showPassText}>{showPassword ? 'Sembunyikan' : 'Tampilkan'} Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={s.submitBtn} onPress={handleResetPassword} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={s.submitBtnText}>Reset Password</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={s.footer}>
            <TouchableOpacity onPress={() => router.push('/login')} style={s.backBtn}>
              <ArrowLeft size={16} color="#64748B" />
              <Text style={s.backText}>Kembali ke Login</Text>
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
    backgroundColor: 'rgba(255,255,255,0.95)',
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
    width: 56,
    height: 56,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  form: {
    gap: 20,
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
  submitBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  },
  otpFilled: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  textLinkBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  textLink: {
    color: '#64748B',
    fontSize: 14,
  },
  showPassToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  showPassText: {
    color: '#64748B',
    fontSize: 13,
  },
  footer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
});