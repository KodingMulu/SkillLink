import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  IconButton,
  List,
  Surface,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgetPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendEmail = () => {
    setError('');
    
    if (!email) {
      setError('Email tidak boleh kosong');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleResetPassword = () => {
    setError('');
    
    if (!newPassword || !confirmPassword) {
      setError('Semua field harus diisi');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password minimal 8 karakter');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Sukses', 'Password berhasil diubah!');
    }, 1500);
  };

  return (
    <LinearGradient
      colors={['#3b82f6', '#a855f7', '#ec4899']}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.card}>
          {/* Step 1: Email Input */}
          {step === 1 && (
            <Card.Content>
              <IconButton
                icon="arrow-left"
                size={24}
                onPress={() => console.log('Back')}
                style={styles.backButton}
              />

              <View style={styles.header}>
                <Surface style={styles.iconContainer}>
                  <IconButton icon="lock" size={32} iconColor="#fff" />
                </Surface>
                <Text variant="headlineMedium" style={styles.title}>
                  Lupa Password?
                </Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                  Masukkan email Anda dan kami akan mengirimkan link untuk reset password
                </Text>
              </View>

              {error && (
                <Surface style={styles.errorContainer}>
                  <IconButton icon="alert-circle" size={20} iconColor="#ef4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </Surface>
              )}

              <TextInput
                label="Email Address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
                mode="outlined"
                left={<TextInput.Icon icon="email" />}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                placeholder="nama@email.com"
              />

              <Button
                mode="contained"
                onPress={handleSendEmail}
                loading={loading}
                disabled={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                {loading ? 'Mengirim...' : 'Konfirmasi'}
              </Button>

              <View style={styles.footer}>
                <Text variant="bodySmall" style={styles.footerText}>
                  Ingat password Anda?{' '}
                  <Text 
                    style={styles.link}
                    onPress={() => console.log('Login')}
                  >
                    Masuk di sini
                  </Text>
                </Text>
              </View>
            </Card.Content>
          )}

          {/* Step 2: Success Message */}
          {step === 2 && (
            <Card.Content>
              <View style={styles.header}>
                <Surface style={[styles.iconContainer, styles.successIcon]}>
                  <IconButton icon="check-circle" size={48} iconColor="#22c55e" />
                </Surface>
                <Text variant="headlineMedium" style={styles.title}>
                  Email Terkirim!
                </Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                  Kami telah mengirimkan link reset password ke
                </Text>
                <Text variant="bodyMedium" style={styles.emailText}>
                  {email}
                </Text>
                <Text variant="bodySmall" style={styles.smallText}>
                  Silakan cek inbox atau folder spam email Anda. Link akan kadaluarsa dalam 1 jam.
                </Text>
              </View>

              <Surface style={styles.infoBox}>
                <Text variant="titleSmall" style={styles.infoTitle}>
                  Tidak menerima email?
                </Text>
                <List.Item
                  title="Periksa folder spam atau junk mail"
                  titleNumberOfLines={2}
                  titleStyle={styles.listItem}
                  left={props => <List.Icon {...props} icon="circle-small" />}
                />
                <List.Item
                  title="Pastikan email yang dimasukkan benar"
                  titleNumberOfLines={2}
                  titleStyle={styles.listItem}
                  left={props => <List.Icon {...props} icon="circle-small" />}
                />
                <List.Item
                  title="Tunggu beberapa menit, email mungkin terlambat"
                  titleNumberOfLines={2}
                  titleStyle={styles.listItem}
                  left={props => <List.Icon {...props} icon="circle-small" />}
                />
              </Surface>

              <Button
                mode="outlined"
                onPress={handleSendEmail}
                loading={loading}
                disabled={loading}
                style={styles.outlinedButton}
                contentStyle={styles.buttonContent}
              >
                {loading ? 'Mengirim ulang...' : 'Kirim Ulang Email'}
              </Button>

              <Button
                mode="contained"
                onPress={() => setStep(3)}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Sudah Punya Kode? Reset Password
              </Button>

              <Button
                mode="text"
                onPress={() => console.log('Back to login')}
                icon="arrow-left"
                style={styles.textButton}
              >
                Kembali ke halaman login
              </Button>
            </Card.Content>
          )}

          {/* Step 3: Reset Password Form */}
          {step === 3 && (
            <Card.Content>
              <IconButton
                icon="arrow-left"
                size={24}
                onPress={() => setStep(2)}
                style={styles.backButton}
              />

              <View style={styles.header}>
                <Surface style={styles.iconContainer}>
                  <IconButton icon="lock" size={32} iconColor="#fff" />
                </Surface>
                <Text variant="headlineMedium" style={styles.title}>
                  Buat Password Baru
                </Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                  Password baru harus berbeda dengan password sebelumnya
                </Text>
              </View>

              {error && (
                <Surface style={styles.errorContainer}>
                  <IconButton icon="alert-circle" size={20} iconColor="#ef4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </Surface>
              )}

              <TextInput
                label="Password Baru"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setError('');
                }}
                mode="outlined"
                secureTextEntry={!showPassword}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
                placeholder="Minimal 8 karakter"
              />

              <TextInput
                label="Konfirmasi Password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError('');
                }}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                style={styles.input}
                placeholder="Ulangi password baru"
              />

              <Surface style={styles.requirementsBox}>
                <Text variant="titleSmall" style={styles.requirementsTitle}>
                  Password harus mengandung:
                </Text>
                <View style={styles.requirement}>
                  <Surface
                    style={[
                      styles.requirementDot,
                      newPassword.length >= 8 && styles.requirementDotActive
                    ]}
                  >
                    {newPassword.length >= 8 && (
                      <IconButton icon="check" size={12} iconColor="#fff" />
                    )}
                  </Surface>
                  <Text
                    style={[
                      styles.requirementText,
                      newPassword.length >= 8 && styles.requirementTextActive
                    ]}
                  >
                    Minimal 8 karakter
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <Surface
                    style={[
                      styles.requirementDot,
                      /[A-Z]/.test(newPassword) && styles.requirementDotActive
                    ]}
                  >
                    {/[A-Z]/.test(newPassword) && (
                      <IconButton icon="check" size={12} iconColor="#fff" />
                    )}
                  </Surface>
                  <Text
                    style={[
                      styles.requirementText,
                      /[A-Z]/.test(newPassword) && styles.requirementTextActive
                    ]}
                  >
                    Huruf kapital (A-Z)
                  </Text>
                </View>
                <View style={styles.requirement}>
                  <Surface
                    style={[
                      styles.requirementDot,
                      /[0-9]/.test(newPassword) && styles.requirementDotActive
                    ]}
                  >
                    {/[0-9]/.test(newPassword) && (
                      <IconButton icon="check" size={12} iconColor="#fff" />
                    )}
                  </Surface>
                  <Text
                    style={[
                      styles.requirementText,
                      /[0-9]/.test(newPassword) && styles.requirementTextActive
                    ]}
                  >
                    Angka (0-9)
                  </Text>
                </View>
              </Surface>

              <Button
                mode="contained"
                onPress={handleResetPassword}
                loading={loading}
                disabled={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                {loading ? 'Memproses...' : 'Reset Password'}
              </Button>
            </Card.Content>
          )}
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    borderRadius: 16,
    elevation: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: -8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#a855f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
  },
  successIcon: {
    backgroundColor: '#dcfce7',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 8,
  },
  emailText: {
    color: '#a855f7',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  smallText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#a855f7',
  },
  outlinedButton: {
    marginTop: 8,
    marginBottom: 8,
    borderColor: '#a855f7',
  },
  textButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#6b7280',
  },
  link: {
    color: '#a855f7',
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
    marginLeft: 12,
  },
  listItem: {
    fontSize: 14,
    color: '#1e40af',
  },
  requirementsBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  requirementsTitle: {
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  requirementDotActive: {
    backgroundColor: '#22c55e',
  },
  requirementText: {
    fontSize: 14,
    color: '#6b7280',
  },
  requirementTextActive: {
    color: '#22c55e',
  },
});