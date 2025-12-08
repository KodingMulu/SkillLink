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
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  // State Management
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState<boolean>(false);

  // Logic: Handle Submit (Simulasi API Call sesuai Web)
  const handleSubmit = () => {
    if (!email) {
      Alert.alert('Error', 'Mohon masukkan alamat email Anda');
      return;
    }

    setIsLoading(true);
    
    // Simulasi delay request seperti di Web code
    setTimeout(() => {
      console.log('Reset password request for:', email);
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  // Logic: Handle Resend Email
  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Resend email to:', email);
      Alert.alert('Berhasil', 'Email telah dikirim ulang!');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Background Blobs (Konsisten dengan halaman lain) */}
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
            
            {!isSuccess ? (
              // === STATE 1: INPUT FORM ===
              <>
                <View style={styles.header}>
                  <View style={styles.iconContainerBlue}>
                    <Mail size={28} color="white" />
                  </View>
                  <Text style={styles.title}>Ingin Merubah Password?</Text>
                  <Text style={styles.subtitle}>
                    Jangan khawatir, kami akan mengirimkan instruksi reset password ke email Anda
                  </Text>
                </View>

                <View style={styles.formSpace}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <View style={[styles.inputContainer, focusedInput && styles.inputFocused]}>
                      <Mail size={20} color={focusedInput ? '#2563EB' : '#94A3B8'} style={styles.inputIcon} />
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        placeholder="nama@email.com"
                        placeholderTextColor="#94A3B8"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onFocus={() => setFocusedInput(true)}
                        onBlur={() => setFocusedInput(false)}
                      />
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isLoading || !email}
                    style={[styles.button, (isLoading || !email) && styles.buttonDisabled]}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContent}>
                        <ActivityIndicator color="white" size="small" />
                        <Text style={styles.buttonText}>Mengirim...</Text>
                      </View>
                    ) : (
                      <Text style={styles.buttonText}>Kirim Link Reset Password</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => router.push('/auth/register')} 
                    style={styles.backLink}
                  >
                    <ArrowLeft size={16} color="#475569" />
                    <Text style={styles.backLinkText}>Daftar sekarang</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              // === STATE 2: SUCCESS MESSAGE ===
              <>
                <View style={styles.header}>
                  <View style={styles.iconContainerGreen}>
                    <CheckCircle size={32} color="#16A34A" />
                  </View>
                  <Text style={styles.title}>Email Terkirim!</Text>
                  <Text style={styles.subtitle}>
                    Kami telah mengirimkan link reset password ke
                  </Text>
                  <Text style={styles.emailHighlight}>{email}</Text>
                  <Text style={[styles.subtitle, { marginTop: 8, fontSize: 13 }]}>
                    Silakan cek inbox email Anda dan klik link yang diberikan untuk mengatur password baru
                  </Text>
                </View>

                {/* Tips Box */}
                <View style={styles.tipsBox}>
                  <Text style={styles.tipsText}>
                    <Text style={styles.tipsBold}>💡 Tips:</Text> Jika email tidak muncul dalam beberapa menit, cek folder spam atau junk email Anda
                  </Text>
                </View>

                <View style={styles.formSpace}>
                  <TouchableOpacity
                    onPress={handleResendEmail}
                    disabled={isLoading}
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContent}>
                        <ActivityIndicator color="white" size="small" />
                        <Text style={styles.buttonText}>Mengirim...</Text>
                      </View>
                    ) : (
                      <Text style={styles.buttonText}>Kirim Ulang Email</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => router.push('/auth/login')} 
                    style={styles.backLink}
                  >
                    <ArrowLeft size={16} color="#475569" />
                    <Text style={styles.backLinkText}>Kembali Login</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Footer Help */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Butuh bantuan?{' '}
                <Text style={styles.linkText}>Hubungi Support</Text>
              </Text>
            </View>
          </View>

          <Text style={styles.copyright}>© 2024 Your Company. All rights reserved.</Text>
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
  // Background Blobs
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
    marginBottom: 24,
  },
  // Icon Container untuk Step 1 (Biru)
  iconContainerBlue: {
    width: 64,
    height: 64,
    backgroundColor: '#2563EB', // blue-600 (Gradient simulation)
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  // Icon Container untuk Step 2 (Hijau/Success)
  iconContainerGreen: {
    width: 80,
    height: 80,
    backgroundColor: '#DCFCE7', // green-100
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827', // gray-900
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280', // gray-500
    textAlign: 'center',
    lineHeight: 20,
  },
  emailHighlight: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563EB', // blue-600
    marginTop: 8,
  },
  formSpace: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 12,
  },
  inputFocused: {
    borderColor: '#2563EB',
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 15,
    height: '100%',
  },
  button: {
    backgroundColor: '#2563EB', // Gradient simulation to solid blue
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD', // blue-300
    opacity: 0.8,
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
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  backLinkText: {
    color: '#4B5563', // gray-600
    fontSize: 14,
    fontWeight: '500',
  },
  // Tips Box Styles
  tipsBox: {
    backgroundColor: '#EFF6FF', // blue-50
    borderWidth: 1,
    borderColor: '#BFDBFE', // blue-200
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  tipsText: {
    fontSize: 13,
    color: '#1E40AF', // blue-800
    lineHeight: 20,
  },
  tipsBold: {
    fontWeight: '700',
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // gray-200
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#4B5563',
  },
  linkText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF', // gray-500
    marginTop: 24,
  },
});