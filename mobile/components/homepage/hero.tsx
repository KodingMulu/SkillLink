import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Surface } from 'react-native-paper';

export default function HeroHome() {
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  
  const words = ['Freelancer Terbaik', 'Talenta Profesional', 'Expert Terpercaya'];
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseTime = 2000;

  useEffect(() => {
    const currentWord = words[wordIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < currentWord.length) {
          setTypedText(currentWord.slice(0, typedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (typedText.length > 0) {
          setTypedText(currentWord.slice(0, typedText.length - 1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, wordIndex]);

  const stats = [
    { icon: '💼', value: '500+', label: 'Proyek nyata dari industri' },
    { icon: '👥', value: '2000+', label: 'Mahasiswa Aktif' },
    { icon: '🏆', value: '200+', label: 'Mentor Industri' },
    { icon: '💰', value: '95%', label: 'Portofolio terverifikasi' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.heroSection} elevation={0}>
        {/* Background Gradient Effect */}
        <View style={styles.gradientBackground} />

        <View style={styles.contentContainer}>
          {/* Hero Title */}
          <View style={styles.titleContainer}>
            <Text variant="displayLarge" style={styles.title}>
              Temukan{' '}
            </Text>
            <View style={styles.typedTextContainer}>
              <Text variant="displayLarge" style={styles.typedText}>
                {typedText}
                <Text style={styles.cursor}>|</Text>
              </Text>
            </View>
            <Text variant="displayLarge" style={styles.title}>
              untuk Proyekmu
            </Text>
          </View>

          {/* Subtitle */}
          <Text variant="titleLarge" style={styles.subtitle}>
            Kolaborasi dengan industri, kerjakan tugas nyata, dan bangun portofolio profesional.
          </Text>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <Card key={index} style={styles.statCard} elevation={2}>
                <Card.Content style={styles.statCardContent}>
                  <Text style={styles.statIcon}>{stat.icon}</Text>
                  <Text variant="headlineLarge" style={styles.statValue}>
                    {stat.value}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    {stat.label}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  heroSection: {
    position: 'relative',
    paddingTop: 60,
    paddingBottom: 48,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F4F7FF',
    opacity: 0.7,
  },
  contentContainer: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
    minHeight: 200,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  typedTextContainer: {
    minHeight: 60,
    justifyContent: 'center',
  },
  typedText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
  },
  cursor: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#10b981',
  },
  subtitle: {
    fontSize: 20,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 700,
    lineHeight: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 48,
    maxWidth: 1000,
    width: '100%',
  },
  statCard: {
    width: '45%',
    minWidth: 150,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  statCardContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
  },
});