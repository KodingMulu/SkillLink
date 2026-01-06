import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
} from 'react-native';
import { Wallet, Clock, CheckCircle2, Star, TrendingUp, TrendingDown, ArrowRight } from "lucide-react-native";
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DashboardStats {
  revenue: { value: number; growth: number; label: string };
  activeProjects: { value: number; growth: number; label: string };
  completedProjects: { value: number; growth: number; label: string };
  rating: { value: number; growth: number; label: string };
}

interface Project {
  id?: string;
  title: string;
  client: string;
  deadline: string;
  progress: number;
  status: string;
}

interface RecommendedJob {
  id: string;
  title: string;
  description: string;
  budget: string;
  tags: string[];
}

export default function FreelancerDashboard() {
  const router = useRouter();
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('revisi')) return { bg: '#FFF7ED', text: '#EA580C' }; 
    if (s.includes('review')) return { bg: '#EFF6FF', text: '#2563EB' }; 
    if (s.includes('progress')) return { bg: '#ECFDF5', text: '#059669' }; 
    return { bg: '#F1F5F9', text: '#475569' }; 
  };

  const fetchDashboardData = async () => {
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem('token'); 

      const response = await axios.get(`${apiUrl}/user/freelancer/dashboard`, {
        withCredentials: true,
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.code === 200 && response.data.data) {
        const { stats, activeProjects, recommendedJobs } = response.data.data;
        if (stats) setStatsData(stats);
        if (activeProjects) setActiveProjects(activeProjects);
        if (recommendedJobs) setRecommendedJobs(recommendedJobs);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Gagal mengambil data dashboard:", error.response?.data || error.message);
      } else {
        console.error("Terjadi kesalahan sistem:", error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, []);

  const statsConfig = [
    {
      label: "Pendapatan",
      value: statsData ? formatRupiah(statsData.revenue.value) : "Rp 0",
      growth: statsData?.revenue.growth || 0,
      icon: Wallet,
      color: "#059669",
      bg: "#ECFDF5" 
    },
    {
      label: "Proyek Aktif",
      value: statsData?.activeProjects.value.toString() || "0",
      growth: statsData?.activeProjects.growth || 0,
      icon: Clock,
      color: "#2563EB", 
      bg: "#EFF6FF"
    },
    {
      label: "Selesai",
      value: statsData?.completedProjects.value.toString() || "0",
      growth: statsData?.completedProjects.growth || 0,
      icon: CheckCircle2,
      color: "#9333EA",
      bg: "#FAF5FF"
    },
    {
      label: "Rating",
      value: statsData ? `${statsData.rating.value}/5.0` : "0.0/5.0",
      growth: statsData?.rating.growth || 0,
      icon: Star,
      color: "#D97706", 
      bg: "#FFFBEB" 
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greetingTitle}>Halo, Freelancer! 👋</Text>
        <Text style={styles.greetingSubtitle}>Aktivitas terbaru proyekmu.</Text>
      </View>

      <View style={styles.statsGrid}>
        {statsConfig.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.iconBox, { backgroundColor: stat.bg }]}>
                <stat.icon size={20} color={stat.color} />
              </View>
              <View style={[
                styles.badge, 
                { backgroundColor: stat.growth >= 0 ? '#ECFDF5' : '#FEF2F2' }
              ]}>
                {stat.growth >= 0 
                  ? <TrendingUp size={12} color="#059669" /> 
                  : <TrendingDown size={12} color="#DC2626" />
                }
                <Text style={[
                  styles.badgeText, 
                  { color: stat.growth >= 0 ? '#059669' : '#DC2626' }
                ]}>
                  {Math.abs(stat.growth)}%
                </Text>
              </View>
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Proyek Berjalan</Text>
          <TouchableOpacity onPress={() => router.push('/freelancer/jobs')}>
            <Text style={styles.seeAllText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {activeProjects.length === 0 ? (
           <View style={styles.emptyState}>
             <Text style={styles.emptyText}>Tidak ada proyek aktif.</Text>
           </View>
        ) : (
          activeProjects.map((project, idx) => {
            const statusStyle = getStatusColor(project.status);
            return (
              <View key={project.id || idx} style={styles.projectCard}>
                <View style={styles.projectHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.projectTitle} numberOfLines={1}>{project.title}</Text>
                    <Text style={styles.projectClient}>
                      {project.client} • <Text style={[styles.deadline, String(project.deadline).includes('Terlewat') && styles.textRed]}>{project.deadline}</Text>
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {project.status}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressLabel}>
                    <Text style={styles.progressText}>Progress</Text>
                    <Text style={styles.progressPercent}>{project.progress}%</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${project.progress}%` }]} />
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Rekomendasi Pekerjaan</Text>
        
        {recommendedJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Belum ada rekomendasi baru.</Text>
          </View>
        ) : (
          recommendedJobs.map((job) => (
            <TouchableOpacity 
              key={job.id} 
              style={styles.jobCard}
              onPress={() => router.push(`/freelancer/jobs/${job.id}` as any)}
            >
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
                <Text style={styles.jobBudget}>{job.budget}</Text>
              </View>
              <Text style={styles.jobDescription} numberOfLines={2}>{job.description}</Text>
              <View style={styles.tagsContainer}>
                {job.tags.map((tag, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => router.push('/(dashboard)/freelancer/jobs')}
        >
          <Text style={styles.moreButtonText}>Cari Lebih Banyak</Text>
          <ArrowRight size={16} color="#475569" />
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748B',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%', 
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconBox: {
    padding: 10,
    borderRadius: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  statValue: {
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },

  sectionContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
  },

  projectCard: {
    backgroundColor: 'white',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
    maxWidth: '70%',
  },
  projectClient: {
    fontSize: 12,
    color: '#64748B',
  },
  deadline: {
    fontWeight: '500',
    color: '#EF4444',
  },
  textRed: {
    color: '#DC2626',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 10,
  },

  jobCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  jobBudget: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  jobDescription: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    color: '#475569',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  moreButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  }
});