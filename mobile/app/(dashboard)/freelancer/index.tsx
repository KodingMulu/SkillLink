import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';

interface DashboardStats {
  revenue: { value: number; growth: number };
  activeProjects: { value: number; growth: number };
  completedProjects: { value: number; growth: number };
  rating: { value: number; growth: number };
}

export default function FreelancerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await axios.get(`${apiUrl}/user/freelancer/dashboard`);
      if (response.data.data) {
        setStats(response.data.data.stats);
        setProjects(response.data.data.activeProjects || []);
        setJobs(response.data.data.recommendedJobs || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator color="#3b82f6" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Halo, Freelancer! 👋</Text>
          <Text style={styles.subtitle}>Berikut adalah aktivitas terbaru proyekmu.</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard 
            label="Pendapatan" 
            value={stats ? formatIDR(stats.revenue.value) : 'Rp 0'} 
            icon="wallet" 
            color="#10b981" 
            growth={stats?.revenue.growth}
          />
          <StatCard 
            label="Proyek Aktif" 
            value={stats?.activeProjects.value.toString() || '0'} 
            icon="clock-outline" 
            color="#3b82f6"
            growth={stats?.activeProjects.growth}
          />
          <StatCard 
            label="Selesai" 
            value={stats?.completedProjects.value.toString() || '0'} 
            icon="check-circle-outline" 
            color="#8b5cf6"
            growth={stats?.completedProjects.growth}
          />
          <StatCard 
            label="Rating" 
            value={stats ? `${stats.rating.value}/5.0` : '0/5.0'} 
            icon="star-outline" 
            color="#f59e0b"
            growth={stats?.rating.growth}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Proyek Berjalan</Text>
            <TouchableOpacity><Text style={styles.linkText}>Lihat Semua</Text></TouchableOpacity>
          </View>
          
          {projects.length === 0 ? (
            <Text style={styles.emptyText}>Tidak ada proyek aktif.</Text>
          ) : (
            projects.map((item: any, i) => (
              <Card key={i} style={styles.projectCard}>
                <Card.Content>
                  <View style={styles.rowBetween}>
                    <Text style={styles.projectTitle}>{item.title}</Text>
                    <View style={styles.badge}><Text style={styles.badgeText}>{item.status}</Text></View>
                  </View>
                  <Text style={styles.projectSub}>{item.client} • Deadline: {item.deadline}</Text>
                  <View style={styles.progressBox}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                    </View>
                    <Text style={styles.progressPercent}>{item.progress}%</Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekomendasi Pekerjaan</Text>
          {jobs.map((job: any, i) => (
            <TouchableOpacity key={i} style={styles.jobItem}>
              <View style={styles.rowBetween}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobBudget}>{job.budget}</Text>
              </View>
              <Text style={styles.jobDesc} numberOfLines={2}>{job.description}</Text>
              <View style={styles.tagContainer}>
                {job.tags.map((tag: string, j: number) => (
                  <View key={j} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, icon, color, growth }: any) {
  return (
    <Card style={styles.statCard}>
      <Card.Content>
        <View style={styles.rowBetween}>
          <Avatar.Icon size={40} icon={icon} color={color} style={{ backgroundColor: color + '15' }} />
          <View style={[styles.growthBadge, { backgroundColor: growth >= 0 ? '#d1fae5' : '#fee2e2' }]}>
            <Text style={{ fontSize: 10, color: growth >= 0 ? '#065f46' : '#991b1b', fontWeight: 'bold' }}>
              {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}%
            </Text>
          </View>
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16 },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: '#fff', elevation: 0, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16 },
  statValue: { fontSize: 16, fontWeight: 'bold', marginTop: 12, color: '#0f172a' },
  statLabel: { fontSize: 12, color: '#64748b' },
  growthBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  linkText: { color: '#3b82f6', fontSize: 14, fontWeight: '600' },
  projectCard: { marginBottom: 12, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f5f9', elevation: 0 },
  projectTitle: { fontSize: 15, fontWeight: 'bold', flex: 1 },
  projectSub: { fontSize: 12, color: '#64748b', marginVertical: 6 },
  progressBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#e2e8f0', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 3 },
  progressPercent: { fontSize: 11, fontWeight: 'bold', color: '#475569' },
  badge: { backgroundColor: '#dbeafe', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, color: '#1e40af', fontWeight: 'bold' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobItem: { backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 },
  jobTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  jobBudget: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
  jobDesc: { fontSize: 12, color: '#64748b', marginTop: 4 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tag: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 10, color: '#475569' },
  emptyText: { textAlign: 'center', color: '#94a3b8', marginVertical: 20 }
});