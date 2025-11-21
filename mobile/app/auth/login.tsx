import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface, Checkbox } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log('Login attempt:', { email, password });
      alert(`Login berhasil!\nEmail: ${email}`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <LinearGradient
      colors={['#3b82f6', '#a855f7', '#ec4899']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Surface style={styles.card} elevation={4}>
            {/* Header */}
            <View style={styles.header}>
              <LinearGradient
                colors={['#3b82f6', '#9333ea']}
                style={styles.iconContainer}
              >
                <MaterialCommunityIcons name="lock" size={32} color="white" />
              </LinearGradient>
              <Text variant="headlineMedium" style={styles.title}>
                Selamat Datang
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Masuk ke akun Anda untuk melanjutkan
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
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
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
                outlineStyle={styles.inputOutline}
              />

              <View style={styles.optionsRow}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    status={rememberMe ? 'checked' : 'unchecked'}
                    onPress={() => setRememberMe(!rememberMe)}
                    color="#3b82f6"
                  />
                  <Text variant="bodySmall" style={styles.checkboxLabel}>
                    Ingat saya
                  </Text>
                </View>
                <Button
                  mode="text"
                  compact
                  onPress={() => router.push('/auth/forget-password')}
                  labelStyle={styles.forgotPassword}
                >
                  Lupa password?
                </Button>
              </View>

              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
                labelStyle={styles.loginButtonLabel}
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text variant="bodyMedium" style={styles.footerText}>
                Belum punya akun?{' '}
              </Text>
              <Button
                mode="text"
                compact
                onPress={() => router.push('/auth/register')}
                labelStyle={styles.registerLink}
              >
                Daftar sekarang
              </Button>
            </View>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
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
  title: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'white',
  },
  inputOutline: {
    borderRadius: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    color: '#4b5563',
  },
  forgotPassword: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#4b5563',
  },
  registerLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});