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
  ActivityIndicator,
  NativeSyntheticEvent,
  TextInputKeyPressEventData
} from 'react-native';
import { Mail, ArrowLeft, KeyRound, CheckCircle2, ArrowRight, Lock, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpInputRefs = useRef<Array<TextInput | null>>([]);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleSendEmail = async () => {
    if (!email) { Alert.alert('Error', 'Email wajib diisi'); return; }
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      if (response.data.code === 200) {
        setStep(2);
      } else {
        Alert.alert('Gagal', response.data.message);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Gagal', error.response?.data?.message || 'Email tidak ditemukan');
      } else {
        Alert.alert('Error', 'Terjadi kesalahan server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const codeValue = otp.join('');
    if (codeValue.length < 4) {
      Alert.alert('Peringatan', 'Masukkan 4 digit kode');
      return;
    }

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
      Alert.alert('Gagal', 'Kode salah atau kadaluwarsa');
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

  const handleResetPassword = async () => {
    if (passwords.new !== passwords.confirm) {
      Alert.alert('Error', 'Password tidak cocok');
      return;
    }
    if (passwords.new.length < 8) {
        Alert.alert('Error', 'Password minimal 8 karakter');
        return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/change-password`, {
        email,
        password: passwords.new
      });

      if (response.data.code === 200) {
        Alert.alert('Sukses', 'Password berhasil diubah! Silakan login.', [
            { text: 'Login Sekarang', onPress: () => router.replace('/auth/login') }
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
                {step === 1 && <KeyRound size={24} color="white" />}
                {step === 2 && <Mail size={24} color="white" />}
                {step === 3 && <CheckCircle2 size={24} color="white" />}
              </View>

              <Text style={styles.title}>
                {step === 1 && 'Lupa Password?'}
                {step === 2 && 'Cek Email Anda'}
                {step === 3 && 'Password Baru'}
              </Text>

              <Text style={styles.subtitle}>
                {step === 1 && 'Masukkan email Anda untuk menerima kode reset.'}
                {step === 2 && `Kami telah mengirim kode 4 digit ke ${email}`}
                {step === 3 && 'Buat password baru yang aman untuk akun Anda.'}
              </Text>
            </View>

            {step === 1 && (
              <View style={styles.formSpace}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={[styles.inputContainer, focusedInput === 'email' && styles.inputFocused]}>
                    <Mail size={20} color={focusedInput === 'email' ? '#2563EB' : '#94A3B8'} style={styles.inputIcon} />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
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

                <TouchableOpacity
                  onPress={handleSendEmail}
                  disabled={isLoading}
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                >
                  {isLoading ? (
                    <Text style={styles.buttonText}>Mengirim...</Text>
                  ) : (
                    <Text style={styles.buttonText}>Kirim Kode</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {step === 2 && (
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
                        focusedInput === `otp-${index}` ? styles.inputFocused : null
                      ]}
                      keyboardType="number-pad"
                      maxLength={1}
                      onFocus={() => setFocusedInput(`otp-${index}`)}
                      onBlur={() => setFocusedInput(null)}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  onPress={handleVerifyCode}
                  disabled={isLoading}
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                >
                  {isLoading ? <Text style={styles.buttonText}>Memverifikasi...</Text> : <Text style={styles.buttonText}>Lanjut</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStep(1)} style={styles.textBtn}>
                   <Text style={styles.textBtnText}>Salah email? Kembali</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 3 && (
              <View style={styles.formSpace}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password Baru</Text>
                  <View style={[styles.inputContainer, focusedInput === 'new' && styles.inputFocused]}>
                    <Lock size={20} color={focusedInput === 'new' ? '#2563EB' : '#94A3B8'} style={styles.inputIcon} />
                    <TextInput
                      value={passwords.new}
                      onChangeText={(val) => setPasswords({...passwords, new: val})}
                      style={styles.input}
                      placeholder="Minimal 8 karakter"
                      secureTextEntry={!showPassword}
                      onFocus={() => setFocusedInput('new')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Konfirmasi Password</Text>
                  <View style={[styles.inputContainer, focusedInput === 'confirm' && styles.inputFocused]}>
                    <Lock size={20} color={focusedInput === 'confirm' ? '#2563EB' : '#94A3B8'} style={styles.inputIcon} />
                    <TextInput
                      value={passwords.confirm}
                      onChangeText={(val) => setPasswords({...passwords, confirm: val})}
                      style={styles.input}
                      placeholder="Ulangi password"
                      secureTextEntry={!showPassword}
                      onFocus={() => setFocusedInput('confirm')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                </View>

                <View style={styles.checkboxRow}>
                    <TouchableOpacity 
                    style={[styles.checkbox, showPassword && styles.checkboxChecked]} 
                    onPress={() => setShowPassword(!showPassword)}
                    >
                    {showPassword && <Check size={12} color="white" />}
                    </TouchableOpacity>
                    <Text style={styles.checkboxLabel} onPress={() => setShowPassword(!showPassword)}>
                        Tampilkan password
                    </Text>
                </View>

                <TouchableOpacity
                  onPress={handleResetPassword}
                  disabled={isLoading}
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                >
                  {isLoading ? <Text style={styles.buttonText}>Menyimpan...</Text> : <Text style={styles.buttonText}>Reset Password</Text>}
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => router.replace('/auth/login')} style={styles.backLink}>
                    <ArrowLeft size={16} color="#475569" />
                    <Text style={styles.backLinkText}>Kembali ke Login</Text>
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
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 8,
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
  button: {
    backgroundColor: '#2563EB',
    height: 48,
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  otpFilled: {
    borderColor: '#2563EB',
    backgroundColor: '#F8FAFC',
  },
  textBtn: {
    alignItems: 'center',
  },
  textBtnText: {
    color: '#64748B',
    fontSize: 14,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -4,
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
  checkboxLabel: {
    color: '#475569',
    fontSize: 14,
  },
  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backLinkText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
});