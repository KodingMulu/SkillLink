import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
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
      Alert.alert('Berhasil', 'Email telah dikirim ulang!');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Surface style={styles.card} elevation={4}>
            
            {!isSuccess ? (
              <>
                {/* Header */}
                <View style={styles.header}>
                  <LinearGradient colors={['#3b82f6', '#9333ea']} style={styles.iconContainer}>
                    <MaterialCommunityIcons name="email" size={32} color="white" />
                  </LinearGradient>
                  <Text variant="headlineMedium" style={styles.title}>
                    Ingin Merubah Password?
                  </Text>
                  <Text variant="bodyMedium" style={styles.subtitle}>
                    Jangan khawatir, kami akan mengirimkan instruksi reset password ke email Anda
                  </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                  <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="email" />}
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    placeholder="nama@email.com"
                  />

                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={isLoading}
                    disabled={isLoading || !email}
                    style={styles.primaryButton}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                  >
                    {isLoading ? 'Mengirim...' : 'Kirim Link Reset Password'}
                  </Button>

                  <Link href="/auth/register" asChild>
                    <Button
                      mode="text"
                      icon="arrow-left"
                      style={styles.backButton}
                      labelStyle={styles.backButtonLabel}
                    >
                      Daftar sekarang
                    </Button>
                  </Link>
                </View>
              </>
            ) : (
              <>
                {/* Success State */}
                <View style={styles.header}>
                  <View style={styles.successCircle}>
                    <MaterialCommunityIcons name="check-circle" size={48} color="#16a34a" />
                  </View>
                  <Text variant="headlineMedium" style={styles.title}>
                    Email Terkirim!
                  </Text>
                  <Text variant="bodyMedium" style={styles.subtitle}>
                    Kami telah mengirimkan link reset password ke
                  </Text>
                  <Text style={styles.emailHighlight}>{email}</Text>
                  <Text variant="bodySmall" style={styles.subtitleSmall}>
                    Silakan cek inbox email Anda dan klik link yang diberikan untuk mengatur password baru
                  </Text>
                </View>

                {/* Tips Box */}
                <View style={styles.tipsBox}>
                  <Text style={styles.tipsText}>
                    💡 <Text style={styles.tipsBold}>Tips:</Text> Jika email tidak muncul dalam beberapa menit, cek folder spam atau junk email Anda
                  </Text>
                </View>

                {/* Actions */}
                <View style={styles.form}>
                  <Button
                    mode="contained"
                    onPress={handleResendEmail}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.primaryButton}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                  >
                    {isLoading ? 'Mengirim...' : 'Kirim Ulang Email'}
                  </Button>

                  <Link href="/auth/login" asChild>
                    <Button
                      mode="text"
                      icon="arrow-left"
                      style={styles.backButton}
                      labelStyle={styles.backButtonLabel}
                    >
                      Kembali Login
                    </Button>
                  </Link>
                </View>
              </>
            )}

            {/* Footer */}
            <Divider style={styles.divider} />
            <View style={styles.footer}>
              <Text variant="bodySmall" style={styles.footerText}>
                Butuh bantuan?{' '}
              </Text>
              <Button mode="text" compact labelStyle={styles.supportLink}>
                Hubungi Support
              </Button>
            </View>
          </Surface>

          {/* Copyright */}
          <Text style={styles.copyright}>
            © 2024 Your Company. All rights reserved.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  subtitleSmall: {
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  emailHighlight: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 18,
    marginTop: 8,
  },
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: 'white',
  },
  inputOutline: {
    borderRadius: 8,
  },
  primaryButton: {
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    marginTop: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 4,
  },
  backButtonLabel: {
    color: '#4b5563',
  },
  tipsBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  tipsText: {
    color: '#1e40af',
    fontSize: 14,
  },
  tipsBold: {
    fontWeight: '600',
  },
  divider: {
    marginTop: 24,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#4b5563',
  },
  supportLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  copyright: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
    marginTop: 24,
  },
});