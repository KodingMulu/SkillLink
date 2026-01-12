import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert, Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    if (!email) {
      Alert.alert('Peringatan', 'Mohon isi email terlebih dahulu');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Reset password request for:', email);
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Resend email to:', email);
      Alert.alert('Sukses', 'Email telah dikirim ulang!');
      setIsLoading(false);
    }, 1500);
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
          {!isSuccess ? (
            <>
              <View style={s.header}>
                <View style={s.iconWrapper}>
                  <Mail size={32} color="white" />
                </View>
                <Text style={s.title}>Ingin Merubah Password?</Text>
                <Text style={s.subtitle}>
                  Jangan khawatir, kami akan mengirimkan instruksi reset password ke email Anda
                </Text>
              </View>

              <View style={s.form}>
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

                <TouchableOpacity
                  style={s.submitBtn}
                  onPress={handleSubmit}
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <View style={s.btnContent}>
                      <ActivityIndicator color="white" style={s.loadingIcon} />
                      <Text style={s.submitBtnText}>Mengirim...</Text>
                    </View>
                  ) : (
                    <Text style={s.submitBtnText}>Kirim Link Reset Password</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={s.backBtn}
                  onPress={() => router.push('/register')}
                >
                  <ArrowLeft size={16} color="#475569" />
                  <Text style={s.backBtnText}>Daftar sekarang</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={s.header}>
                <View style={s.successIconWrapper}>
                  <CheckCircle size={48} color="#16A34A" />
                </View>
                <Text style={s.title}>Email Terkirim!</Text>
                <Text style={s.subtitle}>Kami telah mengirimkan link reset password ke</Text>
                <Text style={s.emailText}>{email}</Text>
                <Text style={s.infoText}>
                  Silakan cek inbox email Anda dan klik link yang diberikan untuk mengatur password baru
                </Text>
              </View>

              <View style={s.tipBox}>
                <Text style={s.tipText}>
                  <Text style={s.tipLabel}>💡 Tips: </Text>
                  Jika email tidak muncul dalam beberapa menit, cek folder spam atau junk email Anda
                </Text>
              </View>

              <View style={s.actionButtons}>
                <TouchableOpacity
                  style={s.submitBtn}
                  onPress={handleResendEmail}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <View style={s.btnContent}>
                      <ActivityIndicator color="white" style={s.loadingIcon} />
                      <Text style={s.submitBtnText}>Mengirim...</Text>
                    </View>
                  ) : (
                    <Text style={s.submitBtnText}>Kirim Ulang Email</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={s.backBtn}
                  onPress={() => router.push('/login')}
                >
                  <ArrowLeft size={16} color="#475569" />
                  <Text style={s.backBtnText}>Kembali Login</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={s.footer}>
            <Text style={s.footerText}>Butuh bantuan? </Text>
            <TouchableOpacity>
              <Text style={s.linkText}>Hubungi Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={s.copyright}>© 2024 Your Company. All rights reserved.</Text>
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
  successIconWrapper: {
    width: 80,
    height: 80,
    backgroundColor: '#DCFCE7',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    lineHeight: 20,
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
    marginVertical: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
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
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  backBtnText: {
    marginLeft: 8,
    color: '#475569',
    fontWeight: '600',
  },
  tipBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tipText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  tipLabel: {
    fontWeight: 'bold',
  },
  actionButtons: {
    gap: 16,
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
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 24,
  },
});