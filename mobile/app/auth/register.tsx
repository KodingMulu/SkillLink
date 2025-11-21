import React, { useRef, useState, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Text, TextInput, Button, Checkbox, Card } from "react-native-paper";
import { Link, useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Animasi muncul
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }

    if (!acceptTerms) {
      alert("Anda harus menyetujui syarat dan ketentuan");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      alert("Registrasi berhasil!");
      setIsLoading(false);
      router.push("/auth/login");
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          width: "100%",
        }}
      >
        <Card style={styles.card}>
          <Card.Content>

            <Text variant="headlineMedium" style={styles.title}>
              Buat Akun Baru
            </Text>

            <TextInput
              label="Nama Lengkap"
              mode="outlined"
              value={formData.fullName}
              onChangeText={(t) => setFormData({ ...formData, fullName: t })}
              style={styles.input}
            />

            <TextInput
              label="Email"
              mode="outlined"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(t) => setFormData({ ...formData, email: t })}
              style={styles.input}
            />

            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              value={formData.password}
              onChangeText={(t) => setFormData({ ...formData, password: t })}
              style={styles.input}
            />

            <TextInput
              label="Konfirmasi Password"
              mode="outlined"
              secureTextEntry={!showPassword}
              value={formData.confirmPassword}
              onChangeText={(t) =>
                setFormData({ ...formData, confirmPassword: t })
              }
              style={styles.input}
            />

            <View style={styles.checkboxRow}>
              <Checkbox
                status={acceptTerms ? "checked" : "unchecked"}
                onPress={() => setAcceptTerms(!acceptTerms)}
              />
              <Text onPress={() => setAcceptTerms(!acceptTerms)}>
                Saya setuju dengan syarat & ketentuan
              </Text>
            </View>

            <Button
              mode="contained"
              loading={isLoading}
              onPress={handleSubmit}
              style={styles.button}
            >
              Daftar
            </Button>

            <View style={{ marginTop: 10, alignItems: "center" }}>
              <Text>
                Sudah punya akun?{" "}
                <Link href="/auth/login" style={styles.link}>
                  Masuk
                </Link>
              </Text>
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    borderRadius: 20,
    paddingVertical: 10,
    elevation: 4,
  },
  title: {
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "700",
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  link: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});
