import React, { useState, useRef } from 'react';
import { View, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, IconButton } from 'react-native-paper';

interface VerifyCodeProps {
  backgroundImage?: any;
  backgroundColor?: string;
}

export default function VerifyCode({ backgroundImage, backgroundColor }: VerifyCodeProps) {
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<any[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join('');
    if (verificationCode.length === 4) {
      alert(`Kode verifikasi: ${verificationCode}`);
    } else {
      alert('Silakan isi semua kode verifikasi');
    }
  };

  const handleResendCode = () => {
    alert('Kode verifikasi telah dikirim ulang');
  };

  const containerStyle = backgroundColor 
    ? { backgroundColor } 
    : undefined;

  const content = (
    <View style={styles.container}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          {/* Icon Lock */}
          <View style={styles.iconContainer}>
            <IconButton
              icon="lock"
              size={32}
              iconColor="#fff"
              style={styles.iconButton}
            />
          </View>

          {/* Header */}
          <Text variant="headlineMedium" style={styles.title}>
            Verifikasi Kode
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Masukkan 4 digit kode yang telah dikirim
          </Text>

          {/* Code Inputs */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                mode="outlined"
                value={digit}
                onChangeText={(value) => handleChange(index, value)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                keyboardType="numeric"
                maxLength={1}
                style={styles.input}
                outlineColor="rgba(255, 255, 255, 0.3)"
                activeOutlineColor="#fff"
                textColor="#fff"
                theme={{
                  colors: {
                    onSurfaceVariant: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              />
            ))}
          </View>

          {/* Verify Button */}
          <Button
            mode="contained"
            onPress={handleVerify}
            style={styles.verifyButton}
            buttonColor="rgba(0, 0, 0, 0.7)"
            textColor="#fff"
            contentStyle={styles.buttonContent}
          >
            Verify
          </Button>

          {/* Resend Code */}
          <View style={styles.resendContainer}>
            <Text variant="bodySmall" style={styles.resendText}>
              Tidak menerima kode?
            </Text>
            <Button
              mode="text"
              onPress={handleResendCode}
              textColor="#90caf9"
              style={styles.resendButton}
            >
              Kirim ulang kode
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  if (backgroundImage) {
    return (
      <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.background}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {content}
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }

  return (
    <View style={[styles.background, containerStyle]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {content}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 1)',
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(209, 213, 219, 1)',
    textAlign: 'center',
    marginBottom: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  input: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  verifyButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 1)',
    marginBottom: 16,
  },
  buttonContent: {
    height: 48,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    color: 'rgba(209, 213, 219, 1)',
    marginBottom: 8,
  },
  resendButton: {
    marginTop: 0,
  },
});