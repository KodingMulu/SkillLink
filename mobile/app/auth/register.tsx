import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, Checkbox } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    if (!acceptTerms) {
      Alert.alert('Peringatan', 'Anda harus menyetujui syarat dan ketentuan');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      console.log('Register attempt:', formData);
      Alert.alert(
        'Berhasil',
        `Registrasi berhasil!\nNama: ${formData.fullName}\nEmail: ${formData.email}`
      );
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
                <MaterialCommunityIcons name="account" size={32} color="white" />
              </LinearGradient>
              <Text variant="headlineMedium" style={styles.title}>
                Buat Akun Baru
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Daftar untuk memulai perjalanan Anda
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <TextInput
                label="User Name"
                value={formData.fullName}
                onChangeText={(value) => handleChange('fullName', value)}
                mode="outlined"
                left={<TextInput.Icon icon="account" />}
                style={styles.input}
                outlineStyle={styles.inputOutline}
                placeholder="Masukkan nama lengkap"
              />

              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
                style={styles.input}
                outlineStyle={styles.inputOutline}
                placeholder="nama@email.com"
              />

              <TextInput
                label="Password"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
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
                placeholder="••••••••"
              />

              {/* Terms Checkbox */}
              <View style={styles.termsContainer}>
                <Checkbox
                  status={acceptTerms ? 'checked' : 'unchecked'}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                  color="#3b82f6"
                />
                <View style={styles.termsTextContainer}>
                  <Text variant="bodySmall" style={styles.termsText}>
                    Saya setuju dengan{' '}
                  </Text>
                  <Button
                    mode="text"
                    compact
                    labelStyle={styles.termsLink}
                    onPress={() => console.log('Syarat dan ketentuan')}
                  >
                    syarat dan ketentuan
                  </Button>
                  <Text variant="bodySmall" style={styles.termsText}>
                    {' '}serta{' '}
                  </Text>
                  <Button
                    mode="text"
                    compact
                    labelStyle={styles.termsLink}
                    onPress={() => console.log('Kebijakan privasi')}
                  >
                    kebijakan privasi
                  </Button>
                </View>
              </View>

              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
                style={styles.registerButton}
                contentStyle={styles.registerButtonContent}
                labelStyle={styles.registerButtonLabel}
              >
                {isLoading ? 'Memproses...' : 'Daftar'}
              </Button>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text variant="bodyMedium" style={styles.footerText}>
                Sudah punya akun?{' '}
              </Text>
              <Button
                mode="text"
                compact
                onPress={() => router.push('/auth/login')}
                labelStyle={styles.loginLink}
              >
                Masuk
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  termsText: {
    color: '#4b5563',
  },
  termsLink: {
    color: '#3b82f6',
    fontWeight: '500',
    fontSize: 12,
  },
  registerButton: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
  },
  registerButtonContent: {
    paddingVertical: 8,
  },
  registerButtonLabel: {
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
  loginLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});