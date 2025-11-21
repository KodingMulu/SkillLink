import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Button, Text, IconButton, Portal, Modal } from 'react-native-paper';

export default function NavigationHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    // Navigate to login screen
    console.log('Navigate to login');
  };

  const handleRegister = () => {
    // Navigate to register screen
    console.log('Navigate to register');
  };

  return (
    <View style={styles.container}>
      {/* AppBar */}
      <Appbar.Header style={styles.header} elevated>
        <View style={styles.headerContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoGradient}>
              <Text style={styles.logoIcon}>💼</Text>
            </View>
            <Text style={styles.logoText}>SkillLink</Text>
          </View>

          {/* Desktop Menu - Hidden on small screens */}
          <View style={styles.desktopMenu}>
            <Button
              mode="text"
              textColor="#374151"
              onPress={() => console.log('Cari Pekerjaan')}
              labelStyle={styles.menuButtonLabel}
            >
              Cari Pekerjaan
            </Button>
            <Button
              mode="text"
              textColor="#374151"
              onPress={() => console.log('Cari Freelancer')}
              labelStyle={styles.menuButtonLabel}
            >
              Cari Freelancer
            </Button>
            <Button
              mode="text"
              textColor="#374151"
              onPress={() => console.log('Cara Kerja')}
              labelStyle={styles.menuButtonLabel}
            >
              Cara Kerja
            </Button>
            <Button
              mode="text"
              textColor="#374151"
              onPress={() => console.log('Blog')}
              labelStyle={styles.menuButtonLabel}
            >
              Blog
            </Button>
          </View>

          {/* Desktop Auth Buttons */}
          <View style={styles.desktopAuth}>
            <Button
              mode="text"
              textColor="#374151"
              onPress={handleLogin}
              labelStyle={styles.menuButtonLabel}
            >
              Masuk
            </Button>
            <Button
              mode="contained"
              buttonColor="#10b981"
              onPress={handleRegister}
              style={styles.registerButton}
            >
              Daftar
            </Button>
          </View>

          {/* Mobile Menu Button */}
          <IconButton
            icon={mobileMenuOpen ? 'close' : 'menu'}
            iconColor="#000000"
            size={24}
            onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={styles.mobileMenuButton}
          />
        </View>
      </Appbar.Header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <View style={styles.mobileMenu}>
          <ScrollView style={styles.mobileMenuContent}>
            <Button
              mode="text"
              textColor="#374151"
              onPress={() => console.log('Cari Pekerjaan')}
              style={styles.mobileMenuItem}
              contentStyle={styles.mobileMenuItemContent}
            >
              Cari Pekerjaan
            </Button>
            <Button
              mode="text"
              textColor="#374151"
              onPress={() => console.log('Cari Freelancer')}
              style={styles.mobileMenuItem}
              contentStyle={styles.mobileMenuItemContent}
            >
              Cari Freelancer
            </Button>
            <Button
              mode="text"
              textColor="#374151"
              onPress={() => console.log('Cara Kerja')}
              style={styles.mobileMenuItem}
              contentStyle={styles.mobileMenuItemContent}
            >
              Cara Kerja
            </Button>
            <Button
              mode="text"
              textColor="#374151"
              onPress={() => console.log('Blog')}
              style={styles.mobileMenuItem}
              contentStyle={styles.mobileMenuItemContent}
            >
              Blog
            </Button>
            <Button
              mode="contained"
              buttonColor="#10b981"
              onPress={handleLogin}
              style={styles.mobileAuthButton}
            >
              Masuk
            </Button>
            <Button
              mode="outlined"
              textColor="#10b981"
              onPress={handleRegister}
              style={[styles.mobileAuthButton, styles.mobileRegisterButton]}
            >
              Daftar
            </Button>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoGradient: {
    width: 40,
    height: 40,
    backgroundColor: '#10b981',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  desktopMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'none', // Show only on larger screens
  },
  menuButtonLabel: {
    fontWeight: '500',
  },
  desktopAuth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    display: 'none', // Show only on larger screens
  },
  registerButton: {
    borderRadius: 8,
  },
  mobileMenuButton: {
    margin: 0,
  },
  mobileMenu: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    elevation: 2,
  },
  mobileMenuContent: {
    padding: 16,
  },
  mobileMenuItem: {
    justifyContent: 'flex-start',
    marginVertical: 4,
  },
  mobileMenuItemContent: {
    justifyContent: 'flex-start',
  },
  mobileAuthButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  mobileRegisterButton: {
    borderColor: '#10b981',
    borderWidth: 2,
  },
});