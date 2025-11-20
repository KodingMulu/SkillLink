import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  Checkbox,
  ActivityIndicator,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok!');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'Anda harus menyetujui syarat dan ketentuan');
      return;
    }

    setIsLoading(true);

    // setTimeout(() => {
    //   console.log('Register attempt:', formData);
    //   Alert.alert(
    //     'Berhasil',
    //     `Registrasi berhasil!\nNama: ${formData.fullName}\nEmail: ${formData.email}`,
    //     [
    //       {
    //         text: 'OK',
    //         onPress: () => router.push('/auth/login'),
    //       },
    //     ]
    //   );
    //   setIsLoading(false);
    // }, 1500);
  };

  return (
    <LinearGradient
      colors={['#3b82f6', '#a855f7', '#ec4899']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['#3b82f6', '#9333ea']}
                  style={styles.iconGradient}
                >
                  <Text style={styles.iconText}>👤</Text>
                </LinearGradient>
              </View>
              <Text variant="headlineMedium" style={styles.title}>
                Buat Akun Baru
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Daftar untuk memulai perjalanan Anda
              </Text>
            </View>

            <View style={styles.form}>
              <TextInput
                label="User Name"
                value={formData.fullName}
                onChangeText={(text) => handleChange('fullName', text)}
                mode="outlined"
                left={<TextInput.Icon icon="account" />}
                placeholder="Masukkan nama lengkap"
                style={styles.input}
              />

              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
                placeholder="nama@email.com"
                style={styles.input}
              />

              <TextInput
                label="Password"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                mode="outlined"
                secureTextEntry={!showPassword}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                placeholder="••••••••"
                style={styles.input}
              />

              <TextInput
                label="Konfirmasi Password"
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                placeholder="••••••••"
                style={styles.input}
              />

              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={acceptTerms ? 'checked' : 'unchecked'}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                />
                <Text variant="bodySmall" style={styles.checkboxText}>
                  Saya setuju dengan{' '}
                  <Text style={styles.link}>syarat dan ketentuan</Text> serta{' '}
                  <Text style={styles.link}>kebijakan privasi</Text>
                </Text>
              </View>

              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={isLoading}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                {isLoading ? <ActivityIndicator color="#fff" /> : 'Daftar'}
              </Button>
            </View>

            {/* <View style={styles.footer}>
              <Text variant="bodyMedium" style={styles.footerText}>
                Sudah punya akun?{' '}
                <Text
                  style={styles.loginLink}
                  onPress={() => router.push('/auth/login')}
                >
                  Masuk
                </Text>
              </Text>
            </View> */}
          </Card.Content>
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
    borderRadius: 16,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6b7280',
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  checkboxText: {
    flex: 1,
    color: '#4b5563',
    marginTop: 8,
    marginLeft: 8,
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#4b5563',
  },
  loginLink: {
    color: '#2563eb',
    fontWeight: '700',
  },
});